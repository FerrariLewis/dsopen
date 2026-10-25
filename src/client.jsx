import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CSS } from './styles.js';
import { WHALE_PATH } from './logo-path.js';
import { StartupSequence } from './startup-screen.jsx';
import { UpdatePanel } from './update-panel.jsx';
import { UpdatePrompt } from './update-prompt.jsx';
import { startupUpdateSession, isAvailableUpdate } from './startup-update.js';
import { getShortcutRegistry } from './shortcut-registry.js';
import { ResetDialog } from './reset-dialog.jsx';
import { AuthorDialog } from './author-dialog.jsx';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { getEnchantRegistry, bindSettingsEntry } from './enchant-bridge.js';

const BASE = '/dsh-boot-studio';
const OPEN = 'dsh-boot-studio:open';
const PLAY = 'dsh-boot-studio:play';
let bootClaimed = false;
let launchRequest = null;
let launchDecisionSettled = false;
let latestState = null;
const subscribers = new Set();
const playerWindows = new WeakMap();
const VERSION = typeof __DSH_LEWIS_VERSION__ === 'string' ? __DSH_LEWIS_VERSION__ : '1.2.7';

// A marker for Harness's optional HTML menu only. Native caption buttons are
// owned by the desktop host; this lease never changes the native window state.
function acquirePlayerWindow(doc) {
  const root=doc.documentElement;
  let state=playerWindows.get(doc);
  if(!state){state={count:0,previous:root.getAttribute('data-lewis-player')};playerWindows.set(doc,state);}
  state.count++;
  root.setAttribute('data-lewis-player','true');
  let released=false;
  return()=>{
    if(released)return;released=true;
    if(--state.count)return;
    if(state.previous===null)root.removeAttribute('data-lewis-player');else root.setAttribute('data-lewis-player',state.previous);
    playerWindows.delete(doc);
  };
}

export async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout=['/upload','/end-images','/updates/prepare','/reset'].includes(path)?180000:path==='/updates/check'?20000:7000;
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(BASE + path, { ...options, signal: controller.signal,
      headers: { 'x-dsh-boot-studio': '1', ...(options.body && typeof options.body === 'string' ? { 'content-type': 'application/json' } : {}), ...options.headers } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `请求失败 (${response.status})`);
    return data;
  } finally { clearTimeout(timer); }
}
function publish(value) { latestState = value; subscribers.forEach(fn => fn(value)); return value; }
export function openSettings() {
  if (getEnchantRegistry().openControllerSettings('dsh-openup-lewis')) return;
  window.dispatchEvent(new Event(OPEN));
}
function preview(clip, settings, endOnly = false) { window.dispatchEvent(new CustomEvent(PLAY, { detail: {clip, settings, endOnly} })); }
function useStyles() {
  useEffect(() => {
    let el = document.getElementById('dsh-boot-studio-style');
    if (!el) { el = document.createElement('style'); el.id = 'dsh-boot-studio-style'; el.textContent = CSS; document.head.appendChild(el); }
  }, []);
}
export function EndTitle({ settings }) {
  const [imageFailed,setImageFailed] = useState(false);
  useEffect(()=>setImageFailed(false),[settings.endImageId,settings.logoVariant,settings.endScreen]);
  const variant=settings.logoVariant||'silver';
  const userImage=settings.endScreen==='image'&&settings.endImageId&&!imageFailed;
  const builtinImage=settings.endScreen!=='image'&&['silver','gold','ice'].includes(variant)&&!imageFailed;
  const imageURL=userImage?`${BASE}/end-image/${encodeURIComponent(settings.endImageId)}`:builtinImage?`${BASE}/logo/${variant}`:null;
  return <div className={`bs-end-title bs-end-${userImage?'custom':variant}`} data-testid="end-screen" data-logo={builtinImage?variant:undefined}>
    {imageURL ? <img className="bs-end-image" data-testid={userImage?'end-image':'end-logo-image'} src={imageURL} alt={userImage?'自定义结束画面':'DeepSeek 内置结束画面'} style={{objectFit:userImage?(settings.endFit||'contain'):'cover'}} onError={()=>setImageFailed(true)}/> : <div className="bs-end-brand">
      <div className="bs-end-halo"/><svg className="bs-end-whale" viewBox="0 0 50 50" aria-label="DeepSeek 标志" role="img"><path d={WHALE_PATH}/></svg>
      <h1>DEEPSEEK</h1><p>HARNESS</p><div className="bs-end-rule"/>
    </div>}
    <p className="bs-enter-prompt">按任意键进入</p>
  </div>;
}

