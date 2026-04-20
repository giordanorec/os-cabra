import { defineConfig, devices } from '@playwright/test';

// Config dedicada ao smoke do parallax fix — porta 5180 pra não colar em
// dev servers de outros worktrees (gameplay-visual-pivot, mobile-v1 etc).

const DEV_URL = 'http://localhost:5180';

export default defineConfig({
  testDir: './tests/smoke',
  testMatch: /parallax-fallback\.spec\.ts/,
  timeout: 30_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: DEV_URL,
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium-parallax', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } }
  ],
  webServer: {
    command: 'npm run dev -- --port 5180 --strictPort',
    url: DEV_URL,
    reuseExistingServer: false,
    timeout: 30_000
  }
});
