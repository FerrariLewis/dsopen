import { defineConfig } from '@playwright/test'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const port = Number(process.env.BROWSER_TEST_PORT || 4181)
const dataDir = join(tmpdir(), `dsh-boot-studio-e2e-${process.pid}`)
export default defineConfig({
  testDir: './tests', testMatch: 'browser.spec.mjs', fullyParallel: false, workers: 1,
  timeout: 30000, expect: { timeout: 6000 },
  use: { baseURL: `http://127.0.0.1:${port}`, browserName: 'chromium', channel: 'chrome', headless: true, viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  webServer: {
    command: 'node scripts/preview.mjs', url: `http://127.0.0.1:${port}/dsh-boot-studio/state`, reuseExistingServer: false,
    timeout: 15000,
    env: { PORT: String(port), DSH_BOOT_STUDIO_DATA: dataDir },
  },
})
