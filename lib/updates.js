import { createHash, randomUUID } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, writeFile, rename, readdir, stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { validateReleaseNotes, packageReleaseNotesEn } from './release-notes.js';

export const UPDATE_REPOSITORY = 'FerrariLewis/open';
export const UPDATE_MANIFEST_URL = `https://github.com/${UPDATE_REPOSITORY}/releases/download/channel-stable/update.json`;
export const NPM_ENTRY_NAME = 'dsh-openup-lewis';
export function updateManifestUrl(packageName, repo = UPDATE_REPOSITORY) {
  const filename = packageName === NPM_ENTRY_NAME ? 'npm-update.json' : 'update.json';
  return `https://github.com/${repo}/releases/download/channel-stable/${filename}`;
}
const MAX_PACKAGE_BYTES = 80 * 1024 * 1024;
const NPM_REGISTRIES = ['https://registry.npmjs.org', 'https://registry.npmmirror.com'];
// A slow but progressing connection can finish a full media bundle. Connection
// and idle deadlines still stop a stalled request promptly; the total deadline
// bounds each registry attempt. These are not user-controlled network settings.
export const UPDATE_DOWNLOAD_TIMEOUTS = Object.freeze({ connectMs: 20000, idleMs: 60000, totalMs: 15 * 60 * 1000 });

function downloadBudget(timeouts = UPDATE_DOWNLOAD_TIMEOUTS) {
  const controller = new AbortController();
  let connectionTimer, idleTimer;
  const abort = message => controller.abort(registryFailure(message));
  const totalTimer = setTimeout(() => abort('更新包下载超过 15 分钟，请检查网络后重试。'), timeouts.totalMs);
  const clear = timer => { if (timer) clearTimeout(timer); };
  return {
    signal: controller.signal,
    connecting() { clear(connectionTimer); clear(idleTimer); connectionTimer = setTimeout(() => abort('连接更新下载服务超时。'), timeouts.connectMs); },
    connected() { clear(connectionTimer); connectionTimer = null; this.touch(); },
    touch() { clear(idleTimer); idleTimer = setTimeout(() => abort('更新包下载长时间没有进展，请检查网络后重试。'), timeouts.idleMs); },
    dispose() { clear(totalTimer); clear(connectionTimer); clear(idleTimer); },
  };
}

