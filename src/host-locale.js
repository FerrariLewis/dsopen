/** Read the official Harness locale service, falling back to its published <html lang>. */
const stores = new WeakMap();
const serviceListeners = new Set();
let service = null;

function language(value) {
  return /^zh(?:-|$)/i.test(String(value || '')) ? 'zh' : value ? 'en' : null;
}

export function readHostLocale(doc = globalThis.document) {
  try {
    const active = language(service?.getSnapshot?.().active);
    if (active) return active;
  } catch {
    // Fall back to the document language while the host service is unavailable.
  }
  return language(doc?.documentElement?.lang) || 'zh';
}

/** Called from the client's optional locale-service injection; does not write preferences. */
export function bindHostLocale(next) {
  if (!next || typeof next.getSnapshot !== 'function' || typeof next.subscribe !== 'function')
    return () => {};
  const previous = service;
  service = next;
  const refresh = () => {
    for (const listener of [...serviceListeners]) listener();
  };
  const unsubscribe = next.subscribe(refresh);
  refresh();
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    unsubscribe?.();
    if (service === next) {
      service = previous;
      refresh();
    }
  };
}

export function getHostLocaleStore(doc = globalThis.document) {
  if (!doc || typeof doc !== 'object') return fallbackStore;
  let store = stores.get(doc);
  if (store) return store;
  const listeners = new Set();
  let snapshot = readHostLocale(doc),
    observer;
  const refresh = () => {
    const next = readHostLocale(doc);
    if (snapshot === next) return;
    snapshot = next;
    for (const listener of [...listeners]) listener();
  };
  store = Object.freeze({
    getSnapshot: () => readHostLocale(doc),
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        snapshot = readHostLocale(doc);
        serviceListeners.add(refresh);
        const Observer = doc.defaultView?.MutationObserver;
        if (typeof Observer === 'function' && doc.documentElement) {
          observer = new Observer(refresh);
          observer.observe(doc.documentElement, { attributes: true, attributeFilter: ['lang'] });
        }
      }
      let disposed = false;
      return () => {
        if (disposed) return;
        disposed = true;
        listeners.delete(listener);
        if (!listeners.size) {
          serviceListeners.delete(refresh);
          observer?.disconnect();
          observer = null;
        }
      };
    },
  });
  stores.set(doc, store);
  return store;
}

export function subscribeHostLocale(listener, doc = globalThis.document) {
  return getHostLocaleStore(doc).subscribe(listener);
}

const fallbackStore = Object.freeze({
  getSnapshot: () => readHostLocale(),
  subscribe: () => () => {},
});
