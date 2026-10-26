import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, readFile, rename, unlink, lstat, open, realpath, readdir, rmdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, extname, join, resolve, relative, isAbsolute, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { createUpdateService } from './updates.js'

export const name = 'dsh-boot-studio'
export const inject = ['webServer']
export const BASE_PATH = '/dsh-boot-studio'
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024
export const MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024
export const DEFAULT_SETTINGS = Object.freeze({ enabled: true, videoEnabled: true, endEnabled: true, sound: false, volume: 0.7, shuffle: false, selectedId: 'brand', endScreen: 'logo', endImageId: null, logoVariant: 'silver', endFit: 'cover', showShortcut: false })
const BUILTINS = [
  { id: 'brand', name: '启', file: 'deepseek-brand-intro.mp4' },
  { id: 'cyberpunk', name: '数字生命', file: 'deepseek-cyberpunk-intro.mp4' },
  { id: 'awakening', name: '朋克', file: 'deepseek-awakening-intro.mp4' },
  { id: 'startup', name: '半面', file: 'deepseek-startup-intro.mp4' },
  { id: 'whale-girl', name: '鲸鱼娘', file: 'deepseek-whale-girl-intro.mp4' },
  { id: 'deepseek-title', name: 'DeepSeek', file: 'deepseek-title-intro.mp4' },
  { id: 'deepseek-dance', name: '舞', file: 'deepseek-dance-intro.mp4' },
  { id: 'deepseek-sea', name: '海', file: 'deepseek-sea-intro.mp4' },
]
const SEQUENCE = { id: 'startup-screen', name: '莱茵生命', source: 'builtin', kind: 'sequence', bytes: 0 }
const LOGOS = [
  { id: 'silver', name: '远山', file: 'silver.png' },
  { id: 'gold', name: '黑金', file: 'gold.png' },
  { id: 'ice', name: '蓝雾', file: 'ice.png' },
  { id: 'assassins-creed', name: '刺客信条', file: 'assassins-creed.png', fit: 'cover' },
  { id: 'cyberpunk-2077', name: '赛博朋克2077', file: 'cyberpunk-2077.png', fit: 'cover' },
  { id: 'gta6', name: 'GTA6', file: 'gta6.png', fit: 'cover' },
  { id: 'horizon6', name: '地平线6', file: 'horizon6.png', fit: 'cover' },
  { id: 'horizon5', name: '地平线5', file: 'horizon5.png', fit: 'cover' },
  { id: 'horizon4', name: '地平线4', file: 'horizon4.png', fit: 'cover' },
]
const UPLOAD_ID = /^u_[a-f0-9-]{36}$/
const IMAGE_ID = /^i_[a-f0-9-]{36}$/
const TYPES = { '.mp4': 'video/mp4', '.m4v': 'video/mp4', '.webm': 'video/webm' }
const IMAGE_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

function json(res, value, status = 200) {
  if (res.destroyed || res.writableEnded) return
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
  res.end(JSON.stringify(value))
}

function validateSettings(patch, current, available, availableImages = new Set()) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) throw new HttpError(400, '设置必须是 JSON 对象。')
  const next = { ...current }
  for (const [key, value] of Object.entries(patch)) {
    if (key === 'duration') throw new HttpError(400, '已取消播放时长设置，动画按原始长度完整播放。')
    if (key === 'fit') throw new HttpError(400, '已取消画面显示设置，开机动画始终铺满当前窗口。')
    if (key === 'updatePromptBlur' || key === 'updatePromptRadius') throw new HttpError(400, '更新提醒使用统一外观，已取消单独调节。')
    if (!Object.hasOwn(DEFAULT_SETTINGS, key)) throw new HttpError(400, `不支持的设置：${key}`)
    if (['enabled', 'videoEnabled', 'endEnabled', 'sound', 'shuffle', 'showShortcut'].includes(key) && typeof value !== 'boolean') throw new HttpError(400, `${key} 必须是开关。`)
    if (key === 'volume' && !(typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1)) throw new HttpError(400, '音量须在 0 到 1 之间。')
    if (key === 'selectedId' && !(typeof value === 'string' && available.has(value))) throw new HttpError(400, '所选动画不存在，请刷新片库。')
    if (key === 'endScreen' && !['logo', 'image'].includes(value)) throw new HttpError(400, '结束封面须为 logo 或 image。')
    if (key === 'endImageId' && value !== null && !(typeof value === 'string' && availableImages.has(value))) throw new HttpError(400, '所选封面图片不存在，请重新上传。')
    if (key === 'logoVariant' && value !== 'classic' && !LOGOS.some(logo => logo.id === value)) throw new HttpError(400, '不支持此结束画面。')
    if (key === 'endFit' && !['cover', 'contain'].includes(value)) throw new HttpError(400, '封面适配须为 cover 或 contain。')
    next[key] = value
  }
  // Retain the old master switch for older clients. New clients own two stages;
  // their OR is the compatible master value, never a third independent state.
  if (Object.hasOwn(patch, 'enabled') && !Object.hasOwn(patch, 'videoEnabled') && !Object.hasOwn(patch, 'endEnabled')) {
    next.videoEnabled = next.endEnabled = patch.enabled
  }
  next.enabled = next.videoEnabled || next.endEnabled
  if (next.endScreen === 'image' && !next.endImageId) throw new HttpError(400, '请先上传一张结束封面图片。')
  return next
}

