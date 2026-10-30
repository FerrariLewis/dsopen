#!/usr/bin/env node
/** Verify public npm and mirror artifacts; syncing is explicit and never installs anything. */
import { createHash } from 'node:crypto';
import { readFile, lstat, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import {
  NPM_ENTRY_NAME,
  REPOSITORY,
  UPDATE_REPOSITORY,
  MAX_PACKAGE_BYTES,
} from '../src/constants.js';
import { versionParts } from '../src/version.js';
import { readPackageManifestAsync } from '../src/updates.js';
import {
  requirePackageReleaseNotes,
  packageReleaseNotesEn,
  validateReleaseNotes,
} from '../src/release-notes.js';

const OFFICIAL = 'https://registry.npmjs.org';
const MIRROR = 'https://registry.npmmirror.com';
const SYNC = 'https://registry-direct.npmmirror.com';
const REDIRECTS = new Set([301, 302, 303, 307, 308]);
const invalid = (message) => Object.assign(new Error(message), { terminal: true });
const digest = (bytes, algorithm, encoding = 'hex') =>
  createHash(algorithm).update(bytes).digest(encoding);

export function allowedRegistryURL(value, officialOnly = false) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  return (
    url.protocol === 'https:' &&
    !url.username &&
    !url.password &&
    !url.port &&
    !url.hash &&
    (url.hostname === 'registry.npmjs.org' ||
      (!officialOnly &&
        (url.hostname === 'npmmirror.com' || url.hostname.endsWith('.npmmirror.com'))))
  );
}

function repositoryMatches(value) {
  const url = typeof value === 'string' ? value : value?.url;
  return (
    typeof url === 'string' &&
    [REPOSITORY, UPDATE_REPOSITORY].some(
      (repo) =>
        url
          .replace(/^git\+/, '')
          .replace(/\/$/, '')
          .replace(/\.git$/, '') === `https://github.com/${repo}`,
    )
  );
}

async function fetchAllowed(
  fetchImpl,
  input,
  { method = 'GET', officialOnly = false, timeoutMs = 300000 } = {},
) {
  let url = input;
  const signal = AbortSignal.timeout(timeoutMs);
  for (let hop = 0; hop <= 5; hop++) {
    if (!allowedRegistryURL(url, officialOnly))
      throw invalid(`Registry request left the permitted HTTPS hosts: ${url}`);
    const response = await fetchImpl(url, {
      method,
      redirect: 'manual',
      signal,
      headers: {
        accept: input.endsWith('.tgz') ? 'application/octet-stream' : 'application/json',
        'user-agent': 'DSH-Registry-Verifier',
      },
    });
    if (!REDIRECTS.has(response.status)) return { response, url, signal };
    const location = response.headers.get('location');
    await response.body?.cancel().catch(() => {});
    if (!location) throw invalid('Registry redirect has no Location header.');
    // Do not silently transform a sync PUT into a GET or resend it elsewhere.
    if (method !== 'GET') throw invalid('Refusing to redirect a registry sync request.');
    url = new URL(location, url).href;
  }
  throw invalid('Registry redirect limit exceeded.');
}

async function responseBytes({ response, signal }, limit) {
  const encoding = response.headers.get('content-encoding')?.trim().toLowerCase();
  const rawLength =
    !encoding || encoding === 'identity' ? response.headers.get('content-length') : null;
  const length = rawLength && /^\d+$/.test(rawLength) ? Number(rawLength) : null;
  if (length > limit) {
    await response.body?.cancel().catch(() => {});
    throw invalid('Registry response exceeds its size limit.');
  }
  const reader = response.body?.getReader();
  if (!reader) throw invalid('Registry response has no body.');
  const chunks = [];
  let bytes = 0;
  try {
    while (true) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) throw invalid('Registry response exceeds its size limit.');
      chunks.push(Buffer.from(value));
    }
    if (length !== null && length !== bytes) throw invalid('Registry response is incomplete.');
    return Buffer.concat(chunks, bytes);
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  }
}

async function fetchDocument(fetchImpl, url, { officialOnly = false, missing = false } = {}) {
  const result = await fetchAllowed(fetchImpl, url, { officialOnly, timeoutMs: 30000 });
  if (missing && result.response.status === 404) {
    await result.response.body?.cancel().catch(() => {});
    return null;
  }
  if (!result.response.ok) {
    await result.response.body?.cancel().catch(() => {});
    throw Error(`Registry metadata HTTP ${result.response.status}: ${url}`);
  }
  let value;
  try {
    value = JSON.parse((await responseBytes(result, 256 * 1024)).toString('utf8'));
  } catch (error) {
    throw invalid(`Invalid registry metadata: ${error.message}`);
  }
  return { value, url: result.url };
}

