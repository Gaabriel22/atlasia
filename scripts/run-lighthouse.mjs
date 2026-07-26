import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { createServer } from "node:net"
import process from "node:process"

import { chromium } from "@playwright/test"
import lighthouse, { generateReport } from "lighthouse"
import puppeteer from "puppeteer-core"

const categoryBudgets = {
  performance: 0.9,
  accessibility: 1,
  "best-practices": 0.95,
  seo: 1,
}

const metricBudgets = {
  "largest-contentful-paint": 2_500,
  "cumulative-layout-shift": 0.1,
}
const interactionBudget = 200

const routes = [
  { name: "catalog", pathname: "/en" },
  { name: "profile", pathname: "/en/countries/ca" },
]

const port = 3_100
const origin = `http://localhost:${port}`
const outputDirectory = ".lighthouse"
const lighthouseUserAgent =
  "Mozilla/5.0 (Linux; Android 11; moto g power) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse"

function readRunCount() {
  const argument = process.argv.find((value) => value.startsWith("--runs="))
  const value = Number.parseInt(argument?.split("=")[1] ?? "3", 10)

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("--runs must be an integer between 1 and 5.")
  }

  return value
}

function median(values) {
  const sortedValues = [...values].sort((left, right) => left - right)
  return sortedValues[Math.floor(sortedValues.length / 2)]
}

async function assertPortAvailable() {
  await new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once("error", reject)
    probe.once("listening", () => probe.close(resolve))
    probe.listen(port)
  })
}

async function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once("error", reject)
    probe.once("listening", () => {
      const address = probe.address()
      if (!address || typeof address === "string") {
        probe.close()
        reject(new Error("Could not reserve a Chromium debugging port."))
        return
      }
      probe.close(() => resolve(address.port))
    })
    probe.listen(0, "127.0.0.1")
  })
}

async function launchAuditBrowser(label) {
  const browserPort = await findAvailablePort()
  const profileDirectory = `${outputDirectory}/chrome-profile-${process.pid}-${label}`
  await mkdir(profileDirectory, { recursive: true })
  const context = await chromium.launchPersistentContext(profileDirectory, {
    args: [`--remote-debugging-port=${browserPort}`],
    headless: true,
  })

  return { browserPort, context }
}

async function buildProduction() {
  if (process.argv.includes("--skip-build")) return

  console.log("Building Atlasia for the controlled Lighthouse origin...")
  const nextCli = "node_modules/next/dist/bin/next"
  const build = spawn(process.execPath, [nextCli, "build"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      SITE_URL: origin,
    },
    stdio: "inherit",
    windowsHide: true,
  })

  const exitCode = await new Promise((resolve) => build.once("exit", resolve))
  if (exitCode !== 0) {
    throw new Error(`The production build exited with code ${exitCode}.`)
  }
}

function startProductionServer() {
  const nextCli = "node_modules/next/dist/bin/next"
  const server = spawn(
    process.execPath,
    [nextCli, "start", "--port", `${port}`],
    {
      env: {
        ...process.env,
        NODE_ENV: "production",
        SITE_URL: origin,
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  )

  server.stdout.on("data", (chunk) => process.stdout.write(chunk))
  server.stderr.on("data", (chunk) => process.stderr.write(chunk))

  return server
}

async function waitForServer(server) {
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(
        `The production server exited with code ${server.exitCode}.`,
      )
    }

    try {
      const response = await fetch(`${origin}/en`)
      if (response.ok) return
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error(
    "The production server did not become ready within 60 seconds.",
  )
}

async function stopProductionServer(server) {
  if (server.exitCode !== null) return

  server.kill()
  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, 5_000)
    server.once("exit", () => {
      clearTimeout(timeout)
      resolve()
    })
  })
}

