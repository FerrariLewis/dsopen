import React, { useCallback, useEffect, useRef, useState } from 'react';
import { appliedUpdate, isAvailableUpdate, prepareAndInstallUpdate } from './startup-update.js';
import { useEnchantAppearance } from './enchant-theme.jsx';

export function UpdatePrompt({ request, status = {}, settings = {}, onDismiss, onUpdated, preview = false }) {
  const appearance = useEnchantAppearance();
  const dialog = useRef(null);
  const mounted = useRef(true);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('prepare');
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(() => appliedUpdate(status));
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
      const value = await prepareAndInstallUpdate(request, status, { onPhase: value => { if (mounted.current) setPhase(value); } });
      if (mounted.current) setCompleted(value);
    } catch (reason) { if (mounted.current) setError(reason.message || '更新未完成，请稍后重试。'); }
    finally { lock.current = false; if (mounted.current) setBusy(false); }
  }
  return <dialog ref={dialog} className="bs-startup-update" data-testid="startup-update" data-preview={preview || undefined} {...appearance} aria-labelledby="bs-startup-update-title" aria-describedby="bs-startup-update-description" onCancel={event => { event.preventDefault(); close(); }}>
    <div className="bs-startup-update-card">
      <button className="bs-startup-update-close" type="button" aria-label={completed ? '关闭更新提示' : '稍后再说'} disabled={busy} onClick={close}>×</button>
      <div className="bs-startup-update-glyph" aria-hidden="true">✧</div>
      <p className="bs-startup-update-brand">DSH LEWIS ENCHANT{preview && <span> · 更新提醒外观预览</span>}</p>
      <h2 id="bs-startup-update-title">{completed ? '新的开场，已准备就绪。' : '新的开场，准备好了。'}</h2>
      <p id="bs-startup-update-description" className="bs-startup-update-copy">{preview ? '这里只预览弹窗外观，不会下载或安装更新。' : completed ? '重新打开 Harness，即可使用新版本。' : '发现开机动画新版本，为下一次启动添一点新意。'}</p>
      <div className="bs-startup-update-versions"><span>v{status?.currentVersion || '1.2.7'}</span><span aria-hidden="true">→</span><strong>{preview ? '后续版本' : `v${status.latestVersion}`}</strong></div>
      {!busy && !completed && <div className="bs-startup-update-summary"><p>完整安装包校验后更新</p><p>保留个人视频与封面</p><p>重新打开后使用新版本</p></div>}
      <p className="bs-startup-update-retain">你的视频、图片和设置都会保留</p>
      {busy && <p className="bs-startup-update-status" role="status" aria-live="polite">{phase === 'install' ? '校验通过，正在通过 Harness 应用更新…' : '正在下载并校验更新包…'}</p>}
      {error && <p className="bs-startup-update-error" role="alert">{error}</p>}
      {completed && <p className="bs-startup-update-status" role="status">{completed.result.application === 'restart-required' ? '更新完成。请完全退出并重新打开 Harness。' : '新版本已应用。建议重新打开 Harness，让所有窗口使用新版本。'}</p>}
      <div className="bs-startup-update-actions">{preview ? <button className="bs-startup-update-primary" type="button" onClick={close}>关闭预览</button> : completed ? <button className="bs-startup-update-primary" type="button" onClick={close}>知道了</button> : <><button type="button" disabled={busy} onClick={close}>稍后再说</button><button className="bs-startup-update-primary" type="button" disabled={busy} onClick={accept}>{busy ? '正在更新…' : error ? '重试更新' : `更新到 ${status.latestVersion}`}</button></>}</div>
    </div>
  </dialog>;
}
