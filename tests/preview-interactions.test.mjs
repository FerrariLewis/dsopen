import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const built = await build({
  stdin: {
    contents: `export { SettingsPanel, Player, EndTitle, playbackStages, BootRoot, ShortcutAction, openSettings, api } from './src/client.jsx'; export { EndingSettings, VideoLibrary } from './src/settings-sections.jsx'; export { UpdatePrompt } from './src/update-prompt.jsx'; export { bindHarnessServices } from './src/startup-update.js'; export { latestState, subscribers, publish } from './src/studio-state.js';`,
    resolveDir: fileURLToPath(new URL('..', import.meta.url)),
  },
  bundle: true,
  minify: true,
  keepNames: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  external: ['react', 'react-dom', 'react-dom/client'],
});

/** A small renderer host executes the real components and event handlers. It
 * supplies hooks/refs, not a second implementation of preview or selection. */
function componentHost(fixture, language = 'zh', options = {}) {
  let slots = [],
    cursor = 0,
    seeded = false,
    effects = [],
    cleanup = [];
  const events = [],
    requests = [],
    listeners = new Map(),
    attributes = new Map();
  const document = {
    documentElement: {
      lang: language,
      hasAttribute: (name) => attributes.has(name),
      getAttribute: (name) => attributes.get(name) ?? null,
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: (name) => attributes.delete(name),
    },
    body: { hasAttribute: () => false },
    activeElement: { isConnected: true, focus() {} },
  };
  const window = {
    addEventListener(name, listener) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(listener);
    },
    removeEventListener(name, listener) {
      listeners.get(name)?.delete(listener);
    },
    dispatchEvent(event) {
      events.push(event);
      for (const listener of listeners.get(event.type) || []) listener(event);
      return true;
    },
  };
  document.defaultView = window;
  const React = {
    Fragment: Symbol('fragment'),
    createElement(type, props, ...children) {
      return { type, props: { ...props, children } };
    },
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) {
        slots[index] =
          initial === null && fixture && !seeded
            ? ((seeded = true), fixture)
            : typeof initial === 'function'
              ? initial()
              : initial;
      }
      return [
        slots[index],
        (next) => {
          slots[index] = typeof next === 'function' ? next(slots[index]) : next;
        },
      ];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useCallback: (callback) => callback,
    useEffect: (setup) => effects.push(setup),
    useLayoutEffect() {},
    useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
  };
  const module = { exports: {} };
  vm.runInNewContext(built.outputFiles[0].text, {
    module,
    exports: module.exports,
    document,
    window,
    require: (name) => {
      if (name === 'react') return React;
      if (['react-dom', 'react-dom/client'].includes(name)) return {};
      throw Error(`Unexpected dependency: ${name}`);
    },
    CustomEvent: class {
      constructor(type, options) {
        this.type = type;
        this.detail = options?.detail;
      }
    },
    AbortController,
    URL,
    performance: options.performance || performance,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    fetch: async (...args) => {
      requests.push(args);
      throw Error('Unexpected request while previewing');
    },
  });
  function bindRefs(node) {
    for (const element of elements(node)) {
      if (!element.props.ref || element.props.ref.current) continue;
      element.props.ref.current =
        element.type === 'video'
          ? {
              currentTime: 0,
              pause() {},
              load() {},
              removeAttribute() {},
              play: options.play || (async () => {}),
            }
          : {
              open: false,
              showModal() {
                this.open = true;
              },
              close() {
                this.open = false;
              },
              setAttribute() {},
              focus() {},
              click() {},
            };
    }
  }
  return {
    exports: module.exports,
    events,
    requests,
    window,
    render(Component, props) {
      cursor = 0;
      effects = [];
      const tree = Component(props);
      bindRefs(tree);
      return tree;
    },
    commit() {
      cleanup.push(
        ...effects.map((setup) => setup()).filter((value) => typeof value === 'function'),
      );
    },
    reset() {
      for (const dispose of cleanup.reverse()) dispose();
      slots = [];
      cursor = 0;
      seeded = false;
      effects = [];
      cleanup = [];
    },
  };
}

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !node.props) return [];
  return [node, ...elements(node.props.children)];
}
const text = (node) =>
  Array.isArray(node)
    ? node.map(text).join('')
    : node?.props
      ? text(node.props.children)
      : String(node ?? '');