function extractMeasurements(lhr) {
  const categories = Object.fromEntries(
    Object.keys(categoryBudgets).map((category) => {
      const score = lhr.categories[category]?.score
      if (typeof score !== "number") {
        throw new Error(`Lighthouse did not return the ${category} score.`)
      }
      return [category, score]
    }),
  )

  const metrics = {
    "largest-contentful-paint":
      lhr.audits["largest-contentful-paint"]?.numericValue,
    "cumulative-layout-shift":
      lhr.audits["cumulative-layout-shift"]?.numericValue,
  }

  for (const [metric, value] of Object.entries(metrics)) {
    if (typeof value !== "number") {
      throw new Error(`Lighthouse did not return the ${metric} metric.`)
    }
  }

  return { categories, metrics }
}

async function auditRoute(route, runCount) {
  const measurements = []

  for (let run = 1; run <= runCount; run += 1) {
    console.log(`\nAuditing ${route.name} (${run}/${runCount})...`)
    const { browserPort, context } = await launchAuditBrowser(
      `${route.name}-${run}`,
    )

    try {
      const result = await lighthouse(`${origin}${route.pathname}`, {
        formFactor: "mobile",
        emulatedUserAgent: lighthouseUserAgent,
        logLevel: "error",
        onlyCategories: Object.keys(categoryBudgets),
        output: "json",
        port: browserPort,
        screenEmulation: {
          deviceScaleFactor: 2,
          disabled: false,
          height: 800,
          mobile: true,
          width: 360,
        },
        throttlingMethod: "simulate",
      })

      if (!result) throw new Error(`Lighthouse failed to audit ${route.name}.`)

      const reportBase = `${outputDirectory}/${route.name}-${run}`
      await Promise.all([
        writeFile(`${reportBase}.json`, JSON.stringify(result.lhr, null, 2)),
        writeFile(`${reportBase}.html`, generateReport(result.lhr, "html")),
      ])
      measurements.push(extractMeasurements(result.lhr))
    } finally {
      await context.close()
    }
  }

  return {
    categories: Object.fromEntries(
      Object.keys(categoryBudgets).map((category) => [
        category,
        median(measurements.map(({ categories }) => categories[category])),
      ]),
    ),
    metrics: Object.fromEntries(
      Object.keys(metricBudgets).map((metric) => [
        metric,
        median(measurements.map(({ metrics }) => metrics[metric])),
      ]),
    ),
  }
}

