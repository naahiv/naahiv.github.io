import { defineConfig } from '@playwright/test';

// Build the draft and production outputs first; this suite starts their servers.
// Separate origins make a forgotten production draft exclusion observable.
export default defineConfig({
  testDir: './tests',
  testMatch: 'browser.spec.mjs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 3 : 4,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  outputDir: 'work/browser-results',
  reporter: [['list'], ['html', { outputFolder: 'work/browser-report', open: 'never' }]],
  use: {
    baseURL: process.env.PREVIEW_URL || 'http://127.0.0.1:4321',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    reducedMotion: 'reduce',
  },
  webServer: [
    ...(!process.env.PREVIEW_URL ? [{ command: 'node scripts/serve.mjs dist-preview 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI, timeout: 15_000 }] : []),
    ...(!process.env.PRODUCTION_URL ? [{ command: 'node scripts/serve.mjs dist 4322', url: 'http://127.0.0.1:4322', reuseExistingServer: !process.env.CI, timeout: 15_000 }] : []),
  ],
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
