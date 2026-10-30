import { createHash, randomUUID } from 'node:crypto';
import { gunzip, gunzipSync } from 'node:zlib';
import { promisify } from 'node:util';
import { setImmediate as yieldTurn } from 'node:timers/promises';
import { mkdir, readFile, writeFile, rename, lstat, unlink } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { validateReleaseNotes, packageReleaseNotesEn } from './release-notes.js';
import { createUpdateCache, cachedArchiveIdentity } from './update-cache.js';
import {
  UPDATE_REPOSITORY,
  REPOSITORY,
  NPM_ENTRY_NAME,
  MAX_PACKAGE_BYTES,
  NPM_REGISTRIES,
} from './constants.js';
import { versionParts, isNewerVersion } from './version.js';

export { UPDATE_REPOSITORY, NPM_ENTRY_NAME, isNewerVersion };
export const UPDATE_MANIFEST_URL = `https://github.com/${UPDATE_REPOSITORY}/releases/download/channel-stable/update.json`;
export function updateManifestUrl(packageName, repo = UPDATE_REPOSITORY) {
  const filename = packageName === NPM_ENTRY_NAME ? 'npm-update.json' : 'update.json';
  return `https://github.com/${repo}/releases/download/channel-stable/${filename}`;
}
const unzip = promisify(gunzip);
const MAX_TAR_BYTES = 160 * 1024 * 1024;
function updateError(message, code = 'BOOT_UPDATE_INVALID') {
  return Object.assign(new Error(message), { code });
}
function codedError(error, code = 'BOOT_UPDATE_INVALID') {
  if (!String(error?.code || '').startsWith('BOOT_')) error.code = code;
  return error;
}
async function digest(bytes, algorithm, encoding) {
  const hash = createHash(algorithm);
  for (let offset = 0; offset < bytes.length; offset += 4 * 1024 * 1024) {
    hash.update(bytes.subarray(offset, offset + 4 * 1024 * 1024));
    await yieldTurn();
  }
  return hash.digest(encoding);
}
// A slow but progressing connection can finish a full media bundle. Connection
// and idle deadlines still stop a stalled request promptly; the total deadline
// bounds each registry attempt. These are not user-controlled network settings.
export const UPDATE_DOWNLOAD_TIMEOUTS = Object.freeze({
  connectMs: 20000,
  idleMs: 60000,
  totalMs: 15 * 60 * 1000,
});

function downloadBudget(timeouts = UPDATE_DOWNLOAD_TIMEOUTS) {
  const controller = new AbortController();
  let connectionTimer, idleTimer;
  const abort = (message) => controller.abort(registryFailure(message));
  const totalTimer = setTimeout(
    () => abort('更新包下载超过 15 分钟，请检查网络后重试。'),
    timeouts.totalMs,
  );
  const clear = (timer) => {
    if (timer) clearTimeout(timer);
  };
  return {
    signal: controller.signal,
    connecting() {
      clear(connectionTimer);
      clear(idleTimer);
      connectionTimer = setTimeout(() => abort('连接更新下载服务超时。'), timeouts.connectMs);
    },
    connected() {
      clear(connectionTimer);
      connectionTimer = null;
      this.touch();
    },
    touch() {
      clear(idleTimer);
      idleTimer = setTimeout(
        () => abort('更新包下载长时间没有进展，请检查网络后重试。'),
        timeouts.idleMs,
      );
    },
    dispose() {
      clear(totalTimer);
      clear(connectionTimer);
      clear(idleTimer);
    },
  };
}

