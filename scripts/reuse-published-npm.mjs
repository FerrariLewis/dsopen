#!/usr/bin/env node
/** Keep a stage-first release byte-identical to the already public npm artifact. */
import { readFile, writeFile, rename, unlink, lstat } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { NPM_ENTRY_NAME, MAX_PACKAGE_BYTES } from '../src/constants.js';
import { versionParts } from '../src/version.js';
import { readPackageManifestAsync } from '../src/updates.js';
import { regularFiles } from './build-npm-entry.mjs';

const REGISTRY = 'https://registry.npmjs.org';
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function withAbort(promise, signal) {
  if (signal.aborted) return Promise.reject(signal.reason);
  return new Promise((resolveValue, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise)
      .then(resolveValue, reject)
      .finally(() => signal.removeEventListener('abort', abort));
  });
}

async function officialResponse(fetchImpl, url, signal) {
  const response = await withAbort(
    fetchImpl(url, {
      signal,
      redirect: 'manual',
      headers: { accept: url.endsWith('.tgz') ? 'application/octet-stream' : 'application/json' },
    }),
    signal,
  );
  if (
    (response.status >= 300 && response.status < 400) ||
    response.redirected ||
    (response.url && response.url !== url)
  ) {
    void response.body?.cancel().catch(() => {});
    throw Error('Official npm reuse does not accept redirects or a different response URL.');
  }
  return response;
}

async function boundedBytes(response, limit, signal) {
  const rawLength = response.headers.get('content-length');
  const length = rawLength === null ? null : Number(rawLength);
  if (
    rawLength !== null &&
    (!/^\d+$/.test(rawLength) || !Number.isSafeInteger(length) || length > limit)
  ) {
    void response.body?.cancel().catch(() => {});
    throw Error('Official npm response exceeds the allowed size or has an invalid length.');
  }
  const reader = response.body?.getReader();
  if (!reader) throw Error('Official npm response has no readable body.');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await withAbort(reader.read(), signal);
      if (done) break;
      if (!(value instanceof Uint8Array))
        throw Error('Official npm response contains invalid bytes.');
      size += value.byteLength;
      if (size > limit) throw Error('Official npm response exceeds the allowed size.');
      chunks.push(Buffer.from(value));
    }
    if (length !== null && size !== length) throw Error('Official npm response is incomplete.');
    return Buffer.concat(chunks, size);
  } catch (error) {
    void reader.cancel().catch(() => {});
    throw error;
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* An aborted reader may still be settling. */
    }
  }
}

function assertSameFiles(built, published) {
  if (built.size !== published.size)
    throw Error('Published npm package has a different file inventory.');
  for (const [name, bytes] of built) {
    const other = published.get(name);
    // package.json is deliberately compared byte-for-byte, like every runtime
    // and media file. Only compression and TAR container metadata may differ.
    if (!other || !bytes.equals(other))
      throw Error(`Published npm package contents differ: ${name}`);
  }
}

export async function reusePublishedNpm({ tarball, fetchImpl = fetch, timeoutMs = 120_000 } = {}) {
  if (!tarball) throw Error('Specify the local npm tarball with --tarball.');
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) throw Error('Invalid npm reuse timeout.');
  const path = resolve(tarball),
    info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink() || info.size <= 0 || info.size > MAX_PACKAGE_BYTES)
    throw Error('Local npm tarball is not a bounded regular file.');
  const builtBytes = await readFile(path),
    builtManifest = await readPackageManifestAsync(builtBytes);
  if (builtManifest.name !== NPM_ENTRY_NAME)
    throw Error('Only the project npm entry package may be reused.');
  versionParts(builtManifest.version);
  const builtFiles = regularFiles(builtBytes);
  const report = {
    packageName: builtManifest.name,
    version: builtManifest.version,
    bytes: builtBytes.length,
    sha256: sha256(builtBytes),
    reused: false,
  };
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(Error('Official npm reuse timed out.')),
    timeoutMs,
  );
  try {
    const response = await officialResponse(
      fetchImpl,
      `${REGISTRY}/${NPM_ENTRY_NAME}/${builtManifest.version}`,
      controller.signal,
    );
    if (response.status === 404) {
      void response.body?.cancel().catch(() => {});
      return report;
    }
    if (!response.ok) {
      void response.body?.cancel().catch(() => {});
      throw Error(`Official npm metadata returned HTTP ${response.status}.`);
    }
    const metadata = JSON.parse(
      (await boundedBytes(response, 65536, controller.signal)).toString('utf8'),
    );
    if (
      !metadata ||
      Array.isArray(metadata) ||
      metadata.name !== builtManifest.name ||
      metadata.version !== builtManifest.version
    )
      throw Error('Official npm package name/version does not match the local build.');
    const expectedURL = `${REGISTRY}/${NPM_ENTRY_NAME}/-/${NPM_ENTRY_NAME}-${builtManifest.version}.tgz`;
    if (metadata.dist?.tarball !== expectedURL)
      throw Error('Official npm tarball URL does not match the exact package/version.');
    const integrity = metadata.dist?.integrity;
    if (
      typeof integrity !== 'string' ||
      !/^sha512-[A-Za-z0-9+/]{86}==$/.test(integrity) ||
      Buffer.from(integrity.slice(7), 'base64').toString('base64') !== integrity.slice(7)
    )
      throw Error('Official npm package has no valid SHA-512 integrity.');
    const archiveResponse = await officialResponse(fetchImpl, expectedURL, controller.signal);
    if (!archiveResponse.ok) {
      void archiveResponse.body?.cancel().catch(() => {});
      throw Error(`Official npm tarball returned HTTP ${archiveResponse.status}.`);
    }
    const publishedBytes = await boundedBytes(
      archiveResponse,
      MAX_PACKAGE_BYTES,
      controller.signal,
    );
    if ('sha512-' + createHash('sha512').update(publishedBytes).digest('base64') !== integrity)
      throw Error('Official npm tarball SHA-512 integrity does not match.');
    const publishedManifest = await readPackageManifestAsync(publishedBytes);
    if (
      publishedManifest.name !== builtManifest.name ||
      publishedManifest.version !== builtManifest.version
    )
      throw Error('Official npm tarball manifest differs from its metadata.');
    assertSameFiles(builtFiles, regularFiles(publishedBytes));
    if (controller.signal.aborted) throw controller.signal.reason;
    // Detect another build replacing the destination while the registry was read.
    if (!builtBytes.equals(await readFile(path)))
      throw Error('Local npm tarball changed while verifying the published artifact.');
    if (!builtBytes.equals(publishedBytes)) {
      const temporary = join(dirname(path), `.reuse-npm-${randomUUID()}.part`);
      try {
        await writeFile(temporary, publishedBytes, { flag: 'wx' });
        await rename(temporary, path);
      } finally {
        await unlink(temporary).catch(() => {});
      }
    }
    return {
      ...report,
      bytes: publishedBytes.length,
      sha256: sha256(publishedBytes),
      reused: true,
      source: expectedURL,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.length !== 2 || argv[0] !== '--tarball' || !argv[1])
    throw Error('Usage: node scripts/reuse-published-npm.mjs --tarball package.tgz');
  console.log(JSON.stringify(await reusePublishedNpm({ tarball: argv[1] }), null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  main().catch((error) => {
    console.error(`npm artifact reuse failed: ${error.message}`);
    process.exitCode = 1;
  });
