/** Cooperative shortcut budget shared by separately bundled LEWIS ENCHANT plugins. */
export const SHORTCUT_LIMIT = 17;
export const SHORTCUT_REGISTRY_KEY = Symbol.for('dsh.lewis.enchant.shortcuts.v1');

function createRegistry() {
  const entries = new Map();
  const listeners = new Set();
  let snapshot = Object.freeze({
    limit: SHORTCUT_LIMIT,
    count: 0,
    visibleIds: Object.freeze([]),
    waitingIds: Object.freeze([]),
  });

  function publish() {
    const ids = [...entries.keys()];
    snapshot = Object.freeze({
      limit: SHORTCUT_LIMIT,
      count: Math.min(ids.length, SHORTCUT_LIMIT),
      visibleIds: Object.freeze(ids.slice(0, SHORTCUT_LIMIT)),
      waitingIds: Object.freeze(ids.slice(SHORTCUT_LIMIT)),
    });
    for (const listener of [...listeners]) {
      // A failing optional shortcut must not stop other plugins or the workspace.
      try {
        listener();
      } catch {}
    }
  }

  return Object.freeze({
    version: 1,
    limit: SHORTCUT_LIMIT,
    getSnapshot: () => snapshot,
    isVisible: (id) => snapshot.visibleIds.includes(id),
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('快捷入口监听器必须是函数。');
      listeners.add(listener);
      let active = true;
      return () => {
        if (active) {
          active = false;
          listeners.delete(listener);
        }
      };
    },
    acquire(id) {
      if (
        typeof id !== 'string' ||
        !id ||
        id.length > 128 ||
        id !== id.trim() ||
        /[\x00-\x1f\x7f]/.test(id)
      )
        throw new TypeError('快捷入口需要稳定且有效的插件 ID。');
      const owner = Symbol(id);
      let owners = entries.get(id);
      if (!owners) {
        owners = new Set();
        entries.set(id, owners);
      }
      owners.add(owner);
      if (owners.size === 1) publish();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        const current = entries.get(id);
        if (!current || !current.delete(owner) || current.size) return;
        entries.delete(id);
        publish();
      };
    },
  });
}

export function getShortcutRegistry(scope = globalThis) {
  if ((!scope || typeof scope !== 'object') && typeof scope !== 'function')
    throw new TypeError('快捷入口需要共享窗口作用域。');
  let registry = scope[SHORTCUT_REGISTRY_KEY];
  if (!registry) {
    registry = createRegistry();
    Object.defineProperty(scope, SHORTCUT_REGISTRY_KEY, { value: registry, enumerable: false });
  }
  if (
    registry.version !== 1 ||
    registry.limit !== SHORTCUT_LIMIT ||
    !['acquire', 'subscribe', 'isVisible', 'getSnapshot'].every(
      (key) => typeof registry[key] === 'function',
    )
  )
    throw new Error('附魔台快捷入口共享协议不兼容。');
  return registry;
}
