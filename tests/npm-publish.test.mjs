import test from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { publishNpmEntry, ENTRY_NAME } from '../scripts/publish-npm-entry.mjs';

const repo = 'FerrariLewis/dsh-';
const manifest = { name: ENTRY_NAME, version: '1.2.1', repository: { type: 'git', url: `git+https://github.com/${repo}.git` }, dsh: { bundle: { patch: './cordis.patch.yml' } } };
function tarball(pkg) {
  const body = Buffer.from(JSON.stringify(pkg)), header = Buffer.alloc(512);
  header.write('package/package.json'); header.write('0000644\0',100); header.write('0000000\0',108); header.write('0000000\0',116);
  header.write(body.length.toString(8).padStart(11,'0')+'\0',124); header.write('00000000000\0',136); header.fill(32,148,156); header.write('0',156); header.write('ustar\0',257); header.write('00',263);
  header.write(header.reduce((sum,byte)=>sum+byte,0).toString(8).padStart(6,'0')+'\0 ',148);
  return gzipSync(Buffer.concat([header,body,Buffer.alloc((512-body.length%512)%512),Buffer.alloc(1024)]));
}
function fixture(pkg = manifest) {
  const archive = tarball(pkg);
  const metadata = { format:1, packageName:ENTRY_NAME, version:'1.2.1', commit:'a'.repeat(40), sourceCommit:'b'.repeat(40), publishTimestamp:1792800000, sha256:createHash('sha256').update(archive).digest('hex'), bytes:archive.length, tarballUrl:`https://github.com/${repo}/releases/download/v1.2.1/${ENTRY_NAME}-1.2.1.tgz`, requiresRestart:true };
  return { archive, metadata, repo };
}
function registry(versions = {}) { return { name:ENTRY_NAME, repository:manifest.repository, versions }; }
const respond = doc => async () => new Response(JSON.stringify(doc));

test('a missing npm name completes safely without pretending to publish or invoking credentials', async () => {
  let publishes=0;
  const result=await publishNpmEntry({...fixture(),fetchImpl:async url=>{assert.equal(url,`https://registry.npmjs.org/${ENTRY_NAME}`);return new Response('',{status:404});},publishImpl:()=>{publishes++;}});
  assert.equal(result.state,'bootstrap-required');assert.equal(publishes,0);
});

test('existing identical npm artifact is an idempotent retry; conflicting bytes are refused', async () => {
  const f=fixture(),integrity='sha512-'+createHash('sha512').update(f.archive).digest('base64');
  let publishes=0;
  const result=await publishNpmEntry({...f,fetchImpl:respond(registry({'1.2.1':{...manifest,dist:{integrity}}})),publishImpl:()=>{publishes++;}});
  assert.equal(result.state,'already-published');assert.equal(publishes,0);
  await assert.rejects(publishNpmEntry({...f,fetchImpl:respond(registry({'1.2.1':{...manifest,dist:{integrity:'sha512-wrong'}}})),publishImpl:()=>{publishes++;}}),/内容不同/);
  assert.equal(publishes,0);
});

test('new version publishes only after registry ownership and archive integrity checks', async () => {
  const f=fixture();let calls=0;
  const result=await publishNpmEntry({...f,fetchImpl:respond(registry()),publishImpl:({name,version,integrity})=>{calls++;assert.equal(name,ENTRY_NAME);assert.equal(version,'1.2.1');assert.match(integrity,/^sha512-/);}});
  assert.equal(result.state,'published');assert.equal(calls,1);
  await assert.rejects(publishNpmEntry({...f,archive:Buffer.from('wrong'),fetchImpl:()=>{throw Error('must not query');}}),/SHA-256/);
  await assert.rejects(publishNpmEntry({...f,fetchImpl:respond({...registry(),repository:{url:'https://github.com/other/repo.git'}}),publishImpl:()=>{calls++;}}),/同名包/);
  assert.equal(calls,1);
});

test('wrong repository, install scripts, wrapper dependencies, and registry errors prevent publication', async () => {
  let calls=0;
  for(const pkg of [{...manifest,repository:{url:'https://github.com/other/repo.git'}},{...manifest,scripts:{postinstall:'unexpected'}},{...manifest,dependencies:{'dsh-boot-studio':'https://example.com/a.tgz'}}]) {
    await assert.rejects(publishNpmEntry({...fixture(pkg),fetchImpl:respond(registry()),publishImpl:()=>{calls++;}}));
  }
  await assert.rejects(publishNpmEntry({...fixture(),fetchImpl:async()=>new Response('',{status:503}),publishImpl:()=>{calls++;}}),/HTTP 503/);
  assert.equal(calls,0);
});

test('an older queued Release cannot downgrade npm latest', async () => {
  let publishes=0;
  await assert.rejects(publishNpmEntry({...fixture(),fetchImpl:respond({...registry(),'dist-tags':{latest:'1.3.0'}}),publishImpl:()=>{publishes++;}}),/拒绝回退/);
  assert.equal(publishes,0);
});
