import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lstat,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  truncate,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { setImmediate as yieldTurn } from 'node:timers/promises';
import {
  createUpdateService,
  readPackageManifest,
  readPackageManifestAsync,
  validateNpmManifest,
} from '../src/updates.js';
import { MAX_PACKAGE_BYTES } from '../src/constants.js';
import {
  packageManifest,
  tarEntry,
  archive,
  archiveName,
  npmMetadata,
} from './update-fixtures.mjs';

test('prepare hashes GitHub bytes once and npm bytes once per integrity algorithm', async () => {
  // Observe real built-in hashes in a child so instrumentation cannot change
  // another test's ESM crypto bindings or bypass the production verification.
  const program = `
    import crypto from 'node:crypto';
    import { syncBuiltinESMExports } from 'node:module';
    import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
    import { tmpdir } from 'node:os';
    import { join } from 'node:path';
    import { createUpdateService } from ${JSON.stringify(new URL('../src/updates.js', import.meta.url).href)};
    import { archive, npmMetadata, packageManifest } from ${JSON.stringify(new URL('./update-fixtures.mjs', import.meta.url).href)};
    const results = [];
    for (const source of ['github', 'npm']) {
      const root = await mkdtemp(join(tmpdir(), 'lewis-digest-'));
      let service;
      const original = crypto.createHash;
      try {
        const name = source === 'github' ? 'dsh-boot-studio' : 'dsh-openup-lewis';
        const pkg = packageManifest('1.3.1', { name });
        const bytes = archive(pkg);
        const sha256 = original('sha256').update(bytes).digest('hex');
        const metadata = source === 'npm' ? npmMetadata(pkg, bytes) : {
          format: 1, packageName: name, version: pkg.version, commit: 'a'.repeat(40),
          sha256, bytes: bytes.length, publishTimestamp: 1, requiresRestart: true,
          releaseNotes: pkg.lewisEnchantRelease,
          tarballUrl: 'https://github.com/FerrariLewis/open/releases/download/v1.3.1/dsh-boot-studio-1.3.1.tgz',
        };
        const packageFile = join(root, 'package.json');
        await writeFile(packageFile, JSON.stringify(packageManifest('1.3.0', { name })));
        const calls = [];
        crypto.createHash = (...args) => { calls.push(args[0]); return original(...args); };
        syncBuiltinESMExports();
        service = createUpdateService({
          dataDir: join(root, 'data'), packageFile,
          fetchImpl: async (url) => new Response(url.endsWith('.tgz') ? bytes : JSON.stringify(metadata)),
        });
        const staged = await service.prepare('1.3.1');
        results.push({ source, calls, sha256: staged.sha256, expected: sha256,
          unchanged: (await readFile(staged.spec)).equals(bytes) });
      } finally {
        crypto.createHash = original;
        syncBuiltinESMExports();
        service?.dispose();
        await rm(root, { recursive: true, force: true });
      }
    }
    process.stdout.write(JSON.stringify(results));
  `;
  const { stdout } = await promisify(execFile)(process.execPath, [
    '--input-type=module',
    '-e',
    program,
  ]);
  const [github, npm] = JSON.parse(stdout);
  assert.deepEqual(github.calls, ['sha256']);
  assert.deepEqual(npm.calls, ['sha512', 'sha256']);
  for (const result of [github, npm]) {
    assert.equal(result.sha256, result.expected);
    assert.equal(result.unchanged, true);
  }
});

async function fixture(t, fetchImpl, { current = '1.3.0', name = 'dsh-openup-lewis' } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'lewis-updates-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dataDir = join(root, 'boot-studio'),
    packageFile = join(root, 'package.json');
  await writeFile(packageFile, JSON.stringify(packageManifest(current, { name })));
  const service = createUpdateService({ dataDir, packageFile, fetchImpl });
  t.after(() => service.dispose());
  return { root, dataDir, packageFile, service };
}

function sourceMetadata(source, pkg, bytes) {
  return source === 'npm'
    ? npmMetadata(pkg, bytes)
    : {
        format: 1,
        packageName: pkg.name,
        version: pkg.version,
        commit: 'a'.repeat(40),
        sha256: createHash('sha256').update(bytes).digest('hex'),
        bytes: bytes.length,
        publishTimestamp: 1,
        requiresRestart: true,
        releaseNotes: pkg.lewisEnchantRelease,
        releaseNotesEn: pkg.lewisEnchantReleaseEn,
        tarballUrl: `https://github.com/FerrariLewis/open/releases/download/v${pkg.version}/${pkg.name}-${pkg.version}.tgz`,
      };
}

async function cacheFixture(t, source) {
  const pkg = packageManifest('1.3.1', {
    name: source === 'npm' ? 'dsh-openup-lewis' : 'dsh-boot-studio',
  });
  const bytes = archive(pkg);
  const requests = { metadata: 0, archive: 0 };
  const remote = { metadata: sourceMetadata(source, pkg, bytes), bytes };
  const context = await fixture(
    t,
    async (url) => {
      const isArchive = url.endsWith('.tgz');
      requests[isArchive ? 'archive' : 'metadata']++;
      return new Response(isArchive ? remote.bytes : JSON.stringify(remote.metadata));
    },
    { name: pkg.name },
  );
  const cacheDir = join(context.dataDir, 'update-cache');
  return { ...context, pkg, bytes, requests, remote, cacheDir };
}

