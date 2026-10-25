import React,{useEffect,useState} from 'react';
import { prepareAndInstallUpdate, startupUpdateSession } from './startup-update.js';
export { installVerifiedUpdate, prepareAndInstallUpdate } from './startup-update.js';

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
      const {version,result}=await prepareAndInstallUpdate(request,status,{onPhase:phase=>setMessage(phase==='install'?'校验通过，正在通过 Harness 原位更新…':'正在下载并校验更新包…')});
      startupUpdateSession.updated(version);
      setStatus(value=>({...value,available:false,currentVersion:version}));
      setMessage(result.application==='restart-required'?'更新完成。请完全退出并重启 Harness，新版本会保留原视频、图片和设置。':'新版本已应用。建议重启 Harness，让所有窗口使用新版本；视频、图片和设置均保留。');
    }catch(e){setError(e.message);setMessage('');}finally{setBusy(false);}
  }
  return <div className="bs-update-area" data-testid="update-panel">
    <div className="bs-section-title"><h2>版本与更新</h2><span>{status?.currentVersion?`v${status.currentVersion}`:'DSH LEWIS ENCHANTMENT'}</span></div>
    <div className="bs-update-card"><div><strong>一次安装，持续焕新</strong><p>更新会保留你的视频、结束图片和播放偏好。</p>{standalone&&<small>当前为独立预览。安装到 Harness 后，可在这里原位更新。</small>}</div>
      <div className="bs-update-actions"><button type="button" disabled={busy} onClick={check}>检查更新</button>{status?.available&&<button type="button" className="bs-primary" disabled={busy||standalone} onClick={update}>更新到 {status.latestVersion}</button>}</div>
    </div>
    {(message||error)&&<p className={error?'bs-update-error':'bs-update-message'} role={error?'alert':'status'}>{error||message}</p>}
    {status?.available&&status.manifest?.releaseNotesUrl&&<a className="bs-release-link" href={status.manifest.releaseNotesUrl} target="_blank" rel="noreferrer">查看本次更新说明 ↗</a>}
  </div>;
}
