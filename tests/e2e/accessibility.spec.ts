import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const wcagTags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]

async function expectNoWcagViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze()

  expect(
    results.violations,
    results.violations
      .map(
        (violation) =>
          `${violation.id}: ${violation.help}\n${violation.nodes
            .map((node) => `  ${node.target.join(" ")}: ${node.failureSummary}`)
            .join("\n")}`,
      )
      .join("\n\n"),
  ).toEqual([])
}

test("catalog meets automated WCAG 2.2 AA checks in both locales", async ({
  page,
}) => {
  for (const locale of ["pt-BR", "en"]) {
    await page.goto(`/${locale}`)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expectNoWcagViolations(page)
  }
})

test("filtered catalog remains accessible after a live update", async ({
  page,
}) => {
  await page.goto("/pt-BR")
  await page
    .getByRole("searchbox", { name: "Buscar por país ou capital" })
    .fill("brasil")
  await expect(page.getByRole("status")).toContainText("1")
  await expectNoWcagViolations(page)
})

test("country profile meets automated WCAG 2.2 AA checks", async ({ page }) => {
  await page.goto("/en/countries/ca")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Canada")
  await expectNoWcagViolations(page)
})

test("not-found state meets automated WCAG 2.2 AA checks", async ({ page }) => {
  await page.goto("/pt-BR/coordenadas-inexistentes")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expectNoWcagViolations(page)
})

test("supports a complete keyboard path with visible focus", async ({
  page,
}) => {
  await page.goto("/en")

  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused()

  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("link", { name: "Atlasia, home page" }),
  ).toBeFocused()

  await page.keyboard.press("Tab")
  await expect(page.getByRole("button", { name: "Portuguese" })).toBeFocused()

  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("button", { name: "English" })).toBeFocused()

  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("searchbox", {
      name: "Search by country or capital",
    }),
  ).toBeFocused()

  await page.keyboard.press("Tab")
  await expect(page.getByRole("button", { name: "All" })).toBeFocused()

  await page.keyboard.press("Tab")
  const firstCountryLink = page.getByRole("link", { name: /^Explore / }).first()
  await expect(firstCountryLink).toBeFocused()
  await expect(firstCountryLink.locator(".country-card")).toHaveCSS(
    "outline-width",
    "3px",
  )
})

test("uses a logical heading hierarchy and adequately sized controls", async ({
  page,
}) => {
  await page.goto("/en")

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  await expect(
    page.getByRole("heading", {
      name: "Choose your next coordinate",
      level: 2,
    }),
  ).toBeVisible()
  await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible()

  const largeControls = [
    page.getByRole("button", { name: "Portuguese" }),
    page.getByRole("button", { name: "English" }),
    page.getByRole("searchbox", {
      name: "Search by country or capital",
    }),
  ]

  for (const control of largeControls) {
    const box = await control.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  }

  const regionFilterBox = await page
    .getByRole("button", { name: "All" })
    .boundingBox()
  expect(regionFilterBox?.width).toBeGreaterThanOrEqual(24)
  expect(regionFilterBox?.height).toBeGreaterThanOrEqual(44)

  const search = page.getByRole("searchbox", {
    name: "Search by country or capital",
  })
  await search.fill("canada")
  const clearSearch = page.getByRole("button", { name: "Clear search" })
  const clearSearchBox = await clearSearch.boundingBox()
  expect(clearSearchBox?.width).toBeGreaterThanOrEqual(24)
  expect(clearSearchBox?.height).toBeGreaterThanOrEqual(24)
})

test("preserves reflow with WCAG text spacing overrides", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto("/en")
  await page.addStyleTag({
    content: `
      * {
        letter-spacing: 0.12em !important;
        line-height: 1.5 !important;
        word-spacing: 0.16em !important;
      }

      p {
        margin-bottom: 2em !important;
      }
    `,
  })

  await expect(
    page.getByRole("heading", {
      name: "Choose your next coordinate",
      level: 2,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole("searchbox", {
      name: "Search by country or capital",
    }),
  ).toBeVisible()

  const hasHorizontalPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasHorizontalPageOverflow).toBe(false)
})

test("removes non-essential motion when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/en")

  const motionStyles = await page
    .locator(".country-card")
    .first()
    .evaluate((element) => {
      const cardStyles = getComputedStyle(element)
      const rootStyles = getComputedStyle(document.documentElement)

      function durationInMilliseconds(duration: string) {
        return duration.endsWith("ms")
          ? Number.parseFloat(duration)
          : Number.parseFloat(duration) * 1_000
      }

      return {
        animationDurations: cardStyles.animationDuration
          .split(", ")
          .map(durationInMilliseconds),
        scrollBehavior: rootStyles.scrollBehavior,
        transitionDurations: cardStyles.transitionDuration
          .split(", ")
          .map(durationInMilliseconds),
      }
    })

  expect(motionStyles.scrollBehavior).toBe("auto")
  expect(
    motionStyles.animationDurations.every((duration) => duration <= 0.01),
  ).toBe(true)
  expect(
    motionStyles.transitionDurations.every((duration) => duration <= 0.01),
  ).toBe(true)
})
