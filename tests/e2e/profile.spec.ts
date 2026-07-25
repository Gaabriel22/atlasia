import { expect, test } from "@playwright/test"

test("renders a localized country dossier with dynamic SEO", async ({
  page,
}) => {
  const browserErrors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    browserErrors.push(error.message)
  })

  const response = await page.goto("/en/countries/ca")

  expect(response?.status()).toBe(200)
  await expect(
    page.getByRole("heading", { name: "Canada", level: 1 }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Geography", level: 2 }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Connectivity", level: 2 }),
  ).toBeVisible()
  await expect(page.getByRole("img", { name: "Flag of Canada" })).toBeVisible()
  await expect(page).toHaveTitle(/Canada/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/en\/countries\/ca$/,
  )
  await expect(
    page.locator('link[rel="alternate"][hreflang="pt-BR"]'),
  ).toHaveAttribute("href", /\/pt-BR\/paises\/ca$/)

  const naturalWidth = await page
    .getByRole("img", { name: "Flag of Canada" })
    .evaluate((image: HTMLImageElement) => image.naturalWidth)

  expect(naturalWidth).toBeGreaterThan(0)
  expect(
    browserErrors.filter((message) =>
      /hydration|did not match|server rendered text/i.test(message),
    ),
  ).toEqual([])
})

test("preserves the country while switching locales", async ({ page }) => {
  await page.goto("/pt-BR/paises/ca")
  await expect(
    page.getByRole("heading", { name: "Canadá", level: 1 }),
  ).toBeVisible()

  await page.getByRole("button", { name: "Inglês" }).click()

  await expect(page).toHaveURL(/\/en\/countries\/ca$/)
  await expect(
    page.getByRole("heading", { name: "Canada", level: 1 }),
  ).toBeVisible()
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(
    page.getByRole("link", { name: "Back to catalog" }),
  ).toHaveAttribute("href", "/en")
})

test("shows a localized not-found state for an unknown ISO code", async ({
  page,
}) => {
  await page.goto("/pt-BR/paises/zz")

  await expect(
    page.getByRole("heading", {
      name: "Este país não foi localizado.",
      level: 1,
    }),
  ).toBeVisible()
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]').first(),
  ).toBeAttached()
})

test("keeps the profile inside a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto("/en/countries/ca")

  await expect(
    page.getByRole("heading", { name: "Canada", level: 1 }),
  ).toBeVisible()

  const hasHorizontalPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )

  expect(hasHorizontalPageOverflow).toBe(false)
})

test("localizes controlled provider data on Portuguese profiles", async ({
  page,
}) => {
  await page.goto("/pt-BR/paises/cv")

  await expect(
    page.getByRole("heading", { name: "Cabo Verde", level: 1 }),
  ).toBeVisible()
  await expect(
    page.getByText("República semipresidencialista unitária"),
  ).toBeVisible()
  await expect(page.getByText("África Ocidental").first()).toBeVisible()
  await expect(page.getByText("República de Cabo Verde").first()).toBeVisible()
  await expect(
    page.getByText("Unitary semi-presidential republic"),
  ).toHaveCount(0)
  await expect(page.getByText("Western Africa")).toHaveCount(0)
})
