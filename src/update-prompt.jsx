import React, { useCallback, useEffect, useRef, useState } from 'react';
import { appliedUpdate, isAvailableUpdate, prepareAndInstallUpdate } from './startup-update.js';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useStudioStyles } from './studio-styles.jsx';
import { CloseIcon } from './close-icon.jsx';
import { UpdateProgress } from './update-progress.jsx';

export function UpdatePrompt({ request, status = {}, onDismiss, onUpdated, preview = false, kind = 'update', checkError, install }) {
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = useRef(null);
  const mounted = useRef(true);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({phase:'prepare',downloadedBytes:0,totalBytes:null});
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(() => kind==='update' ? appliedUpdate(status) : null);
  const close = useCallback(() => {
    if (lock.current) return;
    if (completed && !preview) onUpdated?.(completed.version, completed.result);
    onDismiss?.();
  }, [completed, onDismiss, onUpdated, preview]);
  useEffect(() => {
    mounted.current = true;
    const element = dialog.current;
    const previous = document.activeElement;
    if (typeof element.showModal === 'function') { if (!element.open) element.showModal(); }
    else element.setAttribute('open', '');
    return () => {
      mounted.current = false;
      if (element.open && typeof element.close === 'function') element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  async function accept() {
    if (preview || lock.current || completed || !isAvailableUpdate(status)) return;
    lock.current = true; setBusy(true); setError('');
    try {
      const value = await prepareAndInstallUpdate(request, status, { install, onProgress: value => { if (mounted.current) setProgress(value); } });
      if (mounted.current) setCompleted(value);
    } catch (reason) { if (mounted.current) setError(reason.message || '更新未完成，请稍后重试。'); }
    finally { lock.current = false; if (mounted.current) setBusy(false); }
  }
  const checkingFailed=kind==='error';
  const current=kind==='current';
  const title=current?'已经是最新版本':checkingFailed?'暂时无法检查更新。':completed?'新的开场，已准备就绪。':'准备好新的开场';
  const description=current?'你的开机动画已是最新，快去体验吧':checkingFailed?(checkError||status.message||'请检查网络连接，稍后再试。'):preview?'这里只预览弹窗外观，不会下载或安装更新。':completed?'更新已完成，请完全退出并重新打开 Harness，以应用新版本。':'发现开机动画的新版本，为下一次启动添一点新意';
  return <dialog ref={dialog} className="bs-startup-update" data-testid="startup-update" data-kind={kind} data-preview={preview || undefined} {...appearance} aria-labelledby="bs-startup-update-title" aria-describedby="bs-startup-update-description" onCancel={event => { event.preventDefault(); close(); }}>
    <div className="bs-startup-update-card">
      <button className="bs-startup-update-close" type="button" aria-label="关闭更新提示" disabled={busy} onClick={close}><CloseIcon/></button>
      <div className="bs-startup-update-glyph" aria-hidden="true">{current?'✓':checkingFailed?'!':'✧'}</div>
      <p className="bs-startup-update-brand">DSH LEWIS ENCHANTMENT{preview && <span> · 更新提醒外观预览</span>}</p>
      <h2 id="bs-startup-update-title">{title}</h2>
      <p id="bs-startup-update-description" className="bs-startup-update-copy">{description}</p>
      {current?<div className="bs-startup-update-versions"><strong>v{status?.currentVersion||status?.latestVersion||'1.2.10'}</strong><span>当前版本</span></div>:!checkingFailed&&<div className="bs-startup-update-versions"><span>v{status?.currentVersion||'1.2.9'}</span><span aria-hidden="true">→</span><strong>{status.latestVersion?`v${status.latestVersion}`:preview?'后续版本':'新版本'}</strong></div>}
      {!checkingFailed&&!current&&!busy&&!completed&&<div className="bs-release-notes" aria-label="本次更新"><h3>本次更新</h3>{typeof status.manifest?.releaseNotes==='string'&&status.manifest.releaseNotes.trim()?<p>{status.manifest.releaseNotes}</p>:<p className="bs-release-notes-empty">{preview?'更新说明待作者填写（仅本地预览）':'此版本未提供更新说明。'}</p>}</div>}
      {!checkingFailed&&!current&&!completed&&<p className="bs-startup-update-restart">更新完成后，请完全退出并重新打开 Harness，以应用新版本。</p>}
      {!checkingFailed&&!current&&!completed&&<p className="bs-startup-update-retain">你的视频、图片和设置都会保留</p>}
      {(busy||completed)&&<UpdateProgress progress={progress} completed={!!completed}/>}
      {error && <p className="bs-startup-update-error" role="alert">{error}</p>}
      <div className="bs-startup-update-actions">{current||checkingFailed?<button className="bs-startup-update-primary" type="button" onClick={close}>知道了</button>:preview?<button className="bs-startup-update-primary" type="button" onClick={close}>关闭预览</button>:completed?<button className="bs-startup-update-primary" type="button" disabled={busy} onClick={close}>知道了</button>:<><button type="button" disabled={busy} onClick={close}>稍后再说</button><button className="bs-startup-update-primary" type="button" disabled={busy} onClick={accept}>{busy?'正在更新…':error?'重试更新':`更新到 ${status.latestVersion}`}</button></>}</div>
    </div>
  </dialog>;
}