function checkWrite(req) {
  if (req.headers['x-dsh-boot-studio'] !== '1') throw new HttpError(403, '写入请求缺少插件标识。')
  const origin = req.headers.origin
  if (origin) {
    let parsed
    try { parsed = new URL(origin) } catch { throw new HttpError(403, '无效来源。') }
    if (parsed.host.toLowerCase() !== String(req.headers.host || '').toLowerCase() || !['http:', 'https:'].includes(parsed.protocol)) throw new HttpError(403, '不允许跨站修改设置。')
  }
  if (req.headers['sec-fetch-site'] === 'cross-site') throw new HttpError(403, '不允许跨站修改设置。')
}

async function smallJson(req) {
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) throw new HttpError(415, '请使用 application/json。')
  if (Number(req.headers['content-length']) > 8192) { req.resume(); throw new HttpError(413, '设置内容过大。') }
  const chunks = []
  await receive(req, 8192, chunk => { chunks.push(chunk); return true })
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw new HttpError(400, 'JSON 格式不正确。') }
}

// Do not use pipeline(req, ...): its error handling destroys the request socket,
// preventing a useful 413 response on an oversized chunked upload.
function receive(req, maxBytes, onChunk, output) {
  return new Promise((resolveReceive, reject) => {
    if (req.aborted || (req.destroyed && !req.complete)) { reject(new HttpError(400, '文件上传已中断。')); return }
    let bytes = 0
    let idleTimer
    const resetTimer = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => failed(new HttpError(408, '上传等待超时，请重试。')), 120_000)
      idleTimer.unref?.()
    }
    const resume = () => req.resume()
    const clean = () => {
      clearTimeout(idleTimer)
      req.off('data', data); req.off('end', end); req.off('error', failed); req.off('aborted', aborted)
      output?.off('error', failed); output?.off('drain', resume)
    }
    const failed = error => { clean(); req.resume(); reject(error) }
    const aborted = () => failed(new HttpError(400, '文件上传已中断。'))
    const data = chunk => {
      resetTimer()
      bytes += chunk.length
      if (bytes > maxBytes) { failed(new HttpError(413, '请求内容超过大小限制。')); return }
      try {
        if (onChunk(chunk) === false && output) { req.pause(); output.once('drain', resume) }
      } catch (error) { failed(error) }
    }
    const end = () => { clean(); resolveReceive(bytes) }
    req.on('data', data); req.once('end', end); req.once('error', failed); req.once('aborted', aborted)
    output?.once('error', failed)
    resetTimer()
  })
}

