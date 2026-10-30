#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { CORE_PACKAGE_NAME } from '../src/constants.js';
import { requirePackageReleaseNotes } from '../src/release-notes.js';
import { versionParts } from '../src/version.js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
versionParts(manifest.version);
requirePackageReleaseNotes(manifest, { bilingual: true });
const buildInfo = JSON.parse(await readFile(join(root, 'lib/build-info.json'), 'utf8'));
assert.equal(buildInfo.version, manifest.version, 'Build must use the actual package version.');
for (const entry of await readdir(join(root, 'src'), { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')) {
    await access(join(root, 'lib', entry.name === 'host.js' ? 'index.js' : entry.name));
  }
}
const client = await readFile(join(root, 'lib/client.js'), 'utf8');
assert.ok(client.startsWith(`window.__ModuleLoader__.load({ id: "${CORE_PACKAGE_NAME}", factory:`));
assert.ok(!client.includes('__DSH_LEWIS_VERSION__'), 'Build version placeholder must be resolved.');
new Script(client, { filename: 'lib/client.js' });
const host = await import('../lib/index.js');
assert.equal(typeof host.apply, 'function');
assert.equal(typeof host.createHandler, 'function');
const updates = await import('../lib/updates.js');
assert.equal(typeof updates.createUpdateService, 'function');
console.log(
  `Verified complete runtime, version injection and bilingual notes: ${manifest.version}`,
);
