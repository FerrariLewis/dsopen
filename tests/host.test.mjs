import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer, request } from 'node:http'
import { once } from 'node:events'
import { createHandler, BASE_PATH } from '../src/host.js'

const assetsDir = new URL('../assets/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const headers = { 'x-dsh-boot-studio': '1' }
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z4tQAAAAASUVORK5CYII=', 'base64')
const imageHeaders = filename => ({ ...headers, 'x-file-name': encodeURIComponent(filename), 'content-type': 'image/png' })
async function fixture(t, options = {}) {
  const dataDir = await mkdtemp(join(tmpdir(), 'dsh-boot-studio-test-'))
  const handler = createHandler({ dataDir, assetsDir, ...options })
  const server = createServer(handler)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => { server.closeAllConnections(); await new Promise(r => server.close(r)); await rm(dataDir, { recursive: true, force: true }) })
  const base = `http://127.0.0.1:${server.address().port}${BASE_PATH}`
  return { dataDir, server, base, get: async path => (await fetch(base + path)).json(), post: async (path, body, extra = {}) => fetch(base + path, { method: 'POST', headers: { ...headers, 'content-type': 'application/json', ...extra }, body: JSON.stringify(body) }) }
}

test('ships four playable videos plus one programmatic sequence; launch uses the selected clip', async t => {
  const f = await fixture(t)
  const state = await f.get('/state')
  assert.equal(state.clips.length, 5)
  assert.deepEqual(state.settings, { enabled: true, sound: false, volume: 0.7, fit: 'cover', shuffle: false, selectedId: 'brand', endScreen: 'logo', endImageId: null, logoVariant: 'silver', endFit: 'contain' })
  assert.equal(state.maxUploadBytes, 200 * 1024 * 1024)
  assert.equal(state.maxImageUploadBytes, 20 * 1024 * 1024)
  assert.deepEqual(state.endImages, [])
  assert.ok(state.clips.filter(c => c.kind === 'video').every(c => c.bytes > 1_000_000 && c.source === 'builtin' && typeof c.url === 'string'))
  assert.deepEqual(state.clips.find(c => c.kind === 'sequence'), { id: 'startup-screen', name: 'DeepSeek · 技术档案', source: 'builtin', kind: 'sequence', url: null, bytes: 0 })
  assert.equal((await f.get('/launch')).clip.id, 'brand')
  const selected = await f.post('/settings', { selectedId: 'cyberpunk', shuffle: false })
  assert.equal(selected.status, 200)
  assert.equal((await f.get('/launch')).clip.id, 'cyberpunk')
  assert.equal((await f.post('/settings', { selectedId: 'startup-screen' })).status, 200)
  assert.equal((await f.get('/launch')).clip.kind, 'sequence')
  assert.equal((await fetch(f.base + '/media/startup-screen')).status, 404)
})

test('streams exact Range, suffix, open-ended, HEAD and cache validators', async t => {
  const f = await fixture(t)
  const original = await readFile(join(assetsDir, 'deepseek-brand-intro.mp4'))
  const path = f.base + '/media/brand'
  const head = await fetch(path, { method: 'HEAD' })
  assert.equal(head.status, 200)
  assert.equal(Number(head.headers.get('content-length')), original.length)
  assert.equal((await head.arrayBuffer()).byteLength, 0)
  for (const [range, start, end] of [['bytes=0-15', 0, 15], ['bytes=-8', original.length - 8, original.length - 1], [`bytes=${original.length - 8}-`, original.length - 8, original.length - 1]]) {
    const response = await fetch(path, { headers: { Range: range } })
    assert.equal(response.status, 206)
    assert.equal(response.headers.get('content-range'), `bytes ${start}-${end}/${original.length}`)
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), original.subarray(start, end + 1))
  }
  assert.equal((await fetch(path, { headers: { Range: 'bytes=999999999-' } })).status, 416)
  assert.equal((await fetch(path, { headers: { Range: 'bytes=0-2,4-6' } })).status, 416)
  assert.equal((await fetch(path, { headers: { 'if-none-match': head.headers.get('etag') } })).status, 304)
  const mismatch = await fetch(path, { method: 'HEAD', headers: { Range: 'bytes=0-3', 'if-range': '"outdated"' } })
  assert.equal(mismatch.status, 200)
})

