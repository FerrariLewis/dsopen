import { build } from 'esbuild';
import { copyFile, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';
import { requirePackageReleaseNotes } from '../src/release-notes.js';
import { CORE_PACKAGE_NAME } from '../src/constants.js';
import { versionParts } from '../src/version.js';

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
// Copy the complete ESM dependency graph, including shared validation and cleanup.
// These files have no install hooks and are available for offline use.
for (const entry of await readdir(join(root, 'src'), { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')) {
    await copyFile(
      join(root, 'src', entry.name),
      join(output, entry.name === 'host.js' ? 'index.js' : entry.name),
    );
  }
}
const common = {
  bundle: true,
  sourcemap: false,
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
    },
    null,
    2,
  ) + '\n',
);
console.log(`Built dsh-boot-studio ${pkg.version}: host and DSH client.`);
