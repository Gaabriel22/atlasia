import { defineConfig, devices } from "@playwright/test"

const nextCli = "node node_modules/next/dist/bin/next"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["list"]]
    : [["html", { open: "on-failure" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: process.env.CI ? "retain-on-failure" : "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `npm run build && ${nextCli} start`
      : `${nextCli} dev`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://localhost:3000/robots.txt",
  },
})
