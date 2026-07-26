import { expect, test } from "@playwright/test"

const localizedCatalogs = [
  {
    path: "/pt-BR",
    title: "Escolha sua próxima coordenada",
    searchLabel: "Buscar por país ou capital",
    resultPattern: /\d+ países? encontrados?/,
  },
  {
    path: "/en",
    title: "Choose your next coordinate",
    searchLabel: "Search by country or capital",
    resultPattern: /\d+ countries? found/,
  },
] as const

for (const catalog of localizedCatalogs) {
  test(
    `renders the live catalog at ${catalog.path}`,
    { tag: "@smoke" },
    async ({ page }) => {
      await page.goto(catalog.path)

      await expect(
        page.getByRole("heading", { name: catalog.title, level: 2 }),
      ).toBeVisible()
      await expect(
        page.getByRole("searchbox", { name: catalog.searchLabel }),
      ).toBeVisible()
      await expect(page.getByRole("status")).toHaveText(catalog.resultPattern)
      await expect(
        page.getByRole("link", { name: /Brazil|Brasil/ }),
      ).toBeVisible()
    },
  )
}

test(
  "searches by capital and combines the region filter with keyboard input",
  { tag: "@smoke" },
  async ({ page }) => {
    await page.goto("/pt-BR")

    const search = page.getByRole("searchbox", {
      name: "Buscar por país ou capital",
    })
    await search.focus()
    await page.keyboard.type("brasilia")

    await expect(
      page.getByRole("link", { name: "Explorar Brasil" }),
    ).toBeVisible()
    await expect(page.getByRole("status")).toHaveText("1 país encontrado")

    const africaFilter = page.getByRole("button", { name: "África" })
    await africaFilter.focus()
    await page.keyboard.press("Enter")

    await expect(
      page.getByRole("heading", {
        name: "Nenhuma coordenada corresponde aos filtros.",
      }),
    ).toBeVisible()
    await expect(page.getByRole("status")).toHaveText("Nenhum país encontrado")

    await page.getByRole("button", { name: "Limpar filtros" }).press("Enter")
    await expect(search).toHaveValue("")
    await expect(page.getByRole("status")).toHaveText(/\d+ países encontrados/)
  },
)

test(
  "navigates from a catalog card to its localized profile",
  { tag: "@smoke" },
  async ({ page }) => {
    await page.goto("/en")
    await page
      .getByRole("searchbox", { name: "Search by country or capital" })
      .fill("Canada")

    await page.getByRole("link", { name: /^Explore Canada\b/ }).click()

    await expect(page).toHaveURL(/\/en\/countries\/ca$/)
    await expect(
      page.getByRole("heading", { name: "Canada", level: 1 }),
    ).toBeVisible()
  },
)

test("keeps the mobile catalog inside a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto("/en")

  await expect(
    page.getByRole("heading", { name: "Choose your next coordinate" }),
  ).toBeVisible()

  const hasHorizontalPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasHorizontalPageOverflow).toBe(false)

  const searchBox = await page
    .getByRole("searchbox", { name: "Search by country or capital" })
    .boundingBox()
  expect(searchBox?.height).toBeGreaterThanOrEqual(44)

  const firstCard = page.getByRole("link", { name: /^Explore / }).first()
  await expect(firstCard).toBeVisible()
  expect((await firstCard.boundingBox())?.width).toBeLessThanOrEqual(296)
})

test("hydrates localized country names without mismatches", async ({
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

  await page.goto("/en")
  await expect(page.getByRole("status")).toHaveText(/\d+ countries found/)
  await page
    .getByRole("searchbox", { name: "Search by country or capital" })
    .fill("Falkland")
  await expect(
    page.getByRole("link", { name: /Explore Falkland/ }),
  ).toBeVisible()

  const hydrationErrors = browserErrors.filter((message) =>
    /hydration|did not match|server rendered text/i.test(message),
  )
  expect(hydrationErrors).toEqual([])
})
