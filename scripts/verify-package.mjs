#!/usr/bin/env node
/** Verify the actual packed runtime in a fresh directory without installed dependencies. */
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Script } from 'node:vm';
import { CORE_PACKAGE_NAME, NPM_ENTRY_NAME } from '../src/constants.js';
import { regularFiles } from './build-npm-entry.mjs';
import { inspectTarball } from './release.mjs';
import { serverRuntimeFiles } from './server-runtime.mjs';

export async function verifyPackedRuntime(tarball) {
  const { manifest } = await inspectTarball(tarball);
  assert.ok([CORE_PACKAGE_NAME, NPM_ENTRY_NAME].includes(manifest.name));
  for (const key of [
    'dependencies',
    'optionalDependencies',
    'peerDependencies',
    'bundledDependencies',
    'bundleDependencies',
  ])
    assert.equal(
      Object.keys(manifest[key] ?? {}).length,
      0,
      `Packed runtime cannot depend on ${key}.`,
    );
  for (const name of [
    'preinstall',
    'install',
    'postinstall',
    'prepare',
    'preprepare',
    'postprepare',
    'prepublish',
    'prepublishOnly',
    'prepack',
    'postpack',
    'postpublish',
  ])
    assert.equal(manifest.scripts?.[name], undefined, `Packed runtime cannot run ${name}.`);
  const files = regularFiles(await readFile(resolve(tarball)));
  const directory = await mkdtemp(join(tmpdir(), 'lewis-packed-runtime-'));
  try {
    for (const [name, bytes] of files) {
      if (name !== 'package.json' && !name.startsWith('lib/')) continue;
      const path = join(directory, ...name.split('/'));
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, bytes, { flag: 'wx' });
    }
    const server = await serverRuntimeFiles(join(directory, 'lib'), 'index.js');
    const info = JSON.parse(files.get('lib/build-info.json')?.toString('utf8') ?? 'null');
    assert.equal(info?.version, manifest.version);
    assert.deepEqual(
      [...info.serverFiles].sort(),
      server,
      'Packed build manifest must describe the complete dependency closure.',
    );
    const scripts = [...files.keys()]
      .filter((name) => name.startsWith('lib/') && name.endsWith('.js'))
      .sort();
    assert.deepEqual(
      scripts,
      [
        ...server.filter((name) => name.endsWith('.js')).map((name) => 'lib/' + name),
        'lib/client.js',
      ].sort(),
      'Package must only contain the client bundle and required server modules.',
    );
    for (const file of server)
      if (file.endsWith('.js')) await import(pathToFileURL(join(directory, 'lib', file)).href);
    const host = await import(pathToFileURL(join(directory, 'lib/index.js')).href);
    assert.equal(typeof host.apply, 'function');
    assert.equal(typeof host.createHandler, 'function');
    const registrations = [];
    new Script(files.get('lib/client.js').toString('utf8')).runInNewContext({
      window: { __ModuleLoader__: { load: (plugin) => registrations.push(plugin) } },
    });
    assert.equal(registrations.length, 1);
    assert.equal(
      registrations[0].id,
      manifest.name,
      'Client must register the packed package identity.',
    );
    assert.equal(typeof registrations[0].factory, 'function');
    return {
      packageName: manifest.name,
      version: manifest.version,
      files: files.size,
      serverFiles: server,
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) throw new Error('Specify one or more packed tarballs to verify.');
  for (const tarball of process.argv.slice(2))
    console.log(JSON.stringify(await verifyPackedRuntime(tarball)));
}
