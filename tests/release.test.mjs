import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { buildUpdate, compareVersions, assertVersionAdvance, assertExistingRelease, inspectTarball, main } from '../scripts/release.mjs';

const repo = 'FerrariLewis/dsh-open-beauty';
const commit = 'a'.repeat(40), sourceCommit = 'b'.repeat(40);
const manifest = { name:'dsh-boot-studio', version:'1.2.0', description:'Open Beauty', dsh:{bundle:{patch:'./cordis.patch.yml'},engines:{dsh:'>=0.2.1-rc.2 <0.3.0'}} };
const facts = { manifest, repo, commit, sourceCommit, publishTimestamp:1792814400, bytes:1234, sha256:'c'.repeat(64) };

test('release versions strictly advance and compare numerically without an npm runtime dependency', () => {
  assert.equal(compareVersions('1.10.0','1.9.9'),1);
  assert.equal(compareVersions('2.0.0','10.0.0'),-1);
  assert.equal(compareVersions('1.2.0','1.2.0'),0);
  assert.throws(()=>compareVersions('1.2.0-beta','1.2.0'),/正式发布/);
  assert.throws(()=>compareVersions('01.2.0','1.2.0'),/正式发布/);
  assert.throws(()=>compareVersions('9007199254740992.0.0','1.2.0'),/安全整数/);
  assert.doesNotThrow(()=>assertVersionAdvance(manifest,null));
  assert.doesNotThrow(()=>assertVersionAdvance(manifest,{format:1,packageName:manifest.name,version:'1.1.0'}));
  assert.throws(()=>assertVersionAdvance(manifest,{format:1,packageName:manifest.name,version:'1.2.0'}),/同版本不可覆盖/);
  assert.throws(()=>assertVersionAdvance(manifest,{format:1,packageName:manifest.name,version:'2.0.0'}),/提高 package.json.version/);
  assert.throws(()=>assertVersionAdvance(manifest,{format:1,packageName:'another-plugin',version:'1.1.0'}),/包名不一致/);
});

test('update descriptor points to an immutable versioned tarball and pins both source and distribution commits', () => {
  const update=buildUpdate(facts);
  assert.equal(update.tarballUrl,`https://github.com/${repo}/releases/download/v1.2.0/dsh-boot-studio-1.2.0.tgz`);
  assert.equal(update.commit,commit);assert.equal(update.sourceCommit,sourceCommit);
  assert.equal(update.sha256,facts.sha256);assert.equal(update.bytes,1234);
  assert.equal(update.requiresRestart,true);assert.equal(update.format,1);
  assert.throws(()=>buildUpdate({...facts,repo:'https://example.test/evil'}),/repo/);
  assert.throws(()=>buildUpdate({...facts,commit:'main'}),/40/);
  assert.throws(()=>buildUpdate({...facts,sha256:'bad'}),/SHA/);
  assert.throws(()=>buildUpdate({...facts,bytes:0}),/大小/);
  assert.throws(()=>buildUpdate({...facts,bytes:80*1024*1024+1}),/80 MB/);
});

test('interrupted release can resume only with identical immutable artifact facts', () => {
  const update=buildUpdate(facts);
  const expected={...update,commit:sourceCommit};
  assert.equal(assertExistingRelease(expected,update),commit);
  for(const key of ['sha256','sourceCommit','version','bytes','tarballUrl','publishTimestamp']) assert.throws(()=>assertExistingRelease(expected,{...update,[key]:'changed'}),/拒绝覆盖/);
});

test('real tarball inspection and metadata CLI produce matching SHA, installable catalog and release files offline', async () => {
  const scratch=await mkdtemp(join(tmpdir(),'open-beauty-release-'));
  try {
    const current=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
    const localManifest={...current,scripts:{build:'node scripts/build.mjs'}};
    const packageDir=join(scratch,'package');
    await mkdir(join(packageDir,'lib'),{recursive:true});
    await writeFile(join(packageDir,'package.json'),JSON.stringify(localManifest));
    await writeFile(join(packageDir,'lib','index.js'),'export function apply() {}');
    await writeFile(join(packageDir,'lib','client.js'),'window.__ModuleLoader__.load({});');
    await writeFile(join(packageDir,'cordis.patch.yml'),'- insert: []\n');
    const tarball=join(scratch,`${current.name}-${current.version}.tgz`);
    const tar=process.platform==='win32'?join(process.env.SystemRoot||'C:\\Windows','System32','tar.exe'):'tar';
    execFileSync(tar,['-czf',tarball,'-C',scratch,'package']);
    const artifact=await inspectTarball(tarball);
    assert.equal(artifact.manifest.version,current.version);
    const bytes=await readFile(tarball);
    assert.equal(artifact.bytes,bytes.length);
    assert.equal(artifact.sha256,createHash('sha256').update(bytes).digest('hex'));
    const out=join(scratch,'release-assets');
    await main(['--tarball',tarball,'--repo',repo,'--commit',commit,'--source-commit',sourceCommit,'--time','2026-10-24T12:00:00+08:00','--previous','none','--out',out]);
    const update=JSON.parse(await readFile(join(out,'update.json'),'utf8'));
    const index=JSON.parse(await readFile(join(out,'plugin-index.json'),'utf8'));
    assert.equal(update.sha256,artifact.sha256);assert.equal(update.version,current.version);
    assert.equal(index.format,1);assert.equal(index.plugins[0].name,current.name);
    assert.equal(index.plugins[0].versions[0].source.commit,commit);
    assert.equal(index.plugins[0].versions[0].engines.dsh,current.dsh.engines.dsh);
    assert.equal(index.plugins[0]['dist-tags'].latest,current.version);
    assert.match(await readFile(join(out,'SHA256SUMS.txt'),'utf8'),new RegExp(artifact.sha256));
    assert.match(await readFile(join(out,'release-notes.md'),'utf8'),/无需先卸载/);
    localManifest.scripts.prepare='node execute-on-install.js';
    await writeFile(join(packageDir,'package.json'),JSON.stringify(localManifest));
    execFileSync(tar,['-czf',tarball,'-C',scratch,'package']);
    await assert.rejects(()=>inspectTarball(tarball),/生命周期/);
  } finally {await rm(scratch,{recursive:true,force:true});}
});
