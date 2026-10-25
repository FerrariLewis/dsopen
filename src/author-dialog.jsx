import React, { useEffect, useRef, useState } from 'react';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useStudioStyles } from './studio-styles.jsx';

export function AuthorDialog({ settings = {}, onClose }) {
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    if (typeof element.showModal === 'function') { if (!element.open) element.showModal(); }
    else element.setAttribute('open', '');
    closeButton.current?.focus();
    return () => {
      if (element.open && typeof element.close === 'function') element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  function backdropClick(event) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }
  return <dialog ref={dialog} className="bs-startup-update bs-author-dialog" data-testid="author-dialog" {...appearance} aria-label="作者图片" onCancel={event => { event.preventDefault(); onClose(); }} onClick={backdropClick}>
    <div className="bs-startup-update-card bs-author-card">
      <button ref={closeButton} className="bs-startup-update-close" type="button" aria-label="关闭作者信息" onClick={onClose}>×</button>
      {imageFailed ? <span className="bs-visually-hidden" role="alert">图片暂时无法显示，请关闭后重试。</span> : <div className="bs-author-image-frame"><img className="bs-author-image" src="/dsh-boot-studio/author-image" alt="作者提供的微信收款码" onError={() => setImageFailed(true)}/></div>}
    </div>
  </dialog>;
}