test('settings persist across handler restart; malformed patches do not mutate data', async t => {
  const f = await fixture(t)
  const changed = { sound: true, volume: 0.34, fit: 'contain', enabled: false, shuffle: true }
  const save = await f.post('/settings', changed)
  assert.equal(save.status, 200)
  const disk = JSON.parse(await readFile(join(f.dataDir, 'settings.json'), 'utf8'))
  assert.equal(disk.settings.duration, undefined)
  for (const patch of [{ duration: -1 }, { duration: 121 }, { volume: 2 }, { sound: 'yes' }, { selectedId: '../../x' }, { endScreen: 'invalid' }, { endScreen: 'image' }, { endFit: 'stretch' }, { endImageId: 'missing' }, { logoVariant: 'invalid' }, { unknown: true }, []]) {
    assert.equal((await f.post('/settings', patch)).status, 400)
  }
  const handler = createHandler({ dataDir: f.dataDir, assetsDir })
  const restarted = createServer(handler).listen(0, '127.0.0.1')
  await once(restarted, 'listening')
  t.after(() => { restarted.closeAllConnections(); restarted.close() })
  const state = await (await fetch(`http://127.0.0.1:${restarted.address().port}${BASE_PATH}/state`)).json()
  for (const [key, value] of Object.entries(changed)) assert.equal(state.settings[key], value)
  const launch = await f.get('/launch')
  assert.ok(launch.clips.some(c => c.id === launch.clip.id))
})

