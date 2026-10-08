import { defineConfig, devices } from "@playwright/test";

const target = process.env.TEST_TARGET ?? "next";
if (!["next", "export"].includes(target)) {
  throw new Error("TEST_TARGET must be next or export");
}
const baseURL = "http://127.0.0.1:" + (target === "next" ? 4175 : 4176);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    reducedMotion: "reduce",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      target === "next"
        ? "TEST_SERVER=1 PORT=4175 pnpm dev --hostname 127.0.0.1"
        : "PORT=4176 pnpm preview",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