export function Player({ clip, settings, onClose, endOnly = false }) {
  useStyles();
  const video = useRef(null);
  const dialog = useRef(null);
  const closed = useRef(false);
  const [phase,setPhase]=useState(endOnly?'end':'intro');
  const phaseRef=useRef(endOnly?'end':'intro');
  const lastInput=useRef(-1000);
  const [blocked, setBlocked] = useState(false);
  const [mutedFallback, setMutedFallback] = useState(false);
  const stopMedia=useCallback(()=>{const el=video.current;if(el){el.pause();el.removeAttribute('src');el.load();}},[]);
  const close = useCallback((reason) => {
    if (closed.current) return;
    closed.current = true;
    stopMedia();
    onClose(reason);
  }, [onClose,stopMedia]);
  const showEnd=useCallback(()=>{
    if(closed.current || phaseRef.current==='end')return;
    phaseRef.current='end';stopMedia();setPhase('end');
  },[stopMedia]);
  const advance=useCallback(()=>{
    const now=performance.now();
    if(now-lastInput.current<250)return;
    lastInput.current=now;
    if(phaseRef.current==='intro')showEnd();else close('enter');
  },[showEnd,close]);
  useEffect(() => {
    closed.current = false;
    const playerDialog = dialog.current;
    const previous = document.activeElement;
    const releaseWindow=acquirePlayerWindow(document);
    if (typeof playerDialog.showModal === 'function' && !playerDialog.open) playerDialog.showModal();
    else playerDialog.setAttribute('open', '');
    const key = e => {
      e.preventDefault();e.stopPropagation();
      if(!e.repeat&&!e.isComposing)advance();
    };
    window.addEventListener('keydown', key, true);
    playerDialog.focus();
    return () => { closed.current=true;releaseWindow();window.removeEventListener('keydown',key,true);if(playerDialog.open&&typeof playerDialog.close==='function')playerDialog.close();if(previous?.isConnected)previous.focus?.(); };
  }, [advance]);
  useEffect(()=>{
    if(phase!=='intro')return;
    if(clip.kind==='sequence'){
      const timeout=setTimeout(showEnd,120000);
      return()=>clearTimeout(timeout);
    }
    const playerVideo=video.current;
    if(!playerVideo)return;
    let progressAt = performance.now();
    let previousTime = playerVideo.currentTime;
    const watchdog = setInterval(() => {
      if (playerVideo.currentTime !== previousTime) { previousTime = playerVideo.currentTime; progressAt = performance.now(); }
      if (performance.now() - progressAt > 30000) showEnd();
    }, 1000);
    return()=>{clearInterval(watchdog);playerVideo.pause();playerVideo.removeAttribute('src');playerVideo.load();};
  },[phase,clip.kind,showEnd]);
  useEffect(() => {
    if(phase!=='intro'||clip.kind==='sequence')return;
    const el = video.current;
    let alive = true;
    el.volume = settings.volume ?? 0.7;
    el.muted = !settings.sound;
    const start = async () => {
      try { await el.play(); if (!alive || closed.current) el.pause(); }
      catch (error) {
        if (!alive || closed.current) return;
        if (settings.sound && !el.muted) {
          el.muted = true;
          setMutedFallback(true);
          try { await el.play(); if (!alive || closed.current) el.pause(); } catch { if(alive && !closed.current) setBlocked(true); }
        } else setBlocked(true);
      }
    };
    void start();
    return () => { alive = false; };
  }, [clip.url, clip.kind, phase, settings.sound, settings.volume, showEnd]);
  const enableSound = async e => {
    e.stopPropagation();
    const el = video.current; el.muted = false;
    try { await el.play(); setMutedFallback(false); setBlocked(false); } catch { el.muted = true; setBlocked(true); }
  };
  const playManually = async e => { e.stopPropagation(); try { await video.current.play(); setBlocked(false); } catch { showEnd(); } };
  return <dialog ref={dialog} className="bs-player" data-testid="player" data-phase={phase} aria-label={phase==='end'?'DeepSeek 标题界面':`开机动画：${clip.name}`} tabIndex={-1}
    onCancel={e=>{e.preventDefault();advance();}} onPointerDown={e=>{if(!e.target.closest('[data-bs-control]'))advance();}}>
    {phase==='end'?<EndTitle settings={settings}/>:<>
      {clip.kind==='sequence'?<StartupSequence sound={settings.sound} volume={settings.volume} onEnded={showEnd}/>:<video data-testid="boot-video" ref={video} src={clip.url} loop={false} playsInline preload="auto" style={{objectFit:'cover'}}
        onPlaying={() => setBlocked(false)} onEnded={showEnd} onError={showEnd}/>}
      {blocked&&<button data-bs-control type="button" className="bs-play-manual" onClick={playManually}>▶ 点击播放</button>}
      {mutedFallback&&<button data-bs-control type="button" className="bs-sound" onClick={enableSound}>♪ 开启声音</button>}
      <p className="bs-intro-prompt">按任意键跳过动画</p>
    </>}
  </dialog>;
}