test('upload, choose and delete a real MP4; filename cannot choose a disk path', async t => {
  const f = await fixture(t)
  const bytes = await readFile(join(assetsDir, 'deepseek-brand-intro.mp4'))
  const upload = await fetch(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': encodeURIComponent('../../我的片头.mp4'), 'content-type': 'video/mp4' }, body: bytes })
  assert.equal(upload.status, 201)
  const result = await upload.json()
  assert.equal(result.clip.name, '我的片头')
  assert.equal(result.clip.source, 'upload')
  assert.equal(result.state.settings.selectedId, result.clip.id)
  const media = await fetch(f.base.replace(BASE_PATH, '') + result.clip.url)
  assert.deepEqual(Buffer.from(await media.arrayBuffer()), bytes)
  assert.match((await readdir(join(f.dataDir, 'videos')))[0], /^u_[a-f0-9-]{36}\.mp4$/)
  const removed = await fetch(f.base + '/clips/' + result.clip.id, { method: 'DELETE', headers })
  assert.equal(removed.status, 200)
  assert.equal((await removed.json()).settings.selectedId, 'brand')
  assert.deepEqual(await readdir(join(f.dataDir, 'videos')), [])
  assert.equal((await fetch(f.base.replace(BASE_PATH, '') + result.clip.url)).status, 404)
  assert.equal((await fetch(f.base + '/clips/brand', { method: 'DELETE', headers })).status, 400)
})

test('rejects cross-site writes, invalid JSON, empty/unsupported uploads; no temp files remain', async t => {
  const f = await fixture(t)
  assert.equal((await fetch(f.base + '/settings', { method: 'POST', body: '{}' })).status, 403)
  assert.equal((await f.post('/settings', { enabled: false }, { origin: 'https://evil.invalid' })).status, 403)
  assert.equal((await f.post('/settings', { enabled: false }, { origin: new URL(f.base).origin })).status, 200)
  assert.equal((await fetch(f.base + '/settings', { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: '{bad' })).status, 400)
  for (const [filename, body] of [['bad.exe', 'arbitrary bytes'], ['empty.mp4', ''], ['bad.mp4', 'not a video']]) {
    assert.equal((await fetch(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': encodeURIComponent(filename) }, body })).status, 415)
  }
  assert.deepEqual(await readdir(join(f.dataDir, 'videos')), [])
  assert.equal((await fetch(f.base + '/media/%2e%2e%2fsettings.json')).status, 404)
})

test('rejects oversized fixed and chunked uploads with a readable 413 and cleans partial files', async t => {
  const f = await fixture(t, { maxUploadBytes: 1024 })
  const body = Buffer.alloc(2048)
  body.write('ftyp', 4)
  const fixed = await fetch(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': 'big.mp4' }, body })
  assert.equal(fixed.status, 413)
  const chunked = await new Promise((resolveResponse, reject) => {
    const req = request(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': 'big.mp4', 'transfer-encoding': 'chunked' } }, res => { let data = ''; res.on('data', c => { data += c }); res.on('end', () => resolveResponse({ status: res.statusCode, body: JSON.parse(data) })) })
    req.on('error', reject)
    req.write(body.subarray(0, 512)); req.write(body.subarray(512)); req.end()
  })
  assert.equal(chunked.status, 413)
  assert.ok(chunked.body.error)
  assert.deepEqual(await readdir(join(f.dataDir, 'videos')), [])
})

test('concurrent changes serialize without dropping independent settings', async t => {
  const f = await fixture(t)
  const responses = await Promise.all([f.post('/settings', { sound: true }), f.post('/settings', { volume: 0.45 }), f.post('/settings', { fit: 'contain' })])
  assert.ok(responses.every(r => r.status === 200))
  const state = await f.get('/state')
  assert.equal(state.settings.sound, true)
  assert.equal(state.settings.volume, 0.45)
  assert.equal(state.settings.fit, 'contain')
})

test('an interrupted upload cleans its partial file and releases the mutation queue', async t => {
  const f = await fixture(t)
  await f.get('/state')
  await new Promise(resolveAborted => {
    const req = request(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': 'interrupted.mp4', 'transfer-encoding': 'chunked' } })
    req.on('error', () => {})
    req.on('close', resolveAborted)
    const chunk = Buffer.alloc(512)
    chunk.write('ftyp', 4)
    req.write(chunk)
    setTimeout(() => req.destroy(), 25)
  })
  const after = await f.post('/settings', { fit: 'contain' })
  assert.equal(after.status, 200)
  assert.deepEqual(await readdir(join(f.dataDir, 'videos')), [])
})

test('a missing uploaded file falls back to a built-in without a broken media URL', async t => {
  const f = await fixture(t)
  const bytes = await readFile(join(assetsDir, 'deepseek-brand-intro.mp4'))
  const uploaded = await (await fetch(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': 'local.mp4' }, body: bytes })).json()
  await rm(join(f.dataDir, 'videos', uploaded.clip.id + '.mp4'))
  const launch = await f.get('/launch')
  assert.equal(launch.clip.id, 'brand')
  assert.equal(launch.clips.length, 5)
})

test('corrupt persisted config returns a recoverable error without overwriting the original', async t => {
  const f = await fixture(t)
  const original = '{broken settings'
  await writeFile(join(f.dataDir, 'settings.json'), original)
  const handler = createHandler({ dataDir: f.dataDir, assetsDir })
  const server = createServer(handler).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => { server.closeAllConnections(); server.close() })
  const response = await fetch(`http://127.0.0.1:${server.address().port}${BASE_PATH}/state`)
  assert.equal(response.status, 500)
  assert.match((await response.json()).error, /settings.json/)
  assert.equal(await readFile(join(f.dataDir, 'settings.json'), 'utf8'), original)
})

test('uploads an end image, serves safe image bytes, retains it across restart and deletes it back to Logo', async t => {
  const f = await fixture(t)
  await f.post('/settings', { selectedId: 'startup-screen', logoVariant: 'gold', endFit: 'cover' })
  const response = await fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders('../../我的结束封面.png'), body: png })
  assert.equal(response.status, 201)
  const { image, state } = await response.json()
  assert.equal(image.name, '我的结束封面')
  assert.match(image.id, /^i_[a-f0-9-]{36}$/)
  assert.equal(state.settings.endImageId, image.id)
  assert.equal(state.settings.endScreen, 'image')
  assert.equal(state.settings.selectedId, 'startup-screen')
  assert.equal(state.settings.duration, undefined)
  assert.equal(state.settings.logoVariant, 'gold')
  assert.equal(state.settings.endFit, 'cover')
  assert.deepEqual(await readdir(join(f.dataDir, 'images')), [image.id + '.png'])
  const origin = new URL(f.base).origin
  const media = await fetch(origin + image.url)
  assert.equal(media.status, 200)
  assert.equal(media.headers.get('content-type'), 'image/png')
  assert.equal(media.headers.get('x-content-type-options'), 'nosniff')
  assert.deepEqual(Buffer.from(await media.arrayBuffer()), png)
  assert.equal((await fetch(f.base + '/end-image/%2e%2e%2fsettings.json')).status, 404)
  assert.equal((await fetch(f.base + '/end-image/brand')).status, 404)
  const handler = createHandler({ dataDir: f.dataDir, assetsDir })
  const restarted = createServer(handler).listen(0, '127.0.0.1')
  await once(restarted, 'listening')
  t.after(() => { restarted.closeAllConnections(); restarted.close() })
  const restored = await (await fetch(`http://127.0.0.1:${restarted.address().port}${BASE_PATH}/launch`)).json()
  assert.equal(restored.clip.kind, 'sequence')
  assert.equal(restored.settings.endScreen, 'image')
  assert.equal(restored.settings.endImageId, image.id)
  assert.equal(restored.settings.logoVariant, 'gold')
  assert.deepEqual(restored.endImages, [image])
  const removed = await fetch(f.base + '/end-images/' + image.id, { method: 'DELETE', headers })
  assert.equal(removed.status, 200)
  const next = await removed.json()
  assert.equal(next.settings.endScreen, 'logo')
  assert.equal(next.settings.endImageId, null)
  assert.equal(next.settings.selectedId, 'startup-screen')
  assert.deepEqual(next.endImages, [])
  assert.deepEqual(await readdir(join(f.dataDir, 'images')), [])
  assert.equal((await fetch(origin + image.url)).status, 404)
})

test('rejects SVG, mismatched image headers, empty images, cross-site and oversize uploads without adding files', async t => {
  const f = await fixture(t, { maxImageUploadBytes: 128 })
  const invalid = [
    ['unsafe.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>'],
    ['renamed.png', '<svg xmlns="http://www.w3.org/2000/svg"/>'],
    ['empty.png', Buffer.alloc(0)],
    ['wrong.jpg', png],
    ['wrong.webp', png],
  ]
  for (const [filename, body] of invalid) {
    const response = await fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders(filename), body })
    assert.equal(response.status, 415, filename)
  }
  const oversized = await fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders('large.png'), body: Buffer.concat([png, Buffer.alloc(128)]) })
  assert.equal(oversized.status, 413)
  const crossSite = await fetch(f.base + '/end-images', { method: 'POST', headers: { ...imageHeaders('cover.png'), origin: 'https://evil.invalid' }, body: png })
  assert.equal(crossSite.status, 403)
  assert.deepEqual((await f.get('/state')).endImages, [])
  assert.deepEqual(await readdir(join(f.dataDir, 'images')), [])
  assert.equal((await fetch(f.base + '/end-images/../../brand', { method: 'DELETE', headers })).status, 404)
  assert.equal((await fetch(f.base + '/end-images/brand', { method: 'DELETE', headers })).status, 400)
})

test('JPEG and WebP signatures are served with their own raster image MIME type', async t => {
  const f = await fixture(t)
  const samples = [
    ['cover.jpeg', Buffer.from('ffd8ffe000104a46494600010100000100010000ffd9', 'hex'), 'image/jpeg'],
    ['cover.webp', Buffer.from('524946461600000057454250565038200a0000000000000000000000', 'hex'), 'image/webp'],
  ]
  for (const [filename, body, mime] of samples) {
    const uploaded = await fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders(filename), body })
    assert.equal(uploaded.status, 201)
    const { image } = await uploaded.json()
    const media = await fetch(new URL(f.base).origin + image.url, { method: 'HEAD' })
    assert.equal(media.headers.get('content-type'), mime)
    assert.equal(Number(media.headers.get('content-length')), body.length)
  }
})

