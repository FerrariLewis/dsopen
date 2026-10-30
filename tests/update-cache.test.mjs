import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  unlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createUpdateCache } from '../src/update-cache.js';

const oldArchive = 'dsh-openup-lewis-1.2.10-' + 'a'.repeat(64) + '.tgz';
const olderArchive = 'dsh-boot-studio-1.2.9-' + 'b'.repeat(64) + '.tgz';
const currentArchive = 'dsh-openup-lewis-1.3.1-' + 'c'.repeat(64) + '.tgz';
const part = '00000000-0000-4000-8000-000000000000.part';

async function fixture(t, options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'lewis-cache-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dataDir = join(root, 'boot-studio'),
    cacheDir = join(dataDir, 'update-cache');
  await mkdir(cacheDir, { recursive: true });
  const cache = createUpdateCache({ dataDir, packageFile: join(root, 'package.json'), ...options });
  t.after(() => cache.dispose());
  return { root, dataDir, cacheDir, cache };
}

function timers(t) {
  const scheduled = [];
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const timer = {
      callback,
      delay,
      unref() {
        this.unreferenced = true;
      },
    };
    scheduled.push(timer);
    return timer;
  });
  t.mock.method(globalThis, 'clearTimeout', (timer) => {
    if (timer) timer.cleared = true;
  });
  const active = () => scheduled.filter((timer) => !timer.cleared && !timer.fired);
  return {
    scheduled,
    active,
    async fire() {
      const [timer] = active();
      assert.ok(timer, 'a retry must be scheduled');
      timer.fired = true;
      await timer.callback();
    },
  };
}

test('profile-only pending archives await an event recheck instead of polling forever', async (t) => {
  const clock = timers(t);
  const { root, cache, cacheDir } = await fixture(t);
  await writeFile(join(cacheDir, oldArchive), 'old archive');
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  const manifest = join(profile, 'package.json');
  await writeFile(manifest, JSON.stringify({ dependency: `file:${oldArchive}` }));
  const report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(report.pending[0].reason, 'profile-reference');
  assert.equal(clock.active().length, 0);
  await writeFile(manifest, '{}');
  assert.deepEqual((await cache.cleanup({ installedVersion: '1.3.1' })).removed, [oldArchive]);
  assert.equal(clock.active().length, 0);
});

test('temporary file locks back off only on automatic retries and reset after recovery', async (t) => {
  const clock = timers(t);
  let locked = true;
  const { cache, cacheDir } = await fixture(t, {
    fs: {
      unlink: async (path) => {
        if (path.endsWith(oldArchive) && locked)
          throw Object.assign(Error('busy'), { code: 'EBUSY' });
        return unlink(path);
      },
    },
  });
  await writeFile(join(cacheDir, oldArchive), 'old');
  await cache.cleanup({ installedVersion: '1.3.1' });
  for (const minutes of [1, 2, 4, 8, 16, 32, 60, 60]) {
    const [timer] = clock.active();
    assert.equal(timer.delay, minutes * 60_000);
    assert.equal(timer.unreferenced, true);
    await cache.cleanup({ installedVersion: '1.3.1' });
    assert.equal(clock.active()[0], timer, 'manual checks preserve the existing retry deadline');
    await clock.fire();
  }
  locked = false;
  await clock.fire();
  assert.equal(clock.active().length, 0);
  await assert.rejects(lstat(join(cacheDir, oldArchive)), { code: 'ENOENT' });
  locked = true;
  await writeFile(join(cacheDir, oldArchive), 'another old installer');
  await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(clock.active()[0].delay, 60_000);
  cache.dispose();
  assert.equal(clock.active().length, 0);
});

test('new pending work and successful deletion reset the automatic retry backoff', async (t) => {
  const clock = timers(t);
  const { cache, cacheDir } = await fixture(t, {
    fs: {
      unlink: async (path) => {
        if (path.endsWith(oldArchive)) throw Object.assign(Error('busy'), { code: 'EBUSY' });
        return unlink(path);
      },
    },
  });
  await writeFile(join(cacheDir, oldArchive), 'old');
  await cache.cleanup({ installedVersion: '1.3.1' });
  await clock.fire();
  await clock.fire();
  assert.equal(clock.active()[0].delay, 4 * 60_000);
  await writeFile(join(cacheDir, part), 'new orphan download');
  await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(clock.active()[0].delay, 60_000, 'a new pending item starts promptly');
  await clock.fire();
  assert.equal(clock.active()[0].delay, 2 * 60_000);
  await writeFile(join(cacheDir, olderArchive), 'can be removed');
  const report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.removed, [olderArchive]);
  assert.equal(clock.active()[0].delay, 60_000, 'progress resets the next retry');
});