function repositoryMatches(value, repo) {
  const url = typeof value === 'string' ? value : value?.url;
  return (
    typeof url === 'string' &&
    url
      .replace(/^git\+/, '')
      .replace(/\/$/, '')
      .replace(/\.git$/, '') === `https://github.com/${repo}`
  );
}
function registryFailure(message) {
  const error = updateError(message, 'BOOT_UPDATE_NETWORK');
  error.retryRegistry = true;
  return error;
}
function allowedRegistryURL(value) {
  const url = new URL(value);
  return (
    url.protocol === 'https:' &&
    !url.username &&
    !url.password &&
    !url.port &&
    (url.hostname === 'registry.npmjs.org' ||
      url.hostname === 'registry.npmmirror.com' ||
      url.hostname.endsWith('.npmmirror.com'))
  );
}
/** Follow only npm registry/CDN redirects; never make a redirected GitHub request. */
async function registryResponse(fetchImpl, input, signal, budget) {
  let url = input;
  for (let hop = 0; hop < 5; hop++) {
    if (!allowedRegistryURL(url)) throw updateError('npm 更新请求离开了允许的注册表。');
    let response;
    budget?.connecting();
    try {
      response = await fetchImpl(url, {
        signal,
        redirect: 'manual',
        headers: {
          accept: input.endsWith('.tgz') ? 'application/octet-stream' : 'application/json',
          'user-agent': 'DSH-Open-Beauty-Updater',
        },
      });
    } catch (error) {
      if (signal.aborted && signal.reason?.retryRegistry) throw signal.reason;
      throw registryFailure(
        error.name === 'TimeoutError' ? '连接 npm 注册表超时。' : '无法连接 npm 注册表。',
      );
    }
    budget?.connected();
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get('location');
    await response.body?.cancel().catch(() => {});
    if (!location) throw updateError('npm 注册表返回了无效跳转。');
    url = new URL(location, url).href;
  }
  throw updateError('npm 注册表跳转次数过多。');
}
function allowedGithubURL(value, repo) {
  const url = new URL(value);
  // GitHub redirects the historic published identity after the repository rename.
  const repositories = [repo, ...(repo === UPDATE_REPOSITORY ? [REPOSITORY] : [])];
  return (
    url.protocol === 'https:' &&
    !url.username &&
    !url.password &&
    !url.port &&
    !url.hash &&
    ((url.hostname === 'github.com' &&
      repositories.some((name) => url.pathname.startsWith(`/${name}/releases/download/`))) ||
      ['release-assets.githubusercontent.com', 'objects.githubusercontent.com'].includes(
        url.hostname,
      ))
  );
}
async function githubResponse(fetchImpl, input, repo, signal, budget) {
  let url = input;
  for (let hop = 0; hop < 5; hop++) {
    if (!allowedGithubURL(url, repo))
      throw updateError('GitHub 更新请求离开了允许的发布地址。', 'BOOT_UPDATE_NETWORK');
    budget?.connecting();
    const response = await fetchImpl(url, {
      signal,
      redirect: 'manual',
      headers: { accept: 'application/octet-stream', 'user-agent': 'DSH-Open-Beauty-Updater' },
    });
    budget?.connected();
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get('location');
    await response.body?.cancel().catch(() => {});
    if (!location) throw updateError('GitHub 发布服务返回了无效跳转。', 'BOOT_UPDATE_NETWORK');
    url = new URL(location, url).href;
  }
  throw updateError('GitHub 发布服务跳转次数过多。', 'BOOT_UPDATE_NETWORK');
}
async function registryBytes(response, limit, signal, options) {
  try {
    return await responseBytes(response, limit, signal, options);
  } catch (error) {
    if (signal.aborted && signal.reason?.retryRegistry) throw signal.reason;
    if (signal.aborted || ['TimeoutError', 'AbortError', 'TypeError'].includes(error.name))
      throw registryFailure('读取 npm 注册表内容失败。');
    throw error;
  }
}
export function validateNpmManifest(
  value,
  { packageName = NPM_ENTRY_NAME, repo = UPDATE_REPOSITORY, registry = NPM_REGISTRIES[0] } = {},
) {
  if (
    !value ||
    Array.isArray(value) ||
    typeof value !== 'object' ||
    value.name !== packageName ||
    packageName !== NPM_ENTRY_NAME
  )
    throw updateError('npm 更新包标识与当前插件不一致。');
  versionParts(value.version);
  if (!repositoryMatches(value.repository, repo))
    throw updateError('npm 更新包的仓库标识不属于本项目。');
  if (!NPM_REGISTRIES.includes(registry)) throw updateError('不支持的 npm 注册表。');
  const path = `/${packageName}/-/${packageName}-${value.version}.tgz`;
  if (!NPM_REGISTRIES.some((origin) => value.dist?.tarball === origin + path))
    throw updateError('npm 更新包地址不属于允许的注册表和版本。');
  const integrity = value.dist?.integrity;
  if (
    typeof integrity !== 'string' ||
    !/^sha512-[A-Za-z0-9+/]{86}==$/.test(integrity) ||
    Buffer.from(integrity.slice(7), 'base64').toString('base64') !== integrity.slice(7)
  )
    throw updateError('npm 更新包缺少有效的 SHA-512 完整性信息。');
  const releaseNotes = validateReleaseNotes(value.lewisEnchantRelease, value.version);
  const releaseNotesEn = packageReleaseNotesEn(value);
  return {
    source: 'npm',
    packageName,
    version: value.version,
    integrity,
    releaseNotes,
    releaseNotesEn,
    tarballUrls: [registry, ...NPM_REGISTRIES.filter((origin) => origin !== registry)].map(
      (origin) => origin + path,
    ),
    tarballUrl: registry + path,
    releaseNotesUrl: `https://www.npmjs.com/package/${packageName}/v/${value.version}`,
    requiresRestart: true,
  };
}
async function npmManifest(fetchImpl, packageName, repo) {
  let failure;
  for (const registry of NPM_REGISTRIES) {
    try {
      const signal = AbortSignal.timeout(7000);
      const response = await registryResponse(
        fetchImpl,
        `${registry}/${packageName}/latest`,
        signal,
      );
      if (response.status === 404) {
        await response.body?.cancel().catch(() => {});
        return null;
      }
      if (!response.ok) {
        await response.body?.cancel().catch(() => {});
        throw registryFailure(`npm 注册表返回 HTTP ${response.status}。`);
      }
      return validateNpmManifest(
        JSON.parse((await registryBytes(response, 65536, signal)).toString('utf8')),
        { packageName, repo, registry },
      );
    } catch (error) {
      if (!error.retryRegistry) throw error;
      failure = error;
    }
  }
  throw failure;
}
async function npmArchive(fetchImpl, manifest, { onProgress, onVerifying, timeouts }) {
  let failure;
  for (const [index, url] of manifest.tarballUrls.entries()) {
    const budget = downloadBudget(timeouts);
    try {
      onProgress({
        phase: 'downloading',
        downloadedBytes: 0,
        totalBytes: null,
        percent: null,
        attempt: index + 1,
      });
      const response = await registryResponse(fetchImpl, url, budget.signal, budget);
      if (!response.ok) {
        await response.body?.cancel().catch(() => {});
        throw registryFailure(`npm 更新包下载失败（HTTP ${response.status}）。`);
      }
      const bytes = await registryBytes(response, MAX_PACKAGE_BYTES, budget.signal, {
        onProgress,
        budget,
      });
      onVerifying(bytes.length);
      if ('sha512-' + (await digest(bytes, 'sha512', 'base64')) !== manifest.integrity)
        throw updateError('npm 更新包 SHA-512 校验失败，未执行更新。', 'BOOT_UPDATE_INTEGRITY');
      return bytes;
    } catch (error) {
      if (!error.retryRegistry) throw error;
      failure = error;
    } finally {
      budget.dispose();
    }
  }
  throw failure;
}