test('old version-1 settings load with cover defaults and preserve video settings when migrated', async t => {
  const f = await fixture(t)
  const oldSettings = { enabled: false, sound: true, volume: 0.2, duration: 11, fit: 'contain', shuffle: false, selectedId: 'cyberpunk' }
  await writeFile(join(f.dataDir, 'settings.json'), JSON.stringify({ version: 1, settings: oldSettings, uploads: [] }))
  const state = await f.get('/state')
  for (const [key, value] of Object.entries(oldSettings)) if(key !== 'duration') assert.equal(state.settings[key], value)
  assert.equal(state.settings.duration, undefined)
  assert.equal(state.settings.endScreen, 'logo')
  assert.equal(state.settings.endImageId, null)
  assert.equal(state.settings.logoVariant, 'silver')
  assert.equal(state.settings.endFit, 'contain')
  assert.deepEqual(state.endImages, [])
  const saved = await f.post('/settings', { endFit: 'cover' })
  assert.equal(saved.status, 200)
  const disk = JSON.parse(await readFile(join(f.dataDir, 'settings.json'), 'utf8'))
  assert.equal(disk.version, 1)
  assert.equal(disk.settings.selectedId, 'cyberpunk')
  assert.equal(disk.settings.duration, undefined)
  assert.equal(disk.settings.endFit, 'cover')
  assert.deepEqual(disk.endImages, [])
})