function validateRegistryManifest(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    value.name !== NPM_ENTRY_NAME ||
    !repositoryMatches(value.repository)
  )
    throw invalid('Registry package/repository identity does not match this project.');
  versionParts(value.version);
  const path = `/${NPM_ENTRY_NAME}/-/${NPM_ENTRY_NAME}-${value.version}.tgz`;
  if (![OFFICIAL, MIRROR].some((origin) => value.dist?.tarball === origin + path))
    throw invalid('Registry tarball URL does not match its package and version.');
  const integrity = value.dist?.integrity;
  if (
    typeof integrity !== 'string' ||
    !/^sha512-[A-Za-z0-9+/]{86}==$/.test(integrity) ||
    Buffer.from(integrity.slice(7), 'base64').toString('base64') !== integrity.slice(7)
  )
    throw invalid('Registry metadata has no canonical SHA-512 integrity.');
  return value;
}

function assertRegistryDigest(manifest, expected) {
  if (
    manifest.version !== expected.version ||
    manifest.dist.integrity !== expected.integrity ||
    (manifest.dist.shasum !== undefined && manifest.dist.shasum !== expected.shasum)
  )
    throw invalid('Registry version or integrity differs from the verified Release archive.');
}

async function downloadAndVerify(fetchImpl, url, expected, officialOnly) {
  const result = await fetchAllowed(fetchImpl, url, { officialOnly });
  if (!result.response.ok) {
    await result.response.body?.cancel().catch(() => {});
    throw Error(`Tarball download HTTP ${result.response.status}: ${url}`);
  }
  const bytes = await responseBytes(result, MAX_PACKAGE_BYTES);
  const hashes = {
    bytes: bytes.length,
    sha256: digest(bytes, 'sha256'),
    integrity: 'sha512-' + digest(bytes, 'sha512', 'base64'),
  };
  if (
    hashes.bytes !== expected.bytes ||
    hashes.sha256 !== expected.sha256 ||
    hashes.integrity !== expected.integrity
  )
    throw invalid('Downloaded tarball bytes/SHA-256/SHA-512 differ from the Release archive.');
  return {
    ...hashes,
    requestedURL: url,
    finalURL: result.url,
    finalHost: new URL(result.url).hostname,
    verified: true,
  };
}