test('a retry firing during a manual scan remains serialized and advances backoff once', async (t) => {
  const clock = timers(t);
  let blockNext = false,
    entered,
    release;
  const started = new Promise((resolve) => {
    entered = resolve;
  });
  const blocked = new Promise((resolve) => {
    release = resolve;
  });
  const { cache, cacheDir } = await fixture(t, {
    fs: {
      unlink: async (path) => {
        if (path.endsWith(oldArchive)) {
          if (blockNext) {
            blockNext = false;
            entered();
            await blocked;
          }
          throw Object.assign(Error('busy'), { code: 'EBUSY' });
        }
        return unlink(path);
      },
    },
  });
  await writeFile(join(cacheDir, oldArchive), 'old');
  await cache.cleanup({ installedVersion: '1.3.1' });
  blockNext = true;
  const manual = cache.cleanup({ installedVersion: '1.3.1' });
  await started;
  const automatic = clock.fire();
  release();
  await Promise.all([manual, automatic]);
  assert.equal(clock.active().length, 1);
  assert.equal(clock.active()[0].delay, 2 * 60_000);
  await clock.fire();
  assert.equal(clock.active()[0].delay, 4 * 60_000);
});

test('malformed profiles, unsafe entries and fixed access errors are retained without timed retries', async (t) => {
  const clock = timers(t);
  const { root, cache, cacheDir } = await fixture(t, {
    fs: {
      unlink: async (path) => {
        if (path.endsWith(oldArchive)) throw Object.assign(Error('denied'), { code: 'EACCES' });
        return unlink(path);
      },
    },
  });
  await writeFile(join(cacheDir, oldArchive), 'old');
  await mkdir(join(cacheDir, olderArchive));
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  await writeFile(join(profile, 'package.json'), '{invalid');
  let report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(
    new Set(report.pending.map((item) => item.reason)),
    new Set(['profile-unreadable', 'unsafe-entry']),
  );
  assert.equal(clock.active().length, 0);
  await writeFile(join(profile, 'package.json'), '{}');
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(
    new Set(report.pending.map((item) => item.reason)),
    new Set(['delete-failed', 'unsafe-entry']),
  );
  assert.equal(clock.active().length, 0);
  assert.equal(await readFile(join(cacheDir, oldArchive), 'utf8'), 'old');
});

test('temporarily unreadable profiles recover on a timer and stale partial downloads are cleaned automatically', async (t) => {
  const clock = timers(t);
  let blocked = true,
    now = Date.now();
  const { root, cache, cacheDir } = await fixture(t, {
    now: () => now,
    fs: {
      readFile: async (path, ...args) => {
        if (path.endsWith('package.json') && blocked)
          throw Object.assign(Error('busy'), { code: 'EBUSY' });
        return readFile(path, ...args);
      },
    },
  });
  await writeFile(join(cacheDir, oldArchive), 'old');
  await writeFile(join(cacheDir, part), 'partial');
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  await writeFile(join(profile, 'package.json'), '{}');
  const report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.ok(report.pending.some((item) => item.reason === 'profile-unreadable'));
  assert.equal(clock.active()[0].delay, 60_000);
  blocked = false;
  now += 11 * 60_000;
  await clock.fire();
  assert.equal(clock.active().length, 0);
  await assert.rejects(lstat(join(cacheDir, oldArchive)), { code: 'ENOENT' });
  await assert.rejects(lstat(join(cacheDir, part)), { code: 'ENOENT' });
});