test('concurrent image, video and settings writes retain both libraries and all independent settings', async t => {
  const f = await fixture(t)
  const video = await readFile(join(assetsDir, 'deepseek-brand-intro.mp4'))
  const responses = await Promise.all([
    fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders('first.png'), body: png }),
    f.post('/settings', { volume: 0.25, logoVariant: 'ice' }),
    fetch(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': 'new.mp4' }, body: video }),
    fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders('second.png'), body: png }),
  ])
  assert.ok(responses.every(response => response.ok))
  const state = await f.get('/state')
  assert.equal(state.clips.length, 6)
  assert.equal(state.clips.filter(clip => clip.source === 'upload').length, 1)
  assert.equal(state.endImages.length, 2)
  assert.equal(state.settings.duration, undefined)
  assert.equal(state.settings.volume, 0.25)
  assert.equal(state.settings.logoVariant, 'ice')
  assert.equal(state.settings.endScreen, 'image')
  assert.ok(state.endImages.some(image => image.id === state.settings.endImageId))
})

test('a missing current end image falls back to Logo and still permits preference changes', async t => {
  const f = await fixture(t)
  const uploaded = await (await fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders('gone.png'), body: png })).json()
  await rm(join(f.dataDir, 'images', uploaded.image.id + '.png'))
  const launch = await f.get('/launch')
  assert.equal(launch.settings.endScreen, 'logo')
  assert.equal(launch.settings.endImageId, null)
  assert.deepEqual(launch.endImages, [])
  assert.equal((await f.post('/settings', { volume: 0.4 })).status, 200)
})

test('ships three approved local covers with silver as default and readable GET, HEAD and cache responses', async t => {
  const f = await fixture(t)
  const state = await f.get('/state')
  assert.equal(state.settings.logoVariant, 'silver')
  assert.equal(state.settings.endScreen, 'logo')
  assert.deepEqual(state.logos.map(logo => [logo.id, logo.name]), [['silver', '白色远山'], ['gold', '黑金烟雾'], ['ice', '深蓝数字海面']])
  assert.deepEqual(state.endImages, [])
  assert.deepEqual(await readdir(join(f.dataDir, 'images')), [])
  for (const logo of state.logos) {
    const original = await readFile(join(assetsDir, 'end-covers', logo.id + '.png'))
    const url = new URL(f.base).origin + logo.url
    const response = await fetch(url)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'image/png')
    assert.equal(response.headers.get('cache-control'), 'private, max-age=0, must-revalidate')
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), original)
    const head = await fetch(url, { method: 'HEAD' })
    assert.equal(head.status, 200)
    assert.equal(Number(head.headers.get('content-length')), original.length)
    assert.equal(logo.bytes, original.length)
    assert.equal((await head.arrayBuffer()).byteLength, 0)
    assert.equal((await fetch(url, { headers: { 'if-none-match': head.headers.get('etag') } })).status, 304)
  }
})

test('built-in cover routes have a strict variant whitelist and cannot be deleted as user images', async t => {
  const f = await fixture(t)
  for (const path of ['/logo/classic', '/logo/missing', '/logo/gold.png', '/logo/%2e%2e%2fsettings.json', '/logo/silver%2f..%2f..%2fsettings.json', '/logo/%73ilver']) {
    assert.equal((await fetch(f.base + path)).status, 404, path)
  }
  assert.equal((await fetch(f.base + '/end-images/silver', { method: 'DELETE', headers })).status, 400)
  assert.equal((await fetch(f.base + '/logo/silver', { method: 'DELETE', headers })).status, 404)
  assert.equal((await f.get('/state')).logos.length, 3)
  assert.equal((await f.post('/settings', { logoVariant: 'classic' })).status, 200)
  assert.equal((await f.get('/state')).settings.logoVariant, 'classic')
})

test('selected built-in gold cover survives restart without changing video settings or creating user images', async t => {
  const f = await fixture(t)
  const saved = await f.post('/settings', { logoVariant: 'gold', selectedId: 'cyberpunk', sound: true, volume: 0.2 })
  assert.equal(saved.status, 200)
  const handler = createHandler({ dataDir: f.dataDir, assetsDir })
  const server = createServer(handler).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => { server.closeAllConnections(); server.close() })
  const state = await (await fetch(`http://127.0.0.1:${server.address().port}${BASE_PATH}/launch`)).json()
  assert.equal(state.settings.logoVariant, 'gold')
  assert.equal(state.settings.selectedId, 'cyberpunk')
  assert.equal(state.settings.duration, undefined)
  assert.equal(state.settings.sound, true)
  assert.equal(state.settings.volume, 0.2)
  assert.equal(state.logos.length, 3)
  const disk = JSON.parse(await readFile(join(f.dataDir, 'settings.json'), 'utf8'))
  assert.deepEqual(disk.endImages, [])
  assert.deepEqual(disk.uploads, [])
  assert.equal(disk.logos, undefined)
})

