import { expect, test } from "@playwright/test"

test("renders shared shell landmarks", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/pt-BR")

  await expect(page.getByRole("banner")).toBeVisible()
  await expect(page.getByRole("main")).toBeVisible()
  await expect(page.getByRole("contentinfo")).toBeVisible()
})

test("keeps 320px reflow and touch targets usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto("/pt-BR")

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)

  const languageNavigation = page.getByRole("navigation", {
    name: "Seleção de idioma",
  })

  for (const button of await languageNavigation.getByRole("button").all()) {
    const box = await button.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  }
})

test("exposes a working skip link", async ({ page }) => {
  await page.goto("/en")
  await page.keyboard.press("Tab")

  const skipLink = page.getByRole("link", { name: "Skip to content" })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("main")).toBeFocused()
})

test("renders the localized not-found state", async ({ page }) => {
  await page.goto("/pt-BR/coordenadas-inexistentes")

  await expect(
    page.getByRole("heading", {
      name: "Este lugar não apareceu no mapa.",
    }),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Voltar ao atlas" }),
  ).toBeVisible()
})
