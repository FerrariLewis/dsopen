import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import vm from 'node:vm';
import { buildNpmEntry } from '../scripts/build-npm-entry.mjs';

const header = 'window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory:';
function tarball(entries) {
  const blocks = [];
  for (const [name, content, type = '0'] of entries) {
    const body = type === '2' ? Buffer.alloc(0) : Buffer.from(content), block = Buffer.alloc(512);
    block.write(name, 0, 100); block.write('0000644\0', 100); block.write('0000000\0', 108); block.write('0000000\0', 116);
    block.write(body.length.toString(8).padStart(11, '0') + '\0', 124); block.write('00000000000\0', 136);
    block.fill(32, 148, 156); block.write(type, 156); if (type === '2') block.write(content, 157, 100); block.write('ustar\0', 257); block.write('00', 263);
    const sum = block.reduce((total, byte) => total + byte, 0);
    block.write(sum.toString(8).padStart(6, '0') + '\0 ', 148);
    blocks.push(block, body, Buffer.alloc((512 - body.length % 512) % 512));
  }
  return gzipSync(Buffer.concat([...blocks, Buffer.alloc(1024)]));
}
function fixture({ name = 'dsh-boot-studio', client = `${header} () => ({apply(){}}) });`, scripts = { build:'node scripts/build.mjs' }, extra = [] } = {}) {
  const manifest = { name, version:'1.2.1', type:'module', main:'./lib/index.js', exports:{'.':'./lib/index.js','./client':'./lib/client.js','./package.json':'./package.json'}, dependencies:{unwanted:'1.0.0'},devDependencies:{unwantedDev:'1.0.0'},scripts,dsh:{bundle:{patch:'./cordis.patch.yml'},client:{platform:'web',inject:['slots']}} };
  return tarball([
    ['package/package.json',JSON.stringify(manifest)],['package/lib/index.js',"export const name='dsh-boot-studio'; export const BASE_PATH='/dsh-boot-studio';"],
    ['package/lib/client.js',client],['package/cordis.patch.yml','- insert: []\n'],['package/assets/video.mp4','original-video'],
    ['package/LICENSE','BSD-3-Clause'],['package/THIRD_PARTY_NOTICES.md','upstream permissions'],['package/preview/app.js','offline-preview'],...extra,
  ]);
}

test('standalone npm distribution keeps host/media bytes and registers the matching client ID without build dependencies', async () => {
  const scratch = await mkdtemp(join(tmpdir(),'open-beauty-npm-entry-'));
  try {
    const source=join(scratch,'core.tgz'), out=join(scratch,'npm');
    await writeFile(source,fixture());
    const result=await buildNpmEntry({tarball:source,out,repo:'FerrariLewis/dsh-'});
    const manifest=JSON.parse(await readFile(join(out,'package.json'),'utf8'));
    assert.equal(result.packageName,'dsh-openup-lewis'); assert.equal(manifest.version,'1.2.1');
    assert.equal(manifest.repository.url,'git+https://github.com/FerrariLewis/dsh-.git');
    for(const field of ['dependencies','devDependencies','optionalDependencies','scripts']) assert.equal(manifest[field],undefined);
    assert.equal(await readFile(join(out,'assets/video.mp4'),'utf8'),'original-video');
    assert.equal(await readFile(join(out,'lib/index.js'),'utf8'),"export const name='dsh-boot-studio'; export const BASE_PATH='/dsh-boot-studio';");
    assert.match(await readFile(join(out,'cordis.patch.yml'),'utf8'),/id: dsh-openup-lewis\n      name: dsh-openup-lewis/);
    let registered;
    vm.runInNewContext(await readFile(join(out,'lib/client.js'),'utf8'),{window:{__ModuleLoader__:{load:value=>{registered=value;}}}});
    assert.equal(registered.id,'dsh-openup-lewis'); assert.equal(typeof registered.factory().apply,'function');
    await assert.rejects(()=>buildNpmEntry({tarball:source,out,repo:'FerrariLewis/dsh-'}),/EEXIST/);
    assert.equal((await stat(join(out,'assets/video.mp4'))).size,14);
  } finally { await rm(scratch,{recursive:true,force:true}); }
});

test('npm distribution refuses changed build headers, wrong source identity, install scripts and archive links before output', async () => {
  const scratch=await mkdtemp(join(tmpdir(),'open-beauty-npm-entry-invalid-'));
  try {
    const cases=[
      [fixture({client:'window.__ModuleLoader__.load({id:"changed",factory(){}});'}),/注册头/],
      [fixture({name:'another-package'}),/核心包/],
      [fixture({scripts:{postinstall:'node arbitrary.js'}}),/生命周期/],
      [fixture({extra:[['package/lib/link','outside','2']]}),/符号链接/],
      [fixture({extra:[['package/../escape','bad']]}),/不安全路径/],
    ];
    for(let index=0;index<cases.length;index++) {
      const source=join(scratch,`${index}.tgz`),out=join(scratch,`out-${index}`);
      await writeFile(source,cases[index][0]);
      await assert.rejects(()=>buildNpmEntry({tarball:source,out,repo:'FerrariLewis/dsh-'}),cases[index][1]);
      await assert.rejects(()=>stat(out),{code:'ENOENT'});
    }
  } finally {await rm(scratch,{recursive:true,force:true});}
});
