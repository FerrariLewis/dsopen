import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

// Execute the real component and event handlers; only browser services and the
// React host are supplied here. No second implementation of reporting logic.
const built = await build({
  entryPoints: [fileURLToPath(new URL('../src/data-sharing-dialog.jsx', import.meta.url))],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  external: ['react'],
  plugins: [
    {
      name: 'dialog-host-services',
      setup(builder) {
        builder.onResolve(
          {
            filter:
              /^\.\/(?:enchant-theme|studio-styles|close-icon|i18n|api-client|telemetry-runtime)\.(?:js|jsx)$/,
          },
          (args) => ({ path: args.path, namespace: 'test-service' }),
        );
        builder.onLoad({ filter: /.*/, namespace: 'test-service' }, ({ path }) => ({
          contents: {
            './enchant-theme.jsx': 'export const useEnchantAppearance = () => ({});',
            './studio-styles.jsx': 'export const useStudioStyles = () => {};',
            './close-icon.jsx': 'export const CloseIcon = () => null;',
            './i18n.jsx': 'export const useI18n = () => (zh, en) => __language === "en" ? en : zh;',
            './api-client.js': 'export const api = (...args) => __request(...args);',
            './telemetry-runtime.js':
              'export const telemetryMetadata = () => ({ locale: "zh-CN", harnessVersion: "0.2.1" });',
          }[path],
        }));
      },
    },
  ],
});

const base = (extra = {}) => ({
  configured: true,
  enabled: false,
  reporting: false,
  lastResult: null,
  ...extra,
});
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
function nodes(node) {
  if (Array.isArray(node)) return node.flatMap(nodes);
  if (!node?.props) return [];
  return [node, ...nodes(node.props.children)];
}
function text(node) {
  if (Array.isArray(node)) return node.map(text).join('');
  return node?.props ? text(node.props.children) : String(node ?? '');
}
function button(tree, label) {
  const matches = nodes(tree).filter((node) => node.type === 'button' && text(node) === label);
  assert.equal(matches.length, 1, label);
  return matches[0];
}

function host(initial, language = 'zh') {
  const slots = [],
    requests = [],
    updates = [],
    timers = new Map();
  let cursor = 0,
    dirty = true,
    mounted = true,
    tree,
    now = 0,
    nextTimer = 0,
    effects = [];
  let handle = async () => initial;
  const React = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useRef(value) {
      const index = cursor++;
      slots[index] ??= { current: value };
      return slots[index];
    },
    useState(initialValue) {
      const index = cursor++;
      if (!(index in slots))
        slots[index] = typeof initialValue === 'function' ? initialValue() : initialValue;
      return [
        slots[index],
        (value) => {
          const next = typeof value === 'function' ? value(slots[index]) : value;
          if (!Object.is(next, slots[index])) {
            slots[index] = next;
            dirty = true;
          }
        },
      ];
    },
    useEffect(setup, deps) {
      const index = cursor++;
      const old = slots[index];
      if (!old || deps.some((value, i) => !Object.is(value, old.deps[i]))) {
        slots[index] = { deps, cleanup: old?.cleanup };
        effects.push(() => {
          slots[index].cleanup?.();
          slots[index].cleanup = setup();
        });
      }
    },
  };
  const module = { exports: {} };
  vm.runInNewContext(built.outputFiles[0].text, {
    module,
    exports: module.exports,
    require: (name) => {
      assert.equal(name, 'react');
      return React;
    },
    __language: language,
    __request: async (path, options = {}) => {
      requests.push({ path, ...options });
      return handle(path, options);
    },
    document: { activeElement: { isConnected: true, focus() {} } },
    AbortController,
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      timers.set(id, { at: now + delay, callback });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  });
  const props = { onClose() {}, onStatus: (value) => updates.push(value) };
  function render() {
    cursor = 0;
    effects = [];
    dirty = false;
    tree = module.exports.DataSharingDialog(props);
    for (const node of nodes(tree)) {
      if (!node.props.ref || node.props.ref.current) continue;
      node.props.ref.current = {
        open: false,
        showModal() {
          this.open = true;
        },
        close() {
          this.open = false;
        },
        focus() {},
      };
    }
    for (const setup of effects) setup();
  }
  async function flush() {
    for (let i = 0; i < 12; i++) {
      await Promise.resolve();
      if (dirty && mounted) render();
    }
    return tree;
  }
  render();
  return {
    requests,
    updates,
    timers,
    get tree() {
      return tree;
    },
    set handle(value) {
      handle = value;
    },
    flush,
    async advance(milliseconds) {
      const end = now + milliseconds;
      for (;;) {
        const entry = [...timers].sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!entry || entry[1].at > end) break;
        now = entry[1].at;
        timers.delete(entry[0]);
        // A timer can await a deliberately unresolved request; do not await it.
        void entry[1].callback();
        await flush();
      }
      now = end;
      return flush();
    },
    unmount() {
      mounted = false;
      for (const slot of slots) slot?.cleanup?.();
    },
  };
}

test('dialog links to the author-only dashboard without exposing the collector URL in either language', async () => {
  for (const language of ['zh', 'en']) {
    const app = host(base({ endpoint: 'https://private-collector.example.invalid' }), language);
    await app.flush();
    const link = nodes(app.tree).find((node) => node.type === 'a');
    assert.equal(link.props.href, 'https://dsopen-console-lewis.lewiszhouyichen.chatgpt.site');
    assert.equal(link.props.target, '_blank');
    assert.equal(link.props.rel, 'noopener noreferrer');
    assert.match(text(link), language === 'zh' ? /仅作者可访问/ : /author access only/);
    assert.match(text(app.tree), /OpenAI \/ ChatGPT/);
    assert.doesNotMatch(text(app.tree), /private-collector|接收服务：|Collector:/);
    assert.equal(app.timers.size, 0);
    app.unmount();
  }
});

