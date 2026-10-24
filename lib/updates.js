import { createHash, randomUUID } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, writeFile, rename, readdir, stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';

export const UPDATE_REPOSITORY = 'FerrariLewis/open';
export const UPDATE_MANIFEST_URL = `https://github.com/${UPDATE_REPOSITORY}/releases/download/channel-stable/update.json`;
export const NPM_ENTRY_NAME = 'dsh-openup-lewis';
export function updateManifestUrl(packageName, repo = UPDATE_REPOSITORY) {
  const filename = packageName === NPM_ENTRY_NAME ? 'npm-update.json' : 'update.json';
  return `https://github.com/${repo}/releases/download/channel-stable/${filename}`;
}
const MAX_PACKAGE_BYTES = 80 * 1024 * 1024;

function versionParts(value) {
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) throw new Error('维护版本必须使用 X.Y.Z 稳定版本号。');
  const parts=value.split('.').map(Number);
  if(parts.some(part=>!Number.isSafeInteger(part)))throw new Error('版本号过大。');
  return parts;
}
export function isNewerVersion(candidate,current) {
  const a=versionParts(candidate),b=versionParts(current);
  for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i];}return false;
}
export function validateUpdateManifest(value,{packageName,repo=UPDATE_REPOSITORY}) {
  if(!value||typeof value!=='object'||Array.isArray(value)||value.format!==1)throw new Error('维护清单格式不正确。');
  versionParts(value.version);
  if(value.packageName!==packageName)throw new Error('更新包标识与当前插件不一致。');
  if(!/^[a-f0-9]{40}$/.test(value.commit||'')||!/^[a-f0-9]{64}$/.test(value.sha256||''))throw new Error('更新提交或 SHA-256 无效。');
  if(!Number.isSafeInteger(value.bytes)||value.bytes<=0||value.bytes>MAX_PACKAGE_BYTES)throw new Error('更新包大小超出限制。');
  if(!Number.isSafeInteger(value.publishTimestamp)||value.publishTimestamp<=0||value.requiresRestart!==true)throw new Error('维护清单缺少发布时间或重启声明。');
  const expected=`https://github.com/${repo}/releases/download/v${value.version}/${packageName}-${value.version}.tgz`;
  if(value.tarballUrl!==expected)throw new Error('只接受本项目固定版本的 GitHub Release 更新包。');
  return {format:1,packageName,version:value.version,commit:value.commit,sourceCommit:value.sourceCommit,sha256:value.sha256,bytes:value.bytes,publishTimestamp:value.publishTimestamp,tarballUrl:expected,releaseNotesUrl:`https://github.com/${repo}/releases/tag/v${value.version}`,requiresRestart:true};
}

/** Inspect package metadata without extracting any paths or executing code. */
export function readPackageManifest(tgz) {
  const tar=gunzipSync(tgz,{maxOutputLength:160*1024*1024});
  let manifest=null,pendingPath=null,globalPath=null;
  let offset=0,count=0;
  for(;offset+512<=tar.length&&count<20000;count++){
    const header=tar.subarray(offset,offset+512);
    if(header.every(byte=>byte===0))break;
    const text=(start,end)=>header.subarray(start,end).toString('utf8').split('\0')[0];
    const checksum=parseInt(text(148,156).trim(),8);
    let sum=0;for(let i=0;i<512;i++)sum+=(i>=148&&i<156)?32:header[i];
    if(!Number.isFinite(checksum)||sum!==checksum)throw new Error('更新包 TAR 校验失败。');
    const rawSize=text(124,136).trim();
    if(!/^[0-7]+$/.test(rawSize))throw new Error('更新包 TAR 长度无效。');
    const size=parseInt(rawSize,8);
    if(!Number.isSafeInteger(size)||offset+512+size>tar.length)throw new Error('更新包内容不完整。');
    const prefix=text(345,500),type=text(156,157);
    const body=tar.subarray(offset+512,offset+512+size);
    if(type==='x'||type==='g'){
      let at=0;
      while(at<body.length){const space=body.indexOf(32,at);if(space<0)throw Error('更新包扩展头无效。');const length=Number(body.subarray(at,space).toString('ascii'));if(!Number.isSafeInteger(length)||length<=space-at+1||at+length>body.length)throw Error('更新包扩展头长度无效。');const record=body.subarray(space+1,at+length).toString('utf8').replace(/\n$/,'');if(record.startsWith('path=')){if(type==='g')globalPath=record.slice(5);else pendingPath=record.slice(5);}at+=length;}
    } else if(type==='L') {pendingPath=body.toString('utf8').split('\0')[0];}
    const name=(pendingPath||globalPath||(prefix?prefix+'/':'')+text(0,100)).replace(/^(?:\.\/)+/,'');
    if(!['x','g','L'].includes(type)&&name==='package/package.json'){
      if(manifest)throw Error('更新包含重复 package.json，未执行更新。');
      if(size>262144||!['0','\0',''].includes(type))throw new Error('更新包 package.json 无效。');
      const value=JSON.parse(body.toString('utf8'));
      if(!value||Array.isArray(value)||typeof value!=='object')throw new Error('更新包 package.json 无效。');
      manifest=value;
    }
    if(!['x','g','L'].includes(type))pendingPath=null;
    offset+=512+Math.ceil(size/512)*512;
  }
  if(count>=20000)throw Error('更新包包含过多 TAR 条目，未执行更新。');
  if(manifest)return manifest;
  throw new Error('更新包中没有 package/package.json。');
}