test('startup rechecks persisted references and dispose during cleanup cannot leave a retry timer', async (t) => {
  const clock = timers(t);
  const { root, cache, dataDir, cacheDir } = await fixture(t);
  await writeFile(join(cacheDir, oldArchive), 'old');
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  await writeFile(join(profile, 'package.json'), JSON.stringify({ archive: oldArchive }));
  await cache.cleanup({ installedVersion: '1.3.1' });
  cache.dispose();
  await writeFile(join(profile, 'package.json'), '{}');
  const restarted = createUpdateCache({ dataDir, packageFile: join(root, 'package.json') });
  t.after(() => restarted.dispose());
  assert.deepEqual((await restarted.cleanup({ installedVersion: '1.3.1' })).removed, [oldArchive]);

  let release, started;
  const inProgress = new Promise((resolve) => {
    started = resolve;
  });
  const blocked = new Promise((resolve) => {
    release = resolve;
  });
  const stopping = createUpdateCache({
    dataDir,
    packageFile: join(root, 'package.json'),
    fs: {
      unlink: async (path) => {
        if (path.endsWith(oldArchive)) {
          started();
          await blocked;
          throw Object.assign(Error('busy'), { code: 'EBUSY' });
        }
        return unlink(path);
      },
    },
  });
  t.after(() => stopping.dispose());
  await writeFile(join(cacheDir, oldArchive), 'old');
  const cleaning = stopping.cleanup({ installedVersion: '1.3.1' });
  await inProgress;
  stopping.dispose();
  release();
  assert.equal((await cleaning).pending[0].reason, 'file-busy');
  assert.equal(clock.active().length, 0);
});

test('newly loaded version removes every unreferenced older installer and stale partial, preserving user data and current version', async (t) => {
  const { cache, cacheDir, dataDir } = await fixture(t);
  for (const name of [
    oldArchive,
    olderArchive,
    currentArchive,
    part,
    'another-plugin-1.0.0.tgz',
    'my-video.mp4',
  ])
    await writeFile(join(cacheDir, name), name);
  await utimes(join(cacheDir, part), new Date(0), new Date(0));
  await writeFile(join(dataDir, 'preferences.json'), '{"customVideo":"mine.mp4"}');
  await writeFile(join(dataDir, 'mine.mp4'), 'user upload');
  const report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(new Set(report.removed), new Set([oldArchive, olderArchive, part]));
  assert.deepEqual(report.pending, []);
  assert.deepEqual(
    new Set(await readdir(cacheDir)),
    new Set([currentArchive, 'another-plugin-1.0.0.tgz', 'my-video.mp4']),
  );
  assert.equal(await readFile(join(dataDir, 'mine.mp4'), 'utf8'), 'user upload');
  assert.equal(
    await readFile(join(dataDir, 'preferences.json'), 'utf8'),
    '{"customVideo":"mine.mp4"}',
  );
});

test('pnpm lock references defer deletion, persist retry attempts, and disappear automatically once superseded', async (t) => {
  const { root, cache, cacheDir } = await fixture(t);
  await writeFile(join(cacheDir, oldArchive), 'old archive');
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  await writeFile(join(profile, 'package.json'), '{}');
  await writeFile(
    join(profile, 'pnpm-lock.yaml'),
    `resolution: {tarball: file:../../boot-studio/update-cache/${oldArchive}}\n`,
  );
  let report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.pending, [
    { name: oldArchive, reason: 'profile-reference', attempts: 1 },
  ]);
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(report.pending[0].attempts, 2);
  const queue = JSON.parse(await readFile(join(cacheDir, 'cleanup-pending.json'), 'utf8'));
  assert.equal(queue.pending[0].attempts, 2);
  await writeFile(join(profile, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n');
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.removed, [oldArchive]);
  await assert.rejects(lstat(join(cacheDir, 'cleanup-pending.json')), { code: 'ENOENT' });
});

test('unreadable/malformed profile is reported and never guessed to be unreferenced', async (t) => {
  const { root, cache, cacheDir } = await fixture(t);
  await writeFile(join(cacheDir, oldArchive), 'old');
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  await writeFile(join(profile, 'package.json'), '{broken json');
  const report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.pending, [
    { name: oldArchive, reason: 'profile-unreadable', attempts: 1 },
  ]);
  assert.equal(await readFile(join(cacheDir, oldArchive), 'utf8'), 'old');
});