export async function verifyRegistries(
  { version, releaseMetadata, path, sync = false, pollAttempts = 30, pollIntervalMs = 10000 },
  { fetchImpl = fetch, sleepImpl = sleep, now = () => Date.now() } = {},
) {
  const report = {
    success: false,
    packageName: NPM_ENTRY_NAME,
    version,
    startedAt: new Date(now()).toISOString(),
    syncRequested: Boolean(sync),
  };
  try {
    versionParts(version);
    if (
      !Number.isSafeInteger(pollAttempts) ||
      pollAttempts < 1 ||
      pollAttempts > 120 ||
      !Number.isSafeInteger(pollIntervalMs) ||
      pollIntervalMs < 0
    )
      throw invalid('Invalid mirror polling limits.');
    const archivePath = resolve(path),
      metadataPath = resolve(releaseMetadata);
    const info = await lstat(archivePath);
    if (!info.isFile() || info.isSymbolicLink() || info.size <= 0 || info.size > MAX_PACKAGE_BYTES)
      throw invalid('Release archive must be a bounded regular file.');
    const localBytes = await readFile(archivePath);
    const local = {
      version,
      bytes: localBytes.length,
      sha256: digest(localBytes, 'sha256'),
      shasum: digest(localBytes, 'sha1'),
      integrity: 'sha512-' + digest(localBytes, 'sha512', 'base64'),
    };
    const manifest = await readPackageManifestAsync(localBytes);
    if (
      manifest.name !== NPM_ENTRY_NAME ||
      manifest.version !== version ||
      !repositoryMatches(manifest.repository) ||
      manifest.dsh?.bundle?.patch !== './cordis.patch.yml'
    )
      throw invalid('Release archive package identity is invalid.');
    if (
      ['dependencies', 'optionalDependencies', 'peerDependencies', 'scripts'].some(
        (key) => Object.keys(manifest[key] ?? {}).length,
      )
    )
      throw invalid(
        'The npm distribution must be standalone and contain no lifecycle/build scripts.',
      );
    const notes = requirePackageReleaseNotes(manifest, { bilingual: true });
    const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
    const releaseURLs = [REPOSITORY, UPDATE_REPOSITORY].map(
      (repo) =>
        `https://github.com/${repo}/releases/download/v${version}/${NPM_ENTRY_NAME}-${version}.tgz`,
    );
    if (
      metadata.format !== 1 ||
      metadata.packageName !== NPM_ENTRY_NAME ||
      metadata.version !== version ||
      metadata.bytes !== local.bytes ||
      metadata.sha256 !== local.sha256 ||
      !releaseURLs.includes(metadata.tarballUrl)
    )
      throw invalid('Release metadata differs from the local archive.');
    if (
      validateReleaseNotes(metadata.releaseNotes, version, { required: true }) !== notes ||
      validateReleaseNotes(metadata.releaseNotesEn, version) !== packageReleaseNotesEn(manifest)
    )
      throw invalid('Release update notes differ from the local archive.');
    report.release = { ...local, archivePath, metadataPath, verified: true };
    const [officialVersionDocument, officialLatestDocument] = await Promise.all([
      fetchDocument(fetchImpl, `${OFFICIAL}/${NPM_ENTRY_NAME}/${version}`, { officialOnly: true }),
      fetchDocument(fetchImpl, `${OFFICIAL}/${NPM_ENTRY_NAME}/latest`, { officialOnly: true }),
    ]);
    const officialVersion = validateRegistryManifest(officialVersionDocument.value);
    const officialLatest = validateRegistryManifest(officialLatestDocument.value);
    assertRegistryDigest(officialVersion, local);
    assertRegistryDigest(officialLatest, local);
    report.official = {
      latest: officialLatest.version,
      metadataURL: officialVersionDocument.url,
      tarball: await downloadAndVerify(fetchImpl, officialVersion.dist.tarball, local, true),
    };
    if (sync) {
      const syncURL = `${SYNC}/-/package/${NPM_ENTRY_NAME}/syncs`;
      const result = await fetchAllowed(fetchImpl, syncURL, { method: 'PUT', timeoutMs: 30000 });
      if (!result.response.ok) throw Error(`Mirror sync request HTTP ${result.response.status}.`);
      const receipt = JSON.parse((await responseBytes(result, 65536)).toString('utf8'));
      if (receipt.ok !== true || typeof receipt.id !== 'string' || !receipt.id)
        throw invalid('Mirror sync returned no valid task receipt.');
      report.sync = { url: syncURL, id: receipt.id, state: receipt.state, submitted: true };
    }
    let mirrorVersion;
    for (let attempt = 1; attempt <= pollAttempts; attempt++) {
      try {
        const [versionDocument, latestDocument] = await Promise.all([
          fetchDocument(fetchImpl, `${MIRROR}/${NPM_ENTRY_NAME}/${version}`, { missing: true }),
          fetchDocument(fetchImpl, `${MIRROR}/${NPM_ENTRY_NAME}/latest`, { missing: true }),
        ]);
        const candidate = versionDocument && validateRegistryManifest(versionDocument.value);
        const latest = latestDocument && validateRegistryManifest(latestDocument.value);
        report.mirror = {
          attempt,
          latest: latest?.version ?? null,
          versionAvailable: Boolean(candidate),
        };
        if (candidate) assertRegistryDigest(candidate, local);
        if (latest?.version === version) assertRegistryDigest(latest, local);
        if (candidate && latest?.version === version) {
          mirrorVersion = candidate;
          report.mirror.metadataURL = versionDocument.url;
          break;
        }
      } catch (error) {
        if (error.terminal) throw error;
        report.mirror = { attempt, error: error.message };
      }
      if (attempt < pollAttempts) await sleepImpl(pollIntervalMs);
    }
    if (!mirrorVersion)
      throw Error(
        'Mirror metadata/latest did not converge to the target version; synchronization is not verified.',
      );
    report.mirror.tarball = await downloadAndVerify(
      fetchImpl,
      mirrorVersion.dist.tarball.replace(OFFICIAL + '/', MIRROR + '/'),
      local,
      false,
    );
    // A concurrent later release must not turn this report into a stale claim
    // that the requested version is still the public latest.
    const finalLatest = await fetchDocument(fetchImpl, `${OFFICIAL}/${NPM_ENTRY_NAME}/latest`, {
      officialOnly: true,
    });
    assertRegistryDigest(validateRegistryManifest(finalLatest.value), local);
    report.success = true;
    report.completedAt = new Date(now()).toISOString();
    return report;
  } catch (error) {
    error.report = report;
    throw error;
  }
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const option = argv[index];
    if (option === '--sync') {
      args.sync = true;
      continue;
    }
    if (
      !['--version', '--release-metadata', '--path', '--out'].includes(option) ||
      !argv[index + 1] ||
      argv[index + 1].startsWith('--')
    )
      throw Error(`Invalid argument: ${option}`);
    const key = option.slice(2);
    if (Object.hasOwn(args, key)) throw Error(`Duplicate argument: ${option}`);
    args[key] = argv[++index];
  }
  for (const key of ['version', 'release-metadata', 'path', 'out'])
    if (!args[key]) throw Error(`Missing --${key}.`);
  if ([args.path, args['release-metadata']].some((path) => resolve(path) === resolve(args.out)))
    throw Error('Report output must not overwrite either verification input.');
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  let report;
  try {
    report = await verifyRegistries({
      version: args.version,
      releaseMetadata: args['release-metadata'],
      path: args.path,
      sync: args.sync,
    });
  } catch (error) {
    report = { ...error.report, success: false, error: error.message };
    throw Object.assign(error, { report });
  } finally {
    if (report) {
      await mkdir(dirname(resolve(args.out)), { recursive: true });
      await writeFile(resolve(args.out), JSON.stringify(report, null, 2) + '\n');
    }
  }
  console.log(
    `Verified ${NPM_ENTRY_NAME}@${args.version} from the complete official and mirrored tarballs. Report: ${resolve(args.out)}`,
  );
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  main().catch((error) => {
    console.error(`Registry verification failed: ${error.message}`);
    process.exitCode = 1;
  });