for (const source of ['npm', 'github']) {
  test(`${source} retries recheck metadata and reuse the exact validated cache without rewriting it`, async (t) => {
    const { service, pkg, bytes, requests, packageFile, dataDir } = await cacheFixture(t, source);
    const first = await service.prepare(pkg.version);
    assert.equal(first.fromCache, false);
    assert.equal(first.bytes, bytes.length);
    assert.equal(service.progress().fromCache, false);
    // An old timestamp makes an unnecessary rewrite observable on all platforms.
    await utimes(first.spec, new Date('2020-01-01'), new Date('2020-01-01'));
    const original = await lstat(first.spec);
    const second = await service.prepare(pkg.version);
    assert.equal(second.fromCache, true);
    assert.equal(second.spec, first.spec);
    assert.equal(second.sha256, first.sha256);
    assert.equal(second.bytes, bytes.length);
    assert.deepEqual(requests, { metadata: 2, archive: 1 });
    const after = await lstat(second.spec);
    assert.equal(after.ino, original.ino);
    assert.equal(after.mtimeMs, original.mtimeMs);
    assert.equal(service.progress().phase, 'ready');
    assert.equal(service.progress().fromCache, true);
    assert.equal(service.progress().downloadedBytes, bytes.length);
    assert.equal(service.progress().totalBytes, bytes.length);
    assert.equal(service.progress().attempt, 0);
    assert.equal(service.progress().percent, 100);
    assert.deepEqual(await readFile(second.spec), bytes);
    assert.equal((await service.cleanup()).removed.length, 0);
    // A new host process can also reuse the artifact, without an in-memory promise.
    const restarted = createUpdateService({
      dataDir,
      packageFile,
      fetchImpl: async (url) => {
        assert.ok(!url.endsWith('.tgz'), 'a verified cached installer needs no archive request');
        return new Response(JSON.stringify(sourceMetadata(source, pkg, bytes)));
      },
    });
    t.after(() => restarted.dispose());
    assert.equal((await restarted.prepare(pkg.version)).fromCache, true);
  });

  test(`${source} corrupted or oversized cached bytes fall back to a newly verified download`, async (t) => {
    for (const mode of ['corrupt', 'oversize']) {
      const { service, pkg, bytes, requests } = await cacheFixture(t, source);
      const first = await service.prepare(pkg.version);
      if (mode === 'corrupt') await writeFile(first.spec, Buffer.from('damaged cache'));
      else await truncate(first.spec, MAX_PACKAGE_BYTES + 1);
      const retry = await service.prepare(pkg.version);
      assert.equal(retry.fromCache, false, mode);
      assert.equal(retry.bytes, bytes.length);
      assert.deepEqual(requests, { metadata: 2, archive: 2 });
      assert.deepEqual(await readFile(retry.spec), bytes);
      assert.equal(service.progress().fromCache, false);
    }
  });

  test(`${source} cache identity and fresh remote integrity override previously staged bytes`, async (t) => {
    const { service, pkg, requests, remote, cacheDir } = await cacheFixture(t, source);
    const first = await service.prepare(pkg.version);
    // The same version's trusted metadata must be fetched again, not cached in memory.
    remote.bytes = archive(pkg, [tarEntry('package/new-content.txt', 'changed')]);
    remote.metadata = sourceMetadata(source, pkg, remote.bytes);
    const second = await service.prepare(pkg.version);
    assert.equal(second.fromCache, false);
    assert.notEqual(second.sha256, first.sha256);
    assert.deepEqual(await readFile(second.spec), remote.bytes);
    assert.deepEqual(requests, { metadata: 2, archive: 2 });
    // A valid package under a forged content-hash filename must never be reused.
    await rm(second.spec);
    await writeFile(
      join(cacheDir, `${pkg.name}-${pkg.version}-${'0'.repeat(64)}.tgz`),
      remote.bytes,
    );
    assert.equal((await service.prepare(pkg.version)).fromCache, false);
    assert.equal(requests.archive, 3);
  });

  test(`${source} rejects an obsolete target even when its cached installer is valid`, async (t) => {
    const { service, pkg, requests, remote } = await cacheFixture(t, source);
    await service.prepare(pkg.version);
    const newer = packageManifest('1.3.2', { name: pkg.name });
    remote.bytes = archive(newer);
    remote.metadata = sourceMetadata(source, newer, remote.bytes);
    await assert.rejects(service.prepare(pkg.version), { code: 'BOOT_UPDATE_INVALID' });
    assert.deepEqual(requests, { metadata: 2, archive: 1 });
    assert.equal(service.progress().fromCache, false);
  });

  test(`${source} protects the candidate while asynchronous cache verification and cleanup overlap`, async (t) => {
    const { service, pkg, bytes, packageFile, dataDir } = await cacheFixture(t, source);
    const first = await service.prepare(pkg.version);
    const restarted = createUpdateService({
      dataDir,
      packageFile,
      fetchImpl: async (url) => {
        assert.ok(!url.endsWith('.tgz'));
        return new Response(JSON.stringify(sourceMetadata(source, pkg, bytes)));
      },
    });
    t.after(() => restarted.dispose());
    const preparing = restarted.prepare(pkg.version);
    // digest() yields after a chunk; initiate cleanup only once verification owns
    // the candidate, without relying on timers or the earlier service's state.
    while (!['verifying', 'ready', 'error'].includes(restarted.progress().phase)) await yieldTurn();
    const cleanup = restarted.cleanup();
    const [second, report] = await Promise.all([preparing, cleanup]);
    assert.equal(second.fromCache, true);
    assert.equal(second.spec, first.spec);
    assert.equal(report.removed.length, 0);
    assert.deepEqual(await readFile(second.spec), bytes);
  });

  test(`${source} never reuses another package or version's cached archive`, async (t) => {
    const { service, pkg, bytes, requests, cacheDir } = await cacheFixture(t, source);
    await mkdir(cacheDir, { recursive: true });
    const otherName = pkg.name === 'dsh-openup-lewis' ? 'dsh-boot-studio' : 'dsh-openup-lewis';
    await writeFile(join(cacheDir, archiveName('1.3.1', bytes, otherName)), bytes);
    await writeFile(join(cacheDir, archiveName('1.3.0', bytes, pkg.name)), bytes);
    const staged = await service.prepare(pkg.version);
    assert.equal(staged.fromCache, false);
    assert.deepEqual(requests, { metadata: 1, archive: 1 });
  });

  test(`${source} cached archives receive all TAR, package and release-note checks before reuse`, async (t) => {
    const modes = ['traversal', 'name', 'version', 'patch', 'script', 'notes', 'english-notes'];
    if (source === 'npm') modes.push('dependency', 'repository');
    for (const mode of modes) {
      const { service, pkg, requests, remote, cacheDir } = await cacheFixture(t, source);
      const changed = {
        ...pkg,
        ...(mode === 'name' ? { name: 'unrelated-package' } : {}),
        ...(mode === 'version' ? { version: '1.3.9' } : {}),
        ...(mode === 'patch' ? { dsh: { bundle: { patch: '../outside.yml' } } } : {}),
        ...(mode === 'script' ? { scripts: { postinstall: 'evil' } } : {}),
        ...(mode === 'notes'
          ? { lewisEnchantRelease: { version: pkg.version, notes: 'different release notes' } }
          : {}),
        ...(mode === 'english-notes'
          ? { lewisEnchantReleaseEn: { version: pkg.version, notes: 'Unexpected change.' } }
          : {}),
        ...(mode === 'dependency' ? { dependencies: { unexpected: '*' } } : {}),
        ...(mode === 'repository' ? { repository: 'https://github.com/another/project' } : {}),
      };
      remote.bytes = archive(
        changed,
        mode === 'traversal' ? [tarEntry('package/../../escape', 'unsafe')] : [],
      );
      // Even matching current publisher integrity cannot bypass package safety.
      remote.metadata = sourceMetadata(source, pkg, remote.bytes);
      await mkdir(cacheDir, { recursive: true });
      await writeFile(
        join(cacheDir, archiveName(pkg.version, remote.bytes, pkg.name)),
        remote.bytes,
      );
      await assert.rejects(service.prepare(pkg.version), (error) => {
        assert.ok(String(error.code).startsWith('BOOT_UPDATE_'), mode);
        return true;
      });
      assert.deepEqual(requests, { metadata: 1, archive: 1 }, mode);
      assert.equal(service.progress().phase, 'error');
      assert.equal(service.progress().fromCache, false);
    }
  });

  test(`${source} rejects a directory masquerading as a cached installer`, async (t) => {
    const { service, pkg, bytes, requests, cacheDir } = await cacheFixture(t, source);
    const fake = join(cacheDir, archiveName(pkg.version, bytes, pkg.name));
    await mkdir(fake, { recursive: true });
    await writeFile(join(fake, 'preserve.txt'), 'untouched');
    await assert.rejects(service.prepare(pkg.version), { code: 'BOOT_UPDATE_CACHE' });
    assert.deepEqual(requests, { metadata: 1, archive: 1 });
    assert.equal(await readFile(join(fake, 'preserve.txt'), 'utf8'), 'untouched');
  });

  test(`${source} never reuses or overwrites a symlinked cached installer`, async (t) => {
    const { root, service, pkg, bytes, requests, cacheDir } = await cacheFixture(t, source);
    const outside = join(root, 'outside.tgz');
    const linked = join(cacheDir, archiveName(pkg.version, bytes, pkg.name));
    await writeFile(outside, bytes);
    await mkdir(cacheDir, { recursive: true });
    try {
      await symlink(outside, linked, 'file');
    } catch (error) {
      if (error.code === 'EPERM' || error.code === 'EACCES') {
        t.skip('creating file symlinks requires an OS privilege unavailable to this test');
        return;
      }
      throw error;
    }
    await assert.rejects(service.prepare(pkg.version), { code: 'BOOT_UPDATE_CACHE' });
    assert.deepEqual(requests, { metadata: 1, archive: 1 });
    assert.deepEqual(await readFile(outside), bytes);
    assert.equal((await lstat(linked)).isSymbolicLink(), true);
  });

  test(`${source} refuses a symlinked cache directory before reading or downloading archives`, async (t) => {
    const { root, dataDir, service, pkg, bytes, requests, cacheDir } = await cacheFixture(
      t,
      source,
    );
    const outside = join(root, 'outside');
    await mkdir(outside);
    await mkdir(dataDir, { recursive: true });
    await writeFile(join(outside, archiveName(pkg.version, bytes, pkg.name)), bytes);
    try {
      await symlink(outside, cacheDir, process.platform === 'win32' ? 'junction' : 'dir');
    } catch (error) {
      if (error.code === 'EPERM' || error.code === 'EACCES') {
        t.skip('creating directory links requires an OS privilege unavailable to this test');
        return;
      }
      throw error;
    }
    await assert.rejects(service.prepare(pkg.version), { code: 'BOOT_UPDATE_CACHE' });
    assert.deepEqual(requests, { metadata: 1, archive: 0 });
    assert.deepEqual(await readdir(outside), [archiveName(pkg.version, bytes, pkg.name)]);
  });
}