export function validateUpdateManifest(value, { packageName, repo = UPDATE_REPOSITORY }) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.format !== 1)
    throw updateError('维护清单格式不正确。');
  versionParts(value.version);
  if (value.packageName !== packageName) throw updateError('更新包标识与当前插件不一致。');
  if (!/^[a-f0-9]{40}$/.test(value.commit || '') || !/^[a-f0-9]{64}$/.test(value.sha256 || ''))
    throw updateError('更新提交或 SHA-256 无效。');
  if (!Number.isSafeInteger(value.bytes) || value.bytes <= 0 || value.bytes > MAX_PACKAGE_BYTES)
    throw updateError('更新包大小超出限制。');
  if (
    !Number.isSafeInteger(value.publishTimestamp) ||
    value.publishTimestamp <= 0 ||
    value.requiresRestart !== true
  )
    throw updateError('维护清单缺少发布时间或重启声明。');
  const expected = `https://github.com/${repo}/releases/download/v${value.version}/${packageName}-${value.version}.tgz`;
  if (value.tarballUrl !== expected)
    throw updateError('只接受本项目固定版本的 GitHub Release 更新包。');
  const releaseNotes = validateReleaseNotes(value.releaseNotes, value.version);
  const releaseNotesEn = validateReleaseNotes(value.releaseNotesEn, value.version);
  return {
    format: 1,
    packageName,
    version: value.version,
    commit: value.commit,
    sourceCommit: value.sourceCommit,
    sha256: value.sha256,
    bytes: value.bytes,
    publishTimestamp: value.publishTimestamp,
    tarballUrl: expected,
    releaseNotesUrl: `https://github.com/${repo}/releases/tag/v${value.version}`,
    requiresRestart: true,
    releaseNotes,
    releaseNotesEn,
  };
}