function repositoryMatches(value, repo) {
  const url = typeof value === 'string' ? value : value?.url;
  return typeof url === 'string' && url.replace(/^git\+/, '').replace(/\/$/, '').replace(/\.git$/, '') === `https://github.com/${repo}`;
}
function registryFailure(message) { const error = new Error(message); error.retryRegistry = true; return error; }
function allowedRegistryURL(value) {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password && !url.port &&
    (url.hostname === 'registry.npmjs.org' || url.hostname === 'registry.npmmirror.com' || url.hostname.endsWith('.npmmirror.com'));
}
/** Follow only npm registry/CDN redirects; never make a redirected GitHub request. */
async function registryResponse(fetchImpl, input, signal, budget) {
  let url = input;
  for (let hop = 0; hop < 5; hop++) {
    if (!allowedRegistryURL(url)) throw new Error('npm 更新请求离开了允许的注册表。');
    let response;
    budget?.connecting();
    try { response = await fetchImpl(url, { signal, redirect: 'manual', headers: { accept: input.endsWith('.tgz') ? 'application/octet-stream' : 'application/json', 'user-agent': 'DSH-Open-Beauty-Updater' } }); }
    catch (error) { if (signal.aborted && signal.reason?.retryRegistry) throw signal.reason; throw registryFailure(error.name === 'TimeoutError' ? '连接 npm 注册表超时。' : '无法连接 npm 注册表。'); }
    budget?.connected();
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get('location');
    await response.body?.cancel().catch(() => {});
    if (!location) throw new Error('npm 注册表返回了无效跳转。');
    url = new URL(location, url).href;
  }
  throw new Error('npm 注册表跳转次数过多。');
}
async function registryBytes(response, limit, signal, options) {
  try { return await responseBytes(response, limit, signal, options); }
  catch (error) {
    if (signal.aborted && signal.reason?.retryRegistry) throw signal.reason;
    if (signal.aborted || ['TimeoutError', 'AbortError', 'TypeError'].includes(error.name)) throw registryFailure('读取 npm 注册表内容失败。');
    throw error;
  }
}
export function validateNpmManifest(value, { packageName = NPM_ENTRY_NAME, repo = UPDATE_REPOSITORY, registry = NPM_REGISTRIES[0] } = {}) {
  if (!value || typeof value !== 'object' || value.name !== packageName || packageName !== NPM_ENTRY_NAME) throw new Error('npm 更新包标识与当前插件不一致。');
  versionParts(value.version);
  if (!repositoryMatches(value.repository, repo)) throw new Error('npm 更新包的仓库标识不属于本项目。');
  if (!NPM_REGISTRIES.includes(registry)) throw new Error('不支持的 npm 注册表。');
  const path = `/${packageName}/-/${packageName}-${value.version}.tgz`;
  if (!NPM_REGISTRIES.some(origin => value.dist?.tarball === origin + path)) throw new Error('npm 更新包地址不属于允许的注册表和版本。');
  const integrity = value.dist?.integrity;
  if (typeof integrity !== 'string' || !/^sha512-[A-Za-z0-9+/]{86}==$/.test(integrity) || Buffer.from(integrity.slice(7), 'base64').toString('base64') !== integrity.slice(7)) throw new Error('npm 更新包缺少有效的 SHA-512 完整性信息。');
  const releaseNotes = validateReleaseNotes(value.lewisEnchantRelease, value.version);
  const releaseNotesEn = packageReleaseNotesEn(value);
  return { source: 'npm', packageName, version: value.version, integrity, releaseNotes, releaseNotesEn,
    tarballUrls: [registry, ...NPM_REGISTRIES.filter(origin => origin !== registry)].map(origin => origin + path),
    tarballUrl: registry + path, releaseNotesUrl: `https://www.npmjs.com/package/${packageName}/v/${value.version}`, requiresRestart: true };
}
async function npmManifest(fetchImpl, packageName, repo) {
  let failure;
  for (const registry of NPM_REGISTRIES) {
    try {
      const signal = AbortSignal.timeout(7000);
      const response = await registryResponse(fetchImpl, `${registry}/${packageName}/latest`, signal);
      if (response.status === 404) return null;
      if (!response.ok) throw registryFailure(`npm 注册表返回 HTTP ${response.status}。`);
      return validateNpmManifest(JSON.parse((await registryBytes(response, 65536, signal)).toString('utf8')), { packageName, repo, registry });
    } catch (error) { if (!error.retryRegistry) throw error; failure = error; }
  }
  throw failure;
}
async function npmArchive(fetchImpl, manifest, { onProgress, onVerifying, timeouts }) {
  let failure;
  for (const [index, url] of manifest.tarballUrls.entries()) {
    const budget = downloadBudget(timeouts);
    try {
      onProgress({ phase: 'downloading', downloadedBytes: 0, totalBytes: null, percent: null, attempt: index + 1 });
      const response = await registryResponse(fetchImpl, url, budget.signal, budget);
      if (!response.ok) { await response.body?.cancel().catch(() => {}); throw registryFailure(`npm 更新包下载失败（HTTP ${response.status}）。`); }
      const bytes = await registryBytes(response, MAX_PACKAGE_BYTES, budget.signal, { onProgress, budget });
      onVerifying(bytes.length);
      if ('sha512-' + createHash('sha512').update(bytes).digest('base64') !== manifest.integrity) throw new Error('npm 更新包 SHA-512 校验失败，未执行更新。');
      return bytes;
    } catch (error) { if (!error.retryRegistry) throw error; failure = error; }
    finally { budget.dispose(); }
  }
  throw failure;
}

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
  const releaseNotes = validateReleaseNotes(value.releaseNotes, value.version);
  const releaseNotesEn = validateReleaseNotes(value.releaseNotesEn, value.version);
  return {format:1,packageName,version:value.version,commit:value.commit,sourceCommit:value.sourceCommit,sha256:value.sha256,bytes:value.bytes,publishTimestamp:value.publishTimestamp,tarballUrl:expected,releaseNotesUrl:`https://github.com/${repo}/releases/tag/v${value.version}`,requiresRestart:true,releaseNotes,releaseNotesEn};
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

