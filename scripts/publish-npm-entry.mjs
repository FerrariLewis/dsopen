#!/usr/bin/env node
/** Stage a verified Release package for its owner's approval on npm. */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isNewerVersion, readPackageManifest, validateUpdateManifest } from '../src/updates.js';
import { requirePackageReleaseNotes, packageReleaseNotesEn } from '../src/release-notes.js';
import { updateIdentityRepository } from './release.mjs';

export const ENTRY_NAME = 'dsh-openup-lewis';
const LIFECYCLES = ['preinstall', 'install', 'postinstall', 'prepare', 'preprepare', 'postprepare', 'prepublish', 'prepublishOnly', 'prepack', 'postpack', 'postpublish'];
const STAGE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertRepo(repo) {
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]+$/.test(repo ?? '') || /\/\.{1,2}$/.test(repo)) throw Error('repo 必须是 GitHub owner/repo。');
}

function assertSourceCommit(metadata, sourceCommit) {
  if (sourceCommit !== undefined && (typeof sourceCommit !== 'string' || !/^[a-f0-9]{40}$/i.test(sourceCommit) || metadata?.sourceCommit !== sourceCommit)) throw Error('源提交必须是40位十六进制 SHA，且与 Release 清单 sourceCommit 完全一致。');
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

export function parseStageReceipt(stdout) {
  const document = JSON.parse(stdout);
  const receipt = document?.[ENTRY_NAME];
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) throw Error('npm 未返回此安装包的暂存结果。');
  return receipt;
}

export async function stageNpmEntry({ metadata, archive, repo, sourceCommit, fetchImpl = fetch, stageImpl }) {
  assertRepo(repo);
  assertSourceCommit(metadata, sourceCommit);
  const identityRepo = updateIdentityRepository(repo, ENTRY_NAME);
  const registryMatches = value => repositoryMatches(value, identityRepo) ||
    (repo === 'FerrariLewis/dsopen' && repositoryMatches(value, repo));
  const update = validateUpdateManifest(metadata, { packageName: ENTRY_NAME, repo: identityRepo });
  if (archive.length !== update.bytes || createHash('sha256').update(archive).digest('hex') !== update.sha256) throw Error('npm 暂存包大小或 SHA-256 与 Release 清单不一致。');
  const manifest = readPackageManifest(archive);
  if (requirePackageReleaseNotes(manifest, { bilingual: true }) !== update.releaseNotes || packageReleaseNotesEn(manifest) !== (update.releaseNotesEn ?? null)) throw Error('npm 暂存包的作者更新说明与 Release 清单不一致，未执行暂存。');
  if (manifest.name !== ENTRY_NAME || manifest.version !== update.version || !manifest.dsh?.bundle?.patch) throw Error('npm 暂存包名称、版本或 bundle 声明不符。');
  if (!repositoryMatches(manifest.repository, identityRepo)) throw Error('npm 暂存包的 repository 与兼容更新身份不一致。');
  if (LIFECYCLES.some(name => manifest.scripts?.[name])) throw Error('npm 暂存包包含安装或发布生命周期脚本。');
  if (['dependencies', 'optionalDependencies', 'peerDependencies'].some(key => Object.keys(manifest[key] ?? {}).length)) throw Error('短名称安装包必须独立运行，不能引入入口依赖。');
  const integrity = 'sha512-' + createHash('sha512').update(archive).digest('base64');
  const response = await fetchImpl(`https://registry.npmjs.org/${ENTRY_NAME}`, {
    signal: AbortSignal.timeout(30000), headers: { accept: 'application/json', 'user-agent': 'DSH-Open-Beauty-Stager' },
  });
  if (response.status === 404) throw Error(`npm 尚不存在 ${ENTRY_NAME}。请先完成首次发布并配置该包的 GitHub Trusted Publisher；此工作流不会代替首次账户授权。`);
  const registry = await registryDocument(response);
  const latest = registry.versions?.[registry['dist-tags']?.latest];
  if (registry.name !== ENTRY_NAME || !registryMatches(registry.repository ?? latest?.repository)) throw Error('npm 上的同名包不属于此 GitHub 项目，拒绝暂存。');
  const existing = registry.versions?.[update.version];
  if (existing) {
    if (!registryMatches(existing.repository) || !String(existing.dist?.integrity ?? '').split(/\s+/).includes(integrity)) throw Error('npm 已存在同版本但内容不同，拒绝覆盖；请提高版本号。');
    return { state: 'already-published', version: update.version, message: `npm ${ENTRY_NAME}@${update.version} 已公开且内容一致，已跳过重复暂存。` };
  }
  if (registry['dist-tags']?.latest === '0.0.0-stage') throw Error('npm 包仍处于首次暂存引导状态；请先在 npm 官网完成首次批准，再使用自动更新工作流。');
  if (registry['dist-tags']?.latest && !isNewerVersion(update.version, registry['dist-tags'].latest)) throw Error('待暂存版本必须高于 npm latest，拒绝回退安装入口。');
  if (typeof stageImpl !== 'function') throw Error('缺少 npm 暂存实现。');
  // A pending stage is not public registry content. Do not guess its identity or
  // retry uploads automatically when npm reports a conflict; the owner can inspect
  // Staged Packages. Only the public SHA-512 comparison above is an idempotent skip.
  const receipt = await stageImpl({ name: ENTRY_NAME, version: update.version, integrity });
  if (!STAGE_ID.test(receipt?.stageId ?? '') || receipt.name !== ENTRY_NAME || receipt.version !== update.version || receipt.integrity !== integrity) throw Error('npm 暂存回执缺少有效 stageId，或包名、版本、SHA-512 与已验证安装包不一致；请在 npm 官网核对，不要直接重复上传。');
  return {
    state: 'staged', version: update.version, stageId: receipt.stageId,
    message: `已暂存 ${ENTRY_NAME}@${update.version}，等待所有者批准，尚未公开。请登录 npm 官网，打开头像菜单 → Staged Packages，选择此版本并批准。`,
  };
}

