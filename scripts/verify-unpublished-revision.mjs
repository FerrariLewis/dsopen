#!/usr/bin/env node
/** Narrow exception for revising the owner's unapproved npm 1.2.5 package. */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inspectTarball } from './release.mjs';

export const REVISION = Object.freeze({
  repo: 'FerrariLewis/open', version: '1.2.5',
  source: '81ccf0a468bddcada6fa598db40d6aa436ab47e0',
  distribution: 'd5ae3edee3db98bec37d7432b664c410cb763928',
  timestamp: 1792894996,
  coreSHA: '0e2947dac7dba28b1bb2fd6a48056654173ec1cff75ad17345f4216dcf9f931c',
  coreBytes: 13506134,
  npmSHA: '1d7ae1d43a6ab0d07350b5599448950b4c0c499aa2ce2c5b50e30f39cc2bd5f3',
  npmBytes: 13506132,
});
const SHA = /^[a-f0-9]{40}$/;
const DIGEST = /^[a-f0-9]{64}$/;
const CORE = 'dsh-boot-studio';
const NPM = 'dsh-openup-lewis';
const assetURL = name => `https://github.com/${REVISION.repo}/releases/download/v${REVISION.version}/${name}-${REVISION.version}.tgz`;

export async function assertNpmUnpublished({ repo, version, fetchImpl = fetch }) {
  if (repo !== REVISION.repo || version !== REVISION.version) throw Error('同版本修订只允许 FerrariLewis/open 的 1.2.5。');
  const response = await fetchImpl(`https://registry.npmjs.org/${NPM}/${version}`, {
    signal: AbortSignal.timeout(30000), redirect: 'error',
    headers: { accept: 'application/json', 'user-agent': 'DSH-LEWIS-ENCHANT-unpublished-revision' },
  });
  await response.body?.cancel().catch(() => {});
  if (response.status === 200) throw Error('npm 1.2.5 已正式发布，禁止同版本修改安装包；请提高版本号。');
  if (response.status !== 404) throw Error(`无法确认 npm 1.2.5 尚未发布（HTTP ${response.status}），未允许同版本修订。`);
}

function metadataKind(value, name, artifact, sourceCommit, timestamp) {
  if (!value || value.format !== 1 || value.packageName !== name || value.version !== REVISION.version ||
      value.requiresRestart !== true || value.tarballUrl !== assetURL(name) || !SHA.test(value.commit ?? '')) {
    throw Error(`${name} 已有更新清单的身份或来源无效。`);
  }
  const oldSHA = name === CORE ? REVISION.coreSHA : REVISION.npmSHA;
  const oldBytes = name === CORE ? REVISION.coreBytes : REVISION.npmBytes;
  const oldCommit = name === CORE ? REVISION.distribution : REVISION.source;
  if (value.sourceCommit === REVISION.source && value.sha256 === oldSHA && value.bytes === oldBytes &&
      value.publishTimestamp === REVISION.timestamp && value.commit === oldCommit) return 'old';
  if (value.sourceCommit === sourceCommit && value.sha256 === artifact.sha256 && value.bytes === artifact.bytes &&
      value.publishTimestamp === timestamp && (name === CORE || value.commit === sourceCommit)) return 'current';
  throw Error(`${name} 已有内容既不是获准替换的旧版本，也不是当前源码的精确重放，拒绝修订。`);
}

