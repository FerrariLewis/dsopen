import { CSS } from './styles.js';

export const STUDIO_STYLE_ID = 'dsh-boot-studio-style';
// Independent of product/display version numbering. Increase when styles change.
export const STUDIO_STYLE_REVISION = 2026102509;

function fingerprint(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}

/** A document keeps one stylesheet across slot remounts and in-place updates. */
export function ensureStudioStyles(doc) {
  if (!doc?.head) return null;
  let element = doc.getElementById(STUDIO_STYLE_ID);
  if (!element) {
    element = doc.createElement('style');
    element.id = STUDIO_STYLE_ID;
    doc.head.appendChild(element);
  }
  const installed = Number(element.getAttribute('data-lewis-style-revision')) || 0;
  if (installed > STUDIO_STYLE_REVISION) return element;
  if (element.textContent !== CSS) element.textContent = CSS;
  element.setAttribute('data-lewis-style-revision', String(STUDIO_STYLE_REVISION));
  element.setAttribute('data-lewis-style-fingerprint', fingerprint(CSS));
  return element;
}
