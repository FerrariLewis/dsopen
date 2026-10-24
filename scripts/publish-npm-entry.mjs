#!/usr/bin/env node
/** Publish only an already verified, versioned Release package. Never creates an npm account. */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isNewerVersion, readPackageManifest, validateUpdateManifest } from '../src/updates.js';

export const ENTRY_NAME = 'dsh-openup-lewis';
const LIFECYCLES = ['preinstall', 'install', 'postinstall', 'prepare', 'preprepare', 'postprepare', 'prepublish', 'prepublishOnly', 'prepack', 'postpack', 'postpublish'];

function assertRepo(repo) {
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]+$/.test(repo ?? '') || /\/\.{1,2}$/.test(repo)) throw Error('repo 必须是 GitHub owner/repo。');
}

function repositoryMatches(value, repo) {
  const url = typeof value === 'string' ? value : value?.url;
  return typeof url === 'string' && url.replace(/^git\+/, '').replace(/\/$/, '').replace(/\.git$/, '') === `https://github.com/${repo}`;
}

async function registryDocument(response) {
  if (!response.ok) throw Error(`npm 注册表请求失败：HTTP ${response.status}。`);
  const reader = response.body?.getReader();
  if (!reader) throw Error('npm 注册表返回空内容。');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4 * 1024 * 1024) throw Error('npm 注册表元数据超过4 MB。');
      chunks.push(Buffer.from(value));
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  }
  return JSON.parse(Buffer.concat(chunks, size).toString('utf8'));
}

export async function publishNpmEntry({ metadata, archive, repo, fetchImpl = fetch, publishImpl }) {
  assertRepo(repo);
  const update = validateUpdateManifest(metadata, { packageName: ENTRY_NAME, repo });
  if (archive.length !== update.bytes || createHash('sha256').update(archive).digest('hex') !== update.sha256) throw Error('npm 发布包大小或 SHA-256 与 Release 清单不一致。');
  const manifest = readPackageManifest(archive);
  if (manifest.name !== ENTRY_NAME || manifest.version !== update.version || !manifest.dsh?.bundle?.patch) throw Error('npm 发布包名称、版本或 bundle 声明不符。');
  if (!repositoryMatches(manifest.repository, repo)) throw Error('npm 发布包的 repository 与当前 GitHub 仓库不一致。');
  if (LIFECYCLES.some(name => manifest.scripts?.[name])) throw Error('npm 发布包包含安装或发布生命周期脚本。');
  if (Object.keys(manifest.dependencies ?? {}).length) throw Error('短名称安装包必须独立运行，不能引入入口依赖。');
  const integrity = 'sha512-' + createHash('sha512').update(archive).digest('base64');
  const response = await fetchImpl(`https://registry.npmjs.org/${ENTRY_NAME}`, {
    signal: AbortSignal.timeout(30000), headers: { accept: 'application/json', 'user-agent': 'DSH-Open-Beauty-Publisher' },
  });
  if (response.status === 404) return {
    state: 'bootstrap-required', version: update.version,
    message: '短安装码尚未首次发布到 npm。本次只完成 GitHub 发布；维护者注册并登录 npm 后，先手动发布此安装包，再配置 publish-npm.yml 为可信发布者。',
  };
  const registry = await registryDocument(response);
  const latest = registry.versions?.[registry['dist-tags']?.latest];
  if (registry.name !== ENTRY_NAME || !repositoryMatches(registry.repository ?? latest?.repository, repo)) throw Error('npm 上的同名包不属于此 GitHub 项目，拒绝发布。');
  const existing = registry.versions?.[update.version];
  if (existing) {
    if (!repositoryMatches(existing.repository, repo) || !String(existing.dist?.integrity ?? '').split(/\s+/).includes(integrity)) throw Error('npm 已存在同版本但内容不同，拒绝覆盖；请提高版本号。');
    return { state: 'already-published', version: update.version, message: `npm ${ENTRY_NAME}@${update.version} 内容一致，已跳过重复发布。` };
  }
  if (registry['dist-tags']?.latest && !isNewerVersion(update.version, registry['dist-tags'].latest)) throw Error('待发布版本必须高于 npm latest，拒绝回退安装入口。');
  if (typeof publishImpl !== 'function') throw Error('缺少 npm 发布实现。');
  await publishImpl({ name: ENTRY_NAME, version: update.version, integrity });
  return { state: 'published', version: update.version, message: `已发布 ${ENTRY_NAME}@${update.version}；Harness 可直接输入 ${ENTRY_NAME} 安装。` };
}

function parse(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!['--tarball', '--metadata', '--repo'].includes(key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw Error('用法：node scripts/publish-npm-entry.mjs --tarball 包.tgz --metadata npm-update.json --repo owner/repo');
    args[key.slice(2)] = argv[++i];
  }
  if (!args.tarball || !args.metadata || !args.repo) throw Error('必须指定 --tarball、--metadata 和 --repo。');
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parse(argv);
  const archivePath = resolve(args.tarball);
  const result = await publishNpmEntry({
    metadata: JSON.parse(await readFile(resolve(args.metadata), 'utf8')),
    archive: await readFile(archivePath), repo: args.repo,
    publishImpl: () => {
      if (process.platform === 'win32') throw Error('本机请使用 npm publish <安装包.tgz> --access public；此自动发布步骤在 GitHub Linux runner 中执行。');
      execFileSync('npm', ['publish', archivePath, '--access', 'public', '--ignore-scripts', '--registry=https://registry.npmjs.org'], { stdio: 'inherit' });
    },
  });
  console.log(result.message);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, result.message + '\n');
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(`npm 发布失败：${error.message}`); process.exitCode = 1; });