function archiveError(message) {
  return updateError(message, 'BOOT_UPDATE_ARCHIVE');
}
const WINDOWS_DEVICE = /^(?:CON|PRN|AUX|NUL|CLOCK\$|CONIN\$|CONOUT\$|COM[1-9¹²³]|LPT[1-9¹²³])$/i;

export function safeArchivePath(value) {
  const name = value.replace(/^(?:\.\/)+/, '').replace(/\/$/, '');
  if (
    !name ||
    Buffer.byteLength(name, 'utf8') > 8192 ||
    /[\\\u0000-\u001f\u007f:<>"|?*]/.test(name) ||
    name.startsWith('/') ||
    name
      .split('/')
      .some(
        (part) =>
          !part ||
          part === '.' ||
          part === '..' ||
          /[. ]$/.test(part) ||
          WINDOWS_DEVICE.test(part.normalize('NFC').split('.')[0].trimEnd()),
      ) ||
    (name !== 'package' && !name.startsWith('package/'))
  )
    throw archiveError('更新包包含不安全的 TAR 路径。');
  return name;
}

/** Reject aliases conservatively on Windows and Unicode-normalizing filesystems.
 * Keep the original spelling for archive interpretation; only identity is folded. */
export function archivePathKey(value) {
  return safeArchivePath(value).normalize('NFC').toUpperCase().normalize('NFC');
}

/** One scanner serves both the release CLI and the nonblocking runtime path.
 * It validates every entry, including entries following package.json, before
 * handing any archive to the package manager. No paths are extracted here. */
function* scanPackageManifest(tar) {
  let manifest = null,
    pendingPath = null,
    globalPath = null,
    offset = 0,
    count = 0,
    ended = false;
  const names = new Set();
  for (; offset + 512 <= tar.length && count < 20000; count++) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      if (offset + 1024 > tar.length) throw archiveError('更新包内容不完整。');
      for (let tail = offset; tail < tar.length; tail += 1024 * 1024) {
        if (!tar.subarray(tail, tail + 1024 * 1024).every((byte) => byte === 0))
          throw archiveError('更新包 TAR 结束标记之后仍有内容。');
        yield;
      }
      ended = true;
      break;
    }
    const text = (start, end) => header.subarray(start, end).toString('utf8').split('\0')[0];
    const rawChecksum = text(148, 156).trim();
    let sum = 0;
    for (let i = 0; i < 512; i++) sum += i >= 148 && i < 156 ? 32 : header[i];
    if (!/^[0-7]+$/.test(rawChecksum) || sum !== parseInt(rawChecksum, 8))
      throw archiveError('更新包 TAR 校验失败。');
    const rawSize = text(124, 136).trim();
    if (!/^[0-7]+$/.test(rawSize)) throw archiveError('更新包 TAR 长度无效。');
    const size = parseInt(rawSize, 8);
    const nextOffset = offset + 512 + Math.ceil(size / 512) * 512;
    if (!Number.isSafeInteger(size) || nextOffset > tar.length)
      throw archiveError('更新包内容不完整。');
    const prefix = text(345, 500),
      type = text(156, 157);
    const body = tar.subarray(offset + 512, offset + 512 + size);
    if (type === 'x' || type === 'g') {
      if (size > 1024 * 1024) throw archiveError('更新包扩展头过大。');
      let at = 0,
        records = 0;
      while (at < body.length) {
        const space = body.indexOf(32, at);
        if (space < 0 || ++records > 4096) throw archiveError('更新包扩展头无效。');
        const rawLength = body.subarray(at, space).toString('ascii');
        const length = Number(rawLength);
        if (
          !/^[1-9]\d*$/.test(rawLength) ||
          !Number.isSafeInteger(length) ||
          length <= space - at + 1 ||
          at + length > body.length ||
          body[at + length - 1] !== 10
        )
          throw archiveError('更新包扩展头长度无效。');
        const record = body.subarray(space + 1, at + length - 1).toString('utf8');
        const key = record.slice(0, record.indexOf('='));
        // Size/sparse/link overrides could make the installer's interpretation
        // differ from this bounded scan. This plugin never needs those forms.
        if (key === 'size' || key === 'linkpath' || key.startsWith('GNU.sparse'))
          throw archiveError('更新包扩展头包含不支持的路径或长度覆盖。');
        if (record.startsWith('path=')) {
          const path = safeArchivePath(record.slice(5));
          if (type === 'g') globalPath = path;
          else pendingPath = path;
        }
        at += length;
      }
    } else if (type === 'L') {
      if (size > 8192) throw archiveError('更新包扩展路径过长。');
      pendingPath = safeArchivePath(body.toString('utf8').split('\0')[0]);
    } else {
      if (!['0', '', '5'].includes(type)) throw archiveError('更新包包含不支持的链接或特殊文件。');
      const name = safeArchivePath(
        pendingPath || globalPath || (prefix ? prefix + '/' : '') + text(0, 100),
      );
      const key = archivePathKey(name);
      if (names.has(key))
        throw archiveError(
          key === 'PACKAGE/PACKAGE.JSON'
            ? '更新包含重复 package.json，未执行更新。'
            : '更新包包含重复 TAR 路径。',
        );
      names.add(key);
      if (type === '5' && size !== 0) throw archiveError('更新包目录长度无效。');
      if (name === 'package/package.json') {
        if (size > 262144 || type === '5') throw archiveError('更新包 package.json 无效。');
        try {
          manifest = JSON.parse(body.toString('utf8'));
        } catch {
          throw archiveError('更新包 package.json 无效。');
        }
        if (!manifest || Array.isArray(manifest) || typeof manifest !== 'object')
          throw archiveError('更新包 package.json 无效。');
      }
      pendingPath = null;
    }
    offset = nextOffset;
    if (count % 32 === 31) yield;
  }
  if (count >= 20000) throw archiveError('更新包包含过多 TAR 条目，未执行更新。');
  if (!ended || pendingPath) throw archiveError('更新包内容不完整。');
  if (!manifest) throw archiveError('更新包中没有 package/package.json。');
  return manifest;
}

