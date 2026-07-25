import { beforeEach, describe, expect, it, vi } from "vitest"

import { countrySummarySchema } from "@/features/countries/model/country.schemas"

const countries = [
  countrySummarySchema.parse({
    code: "CA",
    alpha3Code: "CAN",
    name: "Canada",
  }),
]

vi.mock("@/config/env", () => ({
  env: {
    siteUrl: "https://atlasia-world.vercel.app",
    restCountriesApiKey: "test-api-key",
  },
}))

vi.mock("@/features/countries/queries/get-countries", () => ({
  getCountries: vi.fn(async () => countries),
}))

vi.mock("@/i18n/navigation", () => ({
  getPathname: ({
    href,
    locale,
  }: {
    href: string | { params: { code: string } }
    locale: "pt-BR" | "en"
  }) =>
    typeof href === "string"
      ? `/${locale}`
      : `/${locale}/${locale === "pt-BR" ? "paises" : "countries"}/${href.params.code}`,
}))

import manifest from "@/app/manifest"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"

describe("metadata routes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("publishes an installable manifest with the approved brand assets", () => {
    expect(manifest()).toMatchObject({
      name: "Atlasia — Atlas mundial",
      short_name: "Atlasia",
      start_url: "/pt-BR",
      display: "standalone",
      icons: expect.arrayContaining([
        expect.objectContaining({
          src: "/brand/icon.png",
          sizes: "512x512",
        }),
      ]),
    })
  })

  it("allows public crawling and advertises the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://atlasia-world.vercel.app/sitemap.xml",
      host: "https://atlasia-world.vercel.app",
    })
  })

  it("lists both catalog and profile locales with reciprocal alternates", async () => {
    const entries = await sitemap()

    expect(entries).toHaveLength(4)
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://atlasia-world.vercel.app/pt-BR",
          alternates: {
            languages: expect.objectContaining({
              "pt-BR": "https://atlasia-world.vercel.app/pt-BR",
              en: "https://atlasia-world.vercel.app/en",
              "x-default": "https://atlasia-world.vercel.app/pt-BR",
            }),
          },
        }),
        expect.objectContaining({
          url: "https://atlasia-world.vercel.app/en/countries/ca",
          alternates: {
            languages: expect.objectContaining({
              "pt-BR": "https://atlasia-world.vercel.app/pt-BR/paises/ca",
              en: "https://atlasia-world.vercel.app/en/countries/ca",
            }),
          },
        }),
      ]),
    )
  })
})
