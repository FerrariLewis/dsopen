import { build } from 'esbuild'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { requirePackageReleaseNotes } from '../src/release-notes.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
requirePackageReleaseNotes(pkg)
await mkdir(join(root, 'lib'), { recursive: true })
await copyFile(join(root, 'src/host.js'), join(root, 'lib/index.js'))
await copyFile(join(root, 'src/updates.js'), join(root, 'lib/updates.js'))
await copyFile(join(root, 'src/release-notes.js'), join(root, 'lib/release-notes.js'))
const common = { bundle: true, sourcemap: false, legalComments: 'eof', target: ['chrome110'], define: { 'process.env.NODE_ENV': '"production"', '__DSH_LEWIS_VERSION__': JSON.stringify(pkg.version) } }
await build({
  ...common,
  entryPoints: [join(root, 'src/client.jsx')],
  outfile: join(root, 'lib/client.js'),
  format: 'cjs', platform: 'browser', external: ['react', 'react-dom', 'react-dom/client'],
  banner: { js: 'window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory: (require) => { var module = { exports: {} }; var exports = module.exports;' },
  footer: { js: 'return module.exports; } });' },
})
await writeFile(join(root, 'lib/build-info.json'), JSON.stringify({ version: pkg.version, format: 'DSH ModuleLoader CJS + Node ESM', source: ['src/client.jsx', 'src/host.js'] }, null, 2) + '\n')
console.log(`Built dsh-boot-studio ${pkg.version}: host and DSH client.`)