test('GitHub cached integrity includes the exact manifest byte count', async (t) => {
  const { service, pkg, requests, remote } = await cacheFixture(t, 'github');
  await service.prepare(pkg.version);
  remote.metadata.bytes++;
  await assert.rejects(service.prepare(pkg.version), { code: 'BOOT_UPDATE_INTEGRITY' });
  assert.deepEqual(requests, { metadata: 2, archive: 2 });
  assert.equal(service.progress().fromCache, false);
});

test('prepare waits for a previously submitted cleanup unlink before accepting a cache candidate', async () => {
  // Patch built-in I/O only in a child. The first cleanup has submitted unlink,
  // but deletion waits until prepare requests its own cleanup. This reproduces
  // the late-protect race deterministically without timing-dependent sleeps.
  const program = `
    import fs from 'node:fs/promises';
    import { syncBuiltinESMExports } from 'node:module';
    import { tmpdir } from 'node:os';
    import { join } from 'node:path';
    import { createHash } from 'node:crypto';
    import { createUpdateService } from ${JSON.stringify(new URL('../src/updates.js', import.meta.url).href)};
    import { archive, archiveName, npmMetadata, packageManifest } from ${JSON.stringify(new URL('./update-fixtures.mjs', import.meta.url).href)};
    const original = { readFile: fs.readFile, unlink: fs.unlink };
    const results = [];
    for (const source of ['npm', 'github']) {
      const root = await fs.mkdtemp(join(tmpdir(), 'lewis-cache-unlink-'));
      let service, releaseDeletion;
      try {
        const name = source === 'npm' ? 'dsh-openup-lewis' : 'dsh-boot-studio';
        const pkg = packageManifest('1.3.1', { name });
        const bytes = archive(pkg);
        const packageFile = join(root, 'package.json');
        const dataDir = join(root, 'data');
        const cacheDir = join(dataDir, 'update-cache');
        const cached = join(cacheDir, archiveName(pkg.version, bytes, name));
        await fs.mkdir(cacheDir, { recursive: true });
        await fs.writeFile(packageFile, JSON.stringify(packageManifest('1.3.0', { name })));
        await fs.writeFile(cached, bytes);
        const metadata = source === 'npm' ? npmMetadata(pkg, bytes) : {
          format: 1, packageName: name, version: pkg.version, commit: 'a'.repeat(40),
          sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
          publishTimestamp: 1, requiresRestart: true, releaseNotes: pkg.lewisEnchantRelease,
          tarballUrl: 'https://github.com/FerrariLewis/open/releases/download/v1.3.1/dsh-boot-studio-1.3.1.tgz',
        };
        let signalDeletion, deletionStarted = false, identities = 0, downloads = 0;
        const deletionEntered = new Promise(resolve => { signalDeletion = resolve; });
        const blocked = new Promise(resolve => { releaseDeletion = resolve; });
        fs.unlink = async (...args) => {
          if (args[0] === cached && !deletionStarted) {
            deletionStarted = true;
            signalDeletion();
            await blocked;
          }
          return original.unlink(...args);
        };
        fs.readFile = async (...args) => {
          const result = await original.readFile(...args);
          // Reads 1/2 belong to the old cleanup and prepare's metadata check.
          // Read 3 is prepare requesting the cleanup queue drain.
          if (args[0] === packageFile && ++identities === 3) releaseDeletion();
          return result;
        };
        syncBuiltinESMExports();
        service = createUpdateService({
          dataDir, packageFile,
          fetchImpl: async url => {
            if (url.endsWith('.tgz')) { downloads++; return new Response(bytes); }
            return new Response(JSON.stringify(metadata));
          },
        });
        const cleaning = service.cleanup();
        await deletionEntered;
        const staged = await service.prepare(pkg.version);
        await cleaning;
        results.push({ source, fromCache: staged.fromCache, downloads,
          unchanged: (await original.readFile(staged.spec)).equals(bytes) });
      } finally {
        releaseDeletion?.();
        fs.readFile = original.readFile;
        fs.unlink = original.unlink;
        syncBuiltinESMExports();
        service?.dispose();
        await fs.rm(root, { recursive: true, force: true });
      }
    }
    process.stdout.write(JSON.stringify(results));
  `;
  const { stdout } = await promisify(execFile)(
    process.execPath,
    ['--input-type=module', '-e', program],
    { timeout: 10_000 },
  );
  for (const result of JSON.parse(stdout)) {
    assert.equal(result.fromCache, false, result.source);
    assert.equal(result.downloads, 1, result.source);
    assert.equal(result.unchanged, true, result.source);
  }
});

