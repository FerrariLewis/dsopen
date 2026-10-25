import React, { useEffect, useRef, useState } from 'react';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useStudioStyles } from './studio-styles.jsx';
import { CloseIcon } from './close-icon.jsx';

/** Confirmation only: the parent owns the authenticated reset request. */
export function ResetDialog({ settings = {}, onCancel, onConfirm }) {
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = useRef(null);
  const cancelButton = useRef(null);
  const mounted = useRef(true);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    mounted.current = true;
    const element = dialog.current;
    const previous = document.activeElement;
    if (typeof element.showModal === 'function') { if (!element.open) element.showModal(); }
    else element.setAttribute('open', '');
    cancelButton.current?.focus();
    return () => {
      mounted.current = false;
      if (element.open && typeof element.close === 'function') element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  function cancel() {
    if (!lock.current) onCancel?.();
  }
  async function confirm() {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try {
      if (typeof onConfirm !== 'function') throw Error('暂时无法恢复默认，请稍后重试。');
      await onConfirm();
    } catch (reason) {
      if (mounted.current) setError(reason?.message || '恢复默认未完成，请稍后重试。');
      return;
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
    // A resolved parent operation means success. Close after it has published
    // the fresh default state; failures remain visible and can be retried.
    if (mounted.current) onCancel?.();
  }
  return <dialog ref={dialog} className="bs-startup-update bs-reset-dialog" data-testid="reset-dialog" {...appearance} aria-labelledby="bs-reset-title" aria-describedby="bs-reset-description bs-reset-warning" aria-busy={busy} onCancel={event => { event.preventDefault(); cancel(); }}>
    <div className="bs-startup-update-card bs-reset-card">
      <button className="bs-startup-update-close" type="button" aria-label="取消恢复默认" disabled={busy} onClick={cancel}><CloseIcon/></button>
      <div className="bs-startup-update-glyph bs-reset-glyph" aria-hidden="true">↺</div>
      <p className="bs-startup-update-brand">DSH LEWIS ENCHANTMENT</p>
      <h2 id="bs-reset-title">回到最初的开场？</h2>
      <p id="bs-reset-description" className="bs-startup-update-copy">恢复默认后，开机动画将回到安装时的状态。</p>
      <div className="bs-startup-update-summary bs-reset-summary">
        <p>删除全部上传的视频和图片</p>
        <p>重置播放、声音及结束画面等偏好</p>
        <p>重置侧栏快捷入口</p>
      </div>
      <p className="bs-startup-update-retain bs-reset-retain">安装包自带的动画和封面会保留。</p>
      <p id="bs-reset-warning" className="bs-reset-warning">此操作不可撤销，请先备份需要保留的素材。</p>
      {busy && <p className="bs-startup-update-status" role="status" aria-live="polite">正在移除自定义素材并恢复默认…</p>}
      {error && <p className="bs-startup-update-error" role="alert">{error}</p>}
      <div className="bs-startup-update-actions bs-reset-actions">
        <button ref={cancelButton} type="button" autoFocus disabled={busy} onClick={cancel}>取消</button>
        <button className="bs-reset-confirm" type="button" disabled={busy} onClick={confirm}>{busy ? '正在恢复…' : '确认恢复默认'}</button>
      </div>
    </div>
  </dialog>;
}
