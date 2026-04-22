import { defineConfig, devices } from '@playwright/test';
import { UI_BASE_URL } from './src/constants';

export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  expect: { timeout: 20_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: require.resolve('./global-setup.ts'),
  use: {
    baseURL: UI_BASE_URL,
    testIdAttribute: 'data-qa',
    actionTimeout: 30_000,
    navigationTimeout: 45_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
    },
    {
      name: 'chromium',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: 'tests/ui/**/*.spec.ts',
      testIgnore: 'tests/ui/authenticated/**',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: 'tests/ui/**/*.spec.ts',
      testIgnore: 'tests/ui/authenticated/**',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