async function safeFile(path) {
  try {
    const info = await lstat(path)
    return info.isFile() && !info.isSymbolicLink() ? info : null
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function rangeOf(raw, size) {
  if (!raw) return null
  const match = /^bytes=(\d*)-(\d*)$/.exec(raw)
  if (!match || (!match[1] && !match[2]) || size === 0) throw new HttpError(416, '无效的视频字节范围。')
  let start, end
  if (!match[1]) {
    const suffix = Number(match[2])
    if (!Number.isSafeInteger(suffix) || suffix <= 0) throw new HttpError(416, '无效的视频字节范围。')
    start = Math.max(0, size - suffix); end = size - 1
  } else {
    start = Number(match[1]); end = match[2] ? Number(match[2]) : size - 1
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) throw new HttpError(416, '无效的视频字节范围。')
    end = Math.min(end, size - 1)
  }
  return { start, end }
}

/** The same routes are used by the DSH plugin and the standalone preview. */
export function createHandler(options = {}) {
  const dataDir = resolve(options.dataDir || join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'boot-studio'))
  const assetsDir = resolve(options.assetsDir || join(dirname(fileURLToPath(import.meta.url)), '..', 'assets'))
  const maxUploadBytes = options.maxUploadBytes ?? MAX_UPLOAD_BYTES
  const updates = options.updateService || createUpdateService({ dataDir, packageFile: join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json') })
  const maxImageUploadBytes = options.maxImageUploadBytes ?? MAX_IMAGE_UPLOAD_BYTES
  const videosDir = join(dataDir, 'videos')
  const imagesDir = join(dataDir, 'images')
  const storePath = join(dataDir, 'settings.json')
  let store
  let initializing
  let queue = Promise.resolve()

  async function initialize() {
    if (!initializing) initializing = (async () => {
      await mkdir(videosDir, { recursive: true })
      await mkdir(imagesDir, { recursive: true })
      let saved
      try { saved = JSON.parse(await readFile(storePath, 'utf8')) } catch (error) {
        if (error.code !== 'ENOENT') throw new HttpError(500, '设置文件无法读取。请备份并检查 boot-studio/settings.json。')
      }
      if (!saved) { store = { version: 1, settings: { ...DEFAULT_SETTINGS }, uploads: [], endImages: [] }; return }
      if (saved.version !== 1 || !Array.isArray(saved.uploads)) throw new HttpError(500, '设置文件版本或片库格式不正确。')
      const uploads = saved.uploads.filter(c => c && UPLOAD_ID.test(c.id) && Object.hasOwn(TYPES, c.ext) && typeof c.name === 'string').map(c => ({ id: c.id, ext: c.ext, name: c.name.slice(0, 120) }))
      if (saved.endImages !== undefined && !Array.isArray(saved.endImages)) throw new HttpError(500, '结束封面片库格式不正确。')
      const endImages = (saved.endImages || []).filter(c => c && IMAGE_ID.test(c.id) && Object.hasOwn(IMAGE_TYPES, c.ext) && typeof c.name === 'string').map(c => ({ id: c.id, ext: c.ext, name: c.name.slice(0, 120) }))
      // Ignore retired playback and per-plugin update-appearance fields while
      // preserving every remaining setting and personal-media manifest entry.
      const legacySettings = saved.settings || {}
      const settings = legacySettings && typeof legacySettings === 'object' && !Array.isArray(legacySettings)
        ? Object.fromEntries(Object.entries(legacySettings).filter(([key]) => !['duration', 'fit', 'updatePromptBlur', 'updatePromptRadius', 'autoRestart'].includes(key))) : legacySettings
      try { store = { version: 1, settings: validateSettings(settings, DEFAULT_SETTINGS, new Set([...BUILTINS.map(c => c.id), SEQUENCE.id, ...uploads.map(c => c.id)]), new Set(endImages.map(c => c.id))), uploads, endImages } } catch { throw new HttpError(500, '已保存的设置格式不正确，请备份并检查 settings.json。') }
    })()
    await initializing
  }

  function serialize(callback) {
    const result = queue.then(callback)
    queue = result.catch(() => {})
    return result
  }

  async function persist(next) {
    const temporary = join(dataDir, `settings.${randomUUID()}.tmp`)
    try {
      const file = await open(temporary, 'wx')
      try { await file.writeFile(JSON.stringify(next, null, 2) + '\n', 'utf8'); await file.sync() } finally { await file.close() }
      await rename(temporary, storePath)
      store = next
    } finally { await unlink(temporary).catch(() => {}) }
  }

  // This remover is used only below the dedicated reset quarantine. lstat keeps
  // symlinks and directory junctions as links; their external targets are untouched.
  async function eraseResetEntry(path, boundary) {
    const within = relative(boundary, path)
    if (!within || within === '..' || within.startsWith('..' + sep) || isAbsolute(within)) throw new HttpError(500, '重置清理路径超出数据目录。')
    let info
    try { info = await lstat(path) } catch (error) { if (error.code === 'ENOENT') return; throw error }
    if (info.isDirectory() && !info.isSymbolicLink()) {
      for (const entry of await readdir(path)) await eraseResetEntry(join(path, entry), boundary)
      await rmdir(path)
    } else await unlink(path)
  }

  async function resetCustomData() {
    // Resolve the configured data directory once. A quarantine symlink is refused
    // before settings or media are touched, rather than followed to another folder.
    const root = await realpath(dataDir)
    const trash = join(root, '.reset-trash')
    const clearScopes = [videosDir, imagesDir, trash, join(root, 'videos'), join(root, 'images')]
    let actualAssets = assetsDir
    try { actualAssets = await realpath(assetsDir) } catch (error) { if (error.code !== 'ENOENT') throw error }
    const overlaps = clearScopes.some(scope => [assetsDir, actualAssets].some(path => {
      const within = relative(scope, path)
      return within === '' || (within !== '..' && !within.startsWith('..' + sep) && !isAbsolute(within))
    }))
    if (overlaps) throw new HttpError(500, '内置素材目录与自定义数据清理范围重叠，未修改设置或素材。')
    let trashInfo
    try { trashInfo = await lstat(trash) } catch (error) { if (error.code !== 'ENOENT') throw error }
    if (trashInfo && (!trashInfo.isDirectory() || trashInfo.isSymbolicLink())) throw new HttpError(500, '重置隔离目录不是安全的本地文件夹，未修改设置或素材。')
    if (!trashInfo) await mkdir(trash)
    if (await realpath(trash) !== trash) throw new HttpError(500, '重置隔离目录超出数据目录，未修改设置或素材。')
    // Commit an empty manifest first. A crash or deletion failure can leave an
    // unreferenced file for retry, never a saved reference to deleted user media.
    await persist({ version: 1, settings: { ...DEFAULT_SETTINGS }, uploads: [], endImages: [] })
    try {
      const quarantine = join(trash, 'reset-' + randomUUID())
      await mkdir(quarantine)
      for (const [source, label] of [[videosDir, 'videos'], [imagesDir, 'images']]) {
        let info
        try { info = await lstat(source) } catch (error) { if (error.code !== 'ENOENT') throw error }
        if (info) await rename(source, join(quarantine, label))
        await mkdir(source)
      }
      // Include any quarantine left by an interrupted/failed reset, and all
      // orphan files. update-cache and packaged assets are outside this scope.
      for (const entry of await readdir(trash)) await eraseResetEntry(join(trash, entry), trash)
      for (const entry of await readdir(root)) {
        if (/^settings\.[a-f0-9-]{36}\.tmp$/.test(entry)) await unlink(join(root, entry))
      }
      return state()
    } catch (error) {
      throw new HttpError(500, `默认设置已恢复，但自定义文件尚未全部清理。请再次恢复默认重试${error.code ? `（${error.code}）` : ''}。`)
    }
  }

  async function library() {
    const candidates = [
      ...BUILTINS.map(c => ({ ...c, source: 'builtin', kind: 'video', path: join(assetsDir, c.file), ext: '.mp4' })),
      ...store.uploads.map(c => ({ ...c, source: 'upload', kind: 'video', path: join(videosDir, c.id + c.ext) })),
    ]
    const clips = await Promise.all(candidates.map(async c => {
      const info = await safeFile(c.path)
      return info && info.size ? { ...c, bytes: info.size, mtime: info.mtimeMs } : null
    }))
    const present = clips.filter(Boolean)
    const builtinClips = present.filter(clip => clip.source === 'builtin')
    const beforeSequence = new Set(BUILTINS.slice(0, BUILTINS.findIndex(clip => clip.id === 'whale-girl')).map(clip => clip.id))
    return [...builtinClips.filter(clip => beforeSequence.has(clip.id)), { ...SEQUENCE }, ...builtinClips.filter(clip => !beforeSequence.has(clip.id)), ...present.filter(clip => clip.source === 'upload')]
  }

  function publicClip(clip) {
    return { id: clip.id, name: clip.name, source: clip.source, kind: clip.kind, url: clip.kind === 'sequence' ? null : `${BASE_PATH}/media/${clip.id}`, bytes: clip.bytes }
  }

  async function imageLibrary() {
    const images = await Promise.all(store.endImages.map(async image => {
      const path = join(imagesDir, image.id + image.ext)
      const info = await safeFile(path)
      return info && info.size ? { ...image, path, bytes: info.size, mtime: info.mtimeMs } : null
    }))
    return images.filter(Boolean)
  }

  function publicImage(image) { return { id: image.id, name: image.name, url: `${BASE_PATH}/end-image/${image.id}`, bytes: image.bytes } }

  async function logoLibrary() {
    const logos = await Promise.all(LOGOS.map(async logo => {
      const path = join(assetsDir, 'end-covers', logo.file)
      const info = await safeFile(path)
      return info && info.size ? { ...logo, path, ext: '.png', bytes: info.size, mtime: info.mtimeMs } : null
    }))
    return logos.filter(Boolean)
  }

  function publicLogo(logo) { return { id: logo.id, name: logo.name, url: `${BASE_PATH}/logo/${logo.id}`, bytes: logo.bytes, fit: logo.fit || 'cover' } }

  async function state(launch = false) {
    const clips = await library()
    const images = await imageLibrary()
    const logos = await logoLibrary()
    let selectedId = clips.some(c => c.id === store.settings.selectedId) ? store.settings.selectedId : (clips[0]?.id ?? null)
    if (launch && store.settings.videoEnabled && store.settings.shuffle && clips.length) selectedId = clips[Math.floor(Math.random() * clips.length)].id
    const endImageId = images.some(image => image.id === store.settings.endImageId) ? store.settings.endImageId : null
    const endScreen = store.settings.endScreen === 'image' && !endImageId ? 'logo' : store.settings.endScreen
    return { settings: { ...store.settings, selectedId, endImageId, endScreen }, clips: clips.map(publicClip), endImages: images.map(publicImage), logos: logos.map(publicLogo), maxUploadBytes, maxImageUploadBytes, ...(launch ? { clip: clips.find(c => c.id === selectedId) ? publicClip(clips.find(c => c.id === selectedId)) : null } : {}) }
  }

  async function upload(req, image = false) {
    let filename
    try { filename = decodeURIComponent(String(req.headers['x-file-name'] || '')) } catch { throw new HttpError(400, '文件名编码无效。') }
    filename = filename.replace(/[\x00-\x1f\x7f]/g, '').split(/[\\/]/).pop()
    const ext = extname(filename).toLowerCase()
    if (!Object.hasOwn(image ? IMAGE_TYPES : TYPES, ext)) throw new HttpError(415, image ? '支持 PNG、JPEG 和 WebP 图片，不接受 SVG。' : '支持 MP4、M4V 和 WebM 视频。')
    const limit = image ? maxImageUploadBytes : maxUploadBytes
    const declared = req.headers['content-length']
    if (declared && Number(declared) > limit) { req.resume(); throw new HttpError(413, `${image ? '图片' : '视频'}不能超过 ${Math.floor(limit / 1024 / 1024)} MB。`) }
    const id = `${image ? 'i' : 'u'}_${randomUUID()}`
    const folder = image ? imagesDir : videosDir
    const temporary = join(folder, `${id}.part`)
    const target = join(folder, id + ext)
    let bytes = 0
    let head = Buffer.alloc(0)
    let output
    try {
      output = createWriteStream(temporary, { flags: 'wx' })
      // Observe disk errors even while the request is waiting for more data.
      let diskError
      output.on('error', error => { diskError = error })
      bytes = await receive(req, limit, chunk => {
        if (head.length < 32) head = Buffer.concat([head, chunk.subarray(0, 32 - head.length)])
        if (diskError) throw diskError
        return output.write(chunk)
      }, output)
      output.end()
      if (!output.closed) await once(output, 'close')
      if (diskError) throw diskError
      let valid
      if (image) {
        if (ext === '.png') valid = head.length >= 24 && head.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && head.toString('ascii', 12, 16) === 'IHDR' && head.readUInt32BE(16) > 0 && head.readUInt32BE(20) > 0
        else if (ext === '.jpg' || ext === '.jpeg') valid = head.length >= 4 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
        else valid = head.length >= 16 && head.toString('ascii', 0, 4) === 'RIFF' && head.toString('ascii', 8, 12) === 'WEBP' && ['VP8 ', 'VP8L', 'VP8X'].includes(head.toString('ascii', 12, 16))
      } else valid = ext === '.webm' ? head.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])) : head.length >= 12 && head.toString('ascii', 4, 8) === 'ftyp'
      if (!bytes || !valid) throw new HttpError(415, image ? '图片格式无效，请上传 PNG、JPEG 或 WebP 图片。' : '文件不是有效的 MP4 / WebM 容器。请优先使用 H.264 + AAC 的 MP4。')
      await rename(temporary, target)
      const item = { id, ext, name: filename.replace(/\.[^.]+$/, '').slice(0, 120) || (image ? '我的封面' : '我的动画') }
      const next = image
        ? { ...store, endImages: [...store.endImages, item], settings: { ...store.settings, endScreen: 'image', endImageId: id } }
        : { ...store, uploads: [...store.uploads, item], settings: { ...store.settings, selectedId: id } }
      try { await persist(next) } catch (error) { await unlink(target).catch(() => {}); throw error }
      const current = await state()
      return image ? { image: current.endImages.find(c => c.id === id), state: current } : { clip: current.clips.find(c => c.id === id), state: current }
    } finally {
      if (output && !output.closed) { output.destroy(); await once(output, 'close').catch(() => {}) }
      await unlink(temporary).catch(() => {})
    }
  }

  async function media(req, res, id, kind = 'video') {
    const image = kind !== 'video'
    let clip
    if (kind === 'author') {
      const path = join(assetsDir, 'author', 'author.jpg')
      const info = await safeFile(path)
      if (info?.size) clip = { id: 'author', path, ext: '.jpg', bytes: info.size, mtime: info.mtimeMs }
    } else clip = (await (kind === 'logo' ? logoLibrary() : image ? imageLibrary() : library())).find(c => c.id === id)
    if (!clip || clip.kind === 'sequence') throw new HttpError(404, image ? '封面图片不存在或文件已被移走。' : '动画不存在或文件已被移走。')
    const tag = `"${clip.id}-${clip.bytes}-${Math.trunc(clip.mtime)}"`
    const headers = { 'content-type': (image ? IMAGE_TYPES : TYPES)[clip.ext], 'accept-ranges': 'bytes', 'cache-control': 'private, max-age=0, must-revalidate', etag: tag, 'x-content-type-options': 'nosniff' }
    if (req.headers['if-none-match'] === tag && !req.headers.range) { res.writeHead(304, headers); res.end(); return }
    let range
    try { range = rangeOf(req.headers['if-range'] && req.headers['if-range'] !== tag ? null : req.headers.range, clip.bytes) } catch (error) { res.writeHead(416, { ...headers, 'content-range': `bytes */${clip.bytes}` }); res.end(); return }
    const start = range?.start ?? 0
    const end = range?.end ?? clip.bytes - 1
    headers['content-length'] = String(end - start + 1)
    if (range) headers['content-range'] = `bytes ${start}-${end}/${clip.bytes}`
    res.writeHead(range ? 206 : 200, headers)
    if (req.method === 'HEAD') { res.end(); return }
    await new Promise(resolveStream => {
      const stream = createReadStream(clip.path, { start, end })
      const close = () => { stream.destroy(); resolveStream() }
      res.once('close', close)
      stream.once('error', () => { res.destroy(); close() })
      stream.once('end', () => { res.off('close', close); resolveStream() })
      stream.pipe(res)
    })
  }

  return async function handler(req, res) {
    try {
      const url = new URL(req.url, 'http://localhost')
      const path = url.pathname
      if (path !== BASE_PATH && !path.startsWith(BASE_PATH + '/')) throw new HttpError(404, '接口不存在。')
      if (req.method === 'GET' && path === BASE_PATH + '/updates/status') { json(res, await updates.identity()); return }
      if (req.method === 'GET' && path === BASE_PATH + '/updates/progress') { json(res, updates.progress?.() || { version: null, phase: 'idle', downloadedBytes: 0, totalBytes: null, percent: null, attempt: 0 }); return }
      if (req.method === 'POST' && path === BASE_PATH + '/updates/check') { checkWrite(req); await smallJson(req); json(res, await updates.check()); return }
      if (req.method === 'POST' && path === BASE_PATH + '/updates/prepare') { checkWrite(req); const body=await smallJson(req); if(typeof body.version!=='string')throw new HttpError(400,'请先检查并选择更新版本。'); try{json(res, await updates.prepare(body.version));}catch(error){throw new HttpError(400,error.message||'更新包准备失败。');} return }
      await initialize()
      if (req.method === 'GET' && path === BASE_PATH + '/state') { json(res, await state()); return }
      if (req.method === 'GET' && path === BASE_PATH + '/launch') { json(res, await state(true)); return }
      if (['GET', 'HEAD'].includes(req.method) && path === BASE_PATH + '/author-image') {
        await media(req, res, 'author', 'author'); return
      }
      if (['GET', 'HEAD'].includes(req.method) && path.startsWith(BASE_PATH + '/media/')) {
        const id = path.slice((BASE_PATH + '/media/').length)
        if (!BUILTINS.some(c => c.id === id) && !UPLOAD_ID.test(id)) throw new HttpError(404, '动画不存在。')
        await media(req, res, id); return
      }
      if (['GET', 'HEAD'].includes(req.method) && path.startsWith(BASE_PATH + '/end-image/')) {
        const id = path.slice((BASE_PATH + '/end-image/').length)
        if (!IMAGE_ID.test(id)) throw new HttpError(404, '封面图片不存在。')
        await media(req, res, id, 'image'); return
      }
      if (['GET', 'HEAD'].includes(req.method) && path.startsWith(BASE_PATH + '/logo/')) {
        const variant = path.slice((BASE_PATH + '/logo/').length)
        if (!LOGOS.some(logo => logo.id === variant)) throw new HttpError(404, '内置结束封面不存在。')
        await media(req, res, variant, 'logo'); return
      }
      if (!['POST', 'DELETE'].includes(req.method)) throw new HttpError(405, '不支持此请求方法。')
      checkWrite(req)
      if (req.method === 'POST' && path === BASE_PATH + '/reset') {
        const body = await smallJson(req)
        if (!body || typeof body !== 'object' || Array.isArray(body) || body.confirm !== 'reset-all-custom-data') throw new HttpError(400, '请先确认删除全部自定义视频、图片和偏好。')
        json(res, await serialize(resetCustomData)); return
      }
      if (req.method === 'POST' && path === BASE_PATH + '/settings') {
        const patch = await smallJson(req)
        const result = await serialize(async () => {
          const clips = await library()
          const images = await imageLibrary()
          const settings = validateSettings(patch, (await state()).settings, new Set(clips.map(c => c.id)), new Set(images.map(c => c.id)))
          await persist({ ...store, settings })
          return state()
        })
        json(res, result); return
      }
      if (req.method === 'POST' && path === BASE_PATH + '/upload') { json(res, await serialize(() => upload(req)), 201); return }
      if (req.method === 'POST' && path === BASE_PATH + '/end-images') { json(res, await serialize(() => upload(req, true)), 201); return }
      if (req.method === 'DELETE' && path.startsWith(BASE_PATH + '/end-images/')) {
        const id = path.slice((BASE_PATH + '/end-images/').length)
        if (!IMAGE_ID.test(id)) throw new HttpError(400, '只能删除自己上传的封面图片。')
        const result = await serialize(async () => {
          const image = store.endImages.find(c => c.id === id)
          if (!image) throw new HttpError(404, '封面图片不存在。')
          const settings = store.settings.endImageId === id ? { ...store.settings, endScreen: 'logo', endImageId: null } : store.settings
          await persist({ ...store, settings, endImages: store.endImages.filter(c => c.id !== id) })
          await unlink(join(imagesDir, image.id + image.ext)).catch(error => { if (error.code !== 'ENOENT') throw error })
          return state()
        })
        json(res, result); return
      }
      if (req.method === 'DELETE' && path.startsWith(BASE_PATH + '/clips/')) {
        const id = path.slice((BASE_PATH + '/clips/').length)
        if (!UPLOAD_ID.test(id)) throw new HttpError(400, '只能删除自己上传的动画。')
        const result = await serialize(async () => {
          const clip = store.uploads.find(c => c.id === id)
          if (!clip) throw new HttpError(404, '动画不存在。')
          // Commit the library first. A crash can leave an unused file, never a dangling selection.
          await persist({ ...store, settings: { ...store.settings, selectedId: store.settings.selectedId === id ? 'brand' : store.settings.selectedId }, uploads: store.uploads.filter(c => c.id !== id) })
          await unlink(join(videosDir, clip.id + clip.ext)).catch(error => { if (error.code !== 'ENOENT') throw error })
          return state()
        })
        json(res, result); return
      }
      throw new HttpError(404, '接口不存在。')
    } catch (error) {
      if (res.headersSent) { res.destroy(); return }
      json(res, { error: error instanceof HttpError ? error.message : '文件操作失败，请检查数据目录权限和可用空间。' }, error.status || 500)
    }
  }
}

export function apply(ctx) {
  const handler = createHandler()
  const register = () => ctx.webServer.register({ kind: 'prefix', path: BASE_PATH, handler })
  if (typeof ctx.effect === 'function') ctx.effect(register, 'dsh-boot-studio: routes')
  else register()
}
