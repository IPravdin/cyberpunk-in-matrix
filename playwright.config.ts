import { defineConfig, devices } from '@playwright/test';

const target = process.env.MIGRATION_TARGET ?? 'next';
if (!['legacy', 'next', 'export'].includes(target)) {
  throw new Error('MIGRATION_TARGET must be legacy, next, or export');
}

const legacyURL = 'http://127.0.0.1:4174';
const targetURL = target === 'legacy' ? legacyURL
  : `http://127.0.0.1:${target === 'next' ? 4175 : 4176}`;
const webServer = [
  {
    command: 'node scripts/build-legacy.mjs && PORT=4174 SITE_DIR=.legacy node scripts/serve.mjs',
    url: legacyURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
];

if (target !== 'legacy') {
  webServer.push({
    command: target === 'next'
      ? 'MIGRATION_TEST=1 PORT=4175 pnpm dev --hostname 127.0.0.1'
      : 'PORT=4176 SITE_DIR=out node scripts/serve.mjs',
    url: targetURL,
    reuseExistingServer: false,
    timeout: 60_000,
  });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  use: {
    baseURL: targetURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer,
});