export async function verifyRevision({ repo, version, sourceCommit, publishTime, release, coreUpdate, npmUpdate, channelUpdate,
  tagSHA, coreArtifact, npmArtifact, metadataDigests, fetchImpl = fetch }) {
  if (repo !== REVISION.repo || version !== REVISION.version) throw Error('同版本修订只允许 FerrariLewis/open 的 1.2.5。');
  if (!SHA.test(sourceCommit ?? '') || sourceCommit === REVISION.source) throw Error('修订必须绑定新的完整源码提交。');
  const timestamp = Math.floor(Date.parse(publishTime) / 1000);
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(publishTime ?? '') || !Number.isSafeInteger(timestamp)) throw Error('修订提交时间无效。');
  if (!release || release.tag_name !== 'v1.2.5' || release.immutable !== false || release.draft !== false) throw Error('只允许修订现有、非 immutable 的 v1.2.5 Release。');
  for (const [artifact, name] of [[coreArtifact, CORE], [npmArtifact, NPM]]) {
    if (!artifact || artifact.manifest?.name !== name || artifact.manifest.version !== version ||
        !DIGEST.test(artifact.sha256 ?? '') || !Number.isSafeInteger(artifact.bytes) || artifact.bytes <= 0) throw Error('修订安装包的名称、版本或校验值无效。');
  }
  const coreKind = metadataKind(coreUpdate, CORE, coreArtifact, sourceCommit, timestamp);
  const npmKind = metadataKind(npmUpdate, NPM, npmArtifact, sourceCommit, timestamp);
  // Never move an already newer stable channel backwards during this exception.
  metadataKind(channelUpdate, CORE, coreArtifact, sourceCommit, timestamp);
  const allowedTags = [REVISION.distribution];
  if (coreKind === 'current' && npmKind === 'current') allowedTags.push(coreUpdate.commit);
  if (!SHA.test(tagSHA ?? '') || !allowedTags.includes(tagSHA)) throw Error('v1.2.5 标签已被其他操作移动，拒绝覆盖。');
  const assets = new Map((release.assets || []).map(asset => [asset.name, asset]));
  for (const [name, digest] of [['update.json', metadataDigests?.core], ['npm-update.json', metadataDigests?.npm]]) {
    if (!DIGEST.test(digest ?? '') || assets.get(name)?.digest !== `sha256:${digest}`) throw Error('已有更新清单在读取期间发生变化，拒绝修订。');
  }
  // Uploads are not atomic. A retry may see old and current archives mixed, but
  // no artifact from a third revision is accepted. Missing target archives can
  // be restored from the freshly verified build after a failed clobber upload.
  for (const [name, allowed] of [
    [`${CORE}-${version}.tgz`, [REVISION.coreSHA, coreArtifact.sha256]],
    [`${NPM}-${version}.tgz`, [REVISION.npmSHA, npmArtifact.sha256]],
    [`${NPM}.tgz`, [REVISION.npmSHA, npmArtifact.sha256]],
  ]) {
    const asset = assets.get(name);
    if (asset && !allowed.map(digest => `sha256:${digest}`).includes(asset.digest)) throw Error(`${name} 不属于获准的旧安装包或当前构建，拒绝覆盖。`);
  }
  await assertNpmUnpublished({ repo, version, fetchImpl });
  const mode = coreKind === 'current' && npmKind === 'current' ? 'replay' : 'replace';
  return { mode, version, sourceCommit, previousTagSHA: tagSHA,
    distributionCommit: mode === 'replay' ? coreUpdate.commit : null,
    coreSHA: coreArtifact.sha256, npmSHA: npmArtifact.sha256 };
}

function parse(argv) {
  const args = {};
  const keys = new Set(['--repo','--version','--source-commit','--time','--release-json','--core-metadata','--npm-metadata','--channel-metadata','--tag-sha','--core-tarball','--npm-tarball','--out']);
  for (let i=0;i<argv.length;i++) {
    const key=argv[i];
    if (!keys.has(key) || args[key.slice(2)] || !argv[i+1] || argv[i+1].startsWith('--')) throw Error('修订校验参数无效或重复。');
    args[key.slice(2)] = argv[++i];
  }
  if ([...keys].some(key => !args[key.slice(2)])) throw Error('修订校验缺少必要参数。');
  return args;
}

export async function main(argv=process.argv.slice(2)) {
  const args=parse(argv);
  const [releaseRaw,coreRaw,npmRaw,channelRaw,coreArtifact,npmArtifact]=await Promise.all([
    readFile(resolve(args['release-json']),'utf8'),readFile(resolve(args['core-metadata']),'utf8'),readFile(resolve(args['npm-metadata']),'utf8'),
    readFile(resolve(args['channel-metadata']),'utf8'),
    inspectTarball(args['core-tarball']),inspectTarball(args['npm-tarball']),
  ]);
  if ([releaseRaw,coreRaw,npmRaw,channelRaw].some(value=>value.length>1024*1024)) throw Error('修订清单超过大小限制。');
  const hash=value=>createHash('sha256').update(value).digest('hex');
  const result=await verifyRevision({repo:args.repo,version:args.version,sourceCommit:args['source-commit'],publishTime:args.time,
    release:JSON.parse(releaseRaw),coreUpdate:JSON.parse(coreRaw),npmUpdate:JSON.parse(npmRaw),channelUpdate:JSON.parse(channelRaw),tagSHA:args['tag-sha'],
    coreArtifact,npmArtifact,metadataDigests:{core:hash(coreRaw),npm:hash(npmRaw)}});
  await writeFile(resolve(args.out),JSON.stringify(result,null,2)+'\n');
  console.log(`Unpublished 1.2.5 revision verified: ${result.mode}; npm publication remains blocked until owner approval.`);
  return result;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{console.error(`同版本修订被拒绝：${error.message}`);process.exitCode=1;});
