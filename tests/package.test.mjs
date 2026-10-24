import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync, spawn } from 'node:child_process'
import { once } from 'node:events'

// Run against a real pnpm/npm tarball, including a freshly packed one in CI:
// DSH_BOOT_STUDIO_TARBALL=/absolute/path/package.tgz node --test tests/package.test.mjs
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const sourceManifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const tarball = resolve(process.env.DSH_BOOT_STUDIO_TARBALL || join(root, `${sourceManifest.name}-${sourceManifest.version}.tgz`))
const enabled = existsSync(tarball)
const options = { skip: enabled ? false : 'Create a tarball with pnpm pack, or set DSH_BOOT_STUDIO_TARBALL.' }
let scratch, packaged, files, manifest
const hashes = {
  'deepseek-brand-intro.mp4': 'b22de4810e195b50f5da760febca8352d9e2dbd7bbefe7c203cc294bd8203c72',
  'deepseek-cyberpunk-intro.mp4': 'beabf5956e0b467e9f06f467b3f5b7a682abb6555c1b16aee1c27f7e5b334a58',
  'deepseek-awakening-intro.mp4': 'ff5afe0dabc16e09d5d1d4a349a551173a872f5c9850c0aab358ebaaf4b09712',
  'deepseek-startup-intro.mp4': 'ba72c501021444cd4bd89ce2cf547a539dfb0874c985a03859d048ee013acb4f',
}
const coverHashes = {
  'silver.png': '58441fc17ae9dd278f35837b512bfa86c9187a5831108e6be5d92704404b20a8',
  'gold.png': 'bb69bbb0a3948b2416f7384af497453e0ac589f939fd19ec5877b1882933ef03',
  'ice.png': '5b568ec35769aa9ba9c195af0cb609e6590138150b73f406d97079ed8c3e47ed',
}
async function walk(path, prefix = '') {
  const names = []
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const relative = prefix + entry.name
    if (entry.isDirectory()) names.push(...await walk(join(path, entry.name), relative + '/'))
    else { assert.ok(entry.isFile(), `Unexpected non-file in archive: ${relative}`); names.push(relative) }
  }
  return names
}
before(async () => {
  if (!enabled) return
  scratch = await mkdtemp(join(tmpdir(), 'boot-studio-package-'))
  const tar = process.platform === 'win32' ? join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar'
  const listing = execFileSync(tar, ['-tf', tarball], { encoding: 'utf8' }).trim().split(/\r?\n/)
  assert.ok(listing.every(path => path.startsWith('package/') && !path.split('/').includes('..')), 'Archive paths must remain inside package/')
  execFileSync(tar, ['-xf', tarball, '-C', scratch])
  packaged = join(scratch, 'package')
  files = await walk(packaged)
  manifest = JSON.parse(await readFile(join(packaged, 'package.json'), 'utf8'))
})
after(async () => { if (scratch) await rm(scratch, { recursive: true, force: true }) })

