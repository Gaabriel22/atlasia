import { expect, test } from "@playwright/test"

test("negotiates English from the browser language @smoke", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  })
  const response = await page.goto("/")

  await expect(page).toHaveURL(/\/en$/)
  expect(response?.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  )
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff")
  expect(response?.headers()["x-frame-options"]).toBe("DENY")
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(
    page.getByRole("heading", {
      name: "Discover the world like an explorer opening an atlas.",
    }),
  ).toBeVisible()
})

test("falls back to Brazilian Portuguese for an unsupported language", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "fr-FR" })
  const page = await context.newPage()

  await page.goto("/")

  await expect(page).toHaveURL(/\/pt-BR$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR")

  await context.close()
})

test("switches locale while preserving the current route", async ({ page }) => {
  await page.goto("/pt-BR")

  await page.getByRole("button", { name: "Inglês" }).click()

  await expect(page).toHaveURL(/\/en$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
})
