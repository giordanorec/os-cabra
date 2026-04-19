import { defineConfig, devices } from '@playwright/test';

const DEV_URL = 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 30_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: DEV_URL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } }
    }
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: DEV_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
