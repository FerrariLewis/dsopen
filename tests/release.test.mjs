import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  buildUpdate,
  assertVersionAdvance,
  assertExistingRelease,
  inspectTarball,
  updateIdentityRepository,
} from '../scripts/release.mjs';
import { allowedRegistryURL, verifyRegistries } from '../scripts/verify-registries.mjs';
import { requirePackageReleaseNotes } from '../src/release-notes.js';
import {
  CORE_PACKAGE_NAME,
  NPM_ENTRY_NAME,
  REPOSITORY,
  UPDATE_REPOSITORY,
} from '../src/constants.js';
import { archive, packageManifest, tarEntry, npmMetadata } from './update-fixtures.mjs';

const VERSION = '1.3.1';
const OFFICIAL = 'https://registry.npmjs.org';
const MIRROR = 'https://registry.npmmirror.com';
const SYNC_URL = `https://registry-direct.npmmirror.com/-/package/${NPM_ENTRY_NAME}/syncs`;
const notes = '第一行\n\n第二行，保留原文。';
const notesEn = 'First line\n\nSecond line.';
const manifest = (extra = {}) =>
  packageManifest(VERSION, {
    type: 'module',
    lewisEnchantRelease: { version: VERSION, notes },
    lewisEnchantReleaseEn: { version: VERSION, notes: notesEn },
    ...extra,
  });
const update = (pkg = manifest()) =>
  buildUpdate({
    manifest: pkg,
    repo: REPOSITORY,
    commit: 'a'.repeat(40),
    sourceCommit: 'b'.repeat(40),
    publishTimestamp: 1793347200,
    bytes: 128,
    sha256: 'c'.repeat(64),
  });

test('release gates preserve author text, require current bilingual notes, and retain pre-1.3 compatibility', () => {
  assert.equal(requirePackageReleaseNotes(manifest(), { bilingual: true }), notes);
  assert.throws(
    () =>
      requirePackageReleaseNotes(manifest({ lewisEnchantReleaseEn: undefined }), {
        bilingual: true,
      }),
    /英文/,
  );
  assert.throws(
    () =>
      requirePackageReleaseNotes(manifest({ lewisEnchantRelease: { version: '1.3.0', notes } })),
    /版本/,
  );
  assert.throws(
    () =>
      requirePackageReleaseNotes(
        manifest({ lewisEnchantRelease: { version: VERSION, notes: ' ' } }),
      ),
    /纯文本/,
  );
  assert.equal(
    requirePackageReleaseNotes(packageManifest('1.2.10'), { bilingual: true }),
    '测试更新说明',
  );
  assert.equal(update().releaseNotes.notes, notes);
  assert.equal(update().releaseNotesEn.notes, notesEn);
  assert.deepEqual(Object.keys(update().releaseNotes).sort(), ['notes', 'version']);
});

test('stable version advances and immutable release data cannot be silently replaced', () => {
  const previous = { format: 1, packageName: NPM_ENTRY_NAME, version: '1.3.0' };
  assert.doesNotThrow(() => assertVersionAdvance(manifest(), previous));
  for (const version of [VERSION, '1.3.2'])
    assert.throws(() => assertVersionAdvance(manifest(), { ...previous, version }), /必须大于/);
  assert.throws(
    () => assertVersionAdvance(manifest(), { ...previous, packageName: 'another-package' }),
    /元数据无效/,
  );
  const expected = update();
  assert.equal(assertExistingRelease(expected, expected), expected.commit);
  for (const changed of [
    { bytes: 129 },
    { sourceCommit: 'd'.repeat(40) },
    { sha256: 'e'.repeat(64) },
    { releaseNotesEn: { version: VERSION, notes: 'changed' } },
  ])
    assert.throws(() => assertExistingRelease(expected, { ...expected, ...changed }), /已有/);
});

test('renamed repository retains exact legacy update URLs for installed core and npm clients', () => {
  for (const packageName of [CORE_PACKAGE_NAME, NPM_ENTRY_NAME]) {
    assert.equal(updateIdentityRepository(REPOSITORY, packageName), UPDATE_REPOSITORY);
    const metadata = update(manifest({ name: packageName }));
    assert.equal(
      metadata.tarballUrl,
      `https://github.com/${UPDATE_REPOSITORY}/releases/download/v${VERSION}/${packageName}-${VERSION}.tgz`,
    );
  }
  assert.equal(updateIdentityRepository(REPOSITORY, 'unrelated-package'), REPOSITORY);
  assert.equal(updateIdentityRepository('someone/fork', NPM_ENTRY_NAME), 'someone/fork');
});

