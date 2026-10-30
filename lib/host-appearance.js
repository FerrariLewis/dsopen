/** Read-only adapter for Harness ui-theme's published DOM tokens. */
const stores = new WeakMap();
export const HOST_PALETTES = Object.freeze({
  light: Object.freeze({
    labelPrimary: '#20242c',
    labelSecondary: '#5f6876',
    labelTertiary: '#7b8492',
    borderColor: '#c7ccd4',
    panelColor: '#ffffff',
    baseColor: '#f5f6f8',
    hoverColor: '#20242c0d',
    accent: '#4d6bfe',
    accentText: '#ffffff',
  }),
  dark: Object.freeze({
    labelPrimary: '#eef0f5',
    labelSecondary: '#b5bdc9',
    labelTertiary: '#8b95a5',
    borderColor: '#616b7b',
    panelColor: '#222832',
    baseColor: '#141820',
    hoverColor: '#ffffff14',
    accent: '#7c96ff',
    accentText: '#101827',
  }),
});

function property(style, name) {
  return style?.getPropertyValue(name).trim() || '';
}
function safeColor(view, value, fallback) {
  if (!value || /[;{}<>\u0000-\u001f]/.test(value)) return fallback;
  return !view?.CSS?.supports || view.CSS.supports('color', value) ? value : fallback;
}
export function contrastText(value, fallback = '#ffffff') {
  let rgb;
  if (/^#[a-f\d]{6}(?:[a-f\d]{2})?$/i.test(value))
    rgb = [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
  else if (/^#[a-f\d]{3}$/i.test(value))
    rgb = [1, 2, 3].map((i) => parseInt(value[i] + value[i], 16));
  else if (/^rgba?\(/i.test(value))
    rgb = value
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number);
  if (!rgb || rgb.length !== 3 || !rgb.every(Number.isFinite)) return fallback;
  return rgb.reduce((sum, channel, i) => sum + channel * [0.299, 0.587, 0.114][i], 0) >= 155
    ? '#142c2c'
    : '#f4fbf8';
}

export function readHostAppearance(doc) {
  const view = doc?.defaultView;
  const root = doc?.documentElement;
  const body = doc?.body;
  const bodyStyle = view?.getComputedStyle?.(body || root);
  const rootStyle = view?.getComputedStyle?.(root);
  const declaredScheme = rootStyle?.colorScheme || bodyStyle?.colorScheme || '';
  const colorScheme =
    body?.hasAttribute('data-ds-dark-theme') ||
    root?.hasAttribute('data-ds-dark-theme') ||
    declaredScheme === 'dark'
      ? 'dark'
      : declaredScheme === 'light'
        ? 'light'
        : view?.matchMedia?.('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
  const fallback = HOST_PALETTES[colorScheme];
  const get = (name, defaultValue) =>
    safeColor(view, property(bodyStyle, name) || property(rootStyle, name), defaultValue);
  const rawSize = parseFloat(
    property(bodyStyle, '--dsh-content-font-size') ||
      property(rootStyle, '--dsh-content-font-size'),
  );
  const fontSize = Number.isFinite(rawSize) ? Math.max(10, Math.min(22, rawSize)) : 14;
  const customTextFamily = property(bodyStyle, '--dsh-font-family-text');
  const fontFamily =
    property(bodyStyle, '--dsw-font-family') ||
    (customTextFamily ? `${customTextFamily}, system-ui, sans-serif` : bodyStyle?.fontFamily) ||
    'system-ui, sans-serif';
  const accent = get('--dsw-alias-brand-primary-new-colorprimary-new-color', fallback.accent);
  const value = {
    colorScheme,
    fontSize,
    fontFamily,
    labelPrimary: get('--dsw-alias-label-primary', fallback.labelPrimary),
    labelSecondary: get('--dsw-alias-label-secondary', fallback.labelSecondary),
    labelTertiary: get('--dsw-alias-label-tertiary', fallback.labelTertiary),
    borderColor: get('--dsw-alias-border-l2', fallback.borderColor),
    panelColor: get('--dsw-alias-bg-layer-2', fallback.panelColor),
    baseColor: get('--dsw-alias-bg-base', get('--dsw-alias-bg-layer-1', fallback.baseColor)),
    hoverColor: get('--dsw-alias-interactive-bg-hover', fallback.hoverColor),
    accent,
    accentText: contrastText(
      accent,
      get('--dsw-alias-label-primary-foreground', fallback.accentText),
    ),
  };
  return Object.freeze(value);
}

function createStore(doc) {
  let snapshot = readHostAppearance(doc),
    observer,
    frame = null,
    media;
  const listeners = new Set();
  const view = doc?.defaultView;
  function refresh() {
    frame = null;
    const next = readHostAppearance(doc);
    if (JSON.stringify(next) === JSON.stringify(snapshot)) return;
    snapshot = next;
    for (const listener of [...listeners]) {
      try {
        listener();
      } catch {}
    }
  }
  function schedule() {
    if (frame !== null) return;
    if (typeof view?.requestAnimationFrame === 'function')
      frame = view.requestAnimationFrame(refresh);
    else refresh();
  }
  function connect() {
    const Observer = view?.MutationObserver;
    if (typeof Observer === 'function') {
      observer = new Observer(schedule);
      for (const element of [doc.documentElement, doc.body].filter(Boolean))
        observer.observe(element, {
          attributes: true,
          attributeFilter: ['style', 'class', 'data-ds-dark-theme'],
        });
      if (doc.head)
        observer.observe(doc.head, {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true,
        });
    }
    media = view?.matchMedia?.('(prefers-color-scheme: dark)');
    media?.addEventListener?.('change', schedule);
    view?.addEventListener?.('resize', schedule);
    doc.fonts?.addEventListener?.('loadingdone', schedule);
    refresh();
  }
  function disconnect() {
    observer?.disconnect();
    observer = undefined;
    media?.removeEventListener?.('change', schedule);
    view?.removeEventListener?.('resize', schedule);
    doc.fonts?.removeEventListener?.('loadingdone', schedule);
    if (frame !== null) view?.cancelAnimationFrame?.(frame);
    frame = null;
  }
  return Object.freeze({
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (typeof listener !== 'function')
        throw new TypeError('Host appearance listener must be a function.');
      listeners.add(listener);
      if (listeners.size === 1) connect();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        listeners.delete(listener);
        if (!listeners.size) disconnect();
      };
    },
  });
}

export function getHostAppearanceStore(doc) {
  if (!doc || typeof doc !== 'object') throw new TypeError('Host appearance needs a document.');
  let store = stores.get(doc);
  if (!store) {
    store = createStore(doc);
    stores.set(doc, store);
  }
  return store;
}
