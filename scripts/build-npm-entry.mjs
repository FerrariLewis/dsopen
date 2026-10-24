#!/usr/bin/env node
/** Make the standalone npm distribution from the exact tested core tarball. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { assertRepository, inspectTarball } from './release.mjs';

export const NPM_PACKAGE_NAME = 'dsh-openup-lewis';
const CORE_PACKAGE_NAME = 'dsh-boot-studio';
const CLIENT_HEADER = 'window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory:';
const NPM_CLIENT_HEADER = 'window.__ModuleLoader__.load({ id: "dsh-openup-lewis", factory:';

/** Extract only bounded regular files in memory: never materialize archive links. */
function regularFiles(compressed) {
  const tar = gunzipSync(compressed, { maxOutputLength: 160 * 1024 * 1024 });
  const files = new Map();
  let offset = 0, pendingPath = null, globalPath = null, count = 0;
  for (; offset + 512 <= tar.length && count < 20000; count++) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every(byte => byte === 0)) break;
    const text = (start, end) => header.subarray(start, end).toString('utf8').split('\0')[0];
    const checksum = Number.parseInt(text(148, 156).trim(), 8);
    let sum = 0;
    for (let index = 0; index < 512; index++) sum += index >= 148 && index < 156 ? 32 : header[index];
    if (!Number.isFinite(checksum) || sum !== checksum) throw new Error('TAR 校验失败。');
    const rawSize = text(124, 136).trim();
    if (!/^[0-7]+$/.test(rawSize)) throw new Error('TAR 长度无效。');
    const size = Number.parseInt(rawSize, 8);
    if (!Number.isSafeInteger(size) || offset + 512 + size > tar.length) throw new Error('TAR 内容不完整。');
    const body = tar.subarray(offset + 512, offset + 512 + size);
    const type = text(156, 157);
    const rawPath = [text(345, 500), text(0, 100)].filter(Boolean).join('/');
    offset += 512 + Math.ceil(size / 512) * 512;
    if (type === 'x' || type === 'g') {
      for (let at = 0; at < body.length;) {
        const space = body.indexOf(32, at);
        if (space < 0) throw new Error('TAR 扩展头无效。');
        const length = Number(body.subarray(at, space).toString('ascii'));
        if (!Number.isSafeInteger(length) || length <= space - at + 1 || at + length > body.length) throw new Error('TAR 扩展头长度无效。');
        const record = body.subarray(space + 1, at + length).toString('utf8').replace(/\n$/, '');
        if (record.startsWith('path=')) {
          if (type === 'g') globalPath = record.slice(5); else pendingPath = record.slice(5);
        }
        at += length;
      }
      continue;
    }
    const archivePath = pendingPath ?? globalPath ?? rawPath;
    pendingPath = null;
    if (!archivePath.startsWith('package/') || archivePath.includes('\\') || /[\x00-\x1f\x7f:<>"|?*]/.test(archivePath) || archivePath.split('/').some(part => part === '..' || part === '.' || /[. ]$/.test(part))) throw new Error('TAR 包含不安全路径。');
    const name = archivePath.slice('package/'.length).replace(/\/$/, '');
    if (type === '5') continue;
    if (type !== '' && type !== '0') throw new Error('npm 分发包不接受符号链接、硬链接或特殊 TAR 条目。');
    if (!name || name.startsWith('/') || name.includes('//') || files.has(name)) throw new Error('TAR 包含空路径或重复文件。');
    files.set(name, body);
  }
  if (count >= 20000) throw new Error('TAR 条目过多。');
  return files;
}

export async function buildNpmEntry({ tarball, out, repo }) {
  assertRepository(repo);
  if (!tarball || !out) throw new Error('必须指定 --tarball 和 --out。');
  const artifact = await inspectTarball(tarball);
  if (artifact.manifest.name !== CORE_PACKAGE_NAME) throw new Error('只能从 dsh-boot-studio 核心包生成 npm 分发包。');
  if (artifact.bytes > 80 * 1024 * 1024) throw new Error('核心包超过80 MB。');
  const files = regularFiles(await readFile(resolve(tarball)));
  const client = files.get('lib/client.js')?.toString('utf8');
  if (!client?.startsWith(CLIENT_HEADER) || client.indexOf(CLIENT_HEADER, CLIENT_HEADER.length) !== -1) throw new Error('客户端 ModuleLoader 注册头与预期不符，拒绝盲目改写。');
  const manifest = { ...artifact.manifest, name: NPM_PACKAGE_NAME,
    repository: { type: 'git', url: `git+https://github.com/${repo}.git` },
    homepage: `https://github.com/${repo}#readme`, bugs: { url: `https://github.com/${repo}/issues` },
    publishConfig: { access: 'public' },
    keywords: [...new Set([NPM_PACKAGE_NAME, ...(artifact.manifest.keywords ?? [])])],
    dsh: { ...artifact.manifest.dsh, bundle: { patch: './cordis.patch.yml' } },
  };
  // Runtime code and media are fully present; end users need no build or wrapper dependency.
  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'peerDependenciesMeta', 'bundledDependencies', 'bundleDependencies', 'scripts', 'private', 'packageManager']) delete manifest[key];
  files.set('package.json', Buffer.from(JSON.stringify(manifest, null, 2) + '\n'));
  const readme = files.get('README.md')?.toString('utf8');
  if (!readme?.trim()) throw new Error('npm 分发包缺少产品说明。');
  files.set('README.md', Buffer.from(readme.replace(/^[^\r\n]*(?:\r?\n|$)/, '`' + NPM_PACKAGE_NAME + '`\n')));
  files.set('cordis.patch.yml', Buffer.from(`- insert:\n    - id: ${NPM_PACKAGE_NAME}\n      name: ${NPM_PACKAGE_NAME}\n`));
  files.set('lib/client.js', Buffer.from(NPM_CLIENT_HEADER + client.slice(CLIENT_HEADER.length)));
  // Do all validation before creating a new directory. Never overwrite an existing output.
  for (const name of files.keys()) {
    for (let parent = name.lastIndexOf('/'); parent !== -1; parent = name.lastIndexOf('/', parent - 1)) {
      if (files.has(name.slice(0, parent))) throw new Error('TAR 路径同时声明为文件和目录。');
    }
  }
  const directory = resolve(out);
  await mkdir(dirname(directory), { recursive: true });
  await mkdir(directory);
  for (const [name, body] of files) {
    const target = join(directory, ...name.split('/'));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body, { flag: 'wx' });
  }
  return { directory, packageName: NPM_PACKAGE_NAME, version: manifest.version, files: files.size, sourceSha256: artifact.sha256 };
}

export async function main(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const option = argv[index];
    if (option === '--help') { console.log('node scripts/build-npm-entry.mjs --tarball 核心.tgz --out 新目录 --repo owner/repo'); return; }
    if (!['--tarball', '--out', '--repo'].includes(option) || !argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error(`参数无效：${option}`);
    args[option.slice(2)] = argv[++index];
  }
  console.log(JSON.stringify(await buildNpmEntry(args), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(`npm 分发准备失败：${error.message}`); process.exitCode = 1; });