function parse(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!['--tarball', '--metadata', '--repo', '--source-commit'].includes(key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw Error('用法：node scripts/publish-npm-entry.mjs --tarball 包.tgz --metadata npm-update.json --repo owner/repo [--source-commit 40位SHA]');
    if (args[key.slice(2)]) throw Error(`参数不能重复：${key}`);
    args[key.slice(2)] = argv[++i];
  }
  if (!args.tarball || !args.metadata || !args.repo) throw Error('必须指定 --tarball、--metadata 和 --repo。');
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parse(argv);
  const archivePath = resolve(args.tarball);
  const metadata = JSON.parse(await readFile(resolve(args.metadata), 'utf8'));
  assertSourceCommit(metadata, args['source-commit']);
  const result = await stageNpmEntry({
    metadata,
    archive: await readFile(archivePath), repo: args.repo, sourceCommit: args['source-commit'],
    stageImpl: () => {
      if (process.platform !== 'linux' || process.env.GITHUB_ACTIONS !== 'true' || !process.env.ACTIONS_ID_TOKEN_REQUEST_URL) throw Error('自动暂存只能在启用 id-token: write 的 GitHub Linux runner 中通过 Trusted Publisher 执行。');
      let stdout;
      try {
        stdout = execFileSync('npm', ['stage', 'publish', archivePath, '--access', 'public', '--ignore-scripts', '--tag', 'latest', '--registry=https://registry.npmjs.org', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 8 * 1024 * 1024 });
      } catch (error) {
        throw Error(`npm 暂存未成功（退出码 ${error.status ?? 'unknown'}）。请查看上方 npm 错误及官网 Staged Packages；如已存在待批准版本，请先核对并批准它，工作流不会自动重复上传。`, { cause: error });
      }
      return parseStageReceipt(stdout);
    },
  });
  console.log(result.message);
  if (result.stageId) console.log(`stageId: ${result.stageId}`);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `${result.message}\n\n${result.stageId ? `暂存编号：\`${result.stageId}\`\n\n` : ''}[打开 npm 官网](https://www.npmjs.com/) → 头像菜单 → Staged Packages。\n`);
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `state=${result.state}\nversion=${result.version}\n${result.stageId ? `stage_id=${result.stageId}\n` : ''}`);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(`npm 暂存失败：${error.message}`); process.exitCode = 1; });