async function auditCatalogInteraction(runCount) {
  const measurements = []

  for (let run = 1; run <= runCount; run += 1) {
    console.log(`\nMeasuring catalog INP (${run}/${runCount})...`)
    const { browserPort, context } = await launchAuditBrowser(
      `interaction-${run}`,
    )
    const connectedBrowser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${browserPort}`,
    })
    const page = await connectedBrowser.newPage()
    const client = await page.createCDPSession()

    try {
      await client.send("Emulation.setCPUThrottlingRate", { rate: 4 })
      await page.setUserAgent({ userAgent: lighthouseUserAgent })
      await page.setViewport({
        deviceScaleFactor: 2,
        hasTouch: true,
        height: 800,
        isMobile: true,
        width: 360,
      })
      await page.goto(`${origin}/en`, { waitUntil: "networkidle0" })
      await page.evaluate(() => {
        window.__atlasiaInteractions = []
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.interactionId > 0) {
              window.__atlasiaInteractions.push({
                duration: entry.duration,
                inputDelay: entry.processingStart - entry.startTime,
                interactionId: entry.interactionId,
                name: entry.name,
                processingDuration: entry.processingEnd - entry.processingStart,
                presentationDelay:
                  entry.startTime + entry.duration - entry.processingEnd,
              })
            }
          }
        })
        observer.observe({
          buffered: true,
          durationThreshold: 0,
          type: "event",
        })
      })

      await page.click("#country-search")
      await page.keyboard.type("canada", { delay: 50 })
      await page.waitForFunction(
        () =>
          document.querySelector('[role="status"]')?.textContent?.trim() ===
          "1 country found",
      )
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      )

      const regionFilters = await page.$$(
        'button[data-slot="toggle-group-item"]',
      )
      for (const regionFilter of regionFilters) {
        const label = await regionFilter.evaluate((element) =>
          element.textContent?.trim(),
        )
        if (label === "Africa") {
          await regionFilter.click()
          break
        }
      }
      await page.waitForFunction(
        () =>
          document.querySelector('[role="status"]')?.textContent?.trim() ===
          "No countries found",
      )
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      )
      const reportBase = `${outputDirectory}/catalog-interaction-${run}`
      const interactions = await page.evaluate(
        () => window.__atlasiaInteractions,
      )
      const eventTimingInp = Math.max(
        ...interactions.map(({ duration }) => duration),
      )
      const inp = eventTimingInp

      if (!Number.isFinite(inp)) {
        throw new Error("Event Timing did not return a catalog interaction.")
      }
      await writeFile(
        `${reportBase}.json`,
        JSON.stringify(
          {
            inp,
            interactions,
            source: "PerformanceEventTiming",
          },
          null,
          2,
        ),
      )
      console.log(`Event Timing measured ${inp.toFixed(0)} ms.`)
      console.table(
        interactions
          .sort((left, right) => right.duration - left.duration)
          .slice(0, 5),
      )

      measurements.push(inp)
    } finally {
      await client.detach()
      await page.close()
      await connectedBrowser.disconnect()
      await context.close()
    }
  }

  return median(measurements)
}

function assertBudgets(summary) {
  const failures = []

  for (const [route, results] of Object.entries(summary)) {
    for (const [category, minimum] of Object.entries(categoryBudgets)) {
      const score = results.categories[category]
      if (score < minimum) {
        failures.push(
          `${route}: ${category} scored ${Math.round(score * 100)}, expected at least ${Math.round(minimum * 100)}.`,
        )
      }
    }

    for (const [metric, maximum] of Object.entries(metricBudgets)) {
      const value = results.metrics[metric]
      if (value > maximum) {
        failures.push(
          `${route}: ${metric} was ${value.toFixed(2)}, expected at most ${maximum}.`,
        )
      }
    }
  }

  const inp = summary.catalog.metrics["interaction-to-next-paint"]
  if (inp > interactionBudget) {
    failures.push(
      `catalog: interaction-to-next-paint was ${inp.toFixed(2)} ms, expected at most ${interactionBudget} ms.`,
    )
  }

  if (failures.length > 0) {
    throw new Error(`Lighthouse budgets failed:\n- ${failures.join("\n- ")}`)
  }
}

function printSummary(summary) {
  console.table(
    Object.fromEntries(
      Object.entries(summary).map(([route, results]) => [
        route,
        {
          Performance: Math.round(results.categories.performance * 100),
          Accessibility: Math.round(results.categories.accessibility * 100),
          "Best Practices": Math.round(
            results.categories["best-practices"] * 100,
          ),
          SEO: Math.round(results.categories.seo * 100),
          "LCP (ms)": Math.round(results.metrics["largest-contentful-paint"]),
          CLS: results.metrics["cumulative-layout-shift"].toFixed(3),
          "INP (ms)":
            typeof results.metrics["interaction-to-next-paint"] === "number"
              ? Math.round(results.metrics["interaction-to-next-paint"])
              : "—",
        },
      ]),
    ),
  )
}

async function main() {
  const runCount = readRunCount()
  const interactionOnly = process.argv.includes("--interaction-only")
  await mkdir(outputDirectory, { recursive: true })
  await assertPortAvailable()
  await buildProduction()

  const server = startProductionServer()

  try {
    await waitForServer(server)

    if (interactionOnly) {
      const inp = await auditCatalogInteraction(runCount)
      if (inp > interactionBudget) {
        throw new Error(
          `Catalog INP was ${inp.toFixed(2)} ms, expected at most ${interactionBudget} ms.`,
        )
      }
      console.log(`Catalog INP budget passed: ${inp.toFixed(0)} ms.`)
      return
    }

    const summary = {}
    for (const route of routes) {
      summary[route.name] = await auditRoute(route, runCount)
    }
    summary.catalog.metrics["interaction-to-next-paint"] =
      await auditCatalogInteraction(runCount)

    await writeFile(
      `${outputDirectory}/summary.json`,
      JSON.stringify({ runCount, routes: summary }, null, 2),
    )
    printSummary(summary)
    assertBudgets(summary)
  } finally {
    await stopProductionServer(server)
  }
}

await main()