test('published tarball has executable entry points without install-time scripts or private data', options, async () => {
  const updates=await import(pathToFileURL(join(packaged,'lib/updates.js')));
  const inspected=updates.readPackageManifest(await readFile(tarball));
  assert.equal(inspected.name,manifest.name);assert.equal(inspected.version,manifest.version);
  for (const required of ['lib/client.js', 'lib/index.js', 'lib/updates.js', 'preview/app.js', 'preview/index.html', 'scripts/preview.mjs']) assert.ok(files.includes(required), `Missing published artifact ${required}`)
  for (const entry of Object.values(manifest.exports)) assert.ok(existsSync(join(packaged, entry)), `Missing export ${entry}`)
  assert.equal(manifest.main, manifest.exports['.'])
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.ok((await readFile(join(packaged, 'cordis.patch.yml'), 'utf8')).includes('name: dsh-boot-studio'))
  for (const lifecycle of ['preinstall', 'install', 'postinstall', 'prepublish', 'preprepare', 'prepare', 'postprepare']) assert.equal(manifest.scripts?.[lifecycle], undefined, `Unexpected lifecycle ${lifecycle}`)
  assert.equal(manifest.dependencies, undefined)
  const forbidden = /(^|\/)(node_modules|\.git|\.preview-data|test-results|playwright-report|install-backups|\.dsh|sessions|storages)(\/|$)|(?:^|\/)(?:images\/i_|videos\/u_)[a-f0-9-]{36}\.|credentials|cookies|\.env($|\.)|settings\.json$|\.tgz$/i
  assert.deepEqual(files.filter(path => forbidden.test(path)), [])
  const secrets = /(?:[A-Za-z]:\\+Users\\+|[A-Za-z]:\/Users\/)[^\\\/"'\s]+|github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/
  for (const file of files.filter(path => /\.(?:js|jsx|mjs|json|md|html|cmd|yml|yaml)$/.test(path))) assert.doesNotMatch(await readFile(join(packaged, file), 'utf8'), secrets, `Private content in ${file}`)
})

test('extracted host locates four bundled videos and exposes the sequence without a fake media URL', options, async t => {
  const host = await import(pathToFileURL(join(packaged, manifest.exports['.'])))
  assert.equal(typeof host.apply, 'function')
  const handler = host.createHandler({ dataDir: join(scratch, 'host-data') })
  const server = createServer(handler).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => { server.closeAllConnections(); await new Promise(done => server.close(done)) })
  const origin = `http://127.0.0.1:${server.address().port}`
  const response = await fetch(origin + '/dsh-boot-studio/state')
  assert.equal(response.status, 200)
  const state = await response.json()
  assert.equal(state.clips.length, 5)
  assert.equal(state.clips.filter(clip => clip.kind === 'video').length, 4)
  const sequence = state.clips.find(clip => clip.id === 'startup-screen')
  assert.equal(sequence.kind, 'sequence')
  assert.equal(sequence.url, null)
  assert.equal(sequence.bytes, 0)
  assert.equal(state.settings.endScreen, 'logo')
  assert.equal(Object.hasOwn(state.settings, 'duration'), false)
  assert.equal(state.settings.logoVariant, 'silver')
  assert.equal(state.settings.endImageId, null)
  assert.deepEqual(state.endImages, [])
  assert.deepEqual(state.logos.map(logo => logo.id), ['silver', 'gold', 'ice'])
  for (const logo of state.logos) {
    assert.ok(files.includes(`assets/end-covers/${logo.id}.png`))
    const response = await fetch(origin + logo.url, { method: 'HEAD' })
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'image/png')
    assert.equal(Number(response.headers.get('content-length')), logo.bytes)
  }
  assert.equal((await fetch(origin + '/dsh-boot-studio/media/startup-screen')).status, 404)
  for (const clip of state.clips.filter(clip => clip.kind === 'video')) {
    const media = await fetch(origin + clip.url, { method: 'HEAD' })
    assert.equal(media.status, 200)
    assert.equal(Number(media.headers.get('content-length')), clip.bytes)
  }
})

test('tarball retains exact licensed media, upstream permission and working documentation links', options, async () => {
  for (const [file, expected] of Object.entries(hashes)) assert.equal(createHash('sha256').update(await readFile(join(packaged, 'assets', file))).digest('hex'), expected, file)
  for (const [file, expected] of Object.entries(coverHashes)) assert.equal(createHash('sha256').update(await readFile(join(packaged, 'assets', 'end-covers', file))).digest('hex'), expected, file)
  const license = await readFile(join(packaged, 'LICENSE'), 'utf8')
  assert.match(license, /BSD 3-Clause License/)
  assert.match(license, /with the plugin author's permission/)
  const notices = await readFile(join(packaged, 'THIRD_PARTY_NOTICES.md'), 'utf8')
  assert.match(notices, /24c711296cb4af2618fef4f65e81346a660fc67b/)
  assert.match(notices, /Copyright \(c\) Facebook, Inc\. and its affiliates\./)
  assert.match(notices, /Permission is hereby granted/)
  for (const file of files.filter(path => path.endsWith('.md'))) {
    const text = await readFile(join(packaged, file), 'utf8')
    for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0]
      if (!target || /^(?:https?:|mailto:)/.test(target)) continue
      assert.ok(existsSync(resolve(dirname(join(packaged, file)), target)), `Broken link in ${file}: ${target}`)
    }
  }
})

test('standalone preview in the extracted tarball runs without dev dependencies', options, async t => {
  const reservation = createServer().listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const port = reservation.address().port
  await new Promise(done => reservation.close(done))
  const child = spawn(process.execPath, [join(packaged, 'scripts', 'preview.mjs')], { cwd: packaged, env: { ...process.env, PORT: String(port), DSH_BOOT_STUDIO_DATA: join(scratch, 'preview-data') }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  t.after(async () => { if (child.exitCode === null) { child.kill(); await once(child, 'exit') } })
  let stderr = ''
  child.stderr.on('data', chunk => { stderr += chunk })
  await new Promise((ready, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview startup timed out: ' + stderr)), 8000)
    child.stdout.on('data', chunk => { if (String(chunk).includes(`127.0.0.1:${port}`)) { clearTimeout(timer); ready() } })
    child.once('error', error => { clearTimeout(timer); reject(error) })
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Preview exited ${code}: ${stderr}`)) })
  })
  const origin = `http://127.0.0.1:${port}`
  const page = await fetch(origin)
  assert.equal(page.status, 200)
  assert.match(await page.text(), /<script src="\/app\.js"><\/script>/)
  const app = await fetch(origin + '/app.js')
  assert.equal(app.status, 200)
  assert.ok((await app.text()).length > 100_000)
  assert.equal((await (await fetch(origin + '/dsh-boot-studio/state')).json()).clips.length, 5)
})
