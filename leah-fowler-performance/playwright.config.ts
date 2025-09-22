import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3007',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Mobile iPhone 14 Pro',
      use: { 
        ...devices['iPhone 14 Pro'],
        viewport: { width: 390, height: 844 }
      },
    },
    {
      name: 'Tablet iPad',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 768, height: 1024 }
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3007',
    reuseExistingServer: true,
    timeout: 120000,
  },
});