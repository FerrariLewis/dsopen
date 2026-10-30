#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Script } from 'node:vm';
import { CORE_PACKAGE_NAME } from '../src/constants.js';
import { requirePackageReleaseNotes } from '../src/release-notes.js';
import { versionParts } from '../src/version.js';
import { serverRuntimeFiles, runtimeOutputPath } from './server-runtime.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
versionParts(manifest.version);
requirePackageReleaseNotes(manifest, { bilingual: true });
const buildInfo = JSON.parse(await readFile(join(root, 'lib/build-info.json'), 'utf8'));
assert.equal(buildInfo.version, manifest.version, 'Build must use the actual package version.');
const sourceFiles = await serverRuntimeFiles(join(root, 'src'));
const expected = sourceFiles.map(runtimeOutputPath).sort();
const built = await serverRuntimeFiles(join(root, 'lib'), 'index.js');
assert.deepEqual(
  built,
  expected,
  'Built runtime must contain the entire server dependency closure.',
);
assert.deepEqual(
  [...buildInfo.serverFiles].sort(),
  expected,
  'Build manifest must list every server file.',
);
for (const file of sourceFiles) {
  const destination = join(root, 'lib', runtimeOutputPath(file));
  assert.ok(
    (await readFile(destination)).equals(await readFile(join(root, 'src', file))),
    `Server source must be copied without transformations: ${file}`,
  );
  if (file.endsWith('.js')) await import(pathToFileURL(destination).href);
}
const allBuiltFiles = (await readdir(join(root, 'lib'), { recursive: true }))
  .filter((file) => file.endsWith('.js'))
  .map((file) => file.replaceAll('\\', '/'))
  .sort();
assert.deepEqual(
  allBuiltFiles,
  [...expected.filter((file) => file.endsWith('.js')), 'client.js'].sort(),
  'Distribution must not include unused browser source modules.',
);
const client = await readFile(join(root, 'lib/client.js'), 'utf8');
assert.ok(client.startsWith(`window.__ModuleLoader__.load({ id: "${CORE_PACKAGE_NAME}", factory:`));
assert.ok(!client.includes('__DSH_LEWIS_VERSION__'), 'Build version placeholder must be resolved.');
const registrations = [];
new Script(client, { filename: 'lib/client.js' }).runInNewContext({
  window: { __ModuleLoader__: { load: (plugin) => registrations.push(plugin) } },
  fetch: () => {
    throw new Error('Loading the client must not start a network request.');
  },
  AbortController,
  URL,
  performance,
  setTimeout,
  clearTimeout,
});
assert.equal(registrations.length, 1, 'Client must register exactly one plugin.');
assert.equal(registrations[0].id, CORE_PACKAGE_NAME);
const clientExports = registrations[0].factory((name) => {
  assert.ok(
    ['react', 'react-dom', 'react-dom/client'].includes(name),
    `Unexpected client dependency: ${name}`,
  );
  return {};
});
for (const name of ['apply', 'Player', 'SettingsPanel', 'BootRoot', 'openSettings', 'api'])
  assert.equal(
    typeof clientExports[name],
    'function',
    `Client export must remain available: ${name}`,
  );
const host = await import('../lib/index.js');
assert.equal(typeof host.apply, 'function');
assert.equal(typeof host.createHandler, 'function');
const updates = await import('../lib/updates.js');
assert.equal(typeof updates.createUpdateService, 'function');
console.log(
  `Verified complete runtime, version injection and bilingual notes: ${manifest.version}`,
);
