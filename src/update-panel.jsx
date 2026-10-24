import React,{useEffect,useState} from 'react';

/** The official authenticated Typert endpoint enforces the Harness owner ACL. */
export async function installVerifiedUpdate(spec,version) {
  const rpcId=globalThis.crypto?.randomUUID?.() || `open-beauty-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const response=await fetch('/api/pluginManager/installBundle',{
    method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},
    body:JSON.stringify({type:'client-request',rpcId,method:'pluginManager/installBundle',payload:{args:{spec,options:{enabled:true,saveExact:true,requestId:rpcId}}}}),
  });
  if(response.status===401||response.status===403)throw new Error('当前连接没有管理插件的权限，请使用 Harness 主窗口的拥有者连接。');
  if(!response.ok)throw new Error(`Harness 更新请求失败（HTTP ${response.status}）。`);
  const envelope=await response.json();
  if(envelope.type!=='server-response'||envelope.rpcId!==rpcId||envelope.result?.ok!==true)throw new Error('Harness 未接受更新请求，请在插件管理中查看详情。');
  const result=envelope.result.value;
  if(!result||!['applied','restart-required'].includes(result.application)||result.error)throw new Error(result?.error?.diagnostic||'更新未完成，当前插件和设置已保留。');
  if(result.version&&result.version!==version)throw new Error('Harness 返回的版本与更新目标不一致，请查看插件管理。');
  return result;
}

export function UpdatePanel({request,standalone=false}) {
  const [status,setStatus]=useState(null);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{let alive=true;request('/updates/status').then(value=>{if(alive)setStatus(value);}).catch(()=>{});return()=>{alive=false;};},[request]);
  async function check(){
    setBusy(true);setError('');setMessage('正在检查更新…');
    try{const value=await request('/updates/check',{method:'POST',body:'{}'});setStatus(value);setMessage(value.message||'检查完成。');}
    catch(e){setError(e.message);setMessage('');}finally{setBusy(false);}
  }
  async function update(){
    if(standalone||!status?.available||busy)return;
    setBusy(true);setError('');setMessage('正在下载并校验更新包…');
    try{
      const staged=await request('/updates/prepare',{method:'POST',body:JSON.stringify({version:status.latestVersion})});
      if(staged.version!==status.latestVersion||typeof staged.spec!=='string'||!/^[a-f0-9]{64}$/.test(staged.sha256||''))throw Error('更新包准备结果无效，未请求安装。');
      setMessage('校验通过，正在通过 Harness 原位更新…');
      const result=await installVerifiedUpdate(staged.spec,staged.version);
      setStatus(value=>({...value,available:false,currentVersion:staged.version}));
      setMessage(result.application==='restart-required'?'更新完成。请完全退出并重启 Harness，新版本会保留原视频、图片和设置。':'新版本已应用。建议重启 Harness，让所有窗口使用新版本；视频、图片和设置均保留。');
    }catch(e){setError(e.message);setMessage('');}finally{setBusy(false);}
  }
  return <div className="bs-update-area" data-testid="update-panel">
    <div className="bs-section-title"><h2>版本与更新</h2><span>{status?.currentVersion?`v${status.currentVersion}`:'DSH Open Beauty'}</span></div>
    <div className="bs-update-card"><div><strong>一次安装，持续焕新</strong><p>更新会保留你的视频、结束图片和播放偏好。</p>{standalone&&<small>当前为独立预览。安装到 Harness 后，可在这里原位更新。</small>}</div>
      <div className="bs-update-actions"><button type="button" disabled={busy} onClick={check}>检查更新</button>{status?.available&&<button type="button" className="bs-primary" disabled={busy||standalone} onClick={update}>更新到 {status.latestVersion}</button>}</div>
    </div>
    {(message||error)&&<p className={error?'bs-update-error':'bs-update-message'} role={error?'alert':'status'}>{error||message}</p>}
    {status?.available&&status.manifest?.releaseNotesUrl&&<a className="bs-release-link" href={status.manifest.releaseNotesUrl} target="_blank" rel="noreferrer">查看本次更新说明 ↗</a>}
  </div>;
}