const byLabel = (tree, label) => {
  const result = elements(tree).filter(
    (node) => node.type === 'button' && node.props['aria-label'] === label,
  );
  assert.equal(result.length, 1, label);
  return result[0];
};
const plain = (value) => JSON.parse(JSON.stringify(value));

const flush = () => new Promise((resolve) => setImmediate(resolve));

function fixture(settings = {}) {
  return {
    settings: Object.freeze({
      enabled: false,
      videoEnabled: false,
      endEnabled: false,
      selectedId: 'brand',
      endScreen: 'logo',
      logoVariant: 'silver',
      endImageId: null,
      endFit: 'cover',
      sound: false,
      shuffle: false,
      showShortcut: false,
      ...settings,
    }),
    clips: [
      { id: 'brand', name: '启', source: 'builtin', kind: 'video', url: '/video.mp4', bytes: 100 },
    ],
    logos: [
      { id: 'silver', name: '远山', url: '/silver.png' },
      { id: 'gold', name: '黑金', url: '/gold.png' },
    ],
    endImages: [
      { id: 'i_first', name: '我的第一张图', url: '/first.png' },
      { id: 'i_second', name: 'My Holiday 原图', url: '/second.png' },
    ],
  };
}

test('media failures keep the ending screen and preserve the failure reason until entry', () => {
  for (const endEnabled of [true, false]) {
    const host = componentHost(null),
      closed = [];
    const props = {
      clip: fixture().clips[0],
      settings: { videoEnabled: true, endEnabled },
      onClose: (reason) => closed.push(reason),
    };
    try {
      const intro = host.render(host.exports.Player, props);
      host.commit();
      const video = elements(intro).find((node) => node.type === 'video');
      video.props.onError();
      if (endEnabled) {
        const ending = host.render(host.exports.Player, props);
        assert.equal(ending.props['data-phase'], 'end');
        assert.deepEqual(closed, []);
        video.props.onError(); // A delayed event from the stopped video cannot replace the reason.
        ending.props.onPointerDown({ target: { closest: () => null } });
      }
      assert.deepEqual(closed, ['media-error']);
    } finally {
      host.reset();
    }
  }
});

test('manual playback failure reaches the ending and reports play-error on close', async () => {
  const host = componentHost(null, 'zh', {
    play: async () => {
      throw Error('decoder failed');
    },
  });
  const closed = [],
    props = {
      clip: fixture().clips[0],
      settings: { videoEnabled: true, endEnabled: true },
      onClose: (reason) => closed.push(reason),
    };
  try {
    host.render(host.exports.Player, props);
    host.commit();
    await flush();
    const blocked = host.render(host.exports.Player, props);
    const retry = elements(blocked).find(
      (node) => node.type === 'button' && text(node) === '▶ 点击播放',
    );
    assert.ok(retry);
    await retry.props.onClick({ stopPropagation() {} });
    const ending = host.render(host.exports.Player, props);
    assert.equal(ending.props['data-phase'], 'end');
    assert.deepEqual(closed, []);
    ending.props.onCancel({ preventDefault() {} });
    assert.deepEqual(closed, ['play-error']);
  } finally {
    host.reset();
  }
});

