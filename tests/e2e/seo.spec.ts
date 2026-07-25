import { expect, test } from "@playwright/test"
import { z } from "zod"

const jsonLdGraphSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@graph": z.array(
    z
      .object({
        "@type": z.string(),
      })
      .loose(),
  ),
})

async function readJsonLd(page: import("@playwright/test").Page) {
  const content = await page
    .locator('script[type="application/ld+json"]')
    .textContent()

  return jsonLdGraphSchema.parse(JSON.parse(content ?? ""))
}

test("publishes localized, indexable catalog metadata and schema", async ({
  page,
}) => {
  await page.goto("/pt-BR")

  await expect(page).toHaveTitle("Atlasia — descubra o mundo")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://atlasia-world.vercel.app/pt-BR",
  )
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]'),
  ).toHaveAttribute("href", "https://atlasia-world.vercel.app/en")
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]'),
  ).toHaveAttribute("href", "https://atlasia-world.vercel.app/pt-BR")
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  )
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "pt_BR",
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/pt-BR\/opengraph-image/,
  )
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]'),
  ).toHaveCount(0)

  const jsonLd = await readJsonLd(page)
  const website = jsonLd["@graph"].find((node) => node["@type"] === "WebSite")
  const collection = jsonLd["@graph"].find(
    (node) => node["@type"] === "CollectionPage",
  )

  expect(website).toMatchObject({
    url: "https://atlasia-world.vercel.app/",
    name: "Atlasia",
  })
  expect(collection).toMatchObject({
    url: "https://atlasia-world.vercel.app/pt-BR",
    inLanguage: "pt-BR",
  })
})

test("publishes matching Country and breadcrumb schema on profiles", async ({
  page,
}) => {
  await page.goto("/en/countries/ca")

  await expect(page).toHaveTitle("Canada — geographic profile | Atlasia")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://atlasia-world.vercel.app/en/countries/ca",
  )
  await expect(
    page.locator('link[rel="alternate"][hreflang="pt-BR"]'),
  ).toHaveAttribute("href", "https://atlasia-world.vercel.app/pt-BR/paises/ca")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)

  const jsonLd = await readJsonLd(page)
  const country = jsonLd["@graph"].find((node) => node["@type"] === "Country")
  const breadcrumb = jsonLd["@graph"].find(
    (node) => node["@type"] === "BreadcrumbList",
  )

  expect(country).toMatchObject({
    url: "https://atlasia-world.vercel.app/en/countries/ca",
    name: "Canada",
    containedInPlace: {
      "@type": "Place",
      name: "Americas",
    },
  })
  expect(breadcrumb).toMatchObject({
    itemListElement: expect.arrayContaining([
      expect.objectContaining({
        name: "Canada",
        item: "https://atlasia-world.vercel.app/en/countries/ca",
      }),
    ]),
  })
})

test("serves crawl, install, sitemap, and social image metadata routes", async ({
  request,
}) => {
  const [robotsResponse, manifestResponse, sitemapResponse, imageResponse] =
    await Promise.all([
      request.get("/robots.txt"),
      request.get("/manifest.webmanifest"),
      request.get("/sitemap.xml"),
      request.get("/pt-BR/opengraph-image"),
    ])

  await expect(robotsResponse).toBeOK()
  await expect(manifestResponse).toBeOK()
  await expect(sitemapResponse).toBeOK()
  await expect(imageResponse).toBeOK()

  expect(await robotsResponse.text()).toContain(
    "Sitemap: https://atlasia-world.vercel.app/sitemap.xml",
  )
  expect(await manifestResponse.json()).toMatchObject({
    name: "Atlasia — Atlas mundial",
    start_url: "/pt-BR",
  })

  const sitemap = await sitemapResponse.text()
  expect(sitemap).toContain("<loc>https://atlasia-world.vercel.app/pt-BR</loc>")
  expect(sitemap).toContain(
    'hreflang="en" href="https://atlasia-world.vercel.app/en"',
  )
  expect(sitemap).toContain("https://atlasia-world.vercel.app/pt-BR/paises/ca")
  expect(imageResponse.headers()["content-type"]).toContain("image/png")
  expect((await imageResponse.body()).byteLength).toBeGreaterThan(10_000)
})
