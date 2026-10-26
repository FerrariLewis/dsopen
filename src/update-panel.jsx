import React,{useEffect,useState} from 'react';
import { isAvailableUpdate, startupUpdateSession } from './startup-update.js';
import { UpdatePrompt } from './update-prompt.jsx';
import { useI18n } from './i18n.jsx';
export { installVerifiedUpdate, prepareAndInstallUpdate } from './startup-update.js';

export function UpdatePanel({request,standalone=false,install}) {
  const t = useI18n();
  const [status,setStatus]=useState(null);
  const [busy,setBusy]=useState(false);
  const [prompt,setPrompt]=useState(null);
  useEffect(()=>{let alive=true;request('/updates/status').then(value=>{if(alive)setStatus(value);}).catch(()=>{});return()=>{alive=false;};},[request]);
  async function check(){
    if(busy)return;
    setBusy(true);
    try{
      const value=await request('/updates/check',{method:'POST',body:'{}'});
      setStatus(value);
      setPrompt({kind:isAvailableUpdate(value)?'update':value?.channelReady?'current':'error',status:value});
    }catch(e){setStatus(value=>({...value,available:false,channelReady:false}));setPrompt({kind:'error',status:status||{},message:e.message||'暂时无法检查更新，请稍后重试。'});}
    finally{setBusy(false);}
  }
  function updated(version){
    startupUpdateSession.updated(version);
    setStatus(value=>({...value,available:false,currentVersion:version}));
  }
  return <div className="bs-update-area" data-testid="update-panel">
    <div className="bs-section-title"><h2>{t('版本与更新', 'Version and updates')}</h2><span>{status?.currentVersion?`v${status.currentVersion}`:'DSH LEWIS ENCHANTMENT'}</span></div>
      <div className="bs-update-card"><div><strong>{t('一次安装，持续焕新', 'Install once, keep it fresh')}</strong><p>{t('更新会保留你的视频、结束图片和播放偏好。', 'Updates keep your videos, end screen images and playback preferences.')}</p>{standalone&&<small>{t('当前为独立预览，检查结果仅用于展示。', 'This is a standalone preview. Update results are for display only.')}</small>}</div>
        <div className="bs-update-actions"><button type="button" disabled={busy} onClick={check}>{busy?t('正在检查…', 'Checking…'):isAvailableUpdate(status)?t('查看更新', 'View update'):status?.channelReady?t('已是最新', 'Up to date'):t('检查更新', 'Check for updates')}</button></div>
      </div>
    {prompt&&<UpdatePrompt request={request} status={prompt.status} kind={prompt.kind} checkError={prompt.message} install={install} preview={standalone&&prompt.kind==='update'&&!install} onDismiss={()=>setPrompt(null)} onUpdated={updated}/ >}
  </div>;
}