test('stalled videos and overlong sequences report timeout after their ending screen', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  for (const kind of ['video', 'sequence']) {
    let elapsed = 0;
    const host = componentHost(null, 'zh', { performance: { now: () => elapsed } }),
      closed = [];
    const props = {
      clip: { ...fixture().clips[0], kind },
      settings: { videoEnabled: true, endEnabled: true },
      onClose: (reason) => closed.push(reason),
    };
    try {
      host.render(host.exports.Player, props);
      host.commit();
      elapsed = kind === 'sequence' ? 120000 : 31000;
      t.mock.timers.tick(kind === 'sequence' ? 120000 : 1000);
      const ending = host.render(host.exports.Player, props);
      assert.equal(ending.props['data-phase'], 'end');
      assert.deepEqual(closed, []);
      ending.props.onPointerDown({ target: { closest: () => null } });
      assert.deepEqual(closed, ['timeout']);
    } finally {
      host.reset();
    }
  }
});

test('the real BootRoot consumes Player failure after entry and displays a localized notice', async () => {
  const root = componentHost(null, 'en'),
    player = componentHost(null, 'en');
  try {
    root.render(root.exports.BootRoot, {});
    root.commit();
    await flush();
    root.window.dispatchEvent({
      type: 'dsh-boot-studio:play',
      detail: { clip: fixture().clips[0], settings: { videoEnabled: true, endEnabled: true } },
    });
    const tree = root.render(root.exports.BootRoot, {});
    const active = elements(tree).find((node) => node.type === root.exports.Player);
    assert.ok(active);
    const intro = player.render(player.exports.Player, active.props);
    player.commit();
    elements(intro)
      .find((node) => node.type === 'video')
      .props.onError();
    const ending = player.render(player.exports.Player, active.props);
    assert.equal(ending.props['data-phase'], 'end');
    assert.equal(
      elements(root.render(root.exports.BootRoot, {})).some((node) => node.props.role === 'status'),
      false,
    );
    ending.props.onPointerDown({ target: { closest: () => null } });
    const entered = root.render(root.exports.BootRoot, {});
    assert.equal(
      elements(entered).some((node) => node.type === root.exports.Player),
      false,
    );
    const notice = elements(entered).find((node) => node.props.role === 'status');
    assert.ok(notice);
    assert.match(text(notice), /Harness/);
    assert.doesNotMatch(text(notice), /\p{Script=Han}/u);
  } finally {
    player.reset();
    root.reset();
  }
});

test('an uncertain install hides retry while keeping working plugin navigation and never reinstalls', async () => {
  const host = componentHost(null, 'en');
  let installs = 0,
    dismissed = 0,
    opened;
  const dispose = host.exports.bindHarnessServices({
    pluginManager: {
      installBundle: async () => {
        installs++;
        return { ok: false, error: { message: 'connection lost' } };
      },
    },
    pluginNavigation: {
      openBundle: (name) => {
        opened = name;
      },
    },
  });
  const status = {
    packageName: 'dsh-openup-lewis',
    currentVersion: '1.3.3',
    latestVersion: '1.3.4',
    channelReady: true,
    available: true,
  };
  const sha256 = 'a'.repeat(64),
    staged = {
      version: '1.3.4',
      requiresRestart: true,
      sha256,
      spec: `C:/isolated/update-cache/dsh-openup-lewis-1.3.4-${sha256}.tgz`,
    };
  const props = {
    status,
    request: async (path) =>
      path === '/updates/prepare' ? staged : { version: '1.3.4', phase: 'ready' },
    onDismiss: () => {
      dismissed++;
    },
  };
  try {
    const first = host.render(host.exports.UpdatePrompt, props);
    host.commit();
    const accept = elements(first).find(
      (node) => node.type === 'button' && text(node) === 'Update to 1.3.4',
    );
    await accept.props.onClick();
    const failed = host.render(host.exports.UpdatePrompt, props);
    assert.equal(
      elements(failed).some(
        (node) => node.type === 'button' && /Retry update|Update to/.test(text(node)),
      ),
      false,
    );
    const navigation = elements(failed).find(
      (node) => node.type === 'button' && text(node) === 'Open plugin manager',
    );
    assert.ok(navigation);
    // Even a stale event handler and a reopened prompt cannot resend installation.
    await accept.props.onClick();
    assert.equal(installs, 1);
    navigation.props.onClick();
    assert.equal(opened, status.packageName);
    assert.equal(dismissed, 1);
    host.reset();
    const reopened = host.render(host.exports.UpdatePrompt, props);
    host.commit();
    await elements(reopened)
      .find((node) => node.type === 'button' && text(node) === 'Update to 1.3.4')
      .props.onClick();
    assert.equal(installs, 1);
    assert.equal(
      elements(host.render(host.exports.UpdatePrompt, props)).some(
        (node) => node.type === 'button' && text(node) === 'Retry update',
      ),
      false,
    );
  } finally {
    dispose();
    host.reset();
  }
});

