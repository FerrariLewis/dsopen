import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { reusePublishedNpm } from '../scripts/reuse-published-npm.mjs';
import { MAX_PACKAGE_BYTES } from '../src/constants.js';
import { archive, packageManifest, tarEntry, npmMetadata } from './update-fixtures.mjs';

const pkg = packageManifest('1.9.7');
const client = tarEntry('package/lib/client.js', 'verified runtime');
const built = archive(pkg, [client]);

async function fixture(t, published = built, metadata = npmMetadata(pkg, published)) {
  const directory = await mkdtemp(join(tmpdir(), 'lewis-reuse-npm-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const tarball = join(directory, 'local.tgz');
  await writeFile(tarball, built);
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push(url);
    assert.equal(options.redirect, 'manual');
    assert.equal(new URL(url).origin, 'https://registry.npmjs.org');
    return url.endsWith('.tgz') ? new Response(published) : Response.json(metadata);
  };
  return { tarball, requests, fetchImpl };
}

test('same regular file bytes with a different gzip OS header reuse the exact published bytes', async (t) => {
  const published = Buffer.from(built);
  published[9] = built[9] === 3 ? 10 : 3;
  assert.notDeepEqual(published, built);
  const fixtureValue = await fixture(t, published);
  const result = await reusePublishedNpm(fixtureValue);
  assert.equal(result.reused, true);
  assert.equal(result.version, '1.9.7');
  assert.equal(result.sha256, createHash('sha256').update(published).digest('hex'));
  assert.deepEqual(await readFile(fixtureValue.tarball), published);
  assert.equal(fixtureValue.requests.length, 2);
});

test('Fetch-decoded compressed metadata uses decoded limits instead of the encoded Content-Length', async (t) => {
  for (const encoding of ['gzip', 'br', 'identity']) {
    const f = await fixture(t);
    const fetchImpl = (url) =>
      url.endsWith('.tgz')
        ? new Response(built)
        : new Response(JSON.stringify(npmMetadata(pkg, built)), {
            headers: { 'content-encoding': encoding, 'content-length': '1' },
          });
    const operation = reusePublishedNpm({ ...f, fetchImpl });
    if (encoding === 'identity') await assert.rejects(operation, /incomplete/);
    else assert.equal((await operation).reused, true);
  }
});

test('different runtime bytes or file inventories fail without overwriting the local build', async (t) => {
  for (const entries of [
    [tarEntry('package/lib/client.js', 'one changed runtime byte')],
    [client, tarEntry('package/lib/extra.js', 'unexpected executable')],
    [],
  ]) {
    const f = await fixture(t, archive(pkg, entries));
    await assert.rejects(reusePublishedNpm(f), /different file inventory|contents differ/);
    assert.deepEqual(await readFile(f.tarball), built);
  }
});

test('package.json whitespace is a real file difference and is never ignored', async (t) => {
  const published = gzipSync(
    Buffer.concat([
      tarEntry('package/package.json', JSON.stringify(pkg, null, 2)),
      tarEntry('package/cordis.patch.yml', '- id: dsh-boot-studio\n'),
      client,
      Buffer.alloc(1024),
    ]),
  );
  const f = await fixture(t, published);
  await assert.rejects(reusePublishedNpm(f), /contents differ: package.json/);
  assert.deepEqual(await readFile(f.tarball), built);
});

test('wrong official SHA-512 integrity fails closed even if files would match', async (t) => {
  const f = await fixture(t, built, npmMetadata(pkg, Buffer.from('incorrect integrity')));
  await assert.rejects(reusePublishedNpm(f), /SHA-512 integrity does not match/);
  assert.deepEqual(await readFile(f.tarball), built);
});

test('a genuinely unpublished version (404) keeps the original local build', async (t) => {
  const f = await fixture(t);
  const result = await reusePublishedNpm({
    ...f,
    fetchImpl: async () => new Response(null, { status: 404 }),
  });
  assert.equal(result.reused, false);
  assert.deepEqual(await readFile(f.tarball), built);
});

test('metadata identity, URL, redirects and non-404 network failures cannot authorize reuse', async (t) => {
  const valid = npmMetadata(pkg, built);
  for (const metadata of [
    { ...valid, name: 'unrelated-package' },
    { ...valid, version: '1.9.8' },
    { ...valid, dist: { ...valid.dist, tarball: valid.dist.tarball.replace('https:', 'http:') } },
    { ...valid, dist: { ...valid.dist, tarball: 'https://evil.example/package.tgz' } },
  ]) {
    const f = await fixture(t, built, metadata);
    await assert.rejects(reusePublishedNpm(f), /name\/version|tarball URL/);
    assert.equal(f.requests.length, 1);
    assert.deepEqual(await readFile(f.tarball), built);
  }
  for (const fetchImpl of [
    async () => new Response(null, { status: 302, headers: { location: 'https://evil.example/' } }),
    async () => new Response(null, { status: 500 }),
    async () => {
      throw Error('connection reset');
    },
  ]) {
    const f = await fixture(t);
    await assert.rejects(reusePublishedNpm({ ...f, fetchImpl }));
    assert.deepEqual(await readFile(f.tarball), built);
  }
});

test('oversized and stalled official downloads are bounded and leave the build intact', async (t) => {
  const f = await fixture(t);
  await assert.rejects(
    reusePublishedNpm({
      ...f,
      fetchImpl: async (url, options) =>
        url.endsWith('.tgz')
          ? new Response('small body', {
              headers: { 'content-length': String(MAX_PACKAGE_BYTES + 1) },
            })
          : f.fetchImpl(url, options),
    }),
    /allowed size/,
  );
  await assert.rejects(
    reusePublishedNpm({ ...f, timeoutMs: 5, fetchImpl: () => new Promise(() => {}) }),
    /timed out/,
  );
  assert.deepEqual(await readFile(f.tarball), built);
});

test('published links and case aliases are rejected before any regular-file comparison', async (t) => {
  for (const malicious of [
    tarEntry('package/link', '', '2'),
    tarEntry('package/PACKAGE.JSON', '{}'),
  ]) {
    const f = await fixture(t, archive(pkg, [client, malicious]));
    await assert.rejects(reusePublishedNpm(f), { code: 'BOOT_UPDATE_ARCHIVE' });
    assert.deepEqual(await readFile(f.tarball), built);
  }
});

test('safe GNU path metadata is a container difference, not a runtime difference', async (t) => {
  const published = archive(pkg, [
    tarEntry('././@LongLink', 'package/lib/client.js\0', 'L'),
    tarEntry('ignored', 'verified runtime'),
  ]);
  const f = await fixture(t, published);
  assert.equal((await reusePublishedNpm(f)).reused, true);
  assert.deepEqual(await readFile(f.tarball), published);
});