test('retired legacy duration is ignored while every other preference survives migration and clip changes', async t => {
  for (const duration of [undefined, 0, 7, 3, 120]) {
    const f = await fixture(t)
    const settings = { enabled: false, selectedId: 'cyberpunk', sound: true, volume: 0.3 }
    if (duration !== undefined) settings.duration = duration
    await writeFile(join(f.dataDir, 'settings.json'), JSON.stringify({ version: 1, settings, uploads: [] }))
    const initial = await f.get('/state')
    assert.equal(initial.settings.duration, undefined)
    for (const id of ['brand', 'cyberpunk', 'awakening', 'startup', 'startup-screen']) {
      const changed = await f.post('/settings', { selectedId: id })
      assert.equal(changed.status, 200)
      const result = await changed.json()
      assert.equal(result.settings.duration, undefined, `${id}, previous duration ${duration}`)
      assert.equal(result.settings.sound, true)
      assert.equal(result.settings.volume, 0.3)
    }
    assert.equal(JSON.parse(await readFile(join(f.dataDir, 'settings.json'), 'utf8')).settings.duration, undefined)
  }
})

test('new API requests cannot reintroduce a playback duration or mutate other preferences on rejection', async t => {
  const f = await fixture(t)
  const configured = await (await f.post('/settings', { selectedId: 'startup-screen', sound: true, volume: 0.24, fit: 'contain', logoVariant: 'gold' })).json()
  for (const duration of [0, 3, 7, 10, 120]) {
    const response = await f.post('/settings', { duration, sound: false })
    assert.equal(response.status, 400)
    assert.match((await response.json()).error, /已取消播放时长/)
  }
  assert.deepEqual((await f.get('/state')).settings, configured.settings)
  assert.equal(JSON.parse(await readFile(join(f.dataDir, 'settings.json'), 'utf8')).settings.duration, undefined)
})

test('retiring an old duration preserves imported videos, ending images and all remaining preferences', async t => {
  const f = await fixture(t)
  const videoBytes = await readFile(join(assetsDir, 'deepseek-brand-intro.mp4'))
  const video = await (await fetch(f.base + '/upload', { method: 'POST', headers: { ...headers, 'x-file-name': 'personal.mp4' }, body: videoBytes })).json()
  const image = await (await fetch(f.base + '/end-images', { method: 'POST', headers: imageHeaders('personal.png'), body: png })).json()
  const disk = JSON.parse(await readFile(join(f.dataDir, 'settings.json'), 'utf8'))
  disk.settings.duration = 3
  disk.settings.sound = true
  disk.settings.volume = 0.23
  await writeFile(join(f.dataDir, 'settings.json'), JSON.stringify(disk))
  const restarted = createServer(createHandler({ dataDir: f.dataDir, assetsDir })).listen(0, '127.0.0.1')
  await once(restarted, 'listening')
  t.after(() => { restarted.closeAllConnections(); restarted.close() })
  const base = `http://127.0.0.1:${restarted.address().port}${BASE_PATH}`
  const state = await (await fetch(base + '/state')).json()
  const expected = { ...disk.settings }
  delete expected.duration
  assert.deepEqual(state.settings, expected)
  assert.ok(state.clips.some(clip => clip.id === video.clip.id))
  assert.equal(state.settings.endImageId, image.image.id)
  assert.ok(state.endImages.some(entry => entry.id === image.image.id))
  const saved = await fetch(base + '/settings', { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify({ fit: 'contain' }) })
  assert.equal(saved.status, 200)
  const migrated = JSON.parse(await readFile(join(f.dataDir, 'settings.json'), 'utf8'))
  assert.equal(migrated.settings.duration, undefined)
  assert.equal(migrated.settings.sound, true)
  assert.equal(migrated.settings.volume, 0.23)
  assert.deepEqual(migrated.uploads, disk.uploads)
  assert.deepEqual(migrated.endImages, disk.endImages)
  assert.deepEqual(await readFile(join(f.dataDir, 'videos', video.clip.id + '.mp4')), videoBytes)
  assert.deepEqual(await readFile(join(f.dataDir, 'images', image.image.id + '.png')), png)
})