test('split modules retain client exports, live shared settings, renderer isolation and launch-once remount behavior', async () => {
  const host = componentHost(null),
    otherWindow = componentHost(null);
  try {
    for (const name of [
      'SettingsPanel',
      'Player',
      'EndTitle',
      'playbackStages',
      'BootRoot',
      'ShortcutAction',
      'openSettings',
      'api',
    ])
      assert.equal(typeof host.exports[name], 'function', name);
    const state = fixture();
    host.exports.publish(state);
    assert.equal(host.exports.latestState, state);
    assert.equal(otherWindow.exports.latestState, null);
    const first = host.render(host.exports.SettingsPanel, {});
    assert.equal(
      elements(first).find((node) => node.type === host.exports.VideoLibrary).props.state,
      state,
    );
    host.commit();
    assert.equal(host.exports.subscribers.size, 1);
    host.reset();
    assert.equal(host.exports.subscribers.size, 0);
    const changed = fixture({ sound: true });
    host.exports.publish(changed);
    const remounted = host.render(host.exports.SettingsPanel, {});
    assert.equal(
      elements(remounted).find((node) => node.type === host.exports.VideoLibrary).props.state,
      changed,
    );
    host.reset();
    for (let count = 0; count < 2; count++) {
      host.render(host.exports.BootRoot, {});
      host.commit();
      await flush();
      host.reset();
    }
    assert.equal(host.requests.filter(([url]) => url.endsWith('/launch')).length, 1);
    assert.equal(host.requests.filter(([url]) => url.endsWith('/updates/check')).length, 1);
    assert.equal(host.exports.subscribers.size, 0);
  } finally {
    host.reset();
    otherWindow.reset();
  }
});

test('the actual full-preview button always plays video then ending without changing disabled launch preferences', () => {
  for (const [videoEnabled, endEnabled] of [
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ]) {
    const state = fixture({ videoEnabled, endEnabled }),
      before = structuredClone(state.settings);
    const host = componentHost(state);
    try {
      const tree = host.render(host.exports.SettingsPanel, {});
      const button = elements(tree).find(
        (node) => node.type === 'button' && text(node) === '▶ 预览当前开场',
      );
      assert.equal(button.props.disabled, false);
      button.props.onClick();
      const detail = host.events.find((event) => event.type === 'dsh-boot-studio:play').detail;
      assert.equal(detail.settings.videoEnabled, true);
      assert.equal(detail.settings.endEnabled, true);
      assert.deepEqual(state.settings, before);
      assert.equal(host.requests.length, 0);
      // The saved flags still control a real automatic launch.
      const automatic = host.exports.playbackStages(state.settings);
      assert.equal(automatic.video, videoEnabled);
      assert.equal(automatic.end, endEnabled);
      host.reset();
      const closed = [],
        props = { ...detail, onClose: (reason) => closed.push(reason) };
      const intro = host.render(host.exports.Player, props);
      assert.equal(intro.props['data-phase'], 'intro');
      host.commit();
      elements(intro)
        .find((node) => node.type === 'video')
        .props.onEnded();
      const ending = host.render(host.exports.Player, props);
      assert.equal(ending.props['data-phase'], 'end');
      assert.deepEqual(closed, []);
      host.window.dispatchEvent({
        type: 'keydown',
        key: 'x',
        preventDefault() {},
        stopPropagation() {},
      });
      assert.deepEqual(closed, ['enter']);
      assert.deepEqual(state.settings, before);
    } finally {
      host.reset();
    }
  }
});

