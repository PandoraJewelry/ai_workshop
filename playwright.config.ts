import { defineConfig, devices } from '@playwright/test';

const isWindows = process.platform === 'win32';

const backendCommand = isWindows
  ? 'cd backend && call venv\\Scripts\\activate.bat && python main.py'
  : 'cd backend && source venv/bin/activate && python main.py';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: backendCommand,
      url: 'http://localhost:8765/api/products',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: 'npm run dev --prefix frontend',
      url: 'http://localhost:4321',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
  ],
});
