import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, lstat, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildNpmEntry } from '../scripts/build-npm-entry.mjs';
import { archive, packageManifest, tarEntry } from './update-fixtures.mjs';

test('npm entry extraction shares runtime path validation before writing any files', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'lewis-npm-paths-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const pkg = packageManifest('1.2.6', { name: 'dsh-boot-studio', type: 'module' });
  const required = [
    tarEntry(
      'package/lib/client.js',
      'window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory: () => ({}) });',
    ),
    tarEntry('package/lib/index.js', 'export const apply = () => {};'),
    tarEntry('package/lib/release-notes.js', '// fixture'),
    tarEntry('package/README.md', 'Test package'),
  ];
  const source = join(root, 'valid.tgz');
  await writeFile(source, archive(pkg, required));
  const output = join(root, 'valid-output');
  await buildNpmEntry({ tarball: source, out: output, repo: 'FerrariLewis/dsopen' });
  assert.equal(
    JSON.parse(await readFile(join(output, 'package.json'), 'utf8')).name,
    'dsh-openup-lewis',
  );
  for (const [index, path] of [
    'package/PACKAGE.JSON',
    'package/assets/NUL.txt',
    'package/assets/file.txt.',
  ].entries()) {
    const tarball = join(root, `invalid-${index}.tgz`),
      out = join(root, `invalid-output-${index}`);
    await writeFile(tarball, archive(pkg, [...required, tarEntry(path, '{}')]));
    await assert.rejects(buildNpmEntry({ tarball, out, repo: 'FerrariLewis/dsopen' }), {
      code: 'BOOT_UPDATE_ARCHIVE',
    });
    await assert.rejects(lstat(out), { code: 'ENOENT' });
  }
});
