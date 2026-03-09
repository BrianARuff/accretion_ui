import path from 'node:path';
import { defineConfig } from '@playwright/test';

const chromaticRoot = path.resolve(__dirname, '..');
const reportDir = path.resolve(__dirname, 'playwright-report');

export default defineConfig({
  testDir: path.resolve(__dirname, 'specs'),
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 15_000
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: reportDir }]
  ],
  use: {
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: [
    {
      command: 'python3 -m http.server 6408 --directory react/storybook-static',
      url: 'http://127.0.0.1:6408',
      cwd: chromaticRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: 'python3 -m http.server 6406 --directory angular_18/storybook-static',
      url: 'http://127.0.0.1:6406',
      cwd: chromaticRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: 'python3 -m http.server 6407 --directory angular_21/storybook-static',
      url: 'http://127.0.0.1:6407',
      cwd: chromaticRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ]
});
