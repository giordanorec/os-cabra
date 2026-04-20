import { defineConfig, devices } from '@playwright/test';

// Config dedicada aos testes de smoke mobile (iPad).
// Porta separada (5174) pra não conflitar com a dev server do worktree principal.
// Usa o mesmo vite; só difere viewport/userAgent e hasTouch configurados
// por `test.use()` dentro de tests/smoke/mobile-ipad.spec.ts.

const DEV_URL = 'http://localhost:5179';

export default defineConfig({
  testDir: './tests/smoke',
  testMatch: /mobile-ipad\.spec\.ts/,
  timeout: 30_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: DEV_URL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'mobile-ipad',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run dev -- --port 5179 --strictPort',
    url: DEV_URL,
    reuseExistingServer: false,
    timeout: 30_000
  }
});