/** Kept synchronous for existing release tooling. Runtime uses the async API. */
export function readPackageManifest(tgz) {
  try {
    const scanner = scanPackageManifest(gunzipSync(tgz, { maxOutputLength: MAX_TAR_BYTES }));
    let result;
    do {
      result = scanner.next();
    } while (!result.done);
    return result.value;
  } catch (error) {
    throw codedError(error, 'BOOT_UPDATE_ARCHIVE');
  }
}
export async function readPackageManifestAsync(tgz) {
  try {
    if (tgz.length > MAX_PACKAGE_BYTES) throw archiveError('维护文件超过允许大小。');
    const scanner = scanPackageManifest(await unzip(tgz, { maxOutputLength: MAX_TAR_BYTES }));
    let result;
    do {
      result = scanner.next();
      if (!result.done) await yieldTurn();
    } while (!result.done);
    return result.value;
  } catch (error) {
    throw codedError(error, 'BOOT_UPDATE_ARCHIVE');
  }
}

function readWithSignal(reader, signal) {
  if (signal.aborted) return Promise.reject(signal.reason || updateError('维护文件读取已中断。'));
  return new Promise((resolve, reject) => {
    const aborted = () => {
      signal.removeEventListener('abort', aborted);
      reject(signal.reason || updateError('维护文件读取已中断。'));
    };
    signal.addEventListener('abort', aborted, { once: true });
    reader.read().then(
      (value) => {
        signal.removeEventListener('abort', aborted);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener('abort', aborted);
        reject(error);
      },
    );
  });
}

