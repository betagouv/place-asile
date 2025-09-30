import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests-e2e",
  use: {
    baseURL: "http://localhost:3000",
    headless: false,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