test('grant is submitted once, then GET polling displays successful account identification and stops', async () => {
  const app = host(base());
  await app.flush();
  const checkbox = nodes(app.tree).find((node) => node.type === 'input');
  checkbox.props.onChange({ target: { checked: true } });
  await app.flush();
  const grant = deferred();
  app.handle = async (path, options) => {
    if (options.method === 'POST') return grant.promise;
    return base({
      enabled: true,
      lastSentAt: '2026-11-14T04:00:00Z',
      lastResult: { sent: true, accountIdentified: true },
    });
  };
  const start = button(app.tree, '同意并开启');
  const first = start.props.onClick();
  const second = start.props.onClick();
  assert.equal(app.requests.filter((request) => request.method === 'POST').length, 1);
  grant.resolve(base({ enabled: true, reporting: true }));
  await Promise.all([first, second]);
  await app.flush();
  assert.match(text(app.tree), /首次上报中/);
  assert.equal(button(app.tree, '重试上报').props.disabled, true);
  await app.advance(1000);
  assert.match(text(app.tree), /上报成功，已识别 DeepSeek 账户/);
  assert.doesNotMatch(text(app.tree), /首次上报中/);
  assert.equal(app.timers.size, 0);
  assert.equal(app.updates.at(-1).lastResult.accountIdentified, true);
  app.unmount();
});

test('retry posts public runtime metadata only once and displays installation-only success', async () => {
  const app = host(
    base({
      enabled: true,
      lastResult: {
        sent: false,
        failureCode: 'HTTP_502',
        httpStatus: 502,
        message: 'sk-secret-and-raw-error',
      },
    }),
  );
  await app.flush();
  assert.match(text(app.tree), /HTTP_502.*HTTP 502/);
  assert.doesNotMatch(text(app.tree), /sk-secret-and-raw-error/);
  const retry = deferred();
  app.handle = async (_path, options) =>
    options.method === 'POST'
      ? retry.promise
      : base({
          enabled: true,
          lastSentAt: '2026-11-14T04:00:00Z',
          lastResult: { sent: true, accountIdentified: false },
        });
  const retryButton = button(app.tree, '重试上报');
  const first = retryButton.props.onClick();
  const second = retryButton.props.onClick();
  await app.flush();
  const posts = app.requests.filter((request) => request.method === 'POST');
  assert.equal(posts.length, 1);
  assert.equal(posts[0].path, '/telemetry/retry');
  assert.deepEqual(JSON.parse(posts[0].body), { locale: 'zh-CN', harnessVersion: '0.2.1' });
  retry.resolve(base({ enabled: true, reporting: true, lastResult: { sent: false } }));
  await Promise.all([first, second]);
  await app.flush();
  await app.advance(1000);
  assert.match(text(app.tree), /上报成功，仅包含安装数据/);
  assert.equal(app.timers.size, 0);
  app.unmount();
});

test('closing aborts a pending poll, clears timers and discards its late response', async () => {
  const app = host(base({ enabled: true, reporting: true }));
  await app.flush();
  const pending = deferred();
  let signal;
  app.handle = (_path, options) => {
    signal = options.signal;
    return pending.promise;
  };
  await app.advance(1000);
  const before = app.updates.length;
  app.unmount();
  assert.equal(signal.aborted, true);
  assert.equal(app.timers.size, 0);
  pending.resolve(base({ enabled: true, lastResult: { sent: true } }));
  await app.flush();
  assert.equal(app.updates.length, before);
});

test('a late poll cannot reenable sharing after withdrawal', async () => {
  const app = host(base({ enabled: true, reporting: true }));
  await app.flush();
  const pending = deferred();
  app.handle = (_path, options) =>
    options.method === 'POST' ? base({ lastResult: { withdrawn: true } }) : pending.promise;
  await app.advance(1000);
  await button(app.tree, '停止共享并请求删除').props.onClick();
  await app.flush();
  pending.resolve(base({ enabled: true, lastResult: { sent: true, accountIdentified: true } }));
  await app.flush();
  assert.equal(app.updates.at(-1).enabled, false);
  assert.match(text(app.tree), /已停止共享，已确认删除/);
  assert.doesNotMatch(text(app.tree), /上报成功/);
  assert.equal(app.timers.size, 0);
  app.unmount();
});

test('polling expires after 90 seconds without automatically resubmitting data', async () => {
  const app = host(base({ enabled: true, reporting: true }));
  await app.flush();
  await app.advance(90000);
  assert.match(text(app.tree), /超过 90 秒/);
  assert.equal(app.timers.size, 0);
  const count = app.requests.length;
  await app.advance(3600000);
  assert.equal(app.requests.length, count);
  assert.equal(app.requests.filter((request) => request.method === 'POST').length, 0);
  app.unmount();
});

test('poll errors and unrecognized failure codes never display raw diagnostics', async () => {
  const app = host(
    base({
      enabled: true,
      lastResult: {
        sent: false,
        failureCode: 'DO_NOT_DISPLAY_PRIVATE_TOKEN',
        message: 'private upstream payload',
      },
    }),
    'en',
  );
  await app.flush();
  assert.match(text(app.tree), /latest report was not sent/);
  assert.doesNotMatch(text(app.tree), /DO_NOT_DISPLAY_PRIVATE_TOKEN|private upstream payload/);
  app.handle = async () => {
    throw Error('raw-sensitive-response');
  };
  await button(app.tree, 'Retry reporting').props.onClick();
  await app.flush();
  assert.match(text(app.tree), /operation did not complete/);
  assert.doesNotMatch(text(app.tree), /raw-sensitive-response/);
  app.unmount();
});