async function responseBytes(response, limit, signal, { onProgress, budget, expectedBytes } = {}) {
  const rawLength = response.headers.get('content-length');
  const parsedLength = rawLength && /^\d+$/.test(rawLength) ? Number(rawLength) : null;
  // Node fetch decodes HTTP gzip/br/deflate while retaining the encoded
  // Content-Length header. Only identity lengths describe the bytes we read.
  const encoded = String(response.headers.get('content-encoding') || '')
    .split(',')
    .some((value) => value.trim() && value.trim().toLowerCase() !== 'identity');
  const length =
    !encoded && Number.isSafeInteger(parsedLength) && parsedLength > 0 ? parsedLength : null;
  if (length > limit) {
    await response.body?.cancel().catch(() => {});
    throw updateError('维护文件超过允许大小。');
  }
  const reader = response.body?.getReader();
  if (!reader) throw updateError('维护文件内容为空。');
  const chunks = [];
  let size = 0;
  const totalBytes = length || expectedBytes || null;
  const report = (done) =>
    onProgress?.({
      downloadedBytes: size,
      totalBytes: done ? size : totalBytes,
      percent: done ? 100 : totalBytes ? Math.min(99, Math.floor((size / totalBytes) * 100)) : null,
    });
  report(false);
  try {
    while (true) {
      const { done, value } = await readWithSignal(reader, signal);
      if (done) break;
      budget?.touch();
      size += value.byteLength;
      if (size > limit) throw updateError('维护文件超过允许大小。');
      chunks.push(Buffer.from(value));
      report(false);
    }
    if (length && length !== size) throw registryFailure('更新包未完整下载，请检查网络后重试。');
    report(true);
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  }
  return Buffer.concat(chunks, size);
}

