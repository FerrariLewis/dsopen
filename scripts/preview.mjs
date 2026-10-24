import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHandler } from '../lib/index.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dataDir = process.env.DSH_BOOT_STUDIO_DATA || join(root, '.preview-data')
const api = createHandler({ dataDir, assetsDir: join(root, 'assets') })
const files = new Map([
  ['/', ['preview/index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['preview/index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['preview/app.js', 'text/javascript; charset=utf-8']],
])
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname
    if (pathname === '/dsh-boot-studio' || pathname.startsWith('/dsh-boot-studio/')) {
      await api(req, res)
      return
    }
    const entry = files.get(pathname)
    if (!entry || !['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('页面不存在')
      return
    }
    const path = join(root, entry[0])
    const info = await stat(path)
    res.writeHead(200, { 'content-type': entry[1], 'content-length': info.size, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' })
    if (req.method === 'HEAD') res.end()
    else createReadStream(path).on('error', () => res.destroy()).pipe(res)
  } catch (error) {
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: '预览服务异常，请查看控制台。' }))
    } else res.destroy()
    console.error(error)
  }
})
const port = Number(process.env.PORT || 4179)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535')
server.listen(port, '127.0.0.1', () => {
  console.log(`\n开机动画工作室 · 本地预览\nhttp://127.0.0.1:${port}\n\n关闭此窗口或按 Ctrl+C 停止。\n预览数据：${dataDir}\n`)
})
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `端口 ${port} 已使用。若预览已经打开，直接访问 http://127.0.0.1:${port}；或设置 PORT 使用其他端口。` : error.message)
  process.exitCode = 1
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)))