function readWithSignal(reader, signal) {
  if (signal.aborted) return Promise.reject(signal.reason || new Error('维护文件读取已中断。'));
  return new Promise((resolve, reject) => {
    const aborted = () => { signal.removeEventListener('abort', aborted); reject(signal.reason || new Error('维护文件读取已中断。')); };
    signal.addEventListener('abort', aborted, { once: true });
    reader.read().then(value => { signal.removeEventListener('abort', aborted); resolve(value); }, error => { signal.removeEventListener('abort', aborted); reject(error); });
  });
}

async function responseBytes(response,limit,signal,{onProgress,budget,expectedBytes}={}) {
  const rawLength = response.headers.get('content-length');
  const parsedLength = rawLength && /^\d+$/.test(rawLength) ? Number(rawLength) : null;
  const length = Number.isSafeInteger(parsedLength) && parsedLength > 0 ? parsedLength : null;
  if(length>limit){await response.body?.cancel().catch(()=>{});throw new Error('维护文件超过允许大小。');}
  const reader=response.body?.getReader();
  if(!reader)throw new Error('维护文件内容为空。');
  const chunks=[];let size=0;
  const totalBytes = length || expectedBytes || null;
  const report = done => onProgress?.({ downloadedBytes: size, totalBytes: done ? size : totalBytes, percent: done ? 100 : totalBytes ? Math.min(99, Math.floor(size / totalBytes * 100)) : null });
  report(false);
  try {
    while(true){const {done,value}=await readWithSignal(reader,signal);if(done)break;budget?.touch();size+=value.byteLength;if(size>limit)throw new Error('维护文件超过允许大小。');chunks.push(Buffer.from(value));report(false);}
    if (length && length !== size) throw registryFailure('更新包未完整下载，请检查网络后重试。');
    report(true);
  } catch(error){await reader.cancel().catch(()=>{});throw error;}
  return Buffer.concat(chunks,size);
}