/** Only checks and stages verified files. Installation belongs to the owner's official Remote API. */
export function createUpdateService({
  dataDir,
  packageFile,
  fetchImpl = fetch,
  repo = UPDATE_REPOSITORY,
  now = () => Date.now(),
  manifestUrl,
  downloadTimeouts = UPDATE_DOWNLOAD_TIMEOUTS,
  profileRoot,
} = {}) {
  const cache = createUpdateCache({
    dataDir,
    packageFile,
    now,
    ...(profileRoot ? { profileRoot } : {}),
  });
  const { cacheDir } = cache;
  let installedVersion;
  const stagedPaths = new Set();
  let checking = null,
    preparing = null,
    preparingVersion = null;
  let snapshot = {
    version: null,
    phase: 'idle',
    downloadedBytes: 0,
    totalBytes: null,
    percent: null,
    attempt: 0,
  };
  const progress = () => ({ ...snapshot });
  const publish = (patch) => {
    snapshot = { ...snapshot, ...patch };
  };
  async function identity() {
    const pkg = JSON.parse(await readFile(packageFile, 'utf8'));
    versionParts(pkg.version);
    if (!['dsh-openup-lewis', 'dsh-boot-studio'].includes(pkg.name))
      throw updateError('更新包标识与当前插件不一致。');
    return { packageName: pkg.name, currentVersion: pkg.version };
  }
  async function check() {
    if (checking) return checking;
    checking = (async () => {
      const local = await identity();
      const signal = AbortSignal.timeout(15000);
      try {
        if (local.packageName === NPM_ENTRY_NAME) {
          const manifest = await npmManifest(fetchImpl, local.packageName, repo);
          if (!manifest)
            return {
              ...local,
              available: false,
              channelReady: false,
              message: 'npm 版本尚未发布，当前版本可以继续使用。',
            };
          const available = isNewerVersion(manifest.version, local.currentVersion);
          return {
            ...local,
            available,
            channelReady: true,
            latestVersion: manifest.version,
            manifest,
            message: available ? '有新版本可用。' : '当前已是最新版本。',
          };
        }
        const response = await githubResponse(
          fetchImpl,
          manifestUrl ?? updateManifestUrl(local.packageName, repo),
          repo,
          signal,
        );
        if (response.status === 404) {
          await response.body?.cancel().catch(() => {});
          return {
            ...local,
            available: false,
            channelReady: false,
            message: '维护通道尚未发布，当前版本可以继续使用。',
          };
        }
        if (!response.ok) {
          await response.body?.cancel().catch(() => {});
          throw updateError(`维护服务返回 HTTP ${response.status}。`);
        }
        const manifest = validateUpdateManifest(
          JSON.parse((await responseBytes(response, 65536, signal)).toString('utf8')),
          { packageName: local.packageName, repo },
        );
        return {
          ...local,
          available: isNewerVersion(manifest.version, local.currentVersion),
          channelReady: true,
          latestVersion: manifest.version,
          manifest,
          message: isNewerVersion(manifest.version, local.currentVersion)
            ? '有新版本可用。'
            : '当前已是最新版本。',
        };
      } catch (error) {
        return {
          ...local,
          available: false,
          channelReady: false,
          code: error.name === 'TimeoutError' ? 'BOOT_UPDATE_TIMEOUT' : codedError(error).code,
          message:
            error.name === 'TimeoutError'
              ? '连接维护通道超时，请稍后重试。'
              : `暂时无法检查更新：${error.message}`,
        };
      }
    })();
    try {
      return await checking;
    } finally {
      checking = null;
    }
  }
  async function cleanup() {
    const local = await identity();
    const currentVersion =
      installedVersion && isNewerVersion(installedVersion, local.currentVersion)
        ? installedVersion
        : local.currentVersion;
    return cache.cleanup({
      installedVersion: currentVersion,
      keepSpecs: [...stagedPaths],
    });
  }
  async function installed(version, spec) {
    try {
      versionParts(version);
      if (typeof spec !== 'string' || resolve(spec) !== join(cacheDir, basename(spec)))
        throw updateError('更新包准备结果无效，未请求安装。');
      const expected = cachedArchiveIdentity(basename(spec));
      const local = await identity();
      if (
        isNewerVersion(local.currentVersion, version) ||
        (installedVersion && isNewerVersion(installedVersion, version))
      )
        throw updateError('更新包的名称、版本或插件声明不匹配。');
      const info = await lstat(spec);
      if (
        !expected ||
        expected.packageName !== local.packageName ||
        expected.version !== version ||
        !info.isFile() ||
        info.isSymbolicLink() ||
        info.size <= 0 ||
        info.size > MAX_PACKAGE_BYTES
      )
        throw updateError('更新包准备结果无效，未请求安装。');
      const bytes = await readFile(spec);
      if ((await digest(bytes, 'sha256', 'hex')) !== expected.sha256)
        throw updateError('更新包 SHA-256 或大小校验失败，未执行更新。');
      const pkg = await readPackageManifestAsync(bytes);
      if (pkg.name !== expected.packageName || pkg.version !== version)
        throw updateError('更新包的名称、版本或插件声明不匹配。');
      installedVersion = version;
      for (const path of stagedPaths) {
        const staged = cachedArchiveIdentity(basename(path));
        if (staged && !isNewerVersion(staged.version, version)) {
          stagedPaths.delete(path);
          cache.unprotect(path);
        }
      }
      // A forged or premature acknowledgement cannot remove archives still
      // named by a real profile: the cache performs fresh reference checks.
      return cleanup();
    } catch (error) {
      throw Object.assign(error, { code: 'BOOT_UPDATE_INSTALL_ACK_INVALID' });
    }
  }
  async function prepare(requestedVersion) {
    if (preparing) {
      if (requestedVersion !== preparingVersion)
        throw updateError('另一个版本正在准备，请稍后重新检查。');
      return preparing;
    }
    preparingVersion = requestedVersion;
    snapshot = {
      version: requestedVersion,
      phase: 'checking',
      downloadedBytes: 0,
      totalBytes: null,
      percent: null,
      attempt: 0,
    };
    preparing = (async () => {
      const status = await check();
      if (!status.channelReady || !status.available || status.latestVersion !== requestedVersion)
        throw updateError('更新版本已变化或尚未发布，请重新检查更新。');
      const manifest = status.manifest;
      let bytes;
      const onVerifying = (size) =>
        publish({ phase: 'verifying', downloadedBytes: size, totalBytes: size, percent: 100 });
      if (manifest.source === 'npm')
        bytes = await npmArchive(fetchImpl, manifest, {
          onProgress: publish,
          onVerifying,
          timeouts: downloadTimeouts,
        });
      else {
        const budget = downloadBudget(downloadTimeouts);
        try {
          publish({
            phase: 'downloading',
            downloadedBytes: 0,
            totalBytes: manifest.bytes,
            percent: 0,
            attempt: 1,
          });
          budget.connecting();
          const response = await githubResponse(
            fetchImpl,
            manifest.tarballUrl,
            repo,
            budget.signal,
            budget,
          );
          budget.connected();
          if (!response.ok) {
            await response.body?.cancel().catch(() => {});
            throw updateError(`更新包下载失败（HTTP ${response.status}）。`);
          }
          bytes = await responseBytes(
            response,
            Math.min(MAX_PACKAGE_BYTES, manifest.bytes),
            budget.signal,
            { onProgress: publish, budget, expectedBytes: manifest.bytes },
          );
          onVerifying(bytes.length);
          if (
            bytes.length !== manifest.bytes ||
            (await digest(bytes, 'sha256', 'hex')) !== manifest.sha256
          )
            throw updateError(
              '更新包 SHA-256 或大小校验失败，未执行更新。',
              'BOOT_UPDATE_INTEGRITY',
            );
        } finally {
          budget.dispose();
        }
      }
      const pkg = await readPackageManifestAsync(bytes);
      if (
        pkg.name !== status.packageName ||
        pkg.version !== manifest.version ||
        !['./cordis.patch.yml', 'cordis.patch.yml'].includes(pkg.dsh?.bundle?.patch)
      )
        throw updateError('更新包的名称、版本或插件声明不匹配。');
      if (validateReleaseNotes(pkg.lewisEnchantRelease, pkg.version) !== manifest.releaseNotes)
        throw updateError('更新包中的作者说明与本次检查结果不一致，请重新检查更新。');
      if (packageReleaseNotesEn(pkg) !== (manifest.releaseNotesEn ?? null))
        throw updateError('更新包中的作者说明与本次检查结果不一致，请重新检查更新。');
      for (const key of [
        'preinstall',
        'install',
        'postinstall',
        'prepare',
        'preprepare',
        'postprepare',
      ])
        if (pkg.scripts?.[key])
          throw updateError('维护包包含安装脚本，请通过 Harness 插件管理器人工检查。');
      if (
        manifest.source === 'npm' &&
        (!repositoryMatches(pkg.repository, repo) ||
          ['dependencies', 'optionalDependencies', 'peerDependencies'].some(
            (key) => Object.keys(pkg[key] ?? {}).length,
          ))
      )
        throw updateError('npm 更新包必须属于本项目且不含运行依赖。');
      const sha256 = await digest(bytes, 'sha256', 'hex');
      await mkdir(cacheDir, { recursive: true });
      const cacheInfo = await lstat(cacheDir);
      if (!cacheInfo.isDirectory() || cacheInfo.isSymbolicLink())
        throw updateError('更新缓存目录无效。', 'BOOT_UPDATE_CACHE');
      await cleanup();
      const path = join(cacheDir, `${pkg.name}-${pkg.version}-${sha256}.tgz`);
      const temp = join(cacheDir, `${randomUUID()}.part`);
      cache.protect(temp);
      try {
        await writeFile(temp, bytes, { flag: 'wx' });
        await rename(temp, path);
        stagedPaths.add(path);
        cache.protect(path);
      } finally {
        cache.unprotect(temp);
        await unlink(temp).catch(() => {});
      }
      publish({
        phase: 'ready',
        downloadedBytes: bytes.length,
        totalBytes: bytes.length,
        percent: 100,
      });
      return { version: manifest.version, spec: path, sha256, requiresRestart: true };
    })();
    try {
      return await preparing;
    } catch (error) {
      codedError(error);
      publish({ phase: 'error', error: error.message || '更新包准备失败。', code: error.code });
      throw error;
    } finally {
      preparing = null;
      preparingVersion = null;
    }
  }
  return { check, prepare, identity, progress, cleanup, installed, dispose: () => cache.dispose() };
}
