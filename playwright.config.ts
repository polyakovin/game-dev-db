import { defineConfig, devices } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT ?? '4321';
const origin = `http://127.0.0.1:${port}`;
// CI has already built dist via npm run verify. Test the published artifact
// without Vite's development reloads interrupting navigation assertions.
const preview = Boolean(process.env.CI || process.env.PLAYWRIGHT_PREVIEW);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: origin,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run ${preview ? 'preview' : 'dev'} -- --host 127.0.0.1 --port ${port} --ignore-lock`,
    url: `${origin}/game-dev-db/ru/`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
