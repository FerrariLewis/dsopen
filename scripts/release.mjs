#!/usr/bin/env node
/** Build immutable release metadata from a real prebuilt tarball. No npm runtime dependencies. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildIndex } from './generate-index.mjs';
import { NPM_ENTRY_NAME } from '../src/updates.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHA = /^[a-f0-9]{40}$/;
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function compareVersions(a, b) {
  if (!VERSION.test(a ?? '') || !VERSION.test(b ?? '')) throw new Error('正式发布版本须为 x.y.z，不接受预发布或构建标记。');
  const left = a.split('.').map(BigInt), right = b.split('.').map(BigInt);
  if ([...left, ...right].some(value => value > BigInt(Number.MAX_SAFE_INTEGER))) throw new Error('版本号的主版本、次版本和修订号均不能超过 JavaScript 安全整数上限。');
  for (let i = 0; i < 3; i++) if (left[i] !== right[i]) return left[i] > right[i] ? 1 : -1;
  return 0;
}

export function assertRepository(repo) {
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]+$/.test(repo ?? '') || /\/\.{1,2}$/.test(repo)) throw new Error('repo 必须是 GitHub owner/repo。');
  return repo;
}

export function assertVersionAdvance(manifest, previous) {
  compareVersions(manifest.version, manifest.version);
  if (!previous) return;
  if (previous.format !== 1 || previous.packageName !== manifest.name || !VERSION.test(previous.version ?? '')) throw new Error('当前维护通道的元数据无效或包名不一致，拒绝覆盖。');
  if (compareVersions(manifest.version, previous.version) <= 0) throw new Error(`当前版本 ${manifest.version} 必须大于已发布版本 ${previous.version}。请先提高 package.json.version；同版本不可覆盖发布。`);
}

export function buildUpdate({ manifest, repo, commit, sourceCommit = commit, publishTimestamp, bytes, sha256 }) {
  assertRepository(repo);
  compareVersions(manifest.version, manifest.version);
  if (!SHA.test(commit ?? '') || !SHA.test(sourceCommit ?? '')) throw new Error('发布提交和源码提交必须是完整的 40 位小写 SHA。');
  if (!Number.isSafeInteger(publishTimestamp) || publishTimestamp < 0 || publishTimestamp >= 1e11) throw new Error('发布时间无效。');
  if (!Number.isSafeInteger(bytes) || bytes <= 0 || bytes > 80 * 1024 * 1024) throw new Error('安装包大小无效或超过80 MB。');
  if (!/^[a-f0-9]{64}$/.test(sha256 ?? '')) throw new Error('SHA-256 必须是64位小写十六进制。');
  if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(manifest.name ?? '')) throw new Error('包名无效。');
  const basename = `${manifest.name.replace('/', '-')}-${manifest.version}.tgz`;
  return {
    format: 1, packageName: manifest.name, version: manifest.version,
    commit, sourceCommit, publishTimestamp, sha256, bytes,
    tarballUrl: `https://github.com/${repo}/releases/download/v${manifest.version}/${basename}`,
    releaseNotesUrl: `https://github.com/${repo}/releases/tag/v${manifest.version}`,
    requiresRestart: true,
  };
}

export async function inspectTarball(tarball) {
  const path = resolve(tarball);
  const buffer = await readFile(path);
  const tar = process.platform === 'win32' ? join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
  const files = execFileSync(tar, ['-tf', path], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }).trim().split(/\r?\n/);
  if (!files.every(file => file.startsWith('package/') && !file.split('/').includes('..') && !file.includes('\\'))) throw new Error('安装包包含不安全路径。');
  const raw = execFileSync(tar, ['-xOf', path, 'package/package.json'], { encoding: 'utf8', maxBuffer: 128 * 1024 });
  const manifest = JSON.parse(raw);
  const required = ['package/lib/client.js', 'package/lib/index.js', 'package/cordis.patch.yml'];
  if (!required.every(file => files.includes(file))) throw new Error('安装包缺少预构建 lib 或 bundle patch。');
  if (!manifest.dsh?.bundle?.patch) throw new Error('安装包不是可安装的 DSH bundle。');
  for (const lifecycle of ['preinstall', 'install', 'postinstall', 'prepare', 'preprepare', 'postprepare']) if (manifest.scripts?.[lifecycle]) throw new Error(`安装包含禁止的安装生命周期脚本：${lifecycle}`);
  return { manifest, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') };
}

export function assertExistingRelease(expected, existing) {
  if (!SHA.test(existing?.commit ?? '')) throw new Error('已有版本发布缺少有效构建提交。');
  for (const key of ['format', 'packageName', 'version', 'sourceCommit', 'sha256', 'bytes', 'tarballUrl', 'publishTimestamp']) {
    if (existing[key] !== expected[key]) throw new Error(`已有 v${expected.version} 的 ${key} 与本次构建不符，拒绝覆盖不可变版本。请提高版本号。`);
  }
  return existing.commit;
}

async function previousFromChannel(repo) {
  const url = `https://github.com/${assertRepository(repo)}/releases/download/channel-stable/update.json`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { accept: 'application/json', 'user-agent': 'dsh-open-beauty-release' } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`无法读取维护通道：HTTP ${response.status}；未跳过版本检查。`);
  const body = await response.text();
  if (body.length > 32768) throw new Error('维护通道元数据过大。');
  return JSON.parse(body);
}

function parse(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === '--help') { result.help = true; continue; }
    if (!['--tarball', '--npm-tarball', '--repo', '--commit', '--source-commit', '--time', '--previous', '--existing', '--existing-npm', '--out'].includes(key)) throw new Error(`未知参数：${key}`);
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${key} 缺少值。`);
    result[key.slice(2)] = value;
  }
  return result;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parse(argv);
  if (args.help) {
    console.log('node scripts/release.mjs --tarball 插件.tgz --repo owner/repo --commit 构建提交 --source-commit 源码提交 --time ISO日期 --out release-assets\n默认检查远端 channel-stable 的版本；--previous none 仅用于首次本地预检，或指定本地旧 update.json。\n--existing 已有版本update.json 用于恢复未完成的通道提升，必须与本次不可变包完全一致。');
    return;
  }
  if (!args.tarball) throw new Error('请指定 --tarball。');
  const artifact = await inspectTarball(args.tarball);
  const current = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
  for (const key of ['name', 'version']) if (current[key] !== artifact.manifest[key]) throw new Error(`实际安装包 ${key} 与当前 package.json 不一致。请重新构建打包。`);
  const repo = assertRepository(args.repo);
  const previous = args.previous === 'none' ? null : args.previous ? JSON.parse(await readFile(resolve(args.previous), 'utf8')) : await previousFromChannel(repo);
  assertVersionAdvance(artifact.manifest, previous);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(args.time ?? '')) throw new Error('--time 必须为带时区的 ISO 日期。');
  const publishTimestamp = Math.floor(Date.parse(args.time) / 1000);
  let commit = args.commit || args['source-commit'];
  let update = buildUpdate({ ...artifact, repo, commit, sourceCommit: args['source-commit'] || commit, publishTimestamp });
  if (args.existing) {
    const existing = JSON.parse(await readFile(resolve(args.existing), 'utf8'));
    commit = assertExistingRelease(update, existing);
    update = { ...update, commit };
  }
  const index = buildIndex({ manifest: artifact.manifest, repo, commit, publishTimestamp });
  let npmArtifact, npmUpdate;
  if (args['existing-npm'] && !args['npm-tarball']) throw new Error('--existing-npm 需要 --npm-tarball。');
  if (args['npm-tarball']) {
    npmArtifact = await inspectTarball(args['npm-tarball']);
    if (npmArtifact.manifest.name !== NPM_ENTRY_NAME || npmArtifact.manifest.version !== artifact.manifest.version) throw new Error('npm 短名称包的名称或版本与本次发布不一致。');
    npmUpdate = buildUpdate({ ...npmArtifact, repo, commit: update.sourceCommit, sourceCommit: update.sourceCommit, publishTimestamp });
    if (args['existing-npm']) assertExistingRelease(npmUpdate, JSON.parse(await readFile(resolve(args['existing-npm']), 'utf8')));
  }
  // Product display name is independent of the stable internal package id.
  index.title = { en: 'DSH Open Beauty', zh: 'Open Beauty 开场美学' };
  index.description = { en: 'Stable Open Beauty releases for DeepSeek Harness.', zh: 'Open Beauty 的稳定版本与更新目录。' };
  index.plugins[0].title = { en: 'DSH Open Beauty', zh: 'Open Beauty 开场美学' };
  const out = resolve(args.out || join(ROOT, 'release-assets'));
  await mkdir(out, { recursive: true });
  await writeFile(join(out, 'update.json'), JSON.stringify(update, null, 2) + '\n');
  if (npmUpdate) await writeFile(join(out, 'npm-update.json'), JSON.stringify(npmUpdate, null, 2) + '\n');
  await writeFile(join(out, 'plugin-index.json'), JSON.stringify(index, null, 2) + '\n');
  await writeFile(join(out, 'SHA256SUMS.txt'), `${artifact.sha256}  ${artifact.manifest.name.replace('/', '-')}-${artifact.manifest.version}.tgz\n` + (npmArtifact ? `${npmArtifact.sha256}  ${NPM_ENTRY_NAME}-${npmArtifact.manifest.version}.tgz\n${npmArtifact.sha256}  ${NPM_ENTRY_NAME}.tgz\n` : ''));
  await writeFile(join(out, 'release-notes.md'), `DSH Open Beauty ${update.version}\n\n源码提交：${update.sourceCommit}\n构建提交：${update.commit}\n\n使用插件设置中的检查更新进行原位升级，无需先卸载。升级后重新打开 Harness。个人视频、图片和播放偏好保留。\n\nSHA-256：${update.sha256}\n`);
  console.log(`Release metadata verified: ${update.packageName}@${update.version}\nDistribution commit: ${update.commit}\nImmutable tarball: ${update.tarballUrl}\nOutput: ${out}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(`发布准备失败：${error.message}`); process.exitCode = 1; });
