import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { build } from 'esbuild';
import { verifyPackedRuntime } from '../scripts/verify-package.mjs';
import { buildNpmEntry } from '../scripts/build-npm-entry.mjs';
import { archive, packageManifest, tarEntry } from './update-fixtures.mjs';

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'lewis-packed-fixture-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const pkg = packageManifest('1.2.6', { name: 'dsh-boot-studio', type: 'module' });
  const client = await build({
    stdin: { contents: 'export function apply() { return "retained"; }' },
    write: false,
    bundle: true,
    minify: true,
    keepNames: true,
    format: 'cjs',
    banner: {
      js: 'window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory: (require) => { var module = { exports: {} }; var exports = module.exports;',
    },
    footer: { js: 'return module.exports; } });' },
  });
  const files = {
    'lib/client.js': client.outputFiles[0].contents,
    'lib/index.js': `export * from './release-notes.js'; export const apply = () => {}; export const createHandler = () => {}; export const later = () => import('./lazy.js');`,
    'lib/release-notes.js': 'export const notes = "retained";',
    'lib/lazy.js': 'export const available = true;',
    'lib/build-info.json': JSON.stringify({
      version: pkg.version,
      serverFiles: ['index.js', 'lazy.js', 'release-notes.js'],
    }),
    'README.md': 'Fixture package',
  };
  return {
    pkg,
    files,
    directory,
    async pack(name, contents = files, manifest = pkg) {
      const path = join(directory, name + '.tgz');
      await writeFile(
        path,
        archive(
          manifest,
          Object.entries(contents).map(([file, body]) => tarEntry('package/' + file, body)),
        ),
      );
      return path;
    },
  };
}

test('minified core and rewritten npm registration both verify in independent packed runtimes', async (t) => {
  const data = await fixture(t);
  const core = await data.pack('core');
  assert.equal((await verifyPackedRuntime(core)).packageName, 'dsh-boot-studio');
  const out = join(data.directory, 'npm-entry');
  await buildNpmEntry({ tarball: core, out, repo: 'FerrariLewis/dsopen' });
  const files = { ...data.files, 'lib/client.js': await readFile(join(out, 'lib/client.js')) };
  const pkg = JSON.parse(await readFile(join(out, 'package.json'), 'utf8'));
  const npm = await data.pack('npm', files, pkg);
  assert.equal((await verifyPackedRuntime(npm)).packageName, 'dsh-openup-lewis');
});

test('packed verification catches missing lazy modules, undeclared runtime files and invalid registration', async (t) => {
  const data = await fixture(t);
  const missing = { ...data.files };
  delete missing['lib/lazy.js'];
  await assert.rejects(verifyPackedRuntime(await data.pack('missing', missing)));
  const unused = { ...data.files, 'lib/browser-only.js': 'export const unused = true;' };
  await assert.rejects(verifyPackedRuntime(await data.pack('unused', unused)), /only contain/);
  const wrong = {
    ...data.files,
    'lib/client.js': Buffer.from(data.files['lib/client.js'])
      .toString()
      .replace('id: "dsh-boot-studio"', 'id: "another-plugin"'),
  };
  await assert.rejects(
    verifyPackedRuntime(await data.pack('wrong', wrong)),
    /packed package identity/,
  );
});
