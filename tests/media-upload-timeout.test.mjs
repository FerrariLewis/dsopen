import test from 'node:test';
import assert from 'node:assert/strict';
import { createMediaUpload } from '../src/media-upload.js';
import { API_TIMEOUTS } from '../src/constants.js';

async function pendingUpload(kind = 'video', onProgress) {
  const file = {
    name: kind === 'video' ? 'slow.mp4' : 'slow.png',
    size: kind === 'video' ? 209715200 : 20971520,
  };
  const xhr = {
    upload: {},
    aborts: 0,
    open() {},
    setRequestHeader() {},
    getResponseHeader: () => 'application/json',
    status: 201,
    responseText: JSON.stringify({ state: { saved: true } }),
    send(value) {
      this.file = value;
    },
    abort() {
      this.aborts++;
      this.onabort?.();
    },
  };
  const task = createMediaUpload(file, {
    kind,
    probe: async () => {},
    xhrFactory: () => xhr,
    onProgress,
  });
  // Validation and browser probing run before the real sendMedia code owns XHR.
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(xhr.file, file);
  const progress = (loaded) =>
    xhr.upload.onprogress?.({ lengthComputable: true, loaded, total: file.size });
  return {
    task,
    xhr,
    file,
    progress,
    idleMs: API_TIMEOUTS[kind === 'video' ? 'uploadVideo' : 'uploadImage'],
  };
}

test('a progressing 200 MB video may exceed the previous absolute timeout and complete', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const percentages = [];
  const { task, xhr, file, progress, idleMs } = await pendingUpload('video', (value) =>
    percentages.push(value),
  );
  assert.equal(xhr.timeout, undefined, 'XHR must not retain the old absolute deadline');
  for (let step = 1; step <= 10; step++) {
    t.mock.timers.tick(idleMs - 1000);
    progress((file.size * step) / 10);
  }
  xhr.upload.onload();
  xhr.onload();
  assert.deepEqual(await task.promise, { state: { saved: true } });
  assert.deepEqual(percentages, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  t.mock.timers.tick(60 * 60 * 1000);
  assert.equal(xhr.aborts, 0, 'success must clear both idle and total timers');
});

test('stalled uploads time out despite duplicate, backwards or invalid progress; synchronous abort cannot turn timeout into cancel', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const kind of ['video', 'image']) {
    const { task, xhr, progress, idleMs } = await pendingUpload(kind);
    const rejected = assert.rejects(task.promise, { code: 'BOOT_UPLOAD_TIMEOUT' });
    t.mock.timers.tick(idleMs - 1);
    progress(1);
    t.mock.timers.tick(idleMs - 1);
    progress(1);
    progress(0);
    progress(NaN);
    t.mock.timers.tick(1);
    await rejected;
    assert.equal(xhr.aborts, 1);
    assert.equal(xhr.onabort, null);
    assert.equal(xhr.upload.onprogress, null);
    assert.equal(xhr.upload.onload, null);
  }
});

test('user cancellation remains distinct and clears every upload timer', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { task, xhr } = await pendingUpload();
  const rejected = assert.rejects(task.promise, { code: 'BOOT_REQUEST_CANCELLED' });
  task.cancel();
  await rejected;
  t.mock.timers.tick(2 * 60 * 60 * 1000);
  assert.equal(xhr.aborts, 1);
});

test('waiting for the server response is bounded and late upload events cannot extend it', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { task, xhr, file, progress, idleMs } = await pendingUpload();
  const rejected = assert.rejects(task.promise, { code: 'BOOT_UPLOAD_TIMEOUT' });
  progress(file.size / 2);
  xhr.upload.onload();
  t.mock.timers.tick(idleMs - 1);
  progress(file.size);
  xhr.upload.onload();
  t.mock.timers.tick(1);
  await rejected;
  assert.equal(xhr.aborts, 1);
});

test('an hour total budget still stops endlessly increasing tiny progress', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { task, xhr, progress, idleMs } = await pendingUpload();
  const rejected = assert.rejects(task.promise, { code: 'BOOT_UPLOAD_TIMEOUT' });
  for (let elapsed = idleMs / 2; elapsed < 60 * 60 * 1000; elapsed += idleMs / 2) {
    t.mock.timers.tick(idleMs / 2);
    progress(elapsed);
  }
  t.mock.timers.tick(idleMs / 2);
  await rejected;
  assert.equal(xhr.aborts, 1);
});