async function responseBytes(response,limit,signal) {
  const length=Number(response.headers.get('content-length'));
  if(length>limit)throw new Error('维护文件超过允许大小。');
  const reader=response.body?.getReader();
  if(!reader)throw new Error('维护文件内容为空。');
  const chunks=[];let size=0;
  try {
    while(true){if(signal.aborted)throw new Error('维护文件读取超时。');const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit)throw new Error('维护文件超过允许大小。');chunks.push(Buffer.from(value));}
  } catch(error){await reader.cancel().catch(()=>{});throw error;}
  return Buffer.concat(chunks,size);
}

/** Only checks and stages verified files. Installation belongs to the owner's official Remote API. */
export function createUpdateService({dataDir,packageFile,fetchImpl=fetch,repo=UPDATE_REPOSITORY,now=()=>Date.now(),manifestUrl}={}) {
  const cacheDir=join(dataDir,'update-cache');
  let checking=null,preparing=null,preparingVersion=null;
  async function identity(){const pkg=JSON.parse(await readFile(packageFile,'utf8'));versionParts(pkg.version);return {packageName:pkg.name,currentVersion:pkg.version};}
  async function check(){
    if(checking)return checking;
    checking=(async()=>{
      const local=await identity();
      const signal=AbortSignal.timeout(15000);
      try {
        const response=await fetchImpl(manifestUrl ?? updateManifestUrl(local.packageName, repo),{signal,headers:{accept:'application/json','user-agent':'DSH-Open-Beauty-Updater'}});
        if(response.status===404)return {...local,available:false,channelReady:false,message:'维护通道尚未发布，当前版本可以继续使用。'};
        if(!response.ok)throw new Error(`维护服务返回 HTTP ${response.status}。`);
        const manifest=validateUpdateManifest(JSON.parse((await responseBytes(response,65536,signal)).toString('utf8')),{packageName:local.packageName,repo});
        return {...local,available:isNewerVersion(manifest.version,local.currentVersion),channelReady:true,latestVersion:manifest.version,manifest,message:isNewerVersion(manifest.version,local.currentVersion)?'有新版本可用。':'当前已是最新版本。'};
      } catch(error){return {...local,available:false,channelReady:false,message:error.name==='TimeoutError'?'连接维护通道超时，请稍后重试。':`暂时无法检查更新：${error.message}`};}
    })();
    try{return await checking;}finally{checking=null;}
  }
  async function cleanOld(){
    const names=await readdir(cacheDir).catch(()=>[]);
    // Installed profile dependencies may point at a staged tgz. Retain those
    // immutable archives so a later pnpm operation can still resolve them.
    await Promise.all(names.filter(name=>/^[a-f0-9-]{36}\.part$/.test(name)).map(async name=>{const path=join(cacheDir,name);const info=await stat(path).catch(()=>null);if(info&&now()-info.mtimeMs>7*86400000)await unlink(path).catch(()=>{});}));
  }
  async function prepare(requestedVersion){
    if(preparing){if(requestedVersion!==preparingVersion)throw Error('另一个版本正在准备，请稍后重新检查。');return preparing;}
    preparingVersion=requestedVersion;
    preparing=(async()=>{
      const status=await check();
      if(!status.channelReady||!status.available||status.latestVersion!==requestedVersion)throw new Error('更新版本已变化或尚未发布，请重新检查更新。');
      const manifest=status.manifest;
      const signal=AbortSignal.timeout(120000);
      const response=await fetchImpl(manifest.tarballUrl,{signal,headers:{'user-agent':'DSH-Open-Beauty-Updater'}});
      if(!response.ok)throw new Error(`更新包下载失败（HTTP ${response.status}）。`);
      const bytes=await responseBytes(response,Math.min(MAX_PACKAGE_BYTES,manifest.bytes),signal);
      if(bytes.length!==manifest.bytes||createHash('sha256').update(bytes).digest('hex')!==manifest.sha256)throw new Error('更新包 SHA-256 或大小校验失败，未执行更新。');
      const pkg=readPackageManifest(bytes);
      if(pkg.name!==status.packageName||pkg.version!==manifest.version||!pkg.dsh?.bundle?.patch)throw new Error('更新包的名称、版本或插件声明不匹配。');
      for(const key of ['preinstall','install','postinstall','prepare','preprepare','postprepare'])if(pkg.scripts?.[key])throw new Error('维护包包含安装脚本，请通过 Harness 插件管理器人工检查。');
      await mkdir(cacheDir,{recursive:true});await cleanOld();
      const path=join(cacheDir,`${pkg.name}-${pkg.version}-${manifest.sha256}.tgz`);
      const temp=join(cacheDir,`${randomUUID()}.part`);
      try{await writeFile(temp,bytes,{flag:'wx'});await rename(temp,path);}finally{await unlink(temp).catch(()=>{});}
      return {version:manifest.version,spec:path,sha256:manifest.sha256,requiresRestart:true};
    })();
    try{return await preparing;}finally{preparing=null;preparingVersion=null;}
  }
  return {check,prepare,identity};
}
