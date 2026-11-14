#!/usr/bin/env node
/** Verify the actually published old updater against an actual candidate archive. Never installs. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { regularFiles } from './build-npm-entry.mjs';
import { isNewerVersion } from '../src/version.js';

const PACKAGE = 'dsh-openup-lewis';
const OFFICIAL = 'https://registry.npmjs.org';
const HISTORICAL_REPO = 'FerrariLewis/open';
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const integrity = (bytes) => 'sha512-' + createHash('sha512').update(bytes).digest('base64');
async function download(url, limit = 80 * 1024 * 1024) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, OFFICIAL, 'Only the official npm registry may supply the baseline.');
  const response = await fetch(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(90_000),
    headers: { accept: 'application/json', 'user-agent': 'dsopen-upgrade-compatibility-check' },
  });
  const chunks = [];
  let bytes = 0;
  if (!response.ok) return { response, body: Buffer.alloc(0) };
  for await (const chunk of response.body) {
    bytes += chunk.byteLength;
    assert.ok(bytes <= limit, 'Official response exceeded the bounded download size.');
    chunks.push(Buffer.from(chunk));
  }
  return { response, body: Buffer.concat(chunks) };
}
async function registryJSON(url) {
  const result = await download(url, 4 * 1024 * 1024);
  assert.equal(result.response.status, 200, `Official registry request failed: ${url}`);
  return JSON.parse(result.body.toString('utf8'));
}

export async function verifyUpgrade({ candidate, baselineVersion = '1.3.4', out } = {}) {
  assert.ok(candidate, 'Provide --candidate with the actual standalone npm tarball.');
  const candidateArchive = await readFile(resolve(candidate));
  const candidateFiles = regularFiles(candidateArchive);
  const manifest = JSON.parse(candidateFiles.get('package.json').toString('utf8'));
  assert.equal(manifest.name, PACKAGE);
  assert.equal(
    manifest.repository?.url,
    `git+https://github.com/${HISTORICAL_REPO}.git`,
    'Candidate must retain the exact historical repository identity.',
  );
  const registry = await registryJSON(`${OFFICIAL}/${PACKAGE}`);
  const latest = registry['dist-tags']?.latest;
  assert.ok(
    isNewerVersion(manifest.version, latest),
    `Candidate ${manifest.version} must be newer than official latest ${latest}.`,
  );
  assert.equal(
    registry.versions?.[manifest.version],
    undefined,
    'The candidate version is already publicly occupied.',
  );
  const unused = await download(`${OFFICIAL}/${PACKAGE}/${manifest.version}`, 65536);
  assert.equal(
    unused.response.status,
    404,
    'The candidate version endpoint must still be unpublished.',
  );
  const baseline =
    registry.versions?.[baselineVersion] ||
    (await registryJSON(`${OFFICIAL}/${PACKAGE}/${baselineVersion}`));
  assert.equal(baseline.name, PACKAGE);
  assert.equal(baseline.version, baselineVersion);
  const baselineURL = `${OFFICIAL}/${PACKAGE}/-/${PACKAGE}-${baselineVersion}.tgz`;
  assert.equal(baseline.dist?.tarball, baselineURL);
  const old = await download(baselineURL);
  assert.equal(old.response.status, 200);
  assert.ok(
    String(baseline.dist.integrity).split(/\s+/).includes(integrity(old.body)),
    'Official old tarball failed its published SHA-512.',
  );
  const baselineFiles = regularFiles(old.body);
  const temp = await mkdtemp(join(tmpdir(), 'dsopen-actual-upgrade-'));
  const services = [];
  try {
    const root = join(temp, 'baseline');
    for (const [name, bytes] of baselineFiles) {
      if (name !== 'package.json' && !name.startsWith('lib/')) continue;
      const target = join(root, ...name.split('/'));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, bytes, { flag: 'wx' });
    }
    const installed = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    assert.equal(installed.name, PACKAGE);
    assert.equal(installed.version, baselineVersion);
    const original = await import(pathToFileURL(join(root, 'lib/updates.js')).href);
    let serviceNumber = 0;
    function service(fetchImpl) {
      const value = original.createUpdateService({
        packageFile: join(root, 'package.json'),
        dataDir: join(temp, 'cache', String(serviceNumber++)),
        profileRoot: join(temp, 'profiles'),
        fetchImpl,
      });
      services.push(value);
      return value;
    }
    const liveRequests = [];
    const live = service((url, options) => {
      liveRequests.push(url);
      return fetch(url, options);
    });
    const liveStatus = await live.check();
    assert.equal(liveStatus.currentVersion, baselineVersion);
    assert.equal(
      liveStatus.channelReady,
      true,
      'The real npm latest metadata was not accepted by the published updater.',
    );
    assert.equal(liveStatus.latestVersion, latest);
    assert.equal(liveStatus.available, isNewerVersion(latest, baselineVersion));

    const candidateURL = `${OFFICIAL}/${PACKAGE}/-/${PACKAGE}-${manifest.version}.tgz`;
    const metadata = {
      ...manifest,
      dist: { tarball: candidateURL, integrity: integrity(candidateArchive) },
    };
    const requested = [];
    function controlled(document = metadata, archive = candidateArchive) {
      return async (url) => {
        requested.push(url);
        if (url === `${OFFICIAL}/${PACKAGE}/latest`)
          return new Response(JSON.stringify(document), {
            headers: { 'content-type': 'application/json' },
          });
        if (url === candidateURL)
          return new Response(archive, {
            headers: {
              'content-type': 'application/octet-stream',
              'content-length': String(archive.length),
            },
          });
        throw new Error(`Unexpected compatibility-test URL: ${url}`);
      };
    }
    const candidateService = service(controlled());
    const status = await candidateService.check();
    assert.equal(status.packageName, PACKAGE);
    assert.equal(status.currentVersion, baselineVersion);
    assert.equal(status.available, true);
    assert.equal(status.channelReady, true);
    assert.equal(status.latestVersion, manifest.version);
    assert.equal(status.manifest.integrity, metadata.dist.integrity);
    const prepared = await candidateService.prepare(manifest.version);
    assert.equal(prepared.version, manifest.version);
    assert.equal(prepared.requiresRestart, true);
    assert.equal(prepared.sha256, sha256(candidateArchive));
    assert.deepEqual(
      await readFile(prepared.spec),
      candidateArchive,
      'The old updater must stage the exact verified candidate bytes.',
    );

    const rejected = [];
    for (const [label, patch] of [
      [
        'canonical repository identity substituted',
        { repository: { type: 'git', url: 'git+https://github.com/FerrariLewis/dsopen.git' } },
      ],
      ['different package name', { name: 'dsh-boot-studio' }],
      [
        'untrusted tarball URL',
        { dist: { ...metadata.dist, tarball: 'https://example.invalid/untrusted.tgz' } },
      ],
      ['missing SHA-512 integrity', { dist: { tarball: candidateURL } }],
    ]) {
      const invalid = await service(controlled({ ...metadata, ...patch })).check();
      assert.equal(invalid.available, false, label);
      assert.equal(invalid.channelReady, false, label);
      rejected.push({ case: label, code: invalid.code });
    }
    const tampered = Buffer.from(candidateArchive);
    tampered[tampered.length - 20] ^= 1;
    await assert.rejects(service(controlled(metadata, tampered)).prepare(manifest.version));
    rejected.push({ case: 'tampered actual candidate bytes', rejected: true });
    const report = {
      checkedAt: new Date().toISOString(),
      baseline: {
        name: PACKAGE,
        version: baselineVersion,
        tarball: baselineURL,
        sha256: sha256(old.body),
        publishedIntegrityVerified: true,
      },
      officialRegistry: {
        latest,
        candidateVersionPubliclyUnoccupied: true,
        liveOldUpdaterAcceptedLatest: true,
        requests: liveRequests,
      },
      candidate: {
        name: manifest.name,
        version: manifest.version,
        repository: manifest.repository.url,
        sha256: sha256(candidateArchive),
        bytes: candidateArchive.length,
      },
      controlledMetadataResult: {
        available: status.available,
        channelReady: status.channelReady,
        latestVersion: status.latestVersion,
        exactArchivePrepared: true,
        requiresRestart: prepared.requiresRestart,
        requests: requested,
      },
      rejected,
      scope:
        'Published old runtime + live official latest check + controlled future metadata using the actual candidate tarball. No real Harness installation, UI notification, public 1.4.0 registry availability or production collector behavior is claimed.',
    };
    if (out) {
      await mkdir(dirname(resolve(out)), { recursive: true });
      await writeFile(resolve(out), JSON.stringify(report, null, 2) + '\n');
    }
    return report;
  } finally {
    for (const value of services) value.dispose();
    await rm(temp, { recursive: true, force: true });
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    const name = process.argv[i];
    assert.ok(['--candidate', '--baseline-version', '--out'].includes(name));
    args[name.slice(2).replace('-v', 'V')] = process.argv[i + 1];
  }
  console.log(JSON.stringify(await verifyUpgrade(args), null, 2));
}