/** Real HTTP/undici transport: encoded header length differs from decoded body. */
async function gzipRegistryFixture(
  t,
  {
    encodeArchive = false,
    metadataExtra = {},
    omitMetadataLength = false,
    tamperArchive = false,
  } = {},
) {
  const pkg = packageManifest('1.3.2');
  const bytes = archive(pkg);
  const metadata = { ...npmMetadata(pkg, bytes), ...metadataExtra };
  const metadataBody = Buffer.from(JSON.stringify(metadata));
  const metadataWire = gzipSync(metadataBody);
  const sentArchive = tamperArchive
    ? archive(pkg, [tarEntry('package/altered.txt', 'different bytes')])
    : bytes;
  const archiveWire = encodeArchive ? gzipSync(sentArchive) : sentArchive;
  const observed = [];
  const server = createServer((req, res) => {
    const isMetadata = req.url === '/latest';
    const wire = isMetadata ? metadataWire : archiveWire;
    const headers = {
      'content-type': isMetadata ? 'application/json' : 'application/octet-stream',
    };
    if (isMetadata || encodeArchive) headers['content-encoding'] = 'gzip';
    if (!isMetadata || !omitMetadataLength) headers['content-length'] = String(wire.length);
    res.writeHead(200, headers);
    res.end(wire);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const fetchImpl = async (url, options) => {
    if (new URL(url).hostname === 'registry.npmjs.org')
      throw new TypeError('simulated primary registry outage');
    assert.equal(new URL(url).hostname, 'registry.npmmirror.com');
    const metadataRequest = url.endsWith('/latest');
    const response = await fetch(base + (metadataRequest ? '/latest' : '/archive'), options);
    observed.push({
      metadataRequest,
      contentEncoding: response.headers.get('content-encoding'),
      contentLength: response.headers.get('content-length'),
    });
    return response;
  };
  const context = await fixture(t, fetchImpl, { current: '1.3.1' });
  return { ...context, bytes, metadataBody, metadataWire, observed };
}

test('real gzip HTTP mirror metadata is decoded by Node fetch and can stage an unchanged tgz', async (t) => {
  const { service, bytes, metadataBody, metadataWire, observed } = await gzipRegistryFixture(t);
  assert.notEqual(metadataBody.length, metadataWire.length);
  const status = await service.check();
  assert.equal(status.channelReady, true, status.message);
  assert.equal(status.available, true);
  assert.equal(status.latestVersion, '1.3.2');
  assert.equal(observed[0].contentEncoding, 'gzip');
  assert.equal(Number(observed[0].contentLength), metadataWire.length);
  const staged = await service.prepare('1.3.2');
  assert.deepEqual(await readFile(staged.spec), bytes);
  assert.equal(bytes[0], 0x1f);
  assert.equal(bytes[1], 0x8b);
  assert.equal(staged.sha256, createHash('sha256').update(bytes).digest('hex'));
});

test('gzip HTTP bodies without Content-Length are accepted and HTTP-gzipped tgz keeps payload integrity', async (t) => {
  const { service, bytes, observed } = await gzipRegistryFixture(t, {
    omitMetadataLength: true,
    encodeArchive: true,
  });
  const staged = await service.prepare('1.3.2');
  assert.equal(observed.find((item) => item.metadataRequest).contentLength, null);
  assert.equal(observed.find((item) => !item.metadataRequest).contentEncoding, 'gzip');
  assert.deepEqual(await readFile(staged.spec), bytes);
});

test('compressed HTTP metadata still obeys the decoded-body limit', async (t) => {
  const { service, metadataWire, metadataBody } = await gzipRegistryFixture(t, {
    metadataExtra: { padding: 'x'.repeat(70_000) },
  });
  assert.ok(metadataWire.length < 65536);
  assert.ok(metadataBody.length > 65536);
  const status = await service.check();
  assert.equal(status.available, false);
  assert.equal(status.channelReady, false);
  assert.equal(status.code, 'BOOT_UPDATE_INVALID');
});

test('HTTP gzip does not weaken archive SHA verification', async (t) => {
  const { service, dataDir } = await gzipRegistryFixture(t, {
    encodeArchive: true,
    tamperArchive: true,
  });
  await assert.rejects(service.prepare('1.3.2'), { code: 'BOOT_UPDATE_INTEGRITY' });
  assert.deepEqual(await readdir(join(dataDir, 'update-cache')).catch(() => []), []);
});

test('identity responses with a mismatched declared body length are still rejected', async (t) => {
  const pkg = packageManifest('1.3.2'),
    body = JSON.stringify(npmMetadata(pkg, archive(pkg)));
  for (const encoding of [undefined, 'identity']) {
    const { service } = await fixture(
      t,
      async () =>
        new Response(body, {
          headers: {
            'content-type': 'application/json',
            'content-length': String(Buffer.byteLength(body) + 10),
            ...(encoding ? { 'content-encoding': encoding } : {}),
          },
        }),
    );
    const status = await service.check();
    assert.equal(status.available, false);
    assert.equal(status.channelReady, false);
    assert.equal(status.code, 'BOOT_UPDATE_NETWORK');
    assert.match(status.message, /未完整下载/);
  }
});

test('release-compatible and async TAR scanners agree, and runtime yields to the event loop', async () => {
  const pkg = packageManifest();
  const bytes = archive(
    pkg,
    Array.from({ length: 1024 }, (_, index) => tarEntry(`package/assets/frame-${index}.txt`, 'x')),
  );
  let turns = 0;
  const tick = setInterval(() => turns++, 0);
  try {
    assert.deepEqual(await readPackageManifestAsync(bytes), pkg);
    assert.ok(turns > 0, 'decompression/scanning must allow progress requests to run');
    assert.deepEqual(readPackageManifest(bytes), pkg);
  } finally {
    clearInterval(tick);
  }
});

test('all TAR entries are checked after the manifest; traversal, links and duplicate manifests are rejected', async () => {
  for (const bad of [
    tarEntry('package/../../evil.js', 'x'),
    tarEntry('package/link', '', '2'),
    tarEntry('package/package.json', '{}'),
  ]) {
    const bytes = archive(packageManifest(), [bad]);
    await assert.rejects(readPackageManifestAsync(bytes), { code: 'BOOT_UPDATE_ARCHIVE' });
    assert.throws(() => readPackageManifest(bytes), { code: 'BOOT_UPDATE_ARCHIVE' });
  }
});

test('truncated TARs and invalid gzip never reach installation', async () => {
  await assert.rejects(readPackageManifestAsync(Buffer.from('not gzip')), {
    code: 'BOOT_UPDATE_ARCHIVE',
  });
  const noTrailer = gzipSync(tarEntry('package/package.json', JSON.stringify(packageManifest())));
  await assert.rejects(readPackageManifestAsync(noTrailer), { code: 'BOOT_UPDATE_ARCHIVE' });
});

test('TAR manifest and asset aliases are rejected across case-insensitive and Unicode-normalizing filesystems', async () => {
  const entries = [
    [tarEntry('package/PACKAGE.JSON', '{"name":"unverified"}')],
    [tarEntry('package/lib/host.js', 'first'), tarEntry('package/LIB/HOST.JS', 'second')],
    [
      tarEntry('package/assets/caf\u00e9.txt', 'first'),
      tarEntry('package/assets/cafe\u0301.txt', 'second'),
    ],
  ];
  for (const extra of entries) {
    const bytes = archive(packageManifest(), extra);
    assert.throws(() => readPackageManifest(bytes), { code: 'BOOT_UPDATE_ARCHIVE' });
    await assert.rejects(readPackageManifestAsync(bytes), { code: 'BOOT_UPDATE_ARCHIVE' });
  }
});

test('Windows illegal, trailing-dot/space and reserved-device TAR paths are rejected identically', async () => {
  const names = [
    'bad<name',
    'bad>name',
    'bad"name',
    'bad|name',
    'bad?name',
    'bad*name',
    'file.txt.',
    'file.txt ',
    'folder./file.txt',
    'folder /file.txt',
    'CON',
    'con.txt',
    'AUX.png',
    'NUL',
    'PRN.log',
    'COM1.dat',
    'lpt9',
    'COM\u00b9.log',
    'LPT\u00b2.log',
    'CON .txt',
    'CONIN$',
    'CONOUT$',
  ];
  for (const name of names) {
    const bytes = archive(packageManifest(), [tarEntry('package/assets/' + name, 'bad')]);
    assert.throws(() => readPackageManifest(bytes), { code: 'BOOT_UPDATE_ARCHIVE' }, name);
    await assert.rejects(readPackageManifestAsync(bytes), { code: 'BOOT_UPDATE_ARCHIVE' }, name);
  }
  const valid = archive(packageManifest(), [tarEntry('package/assets/控制台-副本.txt', 'valid')]);
  assert.equal((await readPackageManifestAsync(valid)).version, '1.3.1');
});

test('npm metadata pins project, package/version path and canonical SHA-512', () => {
  const pkg = packageManifest(),
    bytes = archive(pkg),
    metadata = npmMetadata(pkg, bytes);
  assert.equal(validateNpmManifest(metadata).version, pkg.version);
  for (const changed of [
    { ...metadata, repository: 'https://github.com/someone/else' },
    { ...metadata, dist: { ...metadata.dist, tarball: 'https://evil.example/package.tgz' } },
    { ...metadata, dist: { ...metadata.dist, integrity: 'sha512-invalid' } },
  ])
    assert.throws(() => validateNpmManifest(changed), { code: 'BOOT_UPDATE_INVALID' });
});

test('verified npm update is staged with progress and exact bytes; no installer is run', async (t) => {
  const pkg = packageManifest(),
    bytes = archive(pkg),
    metadata = npmMetadata(pkg, bytes);
  const { service } = await fixture(
    t,
    async (url) => new Response(url.endsWith('/latest') ? JSON.stringify(metadata) : bytes),
  );
  const staged = await service.prepare('1.3.1');
  assert.equal(staged.version, '1.3.1');
  assert.equal(staged.sha256, createHash('sha256').update(bytes).digest('hex'));
  assert.deepEqual(await readFile(staged.spec), bytes);
  assert.equal(service.progress().phase, 'ready');
  assert.equal(service.progress().percent, 100);
});

test('tampering, installation scripts and unsafe bundle declarations leave no staged files', async (t) => {
  for (const mode of ['tamper', 'script', 'patch']) {
    const pkg = packageManifest(
      '1.3.1',
      mode === 'script'
        ? { scripts: { postinstall: 'evil' } }
        : mode === 'patch'
          ? { dsh: { bundle: { patch: '../outside.yml' } } }
          : {},
    );
    const bytes = archive(pkg),
      metadata = npmMetadata(pkg, mode === 'tamper' ? Buffer.from('different') : bytes);
    const { dataDir, service } = await fixture(
      t,
      async (url) => new Response(url.endsWith('/latest') ? JSON.stringify(metadata) : bytes),
    );
    await assert.rejects(service.prepare('1.3.1'), (error) =>
      String(error.code).startsWith('BOOT_UPDATE_'),
    );
    assert.deepEqual(await readdir(join(dataDir, 'update-cache')).catch(() => []), []);
    assert.equal(service.progress().phase, 'error');
  }
});

test('registry redirects never contact an arbitrary host', async (t) => {
  const calls = [];
  const { service } = await fixture(t, async (url) => {
    calls.push(url);
    return new Response(null, {
      status: 302,
      headers: { location: 'https://evil.example/secret' },
    });
  });
  const result = await service.check();
  assert.equal(result.channelReady, false);
  assert.ok(result.code.startsWith('BOOT_UPDATE_'));
  assert.deepEqual(calls, ['https://registry.npmjs.org/dsh-openup-lewis/latest']);
});

test('historic GitHub channel follows the canonical repository rename and the official asset CDN only', async (t) => {
  const pkg = packageManifest('1.3.1', { name: 'dsh-boot-studio' }),
    bytes = archive(pkg);
  const metadata = {
    format: 1,
    packageName: pkg.name,
    version: pkg.version,
    commit: 'a'.repeat(40),
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    publishTimestamp: 1,
    requiresRestart: true,
    releaseNotes: pkg.lewisEnchantRelease,
    tarballUrl: `https://github.com/FerrariLewis/open/releases/download/v${pkg.version}/${pkg.name}-${pkg.version}.tgz`,
  };
  const calls = [];
  const { service, packageFile } = await fixture(t, async (url, options) => {
    calls.push(url);
    assert.equal(options.redirect, 'manual');
    if (url.includes('/FerrariLewis/open/'))
      return new Response(null, {
        status: 302,
        headers: { location: url.replace('/FerrariLewis/open/', '/FerrariLewis/dsopen/') },
      });
    if (url.endsWith('update.json')) return new Response(JSON.stringify(metadata));
    if (url.startsWith('https://github.com/'))
      return new Response(null, {
        status: 302,
        headers: {
          location:
            'https://release-assets.githubusercontent.com/github-production-release-asset/package.tgz',
        },
      });
    return new Response(bytes);
  });
  await writeFile(
    packageFile,
    JSON.stringify(packageManifest('1.3.0', { name: 'dsh-boot-studio' })),
  );
  const checked = await service.check();
  assert.equal(checked.available, true, checked.message);
  assert.equal((await service.prepare('1.3.1')).version, '1.3.1');
  assert.ok(calls.some((url) => url.startsWith('https://release-assets.githubusercontent.com/')));
});

test('reusing the GitHub digest still rejects incorrect SHA-256, short bodies and excess declared size', async (t) => {
  const pkg = packageManifest('1.3.1', { name: 'dsh-boot-studio' });
  const bytes = archive(pkg);
  const metadata = {
    format: 1,
    packageName: pkg.name,
    version: pkg.version,
    commit: 'a'.repeat(40),
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    publishTimestamp: 1,
    requiresRestart: true,
    releaseNotes: pkg.lewisEnchantRelease,
    tarballUrl: `https://github.com/FerrariLewis/open/releases/download/v${pkg.version}/${pkg.name}-${pkg.version}.tgz`,
  };
  for (const mode of ['sha256', 'short', 'oversize']) {
    const manifest = {
      ...metadata,
      ...(mode === 'sha256' ? { sha256: '0'.repeat(64) } : {}),
      ...(mode === 'oversize' ? { bytes: 80 * 1024 * 1024 + 1 } : {}),
    };
    const { service, packageFile, dataDir } = await fixture(
      t,
      async (url) =>
        new Response(
          url.endsWith('update.json')
            ? JSON.stringify(manifest)
            : mode === 'short'
              ? bytes.subarray(0, bytes.length - 1)
              : bytes,
        ),
    );
    await writeFile(packageFile, JSON.stringify(packageManifest('1.3.0', { name: pkg.name })));
    await assert.rejects(service.prepare('1.3.1'), (error) => {
      assert.equal(
        error.code,
        mode === 'oversize' ? 'BOOT_UPDATE_INVALID' : 'BOOT_UPDATE_INTEGRITY',
      );
      return true;
    });
    assert.deepEqual(await readdir(join(dataDir, 'update-cache')).catch(() => []), []);
  }
});

test('prepare rechecks previously referenced installers before staging the next update', async (t) => {
  const pkg = packageManifest(),
    bytes = archive(pkg),
    metadata = npmMetadata(pkg, bytes);
  const { root, dataDir, service } = await fixture(
    t,
    async (url) => new Response(url.endsWith('/latest') ? JSON.stringify(metadata) : bytes),
  );
  const cacheDir = join(dataDir, 'update-cache');
  await mkdir(cacheDir, { recursive: true });
  const oldBytes = archive(packageManifest('1.2.10'));
  const oldName = archiveName('1.2.10', oldBytes);
  await writeFile(join(cacheDir, oldName), oldBytes);
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  const profileFile = join(profile, 'package.json');
  await writeFile(profileFile, JSON.stringify({ archive: oldName }));
  assert.equal((await service.cleanup()).pending[0].reason, 'profile-reference');
  await writeFile(profileFile, '{}');
  const staged = await service.prepare('1.3.1');
  assert.deepEqual(await readdir(cacheDir), [staged.spec.split(/[\\/]/).at(-1)]);
  assert.deepEqual(await readFile(staged.spec), bytes);
});

test('installation acknowledgement verifies the exact cache artifact and preserves live profile references', async (t) => {
  const pkg = packageManifest(),
    bytes = archive(pkg),
    metadata = npmMetadata(pkg, bytes);
  const { root, dataDir, service } = await fixture(
    t,
    async (url) => new Response(url.endsWith('/latest') ? JSON.stringify(metadata) : bytes),
  );
  const cacheDir = join(dataDir, 'update-cache');
  await mkdir(cacheDir, { recursive: true });
  const oldBytes = archive(packageManifest('1.3.0'));
  const oldName = archiveName('1.3.0', oldBytes);
  await writeFile(join(cacheDir, oldName), oldBytes);
  const profile = join(root, 'profiles', 'desktop');
  await mkdir(profile, { recursive: true });
  await writeFile(
    join(profile, 'package.json'),
    JSON.stringify({ dependencies: { 'dsh-openup-lewis': `file:${join(cacheDir, oldName)}` } }),
  );
  const staged = await service.prepare('1.3.1');
  await assert.rejects(service.installed('1.3.1', join(root, 'outside.tgz')), {
    code: 'BOOT_UPDATE_INSTALL_ACK_INVALID',
  });
  let report = await service.installed('1.3.1', staged.spec);
  assert.ok(
    report.pending.some((item) => item.name === oldName && item.reason === 'profile-reference'),
  );
  assert.deepEqual(await readFile(join(cacheDir, oldName)), oldBytes);
  // A late acknowledgement from the previous install must not pin the old
  // version again after a newer installation has already succeeded.
  await assert.rejects(service.installed('1.3.0', join(cacheDir, oldName)), {
    code: 'BOOT_UPDATE_INSTALL_ACK_INVALID',
  });
  await writeFile(
    join(profile, 'package.json'),
    JSON.stringify({ dependencies: { 'dsh-openup-lewis': `file:${staged.spec}` } }),
  );
  report = await service.installed('1.3.1', staged.spec);
  assert.ok(report.removed.includes(oldName));
  assert.deepEqual(await readFile(staged.spec), bytes);
  assert.equal(report.pending.length, 0);
});
