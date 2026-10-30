import { build } from 'esbuild';
import { copyFile, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';
import { requirePackageReleaseNotes } from '../src/release-notes.js';
import { CORE_PACKAGE_NAME } from '../src/constants.js';
import { versionParts } from '../src/version.js';
import { serverRuntimeFiles, runtimeOutputPath } from './server-runtime.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
requirePackageReleaseNotes(pkg, { bilingual: true });
versionParts(pkg.version);
if (pkg.name !== CORE_PACKAGE_NAME) throw Error('Unexpected core package identity.');
const output = resolve(root, 'lib');
if (relative(root, output) !== 'lib')
  throw Error('Refusing to clean an unexpected output directory.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Resolve side-effect imports, re-exports and literal dynamic imports with esbuild.
// Preserve Node ESM source bytes and module locations; browser-only helpers stay bundled.
const serverFiles = await serverRuntimeFiles(join(root, 'src'));
if (new Set(serverFiles.map(runtimeOutputPath)).size !== serverFiles.length)
  throw new Error('Server entry point would overwrite a dependency module.');
for (const file of serverFiles) {
  const destination = join(output, runtimeOutputPath(file));
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(root, 'src', file), destination);
}
const common = {
  absWorkingDir: root,
  bundle: true,
  sourcemap: false,
  minify: true,
  keepNames: true,
  legalComments: 'eof',
  target: ['chrome110'],
  define: {
    'process.env.NODE_ENV': '"production"',
    __DSH_LEWIS_VERSION__: JSON.stringify(pkg.version),
  },
};
await build({
  ...common,
  entryPoints: [join(root, 'src/client.jsx')],
  outfile: join(root, 'lib/client.js'),
  format: 'cjs',
  platform: 'browser',
  external: ['react', 'react-dom', 'react-dom/client'],
  banner: {
    js: 'window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory: (require) => { var module = { exports: {} }; var exports = module.exports;',
  },
  footer: { js: 'return module.exports; } });' },
});
await writeFile(
  join(root, 'lib/build-info.json'),
  JSON.stringify(
    {
      version: pkg.version,
      format: 'DSH ModuleLoader CJS + Node ESM',
      source: ['src/client.jsx', 'src/host.js'],
      serverFiles: serverFiles.map(runtimeOutputPath),
    },
    null,
    2,
  ) + '\n',
);
console.log(`Built dsh-boot-studio ${pkg.version}: host and DSH client.`);
