import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { createAPIClient, parseJSONResponse, clientError } from '../src/api-client.js';
import { handlePlayerKey } from '../src/player-input.js';
import { createMediaUpload, probeMediaFile, validateMediaFile } from '../src/media-upload.js';
import { localizeMessage, ERROR_CODES } from '../src/i18n.js';
import { bindHostLocale } from '../src/host-locale.js';
import {
  isAvailableUpdate,
  createStartupUpdateSession,
  bindHarnessServices,
  installVerifiedUpdate,
  canOpenHarnessPluginManager,
  openHarnessPluginManager,
  prepareAndInstallUpdate,
  retryUpdateAcknowledgements,
} from '../src/startup-update.js';

const json = (value, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

test('API accepts typed JSON and preserves request identity and explicit headers', async () => {
  let sent;
  const api = createAPIClient({
    fetchImpl: async (...args) => {
      sent = args;
      return json({ saved: true });
    },
  });
  assert.deepEqual(
    await api('/settings', { method: 'POST', body: '{}', headers: { 'x-custom': 'value' } }),
    { saved: true },
  );
  assert.equal(sent[0], '/dsh-boot-studio/settings');
  assert.equal(sent[1].headers['x-dsh-boot-studio'], '1');
  assert.equal(sent[1].headers['content-type'], 'application/json');
  assert.equal(sent[1].headers['x-custom'], 'value');
});

test('HTTP and HTML responses never expose raw markup or JSON syntax diagnostics', async () => {
  for (const status of [200, 404, 500]) {
    const api = createAPIClient({
      fetchImpl: async () =>
        new Response('<html>upstream failure</html>', {
          status,
          headers: { 'content-type': 'text/html' },
        }),
    });
    await assert.rejects(api('/state'), (error) => {
      assert.equal(error.code, status === 200 ? 'BOOT_RESPONSE_INVALID' : 'BOOT_HTTP_ERROR');
      assert.doesNotMatch(error.message, /<html>|Unexpected token|JSON/i);
      return true;
    });
  }
  assert.throws(() => parseJSONResponse('{broken', { contentType: 'application/json' }), {
    code: 'BOOT_RESPONSE_INVALID',
  });
});

test('API carries new and legacy host error codes without losing textual compatibility', async () => {
  for (const field of ['code', 'errorCode']) {
    const api = createAPIClient({
      fetchImpl: async () =>
        json({ [field]: 'BOOT_SETTING_VOLUME', error: 'diagnostic changed' }, 400),
    });
    await assert.rejects(api('/settings'), {
      code: 'BOOT_SETTING_VOLUME',
      message: 'diagnostic changed',
      status: 400,
    });
  }
  const api = createAPIClient({
    fetchImpl: async () => json({ error: '音量须在 0 到 1 之间。' }, 400),
  });
  await assert.rejects(api('/settings'), { message: '音量须在 0 到 1 之间。' });
});

test('API uses friendly and distinct network, deadline and external cancellation errors', async () => {
  const network = createAPIClient({
    fetchImpl: async () => {
      throw TypeError('Failed to fetch');
    },
  });
  await assert.rejects(network('/state'), { code: 'BOOT_NETWORK_ERROR' });
  const hanging = (_url, { signal }) =>
    new Promise((_, reject) => {
      if (signal.aborted) reject(signal.reason);
      else signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    });
  const deadline = createAPIClient({ fetchImpl: hanging, timeoutForPath: () => 5 });
  await assert.rejects(deadline('/state'), { code: 'BOOT_REQUEST_TIMEOUT' });
  const cancelled = createAPIClient({ fetchImpl: hanging });
  const controller = new AbortController();
  const request = cancelled('/state', { signal: controller.signal });
  controller.abort();
  await assert.rejects(request, { code: 'BOOT_REQUEST_CANCELLED' });
});

test('error codes localize independently of changing diagnostics, retaining old text fallback', () => {
  const dispose = bindHostLocale({
    getSnapshot: () => ({ active: 'en' }),
    subscribe: () => () => {},
  });
  try {
    assert.equal(
      localizeMessage(clientError('BOOT_SETTING_VOLUME', 'unrecognized wording')),
      'Volume must be between 0 and 1.',
    );
    assert.equal(
      localizeMessage({ errorCode: 'BOOT_UPLOAD_TIMEOUT', error: 'new wording' }),
      'The upload timed out. Please try again.',
    );
    assert.equal(
      localizeMessage(new Error('所选动画不存在，请刷新片库。')),
      'The selected animation is unavailable. Refresh the library.',
    );
    assert.equal(
      localizeMessage({ code: 'FUTURE_CODE', message: 'future diagnostic' }),
      'future diagnostic',
    );
  } finally {
    dispose();
  }
});

test('every supported error code has independent English copy regardless of diagnostic wording', () => {
  const dispose = bindHostLocale({
    getSnapshot: () => ({ active: 'en' }),
    subscribe: () => () => {},
  });
  try {
    assert.ok(ERROR_CODES.length > 0);
    for (const code of ERROR_CODES) {
      const first = localizeMessage({ code, message: '原来的诊断文案已经修改。' });
      const changed = localizeMessage({
        code,
        message: 'A completely different server diagnostic.',
      });
      const legacyField = localizeMessage({ errorCode: code, error: '另一个旧字段错误文本。' });
      assert.equal(typeof first, 'string', code);
      assert.ok(first.trim().length > 3, code);
      assert.doesNotMatch(first, /\p{Script=Han}/u, `${code} must have English copy`);
      assert.equal(first, changed, `${code} must not depend on diagnostic wording`);
      assert.equal(first, legacyField, `${code} must also support errorCode`);
    }
    assert.equal(
      localizeMessage({
        code: 'BOOT_SETTING_VOLUME',
        errorCode: 'BOOT_UPLOAD_TIMEOUT',
        message: 'changed',
      }),
      'Volume must be between 0 and 1.',
    );
  } finally {
    dispose();
  }
});

test('player allows every modifier shortcut and standalone modifier without swallowing it', () => {
  for (const patch of [
    { ctrlKey: true, key: 'r' },
    { metaKey: true, key: 'w' },
    { altKey: true, key: 'F4' },
    { shiftKey: true, key: 'Tab' },
    ...['Control', 'Meta', 'Alt', 'Shift', 'AltGraph'].map((key) => ({ key })),
  ]) {
    const calls = [];
    const event = {
      key: 'a',
      preventDefault: () => calls.push('prevent'),
      stopPropagation: () => calls.push('stop'),
      ...patch,
    };
    assert.equal(
      handlePlayerKey(event, () => calls.push('advance')),
      false,
    );
    assert.deepEqual(calls, []);
  }
});

test('player still skips on an ordinary key, ignores repeats and leaves IME composition alone', () => {
  const calls = [];
  const event = {
    key: ' ',
    preventDefault: () => calls.push('prevent'),
    stopPropagation: () => calls.push('stop'),
  };
  handlePlayerKey(event, () => calls.push('advance'));
  assert.deepEqual(calls, ['prevent', 'stop', 'advance']);
  calls.length = 0;
  handlePlayerKey({ ...event, repeat: true }, () => calls.push('advance'));
  assert.deepEqual(calls, ['prevent', 'stop']);
  calls.length = 0;
  handlePlayerKey({ ...event, isComposing: true }, () => calls.push('advance'));
  assert.deepEqual(calls, []);
});

test('media validation retains both format and size limits', () => {
  validateMediaFile({ name: 'clip.MP4', size: 10 }, 'video');
  validateMediaFile({ name: 'cover.webp', size: 10 }, 'image');
  assert.throws(() => validateMediaFile({ name: 'clip.exe', size: 10 }, 'video'), {
    code: 'BOOT_VIDEO_TYPE',
  });
  assert.throws(() => validateMediaFile({ name: 'cover.svg', size: 10 }, 'image'), {
    code: 'BOOT_IMAGE_TYPE',
  });
  assert.throws(() => validateMediaFile({ name: 'cover.png', size: 0 }, 'image'), {
    code: 'BOOT_IMAGE_TOO_LARGE',
  });
  assert.throws(() => validateMediaFile({ name: 'clip.mp4', size: 11 }, 'video', 10), {
    code: 'BOOT_VIDEO_TOO_LARGE',
  });
});

function fakeXHR({
  status = 201,
  type = 'application/json',
  body = JSON.stringify({ state: { uploaded: true } }),
  fail,
} = {}) {
  return {
    upload: {},
    status,
    responseText: body,
    headers: {},
    open(method, path) {
      this.method = method;
      this.path = path;
    },
    setRequestHeader(name, value) {
      this.headers[name] = value;
    },
    getResponseHeader() {
      return type;
    },
    send(file) {
      this.file = file;
      queueMicrotask(() => {
        this.upload.onprogress?.({ lengthComputable: true, loaded: 5, total: 10 });
        if (fail) this[fail]?.();
        else this.onload?.();
      });
    },
    abort() {
      this.onabort?.();
    },
  };
}

test('one media upload pipeline preserves video/image endpoints, progress, names and success payloads', async () => {
  for (const kind of ['image', 'video']) {
    const xhr = fakeXHR();
    const phases = [],
      progress = [];
    const file = {
      name: kind === 'image' ? '封面.png' : 'clip.mp4',
      type: kind === 'image' ? 'image/png' : 'video/mp4',
      size: 10,
    };
    const task = createMediaUpload(file, {
      kind,
      probe: async () => {},
      xhrFactory: () => xhr,
      onPhase: (value) => phases.push(value),
      onProgress: (value) => progress.push(value),
    });
    assert.deepEqual(await task.promise, { state: { uploaded: true } });
    assert.deepEqual(phases, ['probe', 'upload']);
    assert.deepEqual(progress, [0, 50]);
    assert.equal(
      xhr.path,
      kind === 'image' ? '/dsh-boot-studio/end-images' : '/dsh-boot-studio/upload',
    );
    assert.equal(xhr.headers['x-file-name'], encodeURIComponent(file.name));
    assert.equal(xhr.headers['x-dsh-boot-studio'], '1');
    assert.equal(xhr.file, file);
  }
});

test('upload parses typed errors safely and distinguishes timeout from connection interruption', async () => {
  const file = { name: 'clip.mp4', size: 10 };
  const options = { probe: async () => {} };
  await assert.rejects(
    createMediaUpload(file, {
      ...options,
      xhrFactory: () =>
        fakeXHR({ status: 502, type: 'text/html', body: '<html>bad gateway</html>' }),
    }).promise,
    { code: 'BOOT_HTTP_ERROR' },
  );
  await assert.rejects(
    createMediaUpload(file, {
      ...options,
      xhrFactory: () =>
        fakeXHR({
          status: 400,
          body: JSON.stringify({ code: 'BOOT_MEDIA_COUNT_LIMIT', error: 'limit reached' }),
        }),
    }).promise,
    { code: 'BOOT_MEDIA_COUNT_LIMIT' },
  );
  await assert.rejects(
    createMediaUpload(file, { ...options, xhrFactory: () => fakeXHR({ fail: 'ontimeout' }) })
      .promise,
    { code: 'BOOT_UPLOAD_TIMEOUT' },
  );
  await assert.rejects(
    createMediaUpload(file, { ...options, xhrFactory: () => fakeXHR({ fail: 'onerror' }) }).promise,
    { code: 'BOOT_UPLOAD_INTERRUPTED' },
  );
});

test('canceling media decoding prevents upload and cleans the object URL exactly once', async () => {
  let probe,
    revoked = 0,
    sends = 0;
  const controller = new AbortController();
  const promise = probeMediaFile({ name: 'image.png' }, 'image', {
    signal: controller.signal,
    ImageImpl: class {
      constructor() {
        probe = this;
      }
    },
    urlImpl: { createObjectURL: () => 'blob:test', revokeObjectURL: () => revoked++ },
  });
  controller.abort();
  await assert.rejects(promise, { code: 'BOOT_REQUEST_CANCELLED' });
  assert.equal(revoked, 1);
  assert.equal(probe.onload, null);
  assert.equal(probe.onerror, null);
  const task = createMediaUpload(
    { name: 'clip.mp4', size: 10 },
    {
      probe: async (_file, _kind, { signal }) => {
        if (signal.aborted) throw clientError('BOOT_REQUEST_CANCELLED', 'cancelled');
      },
      xhrFactory: () => {
        sends++;
        return fakeXHR();
      },
    },
  );
  task.cancel();
  await assert.rejects(task.promise, { code: 'BOOT_REQUEST_CANCELLED' });
  assert.equal(sends, 0);
});

test('browser decode rejection remains friendly and releases video resources', async () => {
  let probe,
    revoked = 0,
    loads = 0;
  const promise = probeMediaFile({}, 'video', {
    documentImpl: {
      createElement: () =>
        (probe = {
          load() {
            loads++;
          },
          removeAttribute() {},
        }),
    },
    urlImpl: { createObjectURL: () => 'blob:test', revokeObjectURL: () => revoked++ },
  });
  probe.onerror();
  await assert.rejects(promise, { code: 'BOOT_VIDEO_DECODE' });
  assert.equal(revoked, 1);
  assert.equal(loads, 2);
});

test('valid update comparison is shared and launch check stays once per renderer session', async () => {
  const status = {
    packageName: 'dsh-openup-lewis',
    currentVersion: '1.3.0',
    latestVersion: '1.3.1',
    available: true,
    channelReady: true,
  };
  assert.equal(isAvailableUpdate(status), true);
  assert.equal(isAvailableUpdate({ ...status, latestVersion: '1.03.1' }), false);
  assert.equal(isAvailableUpdate({ ...status, manifest: { version: '1.3.2' } }), false);
  assert.equal(isAvailableUpdate({ ...status, latestVersion: '999999999999999999999.0.0' }), false);
  let calls = 0;
  const session = createStartupUpdateSession();
  const request = async () => {
    calls++;
    return status;
  };
  await Promise.all([session.check(request), session.check(request)]);
  assert.equal(calls, 1);
  session.dismiss();
  assert.equal(session.getSnapshot().dismissed, true);
});

test('official injected Remote installer wins, and disposal restores legacy compatibility', async () => {
  let remoteCalls = 0,
    httpCalls = 0,
    opened;
  const dispose = bindHarnessServices({
    pluginManager: {
      async installBundle(spec, options) {
        remoteCalls++;
        assert.equal(spec, 'C:/cache/update.tgz');
        assert.equal(options.enabled, true);
        assert.equal(options.saveExact, true);
        assert.equal(typeof options.requestId, 'string');
        return { ok: true, value: { application: 'restart-required', version: '1.3.1' } };
      },
    },
    pluginNavigation: {
      openBundle: (name) => {
        opened = name;
      },
    },
  });
  try {
    const result = await installVerifiedUpdate('C:/cache/update.tgz', '1.3.1', {
      fetchImpl: async () => {
        httpCalls++;
        throw Error('must not call HTTP');
      },
    });
    assert.equal(result.application, 'restart-required');
    assert.equal(remoteCalls, 1);
    assert.equal(httpCalls, 0);
    assert.equal(canOpenHarnessPluginManager(), true);
    assert.equal(openHarnessPluginManager('dsh-openup-lewis'), true);
    assert.equal(opened, 'dsh-openup-lewis');
  } finally {
    dispose();
  }
  assert.equal(canOpenHarnessPluginManager(), false);
});

test('optional installer and navigation scopes release only their own service', async () => {
  const built = await build({
    stdin: {
      contents: `export { apply } from './src/client.jsx'; export { installVerifiedUpdate, canOpenHarnessPluginManager, openHarnessPluginManager } from './src/startup-update.js';`,
      resolveDir: fileURLToPath(new URL('..', import.meta.url)),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    external: ['react', 'react-dom', 'react-dom/client'],
  });
  const module = { exports: {} };
  vm.runInNewContext(built.outputFiles[0].text, {
    module,
    exports: module.exports,
    require: (name) => {
      if (['react', 'react-dom', 'react-dom/client'].includes(name)) return {};
      throw Error(`Unexpected client dependency: ${name}`);
    },
    AbortController,
    fetch,
    setTimeout,
    clearTimeout,
  });
  const client = module.exports;
  const injections = [];
  client.apply({
    inject: (dependencies, setup) => {
      injections.push({ dependencies, setup });
    },
  });
  const installerScope = injections.find((entry) =>
    entry.dependencies.includes('remote.pluginManager'),
  );
  const navigationScope = injections.find((entry) =>
    entry.dependencies.includes('pluginNavigation'),
  );
  let remoteCalls = 0,
    httpCalls = 0,
    opened;
  const ready = {
    remote: {
      pluginManager: {
        installBundle: async () => {
          remoteCalls++;
          return { ok: true, value: { application: 'applied' } };
        },
      },
    },
    pluginNavigation: {
      openBundle: (name) => {
        opened = name;
      },
    },
    effect: (setup) => setup(),
  };
  const stopInstaller = installerScope.setup(ready);
  const stopNavigation = navigationScope.setup(ready);
  try {
    await client.installVerifiedUpdate('/cache/update.tgz', '1.3.1');
    assert.equal(remoteCalls, 1);
    stopInstaller();
    await client.installVerifiedUpdate('/cache/update.tgz', '1.3.1', {
      fetchImpl: async (_url, options) => {
        httpCalls++;
        return json({
          type: 'server-response',
          rpcId: JSON.parse(options.body).rpcId,
          result: { ok: true, value: { application: 'applied' } },
        });
      },
    });
    assert.equal(remoteCalls, 1, 'the navigation scope must not retain a disposed installer');
    assert.equal(httpCalls, 1);
    assert.equal(client.canOpenHarnessPluginManager(), true);
    client.openHarnessPluginManager('dsh-openup-lewis');
    assert.equal(opened, 'dsh-openup-lewis');
  } finally {
    stopInstaller();
    stopNavigation();
  }
  assert.equal(client.canOpenHarnessPluginManager(), false);
});

test('legacy installation accepts only a matching authenticated success envelope', async () => {
  const result = await installVerifiedUpdate('/cache/update.tgz', '1.3.1', {
    fetchImpl: async (_url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(options.credentials, 'same-origin');
      assert.equal(body.method, 'pluginManager/installBundle');
      assert.equal(body.payload.args.spec, '/cache/update.tgz');
      return json({
        type: 'server-response',
        rpcId: body.rpcId,
        result: { ok: true, value: { application: 'applied', version: '1.3.1' } },
      });
    },
  });
  assert.equal(result.application, 'applied');
  await assert.rejects(
    installVerifiedUpdate('/cache/update.tgz', '1.3.1', {
      fetchImpl: async () =>
        json({ type: 'server-response', rpcId: 'other', result: { ok: true } }),
    }),
    { code: 'BOOT_HARNESS_INSTALL_RESPONSE', uncertain: true },
  );
});

test('unavailable, denied, HTML and uncertain installer responses point to Plugin Manager', async () => {
  for (const [status, code] of [
    [401, 'BOOT_HARNESS_INSTALL_PERMISSION'],
    [403, 'BOOT_HARNESS_INSTALL_PERMISSION'],
    [404, 'BOOT_HARNESS_INSTALL_UNAVAILABLE'],
    [500, 'BOOT_HARNESS_INSTALL_UNCERTAIN'],
  ]) {
    await assert.rejects(
      installVerifiedUpdate('/cache/update.tgz', '1.3.1', {
        fetchImpl: async () => new Response('not JSON', { status }),
      }),
      { code },
    );
  }
  await assert.rejects(
    installVerifiedUpdate('/cache/update.tgz', '1.3.1', {
      fetchImpl: async () =>
        new Response('<html>login</html>', { headers: { 'content-type': 'text/html' } }),
    }),
    { code: 'BOOT_HARNESS_INSTALL_RESPONSE', uncertain: true },
  );
  let httpCalls = 0;
  await assert.rejects(
    installVerifiedUpdate('/cache/update.tgz', '1.3.1', {
      pluginManager: { installBundle: () => new Promise(() => {}) },
      timeout: 5,
      fetchImpl: async () => {
        httpCalls++;
      },
    }),
    { code: 'BOOT_HARNESS_INSTALL_UNCERTAIN', uncertain: true },
  );
  assert.equal(httpCalls, 0);
});

function preparedStatus(version) {
  const sha256 = 'a'.repeat(64),
    packageName = 'dsh-openup-lewis';
  return {
    status: {
      packageName,
      currentVersion: '1.3.0',
      latestVersion: version,
      available: true,
      channelReady: true,
    },
    staged: {
      version,
      requiresRestart: true,
      sha256,
      spec: `/test/update-cache/${packageName}-${version}-${sha256}.tgz`,
    },
  };
}

test('successful install remains successful if cleanup acknowledgement fails, and can retry acknowledgement', async () => {
  const { status, staged } = preparedStatus('1.3.41');
  let installs = 0,
    failAck = true;
  const request = async (path) => {
    if (path === '/updates/prepare') return staged;
    if (path === '/updates/installed' && failAck)
      throw Error('old host or interrupted acknowledgment');
    return { version: staged.version, phase: 'ready', acknowledged: true };
  };
  const result = await prepareAndInstallUpdate(request, status, {
    install: async () => {
      installs++;
      return { application: 'applied' };
    },
  });
  assert.equal(result.version, status.latestVersion);
  assert.equal(result.cleanupPending, true);
  failAck = false;
  await retryUpdateAcknowledgements(request);
  assert.equal(result.cleanupPending, false);
  await prepareAndInstallUpdate(request, status, {
    install: async () => {
      installs++;
    },
  });
  assert.equal(installs, 1);
});

test('lost install responses cannot trigger a duplicate install from another prompt', async () => {
  const { status, staged } = preparedStatus('1.3.42');
  let installs = 0;
  const request = async (path) =>
    path === '/updates/prepare' ? staged : { version: staged.version, phase: 'ready' };
  const install = async () => {
    installs++;
    throw clientError('BOOT_HARNESS_INSTALL_UNCERTAIN', 'Check Plugin Manager', {
      uncertain: true,
    });
  };
  await assert.rejects(prepareAndInstallUpdate(request, status, { install }), {
    code: 'BOOT_HARNESS_INSTALL_UNCERTAIN',
  });
  await assert.rejects(prepareAndInstallUpdate(request, status, { install }), {
    code: 'BOOT_HARNESS_INSTALL_UNCERTAIN',
  });
  assert.equal(installs, 1);
});

test('coded transport exceptions and Remote failures never repeat an already-sent install', async () => {
  const cases = [
    {
      version: '1.3.43',
      answer: () => {
        throw Object.assign(Error('connection reset'), { code: 'ECONNRESET' });
      },
    },
    { version: '1.3.44', answer: () => ({ ok: false, error: { message: 'connection lost' } }) },
    { version: '1.3.45', answer: () => undefined },
    { version: '1.3.46', answer: () => ({ ok: true, value: {} }) },
  ];
  for (const { version, answer } of cases) {
    const { status, staged } = preparedStatus(version);
    let installs = 0;
    const dispose = bindHarnessServices({
      pluginManager: {
        installBundle: async () => {
          installs++;
          return answer();
        },
      },
    });
    try {
      const request = async (path) =>
        path === '/updates/prepare' ? staged : { version, phase: 'ready' };
      for (let attempt = 0; attempt < 2; attempt++) {
        await assert.rejects(prepareAndInstallUpdate(request, status), {
          code: 'BOOT_HARNESS_INSTALL_UNCERTAIN',
          uncertain: true,
        });
      }
      assert.equal(installs, 1, version);
    } finally {
      dispose();
    }
  }
});

test('an explicit failed application result remains a confirmed failure that can be retried', async () => {
  const { status, staged } = preparedStatus('1.3.47');
  let installs = 0;
  const dispose = bindHarnessServices({
    pluginManager: {
      installBundle: async () => {
        installs++;
        return {
          ok: true,
          value: { application: 'failed', error: { diagnostic: 'installation was rejected' } },
        };
      },
    },
  });
  try {
    const request = async (path) =>
      path === '/updates/prepare' ? staged : { version: staged.version, phase: 'ready' };
    for (let attempt = 0; attempt < 2; attempt++)
      await assert.rejects(prepareAndInstallUpdate(request, status), {
        code: 'BOOT_HARNESS_INSTALL_FAILED',
      });
    assert.equal(installs, 2);
  } finally {
    dispose();
  }
});