function Toggle({ label, description, checked, onChange, disabled }) {
  return <label className="bs-toggle-row"><span><strong>{label}</strong>{description && <small>{description}</small>}</span><input type="checkbox" role="switch" checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled}/><span className="bs-switch" aria-hidden="true"/></label>;
}
export function SettingsPanel({ standalone = false }) {
  useStyles();
  const appearance = useEnchantAppearance();
  const [state, setState] = useState(latestState);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingImageDelete,setPendingImageDelete]=useState(null);
  const [resetOpened,setResetOpened] = useState(false);
  const [authorOpened,setAuthorOpened] = useState(false);
  const input = useRef(null);
  const imageInput=useRef(null);
  const active = useRef(true);
  const uploadRequest = useRef(null);
  const probeCancel=useRef(null);
  useEffect(() => {
    active.current = true;
    const update = v => setState(v);
    subscribers.add(update);
    api('/state').then(publish).catch(e => setError(`连接失败：${e.message}。请重启 Harness 后重试。`));
    return () => { active.current=false; subscribers.delete(update);uploadRequest.current?.abort();probeCancel.current?.(); };
  }, []);
  async function save(patch) {
    if (busy) return;
    setBusy(true);setError('');setNotice('');
    try { publish(await api('/settings',{method:'POST',body:JSON.stringify(patch)}));setNotice('设置已保存，下次启动生效'); }
    catch(e) {setError(e.message);}
    finally {if(active.current)setBusy(false);}
  }
  async function restoreDefaults() {
    if(busy)throw Error('请等待当前操作完成后再恢复默认。');
    setBusy(true);setError('');setNotice('');
    try{
      publish(await api('/reset',{method:'POST',body:JSON.stringify({confirm:'reset-all-custom-data'})}));
      setNotice('已恢复默认，全部上传的视频和图片已删除。');
    }catch(error){
      // Cleanup can report a disk error after preferences were safely reset.
      // Refresh the visible state without hiding that error or claiming success.
      await api('/state').then(publish).catch(()=>{});
      throw error;
    }finally{if(active.current)setBusy(false);}
  }
  async function remove(clip) {
    setBusy(true);setError('');
    try {publish(await api('/clips/'+encodeURIComponent(clip.id),{method:'DELETE'}));setNotice('视频已移除');setPendingDelete(null);}
    catch(e) {setError(e.message);} finally {if(active.current)setBusy(false);}
  }
  async function removeEndImage(image) {
    setBusy(true);setError('');
    try {publish(await api('/end-images/'+encodeURIComponent(image.id),{method:'DELETE'}));setNotice('结束画面已移除');setPendingImageDelete(null);}
    catch(e){setError(e.message);}finally{if(active.current)setBusy(false);}
  }
  function uploadEndImage(file) {
    if(!file||busy)return;
    if(!/\.(png|jpe?g|webp)$/i.test(file.name)||!file.size||file.size>(state?.maxImageUploadBytes||20971520)){setError('请选择不超过20 MB的PNG、JPEG或WebP图片。');return;}
    setBusy(true);setError('');setNotice('正在检查结束画面…');
    const probe=new Image();const objectURL=URL.createObjectURL(file);let finished=false;
    const cleanup=()=>{clearTimeout(timeout);probe.onload=null;probe.onerror=null;probe.src='';URL.revokeObjectURL(objectURL);probeCancel.current=null;};
    const fail=()=>{if(finished)return;finished=true;cleanup();if(active.current){setBusy(false);setNotice('');setError('无法读取这张图片，请更换有效的PNG、JPEG或WebP。');}};
    const timeout=setTimeout(fail,10000);probeCancel.current=()=>{finished=true;cleanup();};probe.onerror=fail;
    probe.onload=()=>{
      if(finished)return;finished=true;cleanup();if(!active.current)return;
      const xhr=new XMLHttpRequest();uploadRequest.current=xhr;xhr.open('POST',BASE+'/end-images');xhr.setRequestHeader('x-dsh-boot-studio','1');xhr.setRequestHeader('x-file-name',encodeURIComponent(file.name));xhr.setRequestHeader('content-type',file.type||'application/octet-stream');xhr.timeout=120000;
      xhr.upload.onprogress=e=>{if(e.lengthComputable)setUploadPercent(Math.round(e.loaded/e.total*100));};
      const done=()=>{if(active.current){setBusy(false);setUploadPercent(null);}uploadRequest.current=null;};
      xhr.onload=()=>{try{const result=JSON.parse(xhr.responseText);if(xhr.status>=400)throw Error(result.error||'上传失败');publish(result.state);setNotice('图片已上传并设为结束画面');}catch(e){setError(e.message);setNotice('');}finally{done();}};
      xhr.onerror=xhr.ontimeout=()=>{if(active.current){setError('图片上传中断，请重试。');setNotice('');}done();};xhr.onabort=done;setUploadPercent(0);setNotice('正在上传图片…');xhr.send(file);
    };
    probe.src=objectURL;
  }
  function upload(file) {
    if (!file || busy) return;
    if (!/\.(mp4|m4v|webm)$/i.test(file.name)) {setError('请选择 MP4、M4V 或 WebM 视频。推荐 MP4（H.264 / AAC）。');return;}
    if (file.size > (state?.maxUploadBytes || 209715200) || file.size === 0) {setError('视频应大于 0 字节，且不超过 200 MB。');return;}
    // Decode before importing, so a file with a video suffix but an unsupported codec is rejected clearly.
    setBusy(true);setError('');setNotice('正在检查视频…');
    const probe = document.createElement('video');
    const objectURL = URL.createObjectURL(file);
    let finished = false;
    const cleanup = () => { clearTimeout(timeout);probe.onloadeddata=null;probe.onerror=null;probe.removeAttribute('src');probe.load();URL.revokeObjectURL(objectURL);probeCancel.current=null; };
    const fail = () => {if(finished)return;finished=true;cleanup();if(active.current){setBusy(false);setNotice('');setError('浏览器无法读取此视频。请转换为 MP4（H.264 / AAC）后重试。');}};
    const timeout = setTimeout(fail,12000);
    probeCancel.current=()=>{finished=true;cleanup();};
    probe.onerror = fail;
    probe.onloadeddata = () => {
      if(finished)return;finished=true;cleanup();
      if(!active.current)return;
      const xhr = new XMLHttpRequest();uploadRequest.current=xhr;
      xhr.open('POST',BASE+'/upload');xhr.setRequestHeader('x-dsh-boot-studio','1');xhr.setRequestHeader('x-file-name',encodeURIComponent(file.name));xhr.setRequestHeader('content-type',file.type || 'application/octet-stream');
      xhr.timeout=180000;
      xhr.upload.onprogress = e => {if(e.lengthComputable)setUploadPercent(Math.round(e.loaded/e.total*100));};
      const done = () => {if(active.current){setBusy(false);setUploadPercent(null);}uploadRequest.current=null;};
      xhr.onload = () => {
        try {const result=JSON.parse(xhr.responseText);if(xhr.status>=400)throw new Error(result.error || '上传失败');publish(result.state);setNotice('视频已导入并设为开机动画');}
        catch(e) {setError(e.message);setNotice('');} finally {done();}
      };
      xhr.onerror=xhr.ontimeout=() => {if(active.current){setError('上传中断，请重试。');setNotice('');}done();};
      xhr.onabort=done;setNotice('正在上传…');setUploadPercent(0);xhr.send(file);
    };
    probe.preload='auto';probe.src=objectURL;probe.load();
  }
  const settings=state?.settings;
  const selected=state?.clips.find(c=>c.id===settings.selectedId) || state?.clips[0];
  return <section className="bs-studio" data-testid="settings" {...appearance}>
    <div className="bs-heading"><div><div className="bs-eyebrow">DSH LEWIS ENCHANT</div><h1>附魔台<span>开机动画</span></h1><p>自定义你的开场，封面与声音。</p></div><span className="bs-version">V{VERSION}</span></div>
    <div className="bs-toolbar"><span className="bs-status"><i/>{settings ? settings.enabled ? '启动时自动播放' : '自动播放已关闭' : '正在连接…'}</span><button className="bs-primary" type="button" disabled={!selected || busy} onClick={()=>preview(selected,settings)}>▶ 预览当前动画</button></div>
    {error && <div className="bs-alert" role="alert">{error}<button type="button" onClick={()=>{setError('');api('/state').then(publish).catch(e=>setError(e.message));}}>重试</button></div>}
    <div className="bs-notice" role="status" aria-live="polite">{busy ? uploadPercent !== null ? `正在上传 ${uploadPercent}%` : notice || '正在保存…' : notice}</div>
    {settings && <>
      <div className="bs-section-title"><h2>动画片库</h2></div>
      <div className="bs-library">
        {state.clips.map((clip,index)=><article key={clip.id} className={`bs-clip ${clip.id===settings.selectedId?'is-selected':''}`}>
          <button type="button" className={`bs-thumbnail bs-tone-${index%4}`} aria-label={`预览 ${clip.name}`} onClick={()=>preview(clip,settings)} disabled={busy}>
            {clip.kind==='sequence'?<div className="bs-sequence-thumb"><svg viewBox="0 0 50 50" aria-hidden="true"><path d={WHALE_PATH}/></svg><span>DEEPSEEK</span><small>TECHNICAL DOSSIER</small></div>:<video src={clip.url+'#t=0.4'} muted playsInline preload="metadata" tabIndex={-1}/>}<span className="bs-thumbnail-shade"/><span className="bs-play-icon">▶</span><span className="bs-clip-number">{String(index+1).padStart(2,'0')}</span><span className="bs-badge">{clip.kind==='sequence'?'程序动画':clip.source==='builtin'?'内置':'我的视频'}</span>
          </button>
          <div className="bs-clip-info"><h3>{clip.name}</h3><span>{clip.kind==='sequence'?'原版视觉序列':(clip.bytes/1048576).toFixed(1)+' MB'}</span></div>
          <div className="bs-clip-actions"><button type="button" className={clip.id===settings.selectedId?'bs-selected':''} onClick={()=>save({selectedId:clip.id})} disabled={busy || clip.id===settings.selectedId}>{clip.id===settings.selectedId?'✓ 当前动画':'使用此动画'}</button>{clip.source==='upload'&&<button className="bs-delete" aria-label={`删除 ${clip.name}`} disabled={busy} onClick={()=>setPendingDelete(clip)}>移除</button>}</div>
          {pendingDelete?.id===clip.id&&<div className="bs-delete-confirm">移除此视频？<button type="button" disabled={busy} onClick={()=>remove(clip)}>确认移除</button><button type="button" onClick={()=>setPendingDelete(null)}>取消</button></div>}
        </article>)}
        <button type="button" className="bs-upload" disabled={busy} onClick={()=>input.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();upload(e.dataTransfer.files?.[0]);}}><span>＋</span><strong>上传我的视频</strong><small>点击选择，或将视频拖到这里</small><small>MP4 / WebM / M4V · ≤ 200 MB</small></button>
      </div>
      <input ref={input} type="file" accept=".mp4,.m4v,.webm,video/mp4,video/webm" aria-label="上传开机视频" hidden onChange={e=>{upload(e.target.files?.[0]);e.target.value='';}} />
      <div className="bs-section-title"><h2>结束停留画面</h2></div>
      <div className="bs-preferences bs-ending-settings">
        <label className="bs-field"><span>播放结束后</span><select aria-label="结束画面类型" disabled={busy} value={settings.endScreen||'logo'} onChange={e=>{if(e.target.value==='image'&&!settings.endImageId){imageInput.current?.click();return;}save({endScreen:e.target.value});}}><option value="logo">DeepSeek 标志</option><option value="image">我的图片</option></select></label>
        {!!state.logos?.length&&<div className="bs-logo-options">{state.logos.map(logo=><button type="button" key={logo.id} disabled={busy} className={settings.endScreen==='logo'&&settings.logoVariant===logo.id?'is-selected':''} aria-label={`使用内置结束画面 ${logo.name}`} onClick={()=>save({endScreen:'logo',logoVariant:logo.id})}><img src={logo.url} alt=""/><span>{logo.name}{settings.endScreen==='logo'&&settings.logoVariant===logo.id?' ✓':''}</span></button>)}</div>}
        <div className="bs-ending-preview"><div className="bs-ending-mini"><EndTitle settings={settings}/></div><div><strong>{settings.endScreen==='image'?'我的图片':state.logos?.find(logo=>logo.id===settings.logoVariant)?.name||'DeepSeek 标志'}</strong><button type="button" className="bs-primary" disabled={busy} onClick={()=>imageInput.current?.click()}>上传结束图片</button><small>PNG / JPEG / WebP · ≤ 20 MB</small></div></div>
        {settings.endScreen==='image'&&<label className="bs-field"><span>结束图片显示</span><select aria-label="结束图片显示" value={settings.endFit||'contain'} disabled={busy} onChange={e=>save({endFit:e.target.value})}><option value="contain">完整显示</option><option value="cover">铺满窗口</option></select></label>}
        {!!state.endImages?.length&&<div className="bs-end-library">{state.endImages.map(image=><div className={`bs-end-card ${settings.endScreen==='image'&&settings.endImageId===image.id?'is-selected':''}`} key={image.id}><button type="button" disabled={busy} aria-label={`使用结束图片 ${image.name}`} onClick={()=>save({endImageId:image.id,endScreen:'image'})}><img src={image.url} alt=""/><span>{image.name}</span></button>{pendingImageDelete===image.id?<span><button type="button" disabled={busy} onClick={()=>removeEndImage(image)}>确认移除</button><button type="button" onClick={()=>setPendingImageDelete(null)}>取消</button></span>:<button type="button" disabled={busy} className="bs-delete" aria-label={`移除结束图片 ${image.name}`} onClick={()=>setPendingImageDelete(image.id)}>移除</button>}</div>)}</div>}
      </div>
      <input ref={imageInput} type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" aria-label="上传结束图片" hidden onChange={e=>{uploadEndImage(e.target.files?.[0]);e.target.value='';}}/>
      <div className="bs-section-title"><h2>播放偏好</h2></div>
      <div className="bs-preferences">
        <Toggle label="启动时播放" checked={settings.enabled} disabled={busy} onChange={enabled=>save({enabled})}/>
        <Toggle label="播放声音" checked={settings.sound} disabled={busy} onChange={sound=>save({sound})}/>
        <Toggle label="随机开场" checked={settings.shuffle} disabled={busy} onChange={shuffle=>save({shuffle})}/>
      </div>
      <UpdatePanel request={api} standalone={standalone}/>
      <div className="bs-section-title bs-entry-title"><h2>进入方式</h2></div>
      <div className="bs-preferences"><Toggle label="显示侧栏快捷入口" description="在头像上方显示“开机动画”；关闭后仍可从设置进入。附魔台系列最多显示17个快捷入口。" checked={settings.showShortcut??false} disabled={busy} onChange={showShortcut=>save({showShortcut})}/></div>
      <div className="bs-reset-area"><div><strong>恢复默认</strong><p>重置所有设置，永久删除全部上传的视频和图片，仅保留内置素材。</p></div><button className="bs-reset-open" type="button" disabled={busy} onClick={()=>setResetOpened(true)}>恢复默认</button></div>
      {resetOpened&&<ResetDialog settings={settings} onCancel={()=>setResetOpened(false)} onConfirm={restoreDefaults}/>}
      <div className="bs-author-entry"><span>点击了解更多作者信息</span><button type="button" aria-label="查看作者信息" onClick={()=>setAuthorOpened(true)}>查看<span aria-hidden="true">↗</span></button></div>
      {authorOpened&&<AuthorDialog settings={settings} onClose={()=>setAuthorOpened(false)}/>}
    </>}
    {!state&&!error&&<div className="bs-loading">正在加载片库…</div>}
  </section>;
}

