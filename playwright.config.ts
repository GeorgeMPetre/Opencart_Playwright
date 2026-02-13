import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  timeout: 90_000, 
  expect: { timeout: 15_000 },

  use: {
    baseURL: "http://localhost/opencart/upload/",
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    { name: "Chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Firefox",  use: { ...devices["Desktop Firefox"] } },
    { name: "WebKit",   use: { ...devices["Desktop Safari"] } },
  ],

  reporter: [["html", { outputFolder: "reports/html" }], ["list"]],
});
