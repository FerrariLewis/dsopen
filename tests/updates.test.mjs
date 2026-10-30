import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { createServer } from 'node:http';
import { once } from 'node:events';
import {
  createUpdateService,
  readPackageManifest,
  readPackageManifestAsync,
  validateNpmManifest,
} from '../src/updates.js';
import {
  packageManifest,
  tarEntry,
  archive,
  archiveName,
  npmMetadata,
} from './update-fixtures.mjs';

async function fixture(t, fetchImpl, { current = '1.3.0' } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'lewis-updates-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dataDir = join(root, 'boot-studio'),
    packageFile = join(root, 'package.json');
  await writeFile(packageFile, JSON.stringify(packageManifest(current)));
  const service = createUpdateService({ dataDir, packageFile, fetchImpl });
  t.after(() => service.dispose());
  return { root, dataDir, packageFile, service };
}

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
  report = await service.cleanup();
  assert.ok(report.removed.includes(oldName));
  assert.deepEqual(await readFile(staged.spec), bytes);
  assert.equal(report.pending.length, 0);
});
