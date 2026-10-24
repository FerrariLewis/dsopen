import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,writeFile,readFile,readdir,rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { gzipSync,gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { createUpdateService,isNewerVersion,validateUpdateManifest,readPackageManifest,UPDATE_MANIFEST_URL } from '../src/updates.js';

function tarball(pkg){
  const body=Buffer.from(JSON.stringify(pkg));const header=Buffer.alloc(512);
  header.write('package/package.json',0);header.write('0000644\0',100);header.write('0000000\0',108);header.write('0000000\0',116);header.write(body.length.toString(8).padStart(11,'0')+'\0',124);header.write('00000000000\0',136);header.fill(32,148,156);header.write('0',156);header.write('ustar\0',257);header.write('00',263);
  const sum=header.reduce((a,b)=>a+b,0);header.write(sum.toString(8).padStart(6,'0')+'\0 ',148);
  return gzipSync(Buffer.concat([header,body,Buffer.alloc((512-body.length%512)%512),Buffer.alloc(1024)]));
}
const pkg={name:'dsh-boot-studio',version:'1.3.0',dsh:{bundle:{patch:'./cordis.patch.yml'}}};
const data=tarball(pkg);
const manifest={format:1,packageName:pkg.name,version:pkg.version,commit:'a'.repeat(40),sourceCommit:'b'.repeat(40),publishTimestamp:1792800000,sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length,tarballUrl:'https://github.com/FerrariLewis/dsh-open-beauty/releases/download/v1.3.0/dsh-boot-studio-1.3.0.tgz',requiresRestart:true};
async function fixture(t,{update=manifest,archive=data,notPublished=false}={}){
  const root=await mkdtemp(join(tmpdir(),'open-beauty-update-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const packageFile=join(root,'package.json');await writeFile(packageFile,JSON.stringify({...pkg,version:'1.2.0'}));
  const settingsFile=join(root,'settings.json');await writeFile(settingsFile,'{"duration":3,"myVideo":"retain"}');
  const calls=[];
  const service=createUpdateService({dataDir:root,packageFile,fetchImpl:async url=>{calls.push(String(url));if(String(url)===UPDATE_MANIFEST_URL)return notPublished?new Response('',{status:404}):new Response(JSON.stringify(update));if(String(url)===manifest.tarballUrl)return new Response(archive);throw Error('Unexpected URL');}});
  return {root,service,calls,settingsFile};
}
test('compares stable versions numerically and rejects invalid release metadata',()=>{
  assert.equal(isNewerVersion('1.10.0','1.2.0'),true);assert.equal(isNewerVersion('1.2.0','1.2.0'),false);assert.equal(isNewerVersion('1.1.9','1.2.0'),false);
  for(const change of [{version:'main'},{packageName:'another-plugin'},{tarballUrl:'https://example.com/code.tgz'},{sha256:'wrong'},{bytes:90*1024*1024},{requiresRestart:false}])assert.throws(()=>validateUpdateManifest({...manifest,...change},{packageName:pkg.name}));
});
test('checking an unpublished channel is harmless and does not download or apply code',async t=>{
  const f=await fixture(t,{notPublished:true});const state=await f.service.check();assert.equal(state.channelReady,false);assert.equal(state.available,false);assert.equal(state.currentVersion,'1.2.0');assert.deepEqual(f.calls,[UPDATE_MANIFEST_URL]);assert.equal((await readdir(f.root)).includes('update-cache'),false);
});
test('checking reports a newer release without staging or executing it',async t=>{
  const f=await fixture(t);const state=await f.service.check();assert.equal(state.available,true);assert.equal(state.latestVersion,'1.3.0');assert.deepEqual(f.calls,[UPDATE_MANIFEST_URL]);assert.equal((await readdir(f.root)).includes('update-cache'),false);
});
test('explicit prepare verifies SHA and metadata, stages an immutable local tgz and retains user settings',async t=>{
  const f=await fixture(t);const before=await readFile(f.settingsFile,'utf8');const result=await f.service.prepare('1.3.0');assert.equal(result.requiresRestart,true);assert.match(result.spec,/1\.3\.0-[a-f0-9]{64}\.tgz$/);assert.deepEqual(await readFile(result.spec),data);assert.equal(await readFile(f.settingsFile,'utf8'),before);assert.deepEqual(readPackageManifest(data),pkg);assert.equal(f.calls.filter(x=>x===manifest.tarballUrl).length,1);assert.equal((await readdir(join(f.root,'update-cache'))).some(n=>n.endsWith('.part')),false);
});
test('tampered bytes and wrong packages never produce an installable staged file',async t=>{
  for(const bad of [Buffer.from('tampered'),tarball({...pkg,name:'other-plugin'})]){
    const altered=bad.length===data.length?manifest:{...manifest,bytes:bad.length,sha256:bad.toString()==='tampered'?manifest.sha256:createHash('sha256').update(bad).digest('hex')};
    const f=await fixture(t,{update:altered,archive:bad});await assert.rejects(f.service.prepare('1.3.0'));assert.equal((await readdir(f.root)).includes('update-cache'),false);
  }
});
test('rejects an obsolete requested version, oversize body and install lifecycle scripts',async t=>{
  const f=await fixture(t);await assert.rejects(f.service.prepare('1.2.5'));
  const big=await fixture(t,{archive:Buffer.concat([data,Buffer.alloc(20)])});await assert.rejects(big.service.prepare('1.3.0'));
  const scripted=tarball({...pkg,scripts:{postinstall:'unexpected'}});const scriptedManifest={...manifest,bytes:scripted.length,sha256:createHash('sha256').update(scripted).digest('hex')};const script=await fixture(t,{update:scriptedManifest,archive:scripted});await assert.rejects(script.service.prepare('1.3.0'),/安装脚本/);
});
test('malformed TAR content is refused without extracting any filesystem paths',()=>{
  assert.throws(()=>readPackageManifest(gzipSync(Buffer.alloc(2048))));const broken=gunzipSync(data);broken[0]^=1;assert.throws(()=>readPackageManifest(gzipSync(broken)));
});
test('duplicate package manifests are rejected instead of trusting whichever one appears first',()=>{
  const raw=gunzipSync(data);const entry=raw.subarray(0,raw.length-1024);const duplicate=gzipSync(Buffer.concat([entry,entry,Buffer.alloc(1024)]));assert.throws(()=>readPackageManifest(duplicate),/重复/);
});
test('a concurrent prepare for a different version is refused and never receives the first target',async t=>{
  const f=await fixture(t);const first=f.service.prepare('1.3.0');await assert.rejects(f.service.prepare('1.4.0'),/另一个版本/);const result=await first;assert.equal(result.version,'1.3.0');
});