test('packed host runtime imports without source tree, installed dependencies, or build/install hooks', async (t) => {
  const root = dirname(dirname(fileURLToPath(import.meta.url)));
  const temporary = await mkdtemp(join(tmpdir(), 'dsh-release-runtime-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const files = [
    tarEntry(
      'package/lib/client.js',
      'window.__ModuleLoader__.load({ id: "dsh-openup-lewis", factory: () => ({}) });',
    ),
    tarEntry('package/lib/build-info.json', JSON.stringify({ version: VERSION })),
  ];
  for (const file of await readdir(join(root, 'src'))) {
    if (file.endsWith('.js'))
      files.push(
        tarEntry(
          'package/lib/' + (file === 'host.js' ? 'index.js' : file),
          await readFile(join(root, 'src', file)),
        ),
      );
  }
  for (const path of [
    'assets/author/author.jpg',
    'assets/deepseek-whale-girl-intro.mp4',
    'assets/deepsea-notices/LICENSE',
    'assets/deepsea-notices/LICENSE-ARTWORK.md',
    'assets/deepsea-notices/NOTICE-ARTWORK.md',
    'assets/deepsea-notices/ADAPTATION.md',
    ...['assassins-creed', 'cyberpunk-2077', 'gta6', 'horizon6', 'horizon5', 'horizon4'].map(
      (name) => `assets/end-covers/${name}.png`,
    ),
    ...['title', 'dance', 'sea'].map((name) => `assets/deepseek-${name}-intro.mp4`),
    'assets/lxj-notices/LICENSE',
    'assets/lxj-notices/NOTICE.md',
  ])
    files.push(tarEntry('package/' + path, 'fixture'));
  const tarball = join(temporary, `${NPM_ENTRY_NAME}-${VERSION}.tgz`);
  await writeFile(tarball, archive(manifest(), files));
  const inspected = await inspectTarball(tarball);
  assert.equal(inspected.manifest.name, NPM_ENTRY_NAME);
  assert.equal(inspected.manifest.dependencies, undefined);
  assert.equal(inspected.manifest.scripts, undefined);
  const extract = join(temporary, 'extract');
  await mkdir(extract);
  execFileSync(
    process.platform === 'win32'
      ? join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe')
      : 'tar',
    ['-xzf', tarball, '-C', extract],
  );
  const imported = await import(pathToFileURL(join(extract, 'package', 'lib', 'index.js')).href);
  assert.equal(typeof imported.apply, 'function');
  assert.equal(typeof imported.createHandler, 'function');
});

async function registryFixture(t, changes = {}) {
  const temporary = await mkdtemp(join(tmpdir(), 'dsh-registry-check-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const pkg = manifest();
  const bytes = archive(pkg);
  const path = join(temporary, 'release.tgz'),
    releaseMetadata = join(temporary, 'npm-update.json');
  const metadata = {
    ...update(pkg),
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
  await writeFile(path, bytes);
  await writeFile(releaseMetadata, JSON.stringify({ ...metadata, ...changes.releaseMetadata }));
  const official = npmMetadata(pkg, bytes);
  const mirrored = {
    ...official,
    repository: { type: 'git', url: `git+https://github.com/${REPOSITORY}.git` },
    dist: {
      ...official.dist,
      tarball: `${MIRROR}/${NPM_ENTRY_NAME}/-/${NPM_ENTRY_NAME}-${VERSION}.tgz`,
    },
  };
  const requests = [];
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url, method: options.method || 'GET' });
    if (changes.fetchImpl) {
      const replacement = await changes.fetchImpl(url, options, { bytes, official, mirrored });
      if (replacement) return replacement;
    }
    if (url === SYNC_URL)
      return Response.json({ ok: true, id: 'sync-task-1', state: 'waiting' }, { status: 201 });
    if (url === `${OFFICIAL}/${NPM_ENTRY_NAME}/${VERSION}`) return Response.json(official);
    if (url === `${OFFICIAL}/${NPM_ENTRY_NAME}/latest`)
      return Response.json(changes.officialLatest ?? official);
    if (url === `${MIRROR}/${NPM_ENTRY_NAME}/${VERSION}`) return Response.json(mirrored);
    if (url === `${MIRROR}/${NPM_ENTRY_NAME}/latest`)
      return Response.json(changes.mirrorLatest ?? mirrored);
    if (
      url === official.dist.tarball ||
      url === mirrored.dist.tarball ||
      url === `https://cdn.npmmirror.com/packages/${NPM_ENTRY_NAME}/release.tgz`
    )
      return new Response(bytes, { headers: { 'content-length': String(bytes.length) } });
    throw Error(`Unexpected fetch: ${url}`);
  };
  return {
    options: { version: VERSION, path, releaseMetadata, pollAttempts: 2, pollIntervalMs: 0 },
    fetchImpl,
    requests,
    bytes,
    official,
    mirrored,
  };
}

test('registry verification downloads both complete tarballs and records the final permitted mirror CDN', async (t) => {
  const f = await registryFixture(t, {
    fetchImpl: (url, options, { mirrored }) =>
      url === mirrored.dist.tarball
        ? new Response(null, {
            status: 302,
            headers: {
              location: `https://cdn.npmmirror.com/packages/${NPM_ENTRY_NAME}/release.tgz`,
            },
          })
        : null,
  });
  const report = await verifyRegistries(f.options, {
    fetchImpl: f.fetchImpl,
    sleepImpl: async () => {},
  });
  assert.equal(report.success, true);
  assert.equal(report.official.latest, VERSION);
  assert.equal(report.mirror.latest, VERSION);
  assert.equal(report.mirror.tarball.finalHost, 'cdn.npmmirror.com');
  assert.equal(report.official.tarball.bytes, f.bytes.length);
  assert.equal(report.official.tarball.sha256, report.mirror.tarball.sha256);
  assert.equal(report.official.tarball.integrity, report.mirror.tarball.integrity);
  assert.equal(
    f.requests.some((request) => request.method === 'PUT'),
    false,
  );
});

test('registry metadata accepts Fetch-decoded compression but still rejects truncated identity bodies', async (t) => {
  for (const encoding of ['gzip', 'br', 'identity']) {
    const f = await registryFixture(t, {
      fetchImpl: (url, options, { mirrored }) =>
        url.startsWith(MIRROR) && !url.endsWith('.tgz')
          ? new Response(JSON.stringify(mirrored), {
              headers: { 'content-encoding': encoding, 'content-length': '1' },
            })
          : null,
    });
    const operation = verifyRegistries(f.options, { fetchImpl: f.fetchImpl });
    if (encoding === 'identity') await assert.rejects(operation, /incomplete/);
    else assert.equal((await operation).success, true);
  }
});

test('explicit sync runs only after official version/latest and its complete artifact have verified', async (t) => {
  const f = await registryFixture(t);
  const report = await verifyRegistries(
    { ...f.options, sync: true },
    { fetchImpl: f.fetchImpl, sleepImpl: async () => {} },
  );
  assert.equal(report.success, true);
  assert.equal(report.sync.submitted, true);
  const syncIndex = f.requests.findIndex((request) => request.method === 'PUT');
  assert.ok(syncIndex > f.requests.findIndex((request) => request.url === f.official.dist.tarball));
  assert.ok(
    syncIndex >
      f.requests.findIndex((request) => request.url === `${OFFICIAL}/${NPM_ENTRY_NAME}/latest`),
  );
  assert.equal(f.requests[syncIndex].url, SYNC_URL);
});

test('stale official latest or mismatched Release data prevents any mirror sync', async (t) => {
  const old = manifest({
    version: '1.3.0',
    lewisEnchantRelease: { version: '1.3.0', notes },
    lewisEnchantReleaseEn: { version: '1.3.0', notes: notesEn },
  });
  const oldLatest = npmMetadata(old, archive(old));
  const f = await registryFixture(t, { officialLatest: oldLatest });
  await assert.rejects(
    verifyRegistries({ ...f.options, sync: true }, { fetchImpl: f.fetchImpl }),
    /version or integrity/,
  );
  assert.equal(
    f.requests.some((request) => request.method === 'PUT'),
    false,
  );
  const badRelease = await registryFixture(t, { releaseMetadata: { sha256: '0'.repeat(64) } });
  await assert.rejects(
    verifyRegistries({ ...badRelease.options, sync: true }, { fetchImpl: badRelease.fetchImpl }),
    /Release metadata differs/,
  );
  assert.equal(badRelease.requests.length, 0);
});

test('a stale mirror latest is polled but never reported as successful synchronization', async (t) => {
  const old = manifest({ version: '1.3.0' });
  const f = await registryFixture(t, { mirrorLatest: npmMetadata(old, archive(old)) });
  let sleeps = 0;
  await assert.rejects(
    verifyRegistries(f.options, {
      fetchImpl: f.fetchImpl,
      sleepImpl: async () => {
        sleeps++;
      },
    }),
    (error) => {
      assert.equal(error.report.success, false);
      assert.equal(error.report.mirror.latest, '1.3.0');
      assert.match(error.message, /did not converge/);
      return true;
    },
  );
  assert.equal(sleeps, 1);
});

test('untrusted redirects and tampered complete mirror artifacts fail closed', async (t) => {
  for (const url of [
    'http://registry.npmjs.org/pkg',
    'https://npmmirror.com.evil.example/pkg',
    'https://user:secret@registry.npmjs.org/pkg',
    'https://cdn.npmmirror.com:444/pkg',
  ])
    assert.equal(allowedRegistryURL(url), false);
  const redirected = await registryFixture(t, {
    fetchImpl: (url, options, { mirrored }) =>
      url === mirrored.dist.tarball
        ? new Response(null, {
            status: 302,
            headers: { location: 'https://evil.example/payload.tgz' },
          })
        : null,
  });
  await assert.rejects(
    verifyRegistries(redirected.options, { fetchImpl: redirected.fetchImpl }),
    /permitted HTTPS hosts/,
  );
  assert.equal(
    redirected.requests.some((request) => request.url.startsWith('https://evil.example')),
    false,
  );
  const tampered = await registryFixture(t, {
    fetchImpl: (url, options, { bytes, mirrored }) =>
      url === mirrored.dist.tarball
        ? new Response(Buffer.concat([bytes.subarray(0, bytes.length - 1), Buffer.from([255])]))
        : null,
  });
  await assert.rejects(
    verifyRegistries(tampered.options, { fetchImpl: tampered.fetchImpl }),
    (error) => {
      assert.equal(error.report.success, false);
      assert.match(error.message, /bytes\/SHA-256\/SHA-512/);
      return true;
    },
  );
});