export function BootRoot() {
  useStyles();
  const [play,setPlay]=useState(null);
  const [opened,setOpened]=useState(false);
  const [message,setMessage]=useState('');
  const [launchSettled,setLaunchSettled]=useState(launchDecisionSettled);
  const [launchState,setLaunchState]=useState(latestState);
  const [updateSnapshot,setUpdateSnapshot]=useState(()=>startupUpdateSession.getSnapshot());
  const [offerUpdate,setOfferUpdate]=useState(false);
  const trigger=useCallback(value=>setPlay({...value,key:Date.now()}),[]);
  useEffect(()=>{
    const playEvent=e=>trigger(e.detail);
    const open=()=>setOpened(true);
    window.addEventListener(PLAY,playEvent);window.addEventListener(OPEN,open);
    return()=>{window.removeEventListener(PLAY,playEvent);window.removeEventListener(OPEN,open);};
  },[trigger]);
  useEffect(()=>{
    const stateChanged=value=>setLaunchState(value);
    subscribers.add(stateChanged);
    const unsubscribe=startupUpdateSession.subscribe(setUpdateSnapshot);
    setUpdateSnapshot(startupUpdateSession.getSnapshot());
    void startupUpdateSession.check(api);
    return()=>{subscribers.delete(stateChanged);unsubscribe();};
  },[]);
  useEffect(()=>{
    if(bootClaimed){setLaunchSettled(true);return;}
    let alive=true;
    // Scope is the current document. A refreshed/reopened renderer replays; a
    // shell slot remount or a conversation change within that renderer does not.
    launchRequest ||= api('/launch');
    launchRequest.then(value=>{if(!alive||bootClaimed)return;bootClaimed=true;launchDecisionSettled=true;publish(value);if(value.settings.enabled){const clip=value.clip || value.clips.find(c=>c.id===value.settings.selectedId)||value.clips[0];if(clip)trigger({clip,settings:value.settings});}setLaunchSettled(true);}).catch(()=>{if(alive){bootClaimed=true;launchDecisionSettled=true;setLaunchSettled(true);}/* A cosmetic plugin never blocks the workspace. */});
    return()=>{alive=false;};
  },[trigger]);
  useEffect(()=>{
    setOfferUpdate(false);
    if(!launchSettled||play||opened||updateSnapshot.dismissed||!isAvailableUpdate(updateSnapshot.status))return;
    let timer=null;
    let alive=true;
    const blocked=()=>Array.from(document.querySelectorAll('dialog[open],[role="dialog"][aria-modal="true"]')).some(element=>{
      if(element.matches('[data-testid="startup-update"]:not([data-preview])'))return false;
      return element.getClientRects().length>0&&getComputedStyle(element).visibility!=='hidden';
    });
    const schedule=()=>{
      if(timer!==null){clearTimeout(timer);timer=null;}
      if(!alive||blocked())return;
      timer=setTimeout(()=>{timer=null;if(alive&&!blocked()){setOfferUpdate(true);observer?.disconnect();}},250);
    };
    const observer=typeof MutationObserver==='function'?new MutationObserver(schedule):null;
    observer?.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open','hidden','style','aria-hidden']});
    schedule();
    return()=>{alive=false;clearTimeout(timer);observer?.disconnect();};
  },[launchSettled,play,opened,updateSnapshot]);
  const onClose=useCallback(reason=>{setPlay(null);if(['media-error','load-error','play-error','timeout'].includes(reason)){setMessage('动画未能播放，已为你进入 Harness。可在设置中更换视频。');setTimeout(()=>setMessage(''),6500);}},[]);
  useEffect(()=>{if(!opened)return;const key=e=>{if(e.key==='Escape'&&!play&&!document.querySelector('dialog[open]'))setOpened(false);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[opened,play]);
  return <>{opened&&<div className="bs-modal" onClick={e=>{if(e.target===e.currentTarget)setOpened(false);}}><div role="dialog" aria-modal="true" aria-label="开机动画设置" className="bs-modal-body"><button type="button" className="bs-modal-close" onClick={()=>setOpened(false)}>关闭 ×</button><SettingsPanel/></div></div>}{play&&<Player key={play.key} clip={play.clip} settings={play.settings} endOnly={play.endOnly} onClose={onClose}/ >}{offerUpdate&&!play&&!opened&&!updateSnapshot.dismissed&&isAvailableUpdate(updateSnapshot.status)&&<UpdatePrompt request={api} status={updateSnapshot.status} settings={launchState?.settings} onDismiss={()=>startupUpdateSession.dismiss()} onUpdated={version=>startupUpdateSession.updated(version)}/ >}{message&&<div className="bs-toast" role="status">{message}</div>}</>;
}

export function ShortcutAction() {
  const [state,setState]=useState(latestState);
  const registry=getShortcutRegistry();
  const [budget,setBudget]=useState(()=>registry.getSnapshot());
  const enabled=state?.settings.showShortcut===true;
  useEffect(()=>{
    const changed=value=>setState(value);subscribers.add(changed);
    if(latestState)setState(latestState);else api('/state').then(publish).catch(()=>{});
    return()=>subscribers.delete(changed);
  },[]);
  useEffect(()=>registry.subscribe(()=>setBudget(registry.getSnapshot())),[registry]);
  useEffect(()=>{if(!enabled)return;return registry.acquire('dsh-openup-lewis');},[enabled,registry]);
  if(!enabled||!budget.visibleIds.includes('dsh-openup-lewis'))return null;
  return <button type="button" title="开机动画" aria-label="开机动画" onClick={openSettings} style={{border:0,background:'transparent',color:'inherit',cursor:'pointer',padding:8}}>▷</button>;
}

export function apply(ctx) {
  const wire=ready=>{
    const register=()=>{
      const registry=getEnchantRegistry();
      const unregister=registry.registerPlugin({id:'dsh-openup-lewis',name:'开机动画',sectionId:'dsh-boot-studio-settings',renderSettings:()=>React.createElement(SettingsPanel),openSettings:()=>window.dispatchEvent(new Event(OPEN))});
      try {
      ready.slots.inject('shell.overlay',()=>ready.slots.register({name:'shell.overlay',id:'dsh-boot-studio-overlay',order:950},()=>React.createElement(BootRoot)));
      ready.slots.inject('settings.section',()=>bindSettingsEntry({slots:ready.slots,registry,pluginId:'dsh-openup-lewis',register:()=>ready.slots.register({name:'settings.section',id:'dsh-boot-studio-settings',order:80,label:()=> '开机动画'},()=>React.createElement(SettingsPanel))}));
      ready.slots.inject('sidebar.footer.action',()=>ready.slots.register({name:'sidebar.footer.action',id:'dsh-boot-studio-shortcut',order:42,label:()=> '开机动画'},()=>React.createElement(ShortcutAction)));
      return unregister;
      } catch (error) { unregister(); throw error; }
    };
    if(typeof ready.effect==='function')return ready.effect(register,'dsh-boot-studio: slots');else return register();
  };
  if(typeof ctx.inject==='function')return ctx.inject(['slots'],wire);else if(ctx.slots)return wire(ctx);
}
