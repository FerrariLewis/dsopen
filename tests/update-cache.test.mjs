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