test('every built-in image previews its own real ending screen; only its separate use button saves selection', () => {
  const state = fixture(),
    before = structuredClone(state.settings),
    host = componentHost(state);
  const previews = [],
    saved = [];
  const props = {
    state,
    settings: state.settings,
    busy: false,
    preview: (...args) => previews.push(args),
    save: (patch) => saved.push(patch),
    imageInput: { current: null },
    EndTitleComponent: host.exports.EndTitle,
  };
  try {
    for (const logo of state.logos) {
      host.reset();
      const tree = host.render(host.exports.EndingSettings, props);
      const savedBeforePreview = saved.length;
      byLabel(tree, `预览内置结束画面 ${logo.name}`).props.onClick();
      const [clip, previewSettings, endOnly] = previews.at(-1);
      assert.equal(clip, null);
      assert.equal(endOnly, true);
      assert.equal(previewSettings.logoVariant, logo.id);
      assert.equal(previewSettings.endScreen, 'logo');
      assert.equal(saved.length, savedBeforePreview);
      host.reset();
      const closed = [],
        playerProps = {
          clip,
          settings: previewSettings,
          endOnly,
          onClose: (reason) => closed.push(reason),
        };
      const player = host.render(host.exports.Player, playerProps);
      assert.equal(player.props['data-phase'], 'end');
      player.props.onPointerDown({ target: { closest: () => null } });
      assert.deepEqual(closed, ['enter']);
      host.reset();
      const title = host.render(host.exports.EndTitle, { settings: previewSettings });
      assert.equal(
        elements(title).find((node) => node.type === 'img').props.src,
        `/dsh-boot-studio/logo/${logo.id}`,
      );
      assert.deepEqual(state.settings, before);
      if (logo.id !== state.settings.logoVariant) {
        host.reset();
        byLabel(
          host.render(host.exports.EndingSettings, props),
          `使用内置结束画面 ${logo.name}`,
        ).props.onClick();
        assert.deepEqual(plain(saved.at(-1)), { endScreen: 'logo', logoVariant: logo.id });
      } else {
        assert.equal(byLabel(tree, `使用内置结束画面 ${logo.name}`).props.disabled, true);
      }
    }
    assert.deepEqual(state.settings, before);
    assert.equal(host.requests.length, 0);
  } finally {
    host.reset();
  }
});

