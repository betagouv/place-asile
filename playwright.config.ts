import { defineConfig } from "@playwright/test";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1, // Run tests sequentially to avoid race conditions
  use: {
    baseURL: "http://localhost:3000",
    headless: false,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
