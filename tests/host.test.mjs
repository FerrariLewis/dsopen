import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, request as httpRequest } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createHandler,
  BASE_PATH,
  DEFAULT_SETTINGS,
  MAX_CUSTOM_MEDIA_BYTES,
  MAX_CUSTOM_MEDIA_FILES,
} from '../src/host.js';

const video = (size = 32) => {
  const bytes = Buffer.alloc(size);
  bytes.writeUInt32BE(size, 0);
  bytes.write('ftyp', 4);
  bytes.write('isom', 8);
  return bytes;
};
const image = () => {
  const bytes = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
  bytes.write('IHDR', 12);
  bytes.writeUInt32BE(1, 16);
  bytes.writeUInt32BE(1, 20);
  return bytes;
};
const writeHeaders = { 'x-dsh-boot-studio': '1' };
const savedStore = (settings = {}, uploads = [], endImages = []) => ({
  version: 1,
  settings: { ...DEFAULT_SETTINGS, ...settings },
  uploads,
  endImages,
});

async function fixture(t, options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-host-test-'));
  const dataDir = join(root, 'data'),
    assetsDir = join(root, 'assets');
  for (const folder of [
    dataDir,
    assetsDir,
    join(assetsDir, 'end-covers'),
    join(assetsDir, 'author'),
  ])
    await mkdir(folder, { recursive: true });
  await writeFile(join(assetsDir, 'deepseek-brand-intro.mp4'), video());
  await writeFile(join(assetsDir, 'end-covers', 'silver.png'), image());
  await writeFile(join(assetsDir, 'author', 'author.jpg'), Buffer.from([255, 216, 255, 217]));
  const updateService = options.updateService ?? {
    identity: async () => ({ version: '1.3.0' }),
    check: async () => ({ available: false }),
    prepare: async (version) => ({ version }),
  };
  const handlerOptions = { dataDir, assetsDir, ...options, updateService };
  let handler = createHandler(handlerOptions);
  const handlers = [handler];
  const server = createServer((req, res) => handler(req, res));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  t.after(async () => {
    for (const active of handlers) active.dispose?.();
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await rm(root, { recursive: true, force: true });
  });
  const request = (path, { method = 'GET', headers = {}, body, chunked = false } = {}) =>
    new Promise((resolve, reject) => {
      const req = httpRequest(
        {
          hostname: '127.0.0.1',
          port,
          path: path.startsWith(BASE_PATH) ? path : BASE_PATH + path,
          method,
          headers: {
            ...headers,
            ...(chunked
              ? { 'transfer-encoding': 'chunked' }
              : body === undefined
                ? {}
                : { 'content-length': Buffer.byteLength(body) }),
          },
          agent: false,
        },
        (res) => {
          const parts = [];
          res.on('data', (part) => parts.push(part));
          res.on('end', () =>
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: Buffer.concat(parts),
              json() {
                return JSON.parse(this.body.toString());
              },
            }),
          );
          res.on('error', reject);
        },
      );
      req.on('error', reject);
      if (chunked && body) {
        req.write(body.subarray(0, 12));
        req.end(body.subarray(12));
      } else req.end(body);
    });
  const postJSON = (path, body, headers = {}) =>
    request(path, {
      method: 'POST',
      headers: { ...writeHeaders, 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
  const upload = (
    body = video(),
    filename = 'my-video.mp4',
    imageUpload = false,
    chunked = false,
  ) =>
    request(imageUpload ? '/end-images' : '/upload', {
      method: 'POST',
      headers: { ...writeHeaders, 'x-file-name': encodeURIComponent(filename) },
      body,
      chunked,
    });
  return {
    root,
    dataDir,
    assetsDir,
    request,
    postJSON,
    upload,
    reload() {
      handler = createHandler(handlerOptions);
      handlers.push(handler);
    },
  };
}

test('settings, stage switches, selected uploads and built-in media survive save/reload', async (t) => {
  const f = await fixture(t);
  const initial = (await f.request('/state')).json();
  assert.deepEqual(initial.settings, DEFAULT_SETTINGS);
  assert.deepEqual(
    initial.clips.map((clip) => clip.id),
    ['brand', 'startup-screen'],
  );
  assert.equal(initial.maxCustomMediaBytes, MAX_CUSTOM_MEDIA_BYTES);
  assert.equal(initial.maxCustomMediaFiles, MAX_CUSTOM_MEDIA_FILES);
  assert.deepEqual(initial.storage, { bytes: 0, files: 0 });
  let changed = await f.postJSON('/settings', { enabled: false });
  assert.equal(changed.status, 200);
  assert.equal(changed.json().settings.videoEnabled, false);
  assert.equal(changed.json().settings.endEnabled, false);
  changed = await f.postJSON('/settings', {
    videoEnabled: true,
    endEnabled: false,
    volume: 0.3,
    showShortcut: true,
  });
  assert.equal(changed.json().settings.enabled, true);
  assert.equal(changed.json().settings.endEnabled, false);
  const imported = await f.upload();
  assert.equal(imported.status, 201);
  const id = imported.json().clip.id;
  f.reload();
  const state = (await f.request('/launch')).json();
  assert.equal(state.clip.id, id);
  assert.equal(state.settings.volume, 0.3);
  assert.equal(state.settings.showShortcut, true);
  assert.equal((await f.request('/media/' + id)).body.equals(video()), true);
  assert.equal((await f.request('/author-image')).status, 200);
  assert.equal((await f.request('/logo/silver')).status, 200);
});

test('settings validation rejects malformed changes without mutating saved preferences', async (t) => {
  const f = await fixture(t);
  const cases = [
    [[], 'BOOT_SETTINGS_OBJECT'],
    [{ volume: 2 }, 'BOOT_SETTING_VOLUME'],
    [{ sound: 'yes' }, 'BOOT_SETTING_BOOLEAN'],
    [{ selectedId: 'missing' }, 'BOOT_SETTING_VIDEO_MISSING'],
    [{ endScreen: 'other' }, 'BOOT_SETTING_END_SCREEN'],
    [{ endImageId: 'missing' }, 'BOOT_SETTING_IMAGE_MISSING'],
    [{ endScreen: 'image' }, 'BOOT_SETTING_IMAGE_REQUIRED'],
    [{ logoVariant: 'missing' }, 'BOOT_SETTING_LOGO'],
    [{ endFit: 'fill' }, 'BOOT_SETTING_END_FIT'],
    [{ duration: 1 }, 'BOOT_SETTING_RETIRED_DURATION'],
    [{ fit: 'cover' }, 'BOOT_SETTING_RETIRED_FIT'],
    [{ updatePromptBlur: 10 }, 'BOOT_SETTING_RETIRED_UPDATE_APPEARANCE'],
    [{ unsupported: true }, 'BOOT_SETTING_UNSUPPORTED'],
  ];
  for (const [patch, code] of cases) {
    const response = await f.postJSON('/settings', patch);
    assert.equal(response.status, 400, JSON.stringify(patch));
    assert.equal(response.json().code, code);
    assert.equal(typeof response.json().error, 'string');
  }
  const malformed = await f.request('/settings', {
    method: 'POST',
    headers: { ...writeHeaders, 'content-type': 'application/json' },
    body: '{',
  });
  assert.deepEqual(malformed.json(), { error: 'JSON 格式不正确。', code: 'BOOT_JSON_INVALID' });
  const huge = await f.postJSON('/settings', { unknown: 'x'.repeat(8192) });
  assert.equal(huge.status, 413);
  assert.equal(huge.json().code, 'BOOT_SETTINGS_TOO_LARGE');
  const state = (await f.request('/state')).json();
  assert.deepEqual(state.settings, DEFAULT_SETTINGS);
});

test('initialization retries after an invalid settings file is repaired', async (t) => {
  const f = await fixture(t);
  const settingsFile = join(f.dataDir, 'settings.json');
  await writeFile(settingsFile, '{ broken');
  const failed = await f.request('/state');
  assert.equal(failed.status, 500);
  assert.equal(failed.json().code, 'BOOT_SETTINGS_READ');
  const recovered = savedStore({
    volume: 0.2,
    duration: 99,
    fit: 'contain',
    updatePromptBlur: 9,
    autoRestart: true,
  });
  await writeFile(settingsFile, JSON.stringify(recovered));
  const response = await f.request('/state');
  assert.equal(response.status, 200);
  assert.equal(response.json().settings.volume, 0.2);
  assert.equal(Object.hasOwn(response.json().settings, 'duration'), false);
  assert.equal((await f.postJSON('/settings', { sound: true })).status, 200);
  assert.equal(JSON.parse(await readFile(settingsFile, 'utf8')).settings.volume, 0.2);
});

test('single Range, suffix, HEAD, ETag and If-Range keep their existing semantics; multi-Range returns full 200', async (t) => {
  const f = await fixture(t);
  const full = await f.request('/media/brand');
  assert.equal(full.status, 200);
  assert.equal(full.headers['accept-ranges'], 'bytes');
  const partial = await f.request('/media/brand', { headers: { range: 'bytes=4-7' } });
  assert.equal(partial.status, 206);
  assert.equal(partial.headers['content-range'], 'bytes 4-7/32');
  assert.equal(partial.body.toString(), 'ftyp');
  const suffix = await f.request('/media/brand', { headers: { range: 'bytes=-4' } });
  assert.equal(suffix.status, 206);
  assert.equal(suffix.body.length, 4);
  const head = await f.request('/media/brand', { method: 'HEAD', headers: { range: 'bytes=4-7' } });
  assert.equal(head.status, 206);
  assert.equal(head.headers['content-length'], '4');
  assert.equal(head.body.length, 0);
  const invalid = await f.request('/media/brand', { headers: { range: 'bytes=999-' } });
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers['content-range'], 'bytes */32');
  const multiple = await f.request('/media/brand', { headers: { range: 'bytes=0-2,5-8' } });
  assert.equal(multiple.status, 200);
  assert.equal(multiple.body.equals(video()), true);
  assert.equal(multiple.headers['content-range'], undefined);
  assert.equal(
    (await f.request('/media/brand', { headers: { 'if-none-match': full.headers.etag } })).status,
    304,
  );
  assert.equal(
    (await f.request('/media/brand', { headers: { range: 'bytes=4-7', 'if-range': 'stale-tag' } }))
      .status,
    200,
  );
  assert.equal(
    (
      await f.request('/media/brand', {
        headers: { range: 'bytes=4-7', 'if-range': full.headers.etag },
      })
    ).status,
    206,
  );
});

test('uploads validate content, enforce per-file limits, and discard invalid/chunked partial files', async (t) => {
  const f = await fixture(t, { maxUploadBytes: 32, maxImageUploadBytes: 24 });
  for (const [bytes, filename, asImage, code] of [
    [Buffer.alloc(12), 'fake.mp4', false, 'BOOT_VIDEO_INVALID'],
    [image(), 'bad.svg', true, 'BOOT_IMAGE_TYPE'],
    [video(33), 'large.mp4', false, 'BOOT_VIDEO_TOO_LARGE'],
    [Buffer.alloc(25), 'large.png', true, 'BOOT_IMAGE_TOO_LARGE'],
  ]) {
    const response = await f.upload(bytes, filename, asImage);
    assert.equal(response.json().code, code);
  }
  const chunked = await f.upload(video(40), 'large.mp4', false, true);
  assert.equal(chunked.status, 413);
  assert.equal(chunked.json().code, 'BOOT_BODY_TOO_LARGE');
  assert.deepEqual(await readdir(join(f.dataDir, 'videos')), []);
  assert.deepEqual(await readdir(join(f.dataDir, 'images')), []);
  assert.deepEqual((await f.request('/state')).json().storage, { bytes: 0, files: 0 });
});

test('video and image uploads share a count quota, deletion releases capacity and preserves other preferences', async (t) => {
  const f = await fixture(t, { maxCustomMediaFiles: 2 });
  await f.postJSON('/settings', { sound: true, volume: 0.4 });
  const clip = (await f.upload()).json().clip;
  const pictureResponse = await f.upload(image(), 'my-cover.png', true);
  assert.equal(pictureResponse.status, 201);
  const picture = pictureResponse.json().image;
  assert.equal(pictureResponse.json().state.settings.endImageId, picture.id);
  const rejected = await f.upload();
  assert.equal(rejected.status, 413);
  assert.equal(rejected.json().code, 'BOOT_MEDIA_COUNT_LIMIT');
  const removed = await f.request('/end-images/' + picture.id, {
    method: 'DELETE',
    headers: writeHeaders,
  });
  assert.equal(removed.status, 200);
  assert.equal(removed.json().settings.endScreen, 'logo');
  assert.equal(removed.json().settings.endImageId, null);
  assert.equal(removed.json().settings.sound, true);
  assert.deepEqual(removed.json().storage, { bytes: 32, files: 1 });
  assert.equal((await f.upload(image(), 'replacement.png', true)).status, 201);
  const deleted = await f.request('/clips/' + clip.id, { method: 'DELETE', headers: writeHeaders });
  assert.equal(deleted.json().settings.selectedId, 'brand');
  assert.equal(deleted.json().settings.volume, 0.4);
  assert.equal((await f.request('/media/' + clip.id)).status, 404);
});

test('byte quota covers chunked uploads and concurrent uploads without committing partial files', async (t) => {
  const f = await fixture(t, { maxCustomMediaBytes: 48 });
  const responses = await Promise.all([f.upload(), f.upload()]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [201, 413]);
  assert.equal(
    responses.find((response) => response.status === 413).json().code,
    'BOOT_MEDIA_STORAGE_LIMIT',
  );
  const chunked = await f.upload(video(24), 'another.mp4', false, true);
  assert.equal(chunked.status, 413);
  assert.equal(chunked.json().code, 'BOOT_MEDIA_STORAGE_LIMIT');
  assert.equal((await readdir(join(f.dataDir, 'videos'))).length, 1);
  assert.deepEqual((await f.request('/state')).json().storage, { bytes: 32, files: 1 });
  const smaller = await f.upload(video(16));
  assert.equal(smaller.status, 201);
  assert.deepEqual(smaller.json().state.storage, { bytes: 48, files: 2 });
});

test('existing over-quota libraries remain playable and deletable and orphan files also consume quota', async (t) => {
  const f = await fixture(t, { maxCustomMediaBytes: 30, maxCustomMediaFiles: 1 });
  const ids = ['u_11111111-1111-1111-1111-111111111111', 'u_22222222-2222-2222-2222-222222222222'];
  await mkdir(join(f.dataDir, 'videos'));
  for (const id of ids) await writeFile(join(f.dataDir, 'videos', id + '.mp4'), video());
  await writeFile(
    join(f.dataDir, 'settings.json'),
    JSON.stringify(
      savedStore(
        { selectedId: ids[0] },
        ids.map((id) => ({ id, ext: '.mp4', name: id })),
      ),
    ),
  );
  const initial = await f.request('/state');
  assert.equal(initial.status, 200);
  assert.equal(initial.json().clips.filter((clip) => clip.source === 'upload').length, 2);
  assert.deepEqual(initial.json().storage, { bytes: 64, files: 2 });
  assert.equal((await f.request('/media/' + ids[0])).status, 200);
  assert.equal((await f.upload(video(16))).status, 413);
  for (const id of ids)
    assert.equal(
      (await f.request('/clips/' + id, { method: 'DELETE', headers: writeHeaders })).status,
      200,
    );
  assert.equal((await f.upload(video(16))).status, 201);
  await writeFile(join(f.dataDir, 'videos', 'orphan.part'), Buffer.alloc(20));
  assert.deepEqual((await f.request('/state')).json().storage, { bytes: 36, files: 2 });
  assert.equal((await f.upload(video(16))).status, 413);
  assert.equal((await readFile(join(f.dataDir, 'videos', 'orphan.part'))).length, 20);
});

test('reset removes custom media and interrupted reset files, while preserving packaged assets and update cache', async (t) => {
  const f = await fixture(t);
  await f.upload();
  await f.upload(image(), 'cover.png', true);
  await f.postJSON('/settings', { volume: 0.1, showShortcut: true });
  await writeFile(join(f.dataDir, 'videos', 'orphan.part'), 'old upload');
  await mkdir(join(f.dataDir, '.reset-trash', 'old-reset', 'nested'), { recursive: true });
  await writeFile(join(f.dataDir, '.reset-trash', 'old-reset', 'nested', 'old.bin'), 'old');
  await mkdir(join(f.dataDir, 'update-cache'));
  await writeFile(join(f.dataDir, 'update-cache', 'keep.tgz'), 'not custom media');
  const rejected = await f.postJSON('/reset', {});
  assert.equal(rejected.json().code, 'BOOT_RESET_CONFIRM');
  assert.equal((await f.request('/state')).json().endImages.length, 1);
  const reset = await f.postJSON('/reset', { confirm: 'reset-all-custom-data' });
  assert.equal(reset.status, 200);
  assert.deepEqual(reset.json().settings, DEFAULT_SETTINGS);
  assert.deepEqual(reset.json().storage, { bytes: 0, files: 0 });
  assert.equal(reset.json().endImages.length, 0);
  assert.equal(reset.json().clips.filter((clip) => clip.source === 'upload').length, 0);
  assert.deepEqual(await readdir(join(f.dataDir, '.reset-trash')), []);
  assert.equal(
    (await readFile(join(f.assetsDir, 'deepseek-brand-intro.mp4'))).equals(video()),
    true,
  );
  assert.equal(
    await readFile(join(f.dataDir, 'update-cache', 'keep.tgz'), 'utf8'),
    'not custom media',
  );
});

test('write protections and untrusted IDs prevent cross-site modification or path access', async (t) => {
  const f = await fixture(t);
  const missingMarker = await f.request('/settings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  });
  assert.equal(missingMarker.status, 403);
  assert.equal(missingMarker.json().code, 'BOOT_WRITE_IDENTIFIER');
  const crossSite = await f.postJSON(
    '/settings',
    { volume: 0.1 },
    { origin: 'https://other.example' },
  );
  assert.equal(crossSite.status, 403);
  assert.equal(crossSite.json().code, 'BOOT_WRITE_CROSS_SITE');
  assert.equal(
    (await f.postJSON('/settings', {}, { origin: 'null' })).json().code,
    'BOOT_WRITE_ORIGIN_INVALID',
  );
  assert.equal((await f.postJSON('/settings', {}, { 'sec-fetch-site': 'cross-site' })).status, 403);
  const imported = await f.upload(video(), '../../outside.mp4');
  assert.equal(imported.status, 201);
  assert.equal(imported.json().clip.name, 'outside');
  assert.equal((await f.request('/media/%2e%2e%2fsettings.json')).status, 404);
  assert.equal(
    (await f.request('/clips/brand', { method: 'DELETE', headers: writeHeaders })).json().code,
    'BOOT_VIDEO_DELETE_ONLY',
  );
  assert.equal(
    (
      await f.request('/end-images/%2e%2e%2fsettings.json', {
        method: 'DELETE',
        headers: writeHeaders,
      })
    ).status,
    400,
  );
  assert.equal((await f.request('/media/brand')).body.equals(video()), true);
});

test('reset refuses unsafe quarantine links before touching preferences or external data', async (t) => {
  const f = await fixture(t);
  await f.postJSON('/settings', { volume: 0.2 });
  const outside = join(f.root, 'outside');
  await mkdir(outside);
  await writeFile(join(outside, 'keep.txt'), 'safe');
  try {
    await symlink(
      outside,
      join(f.dataDir, '.reset-trash'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
  } catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
      t.skip('directory links are not permitted on this host');
      return;
    }
    throw error;
  }
  const response = await f.postJSON('/reset', { confirm: 'reset-all-custom-data' });
  assert.equal(response.status, 500);
  assert.equal(response.json().code, 'BOOT_RESET_QUARANTINE');
  assert.equal((await f.request('/state')).json().settings.volume, 0.2);
  assert.equal(await readFile(join(outside, 'keep.txt'), 'utf8'), 'safe');
});

test('pending reset files consume storage and reset removes nested links without following their targets', async (t) => {
  const f = await fixture(t, { maxCustomMediaBytes: 48 });
  await f.request('/state');
  await mkdir(join(f.dataDir, '.reset-trash', 'old-reset'), { recursive: true });
  await writeFile(join(f.dataDir, '.reset-trash', 'old-reset', 'locked.mp4'), video());
  assert.deepEqual((await f.request('/state')).json().storage, { bytes: 32, files: 1 });
  assert.equal((await f.upload()).json().code, 'BOOT_MEDIA_STORAGE_LIMIT');
  const outside = join(f.root, 'outside');
  await mkdir(outside);
  await writeFile(join(outside, 'keep.txt'), 'safe');
  try {
    await symlink(
      outside,
      join(f.dataDir, 'videos', 'linked'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
  } catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
      t.skip('directory links are not permitted on this host');
      return;
    }
    throw error;
  }
  assert.deepEqual((await f.request('/state')).json().storage, { bytes: 32, files: 1 });
  const response = await f.postJSON('/reset', { confirm: 'reset-all-custom-data' });
  assert.equal(response.status, 200);
  assert.deepEqual(response.json().storage, { bytes: 0, files: 0 });
  assert.equal(await readFile(join(outside, 'keep.txt'), 'utf8'), 'safe');
});

test('update cache cleanup is non-blocking and installation acknowledgements require valid write requests', async (t) => {
  let cleanupCalled = 0,
    installedArgs;
  const f = await fixture(t, {
    updateService: {
      cleanup: async () => {
        cleanupCalled++;
        throw Error('locked archive');
      },
      identity: async () => ({ version: '1.3.0' }),
      installed: async (...args) => {
        installedArgs = args;
        return { removed: ['old.tgz'], pending: [], kept: [] };
      },
    },
  });
  assert.equal((await f.request('/state')).status, 200);
  assert.equal(cleanupCalled, 1);
  const noMarker = await f.request('/updates/installed', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ version: '1.3.1', spec: 'new.tgz' }),
  });
  assert.equal(noMarker.status, 403);
  assert.equal(
    (await f.postJSON('/updates/installed', null)).json().code,
    'BOOT_UPDATE_INSTALL_ACK_INVALID',
  );
  assert.equal(installedArgs, undefined);
  const installed = await f.postJSON('/updates/installed', { version: '1.3.1', spec: 'new.tgz' });
  assert.equal(installed.status, 200);
  assert.deepEqual(installedArgs, ['1.3.1', 'new.tgz']);
  assert.deepEqual(installed.json().removed, ['old.tgz']);
});

test('update service errors retain stable codes and old human-readable error text', async (t) => {
  const f = await fixture(t, {
    updateService: {
      prepare: async () => {
        throw Object.assign(Error('包校验失败。'), { code: 'BOOT_UPDATE_INVALID' });
      },
      installed: async () => {
        throw Object.assign(Error('更新已安装，但确认信息无效。'), {
          code: 'BOOT_UPDATE_INSTALL_ACK_INVALID',
        });
      },
    },
  });
  assert.deepEqual((await f.postJSON('/updates/prepare', null)).json(), {
    error: '请先检查并选择更新版本。',
    code: 'BOOT_UPDATE_VERSION_REQUIRED',
  });
  assert.deepEqual((await f.postJSON('/updates/prepare', { version: '1.3.1' })).json(), {
    error: '包校验失败。',
    code: 'BOOT_UPDATE_INVALID',
  });
  assert.deepEqual(
    (await f.postJSON('/updates/installed', { version: '1.3.1', spec: 'new.tgz' })).json(),
    { error: '更新已安装，但确认信息无效。', code: 'BOOT_UPDATE_INSTALL_ACK_INVALID' },
  );
});
