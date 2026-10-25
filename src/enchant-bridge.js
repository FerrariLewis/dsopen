/** Optional, per-window coordination for independently installed ENCHANT plugins. */
export const ENCHANT_REGISTRY_KEY = Symbol.for('dsh.lewis.enchant.v1');
export const DEFAULT_ENCHANT_THEME = Object.freeze({ effect: 'frosted', accent: null, surface: null, blur: 30, radius: 30 });

const ID = /^[a-z0-9][a-z0-9._-]{0,127}$/;
const COLOR = /^#[a-f0-9]{6}$/i;
const THEME_KEYS = new Set(['effect', 'accent', 'surface', 'blur', 'radius']);
function plain(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
function identifier(value) {
  if (typeof value !== 'string' || !ID.test(value)) throw new TypeError('附魔台需要稳定的插件或设置入口 ID。');
  return value;
}
function themeValue(patch, base = DEFAULT_ENCHANT_THEME) {
  if (!plain(patch)) throw new TypeError('附魔台主题必须是对象。');
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (!THEME_KEYS.has(key)) throw new TypeError('不支持的附魔台主题属性。');
    if (key === 'effect' && !['frosted', 'liquid-glass'].includes(value)) throw new TypeError('不支持的附魔台材质。');
    if (['accent', 'surface'].includes(key) && value !== null && (typeof value !== 'string' || !COLOR.test(value))) throw new TypeError('主题颜色须为六位十六进制颜色。');
    if (key === 'blur' && !(Number.isInteger(value) && value >= 0 && value <= 48)) throw new TypeError('主题磨砂度须为 0 到 48 的整数。');
    if (key === 'radius' && !(Number.isInteger(value) && value >= 12 && value <= 40)) throw new TypeError('主题圆角须为 12 到 40 的整数。');
    result[key] = typeof value === 'string' && key !== 'effect' ? value.toLowerCase() : value;
  }
  return Object.freeze(result);
}

/** Material is web CSS, so it does not require macOS or Windows native bridges. */
export function themeAttributes(theme = DEFAULT_ENCHANT_THEME) {
  const value = themeValue(theme);
  const style = { '--lewis-blur': `${value.blur}px`, '--lewis-radius': `${value.radius}px` };
  if (value.accent) {
    style['--lewis-accent'] = value.accent;
    const rgb = [1, 3, 5].map(offset => parseInt(value.accent.slice(offset, offset + 2), 16));
    const brightness = rgb.reduce((sum, channel, index) => sum + channel * [0.299, 0.587, 0.114][index], 0);
    style['--lewis-accent-text'] = brightness >= 155 ? '#142c2c' : '#f4fbf8';
  }
  if (value.surface) style['--lewis-surface'] = value.surface;
  return { 'data-lewis-effect': value.effect, 'data-lewis-themed': value.accent ? 'true' : undefined, style };
}