/** Only checks and stages verified files. Installation belongs to the owner's official Remote API. */
export function createUpdateService({dataDir,packageFile,fetchImpl=fetch,repo=UPDATE_REPOSITORY,now=()=>Date.now(),manifestUrl,downloadTimeouts=UPDATE_DOWNLOAD_TIMEOUTS}={}) {
  const cacheDir=join(dataDir,'update-cache');
  let checking=null,preparing=null,preparingVersion=null;
  let snapshot = { version: null, phase: 'idle', downloadedBytes: 0, totalBytes: null, percent: null, attempt: 0 };
  const progress = () => ({ ...snapshot });
  const publish = patch => { snapshot = { ...snapshot, ...patch }; };
  async function identity(){const pkg=JSON.parse(await readFile(packageFile,'utf8'));versionParts(pkg.version);return {packageName:pkg.name,currentVersion:pkg.version};}
  async function check(){
    if(checking)return checking;
    checking=(async()=>{
      const local=await identity();
      const signal=AbortSignal.timeout(15000);
      try {
        if (local.packageName === NPM_ENTRY_NAME) {
          const manifest = await npmManifest(fetchImpl, local.packageName, repo);
          if (!manifest) return { ...local, available: false, channelReady: false, message: 'npm 版本尚未发布，当前版本可以继续使用。' };
          const available = isNewerVersion(manifest.version, local.currentVersion);
          return { ...local, available, channelReady: true, latestVersion: manifest.version, manifest, message: available ? '有新版本可用。' : '当前已是最新版本。' };
        }
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
    snapshot = { version: requestedVersion, phase: 'checking', downloadedBytes: 0, totalBytes: null, percent: null, attempt: 0 };
    preparing=(async()=>{
      const status=await check();
      if(!status.channelReady||!status.available||status.latestVersion!==requestedVersion)throw new Error('更新版本已变化或尚未发布，请重新检查更新。');
      const manifest=status.manifest;
      let bytes;
      const onVerifying = size => publish({ phase: 'verifying', downloadedBytes: size, totalBytes: size, percent: 100 });
      if (manifest.source === 'npm') bytes = await npmArchive(fetchImpl, manifest, { onProgress: publish, onVerifying, timeouts: downloadTimeouts });
      else {
        const budget = downloadBudget(downloadTimeouts);
        try {
          publish({ phase: 'downloading', downloadedBytes: 0, totalBytes: manifest.bytes, percent: 0, attempt: 1 });
          budget.connecting();
          const response=await fetchImpl(manifest.tarballUrl,{signal:budget.signal,headers:{'user-agent':'DSH-Open-Beauty-Updater'}});
          budget.connected();
          if(!response.ok){await response.body?.cancel().catch(()=>{});throw new Error(`更新包下载失败（HTTP ${response.status}）。`);}
          bytes=await responseBytes(response,Math.min(MAX_PACKAGE_BYTES,manifest.bytes),budget.signal,{onProgress:publish,budget,expectedBytes:manifest.bytes});
          onVerifying(bytes.length);
          if(bytes.length!==manifest.bytes||createHash('sha256').update(bytes).digest('hex')!==manifest.sha256)throw new Error('更新包 SHA-256 或大小校验失败，未执行更新。');
        } finally { budget.dispose(); }
      }
      const pkg=readPackageManifest(bytes);
      if(pkg.name!==status.packageName||pkg.version!==manifest.version||!pkg.dsh?.bundle?.patch)throw new Error('更新包的名称、版本或插件声明不匹配。');
      if (validateReleaseNotes(pkg.lewisEnchantRelease, pkg.version) !== manifest.releaseNotes) throw new Error('更新包中的作者说明与本次检查结果不一致，请重新检查更新。');
      if (packageReleaseNotesEn(pkg) !== (manifest.releaseNotesEn ?? null)) throw new Error('更新包中的作者说明与本次检查结果不一致，请重新检查更新。');
      for(const key of ['preinstall','install','postinstall','prepare','preprepare','postprepare'])if(pkg.scripts?.[key])throw new Error('维护包包含安装脚本，请通过 Harness 插件管理器人工检查。');
      if (manifest.source === 'npm' && (!repositoryMatches(pkg.repository, repo) || ['dependencies', 'optionalDependencies', 'peerDependencies'].some(key => Object.keys(pkg[key] ?? {}).length))) throw new Error('npm 更新包必须属于本项目且不含运行依赖。');
      const sha256 = createHash('sha256').update(bytes).digest('hex');
      await mkdir(cacheDir,{recursive:true});await cleanOld();
      const path=join(cacheDir,`${pkg.name}-${pkg.version}-${sha256}.tgz`);
      const temp=join(cacheDir,`${randomUUID()}.part`);
      try{await writeFile(temp,bytes,{flag:'wx'});await rename(temp,path);}finally{await unlink(temp).catch(()=>{});}
      publish({ phase: 'ready', downloadedBytes: bytes.length, totalBytes: bytes.length, percent: 100 });
      return {version:manifest.version,spec:path,sha256,requiresRestart:true};
    })();
    try{return await preparing;}catch(error){publish({phase:'error',error:error.message||'更新包准备失败。'});throw error;}finally{preparing=null;preparingVersion=null;}
  }
  return {check,prepare,identity,progress};
}
