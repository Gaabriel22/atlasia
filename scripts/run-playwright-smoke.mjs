import { spawn } from "node:child_process"
import process from "node:process"

const playwright = spawn(
  process.execPath,
  [
    "node_modules/@playwright/test/cli.js",
    "test",
    "--grep",
    "@smoke",
    ...process.argv.slice(2),
  ],
  {
    env: {
      ...process.env,
      CI: "1",
    },
    stdio: "inherit",
    windowsHide: true,
  },
)

const exitCode = await new Promise((resolve, reject) => {
  playwright.once("error", reject)
  playwright.once("exit", resolve)
})

if (exitCode === null) {
  throw new Error("Playwright smoke tests exited without a status code.")
}

process.exitCode = exitCode