function createRegistry() {
  const plugins = new Map();
  const listeners = new Set();
  let controller = null;
  let revision = 0;
  let snapshot = Object.freeze({ version: 1, revision, theme: DEFAULT_ENCHANT_THEME, controller: null, plugins: Object.freeze([]) });
  function entryReady(candidate = controller) {
    if (!candidate) return false;
    try { return candidate.isEntryReady() === true; } catch { return false; }
  }
  function publish() {
    const ready = entryReady();
    snapshot = Object.freeze({
      version: 1, revision: ++revision,
      theme: controller && ready ? controller.theme : DEFAULT_ENCHANT_THEME,
      controller: controller ? Object.freeze({ id: controller.id, sectionId: controller.sectionId, ready }) : null,
      plugins: Object.freeze([...plugins.values()].map(owners => [...owners.values()].at(-1))),
    });
    for (const listener of [...listeners]) { try { listener(); } catch {} }
  }
  function refresh() {
    const ready = entryReady();
    if (Boolean(snapshot.controller?.ready) !== ready) publish();
  }
  function shouldGroupSettings(pluginId) {
    return plugins.has(pluginId) && entryReady() && ![...plugins.get(pluginId).values()].some(plugin => plugin.sectionId === controller.sectionId);
  }
  return Object.freeze({
    version: 1,
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('附魔台监听器必须是函数。');
      listeners.add(listener);
      let active = true;
      return () => { if (active) { active = false; listeners.delete(listener); } };
    },
    refresh,
    registerPlugin(descriptor) {
      if (!plain(descriptor)) throw new TypeError('附魔台插件信息必须是对象。');
      const { id, name, sectionId, renderSettings, openSettings } = descriptor;
      identifier(id); identifier(sectionId);
      if (typeof name !== 'string' || !name.trim() || name.length > 80 || /[\x00-\x1f\x7f]/.test(name)) throw new TypeError('附魔台插件名称无效。');
      if (typeof renderSettings !== 'function' || typeof openSettings !== 'function') throw new TypeError('附魔台插件需要可用的设置组件与打开方法。');
      const owners = plugins.get(id) || new Map();
      const existing = [...owners.values()][0];
      if (existing && (existing.name !== name || existing.sectionId !== sectionId)) throw new Error('附魔台插件 ID 已被另一项占用。');
      const token = Symbol(id);
      owners.set(token, Object.freeze({ id, name, sectionId, renderSettings, openSettings }));
      plugins.set(id, owners); publish();
      let active = true;
      return () => {
        if (!active) return; active = false;
        owners.delete(token); if (!owners.size) plugins.delete(id); publish();
      };
    },
    acquireController(descriptor) {
      if (controller) throw new Error('附魔台已经有一个活动的控制器。');
      if (!plain(descriptor)) throw new TypeError('附魔台控制器信息必须是对象。');
      const { id, sectionId, openSettings, isEntryReady } = descriptor;
      identifier(id); identifier(sectionId);
      if (typeof openSettings !== 'function' || typeof isEntryReady !== 'function') throw new TypeError('控制器需要可用且可验证的设置入口。');
      if ([...plugins.values()].some(owners => [...owners.values()].some(plugin => plugin.sectionId === sectionId))) throw new Error('控制器必须使用独立的设置入口。');
      const token = Symbol(id);
      const candidate = { id, sectionId, openSettings, isEntryReady, token, theme: themeValue(descriptor.theme === undefined ? {} : descriptor.theme) };
      controller = candidate; publish();
      let active = true;
      const assertActive = () => { if (!active || controller?.token !== token) throw new Error('附魔台控制器已经释放。'); };
      return Object.freeze({
        setTheme(patch) { assertActive(); const next = themeValue(patch, controller.theme); controller.theme = next; publish(); },
        refresh() { assertActive(); refresh(); },
        release() { if (!active) return; active = false; if (controller?.token !== token) return; controller = null; publish(); },
      });
    },
    shouldGroupSettings,
    openControllerSettings(pluginId) {
      if (!shouldGroupSettings(pluginId)) return false;
      try { return controller.openSettings(pluginId) !== false; } catch { return false; }
    },
  });
}

export function getEnchantRegistry(scope = globalThis) {
  if ((!scope || typeof scope !== 'object') && typeof scope !== 'function') throw new TypeError('附魔台需要共享窗口作用域。');
  let registry = scope[ENCHANT_REGISTRY_KEY];
  if (!registry) {
    registry = createRegistry();
    Object.defineProperty(scope, ENCHANT_REGISTRY_KEY, { value: registry, enumerable: false });
  }
  if (registry.version !== 1 || !['getSnapshot', 'subscribe', 'registerPlugin', 'acquireController', 'shouldGroupSettings', 'refresh'].every(name => typeof registry[name] === 'function')) throw new Error('附魔台共享协议不兼容。');
  return registry;
}

/** Real slot disposal removes navigation rows; a null React child does not. */
export function bindSettingsEntry({ slots, registry = getEnchantRegistry(), pluginId, register }) {
  identifier(pluginId);
  if (typeof register !== 'function') throw new TypeError('附魔台需要设置入口注册方法。');
  // Old hosts that cannot inspect their settings ledger keep the standalone entry.
  if (typeof slots?.entries !== 'function' || typeof slots?.subscribe !== 'function') {
    const dispose = register(); let active = true;
    return () => { if (!active) return; active = false; if (typeof dispose === 'function') dispose(); };
  }
  let active = true, slot = null, syncing = false;
  function shouldGroup() {
    if (!registry.shouldGroupSettings(pluginId)) return false;
    const owner = registry.getSnapshot().controller;
    try { return slots.entries('settings.section').some(entry => entry.options?.id === owner?.sectionId); } catch { return false; }
  }
  function sync() {
    if (!active || syncing) return;
    syncing = true;
    try {
      registry.refresh();
      if (shouldGroup()) {
        if (slot) { const dispose = slot; slot = null; dispose(); }
      } else if (!slot) {
        // Reserve before register(), whose synchronous ledger notification may re-enter.
        slot = () => {};
        const dispose = register();
        if (typeof dispose !== 'function') throw new TypeError('Harness 设置入口没有返回清理方法。');
        slot = dispose;
      }
    } finally { syncing = false; }
  }
  const offRegistry = registry.subscribe(sync);
  const offLedger = slots.subscribe('settings.section', sync);
  try { sync(); } catch (error) { active = false; offRegistry(); offLedger(); slot?.(); throw error; }
  return () => {
    if (!active) return; active = false;
    offRegistry(); offLedger(); const dispose = slot; slot = null; dispose?.();
  };
}