test('uploaded image preview does not save or delete, has a separate chooser, and retains removal confirmation', () => {
  const state = fixture({ endScreen: 'image', endImageId: 'i_first' }),
    before = structuredClone(state.settings);
  const host = componentHost(state),
    previews = [],
    saved = [],
    pending = [],
    removed = [];
  const props = {
    state,
    settings: state.settings,
    busy: false,
    preview: (...args) => previews.push(args),
    save: (patch) => saved.push(patch),
    imageInput: { current: null },
    setPendingImageDelete: (id) => pending.push(id),
    removeEndImage: (image) => removed.push(image),
    EndTitleComponent: host.exports.EndTitle,
  };
  try {
    const tree = host.render(host.exports.EndingSettings, props);
    for (const image of state.endImages) {
      byLabel(tree, `预览结束图片 ${image.name}`).props.onClick();
      const [clip, settings, endOnly] = previews.at(-1);
      assert.equal(clip, null);
      assert.equal(endOnly, true);
      assert.equal(settings.endImageId, image.id);
      assert.equal(settings.endScreen, 'image');
      assert.equal(saved.length, 0);
      assert.equal(removed.length, 0);
      host.reset();
      const closed = [],
        playerProps = { clip, settings, endOnly, onClose: (reason) => closed.push(reason) };
      assert.equal(host.render(host.exports.Player, playerProps).props['data-phase'], 'end');
      host.commit();
      host.window.dispatchEvent({
        type: 'keydown',
        key: 'a',
        preventDefault() {},
        stopPropagation() {},
      });
      assert.deepEqual(closed, ['enter']);
      host.reset();
      const title = host.render(host.exports.EndTitle, { settings });
      const displayedImage = elements(title).find((node) => node.type === 'img');
      assert.equal(displayedImage.props.src, `/dsh-boot-studio/end-image/${image.id}`);
      assert.equal(displayedImage.props.style.objectFit, 'cover');
    }
    byLabel(tree, '使用结束图片 My Holiday 原图').props.onClick();
    assert.deepEqual(plain(saved[0]), { endImageId: 'i_second', endScreen: 'image' });
    byLabel(tree, '移除结束图片 My Holiday 原图').props.onClick();
    assert.deepEqual(pending, ['i_second']);
    assert.deepEqual(removed, []);
    host.reset();
    const confirmation = host.render(host.exports.EndingSettings, {
      ...props,
      pendingImageDelete: 'i_second',
    });
    elements(confirmation)
      .find((node) => node.type === 'button' && text(node) === '确认移除')
      .props.onClick();
    assert.equal(removed[0], state.endImages[1]);
    assert.deepEqual(state.settings, before);
    assert.equal(host.requests.length, 0);
  } finally {
    host.reset();
  }
});

test('image preview/selection have distinct English accessible names, selected styling and busy guards', () => {
  const state = fixture(),
    host = componentHost(state, 'en');
  const props = {
    state,
    settings: state.settings,
    busy: false,
    preview() {},
    save() {},
    imageInput: { current: null },
    EndTitleComponent: host.exports.EndTitle,
  };
  try {
    const tree = host.render(host.exports.EndingSettings, props);
    assert.equal(
      byLabel(tree, 'Preview built-in ending screen Distant Mountains').props.disabled,
      false,
    );
    const selected = byLabel(tree, 'Use built-in ending screen Distant Mountains');
    assert.equal(selected.props.disabled, true);
    assert.equal(selected.props['aria-pressed'], true);
    assert.match(selected.props.className, /bs-selected/);
    assert.equal(
      text(byLabel(tree, 'Use built-in ending screen Black and Gold')),
      'Use this screen',
    );
    assert.equal(text(byLabel(tree, 'Use ending image My Holiday 原图')), 'Use this screen');
    assert.ok(byLabel(tree, 'Preview ending image My Holiday 原图'));
    host.reset();
    const busyTree = host.render(host.exports.EndingSettings, { ...props, busy: true });
    for (const node of elements(busyTree).filter((element) => element.type === 'button'))
      assert.equal(node.props.disabled, true);
  } finally {
    host.reset();
  }
});

test('individual video previews still stop after the video while normal startup honors stored flags', () => {
  const state = fixture(),
    host = componentHost(state);
  try {
    const panel = host.render(host.exports.SettingsPanel, {});
    const library = elements(panel).find((node) => node.type === host.exports.VideoLibrary);
    host.reset();
    const tree = host.render(host.exports.VideoLibrary, library.props);
    byLabel(tree, '预览 启').props.onClick();
    const detail = host.events.find((event) => event.type === 'dsh-boot-studio:play').detail;
    assert.equal(detail.clipOnly, true);
    assert.equal(detail.endOnly, false);
    host.reset();
    const closed = [],
      props = { ...detail, onClose: (reason) => closed.push(reason) };
    const player = host.render(host.exports.Player, props);
    assert.equal(player.props['data-phase'], 'intro');
    elements(player)
      .find((node) => node.type === 'video')
      .props.onEnded();
    assert.deepEqual(closed, ['complete']);
    assert.equal(host.exports.playbackStages(state.settings).video, false);
    assert.equal(host.exports.playbackStages(state.settings).end, false);
  } finally {
    host.reset();
  }
});
