import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright_tests',  // Playwright will only look in this directory
});