test('uppercase and percent-encoded Windows profile references protect lowercase cache archives until replaced', async (t) => {
  const { root, cache, cacheDir } = await fixture(t);
  await writeFile(join(cacheDir, oldArchive), 'old archive');
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  const manifestPath = join(profile, 'package.json');
  await writeFile(
    manifestPath,
    JSON.stringify({
      dependencies: { 'dsh-openup-lewis': `file:${join(cacheDir, oldArchive.toUpperCase())}` },
    }),
  );
  let report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(report.pending[0].reason, 'profile-reference');
  await writeFile(
    manifestPath,
    JSON.stringify({
      dependencies: {
        'dsh-openup-lewis': `file:${join(cacheDir, oldArchive.toUpperCase().replace('DSH', '%44%53%48'))}`,
      },
    }),
  );
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(report.pending[0].reason, 'profile-reference');
  assert.equal(await readFile(join(cacheDir, oldArchive), 'utf8'), 'old archive');
  await writeFile(manifestPath, JSON.stringify({ dependencies: { 'dsh-openup-lewis': '1.3.1' } }));
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.removed, [oldArchive]);
});

test('final reference recheck also protects an uppercase dependency introduced during cleanup', async (t) => {
  const { root, dataDir, cacheDir } = await fixture(t);
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  const manifestPath = join(profile, 'package.json');
  const referenced = JSON.stringify({
    dependencies: { 'dsh-openup-lewis': `file:${join(cacheDir, oldArchive.toUpperCase())}` },
  });
  await writeFile(manifestPath, referenced);
  await writeFile(join(cacheDir, oldArchive), 'old archive');
  let manifestReads = 0;
  const cache = createUpdateCache({
    dataDir,
    packageFile: join(root, 'package.json'),
    fs: {
      readFile: async (path, ...args) =>
        path === manifestPath && ++manifestReads === 1 ? '{}' : readFile(path, ...args),
    },
  });
  t.after(() => cache.dispose());
  const report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.ok(manifestReads >= 2);
  assert.equal(report.pending[0].reason, 'profile-reference');
  assert.equal(await readFile(join(cacheDir, oldArchive), 'utf8'), 'old archive');
});

test('custom profiles are found beyond pnpm nested node_modules ancestors', async (t) => {
  const { root, dataDir, cacheDir } = await fixture(t);
  const profile = join(root, 'custom-harness', 'desktop');
  await mkdir(profile, { recursive: true });
  await writeFile(join(profile, 'package.json'), '{}');
  await writeFile(
    join(profile, 'pnpm-lock.yaml'),
    `specifier: file:${join(cacheDir, oldArchive)}\n`,
  );
  await writeFile(join(cacheDir, oldArchive), 'referenced archive');
  const packageFile = join(
    profile,
    'node_modules',
    '.pnpm',
    'dsh-openup-lewis@file+cache',
    'node_modules',
    'dsh-openup-lewis',
    'package.json',
  );
  const cache = createUpdateCache({
    dataDir,
    packageFile,
    profileRoot: join(root, 'not-the-profile-root'),
  });
  t.after(() => cache.dispose());
  const report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.pending, [
    { name: oldArchive, reason: 'profile-reference', attempts: 1 },
  ]);
  assert.equal(await readFile(join(cacheDir, oldArchive), 'utf8'), 'referenced archive');
});

test('file-in-use failures are recorded and successfully retried without keeping a previous installer by policy', async (t) => {
  let locked = true;
  const { cache, cacheDir } = await fixture(t, {
    fs: {
      unlink: async (path) => {
        if (path.endsWith(oldArchive) && locked)
          throw Object.assign(Error('busy'), { code: 'EBUSY' });
        return unlink(path);
      },
    },
  });
  await writeFile(join(cacheDir, oldArchive), 'old');
  let report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(report.pending[0].reason, 'file-busy');
  locked = false;
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.removed, [oldArchive]);
  assert.equal(report.pending.length, 0);
});

test('active downloads are protected and fresh orphan partials are queued until idle', async (t) => {
  let now = Date.now();
  const { cache, cacheDir } = await fixture(t, { now: () => now });
  await writeFile(join(cacheDir, part), 'partial');
  cache.protect(join(cacheDir, part));
  let report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.kept, [part]);
  cache.unprotect(join(cacheDir, part));
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.equal(report.pending[0].reason, 'download-in-progress');
  now += 11 * 60_000;
  report = await cache.cleanup({ installedVersion: '1.3.1' });
  assert.deepEqual(report.removed, [part]);
});
