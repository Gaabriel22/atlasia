import { describe, expect, it, vi } from "vitest"

import detailFixture from "@/features/countries/api/__fixtures__/rest-countries-detail.json"
import { normalizeCountryDetail } from "@/features/countries/api/rest-countries.normalizers"
import { restCountriesDetailResponseSchema } from "@/features/countries/api/rest-countries.schemas"
import {
  createCatalogStructuredData,
  createCountryStructuredData,
} from "@/features/countries/utils/country-structured-data"

vi.mock("@/config/env", () => ({
  env: {
    siteUrl: "https://atlasia-world.vercel.app",
    restCountriesApiKey: "test-api-key",
  },
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

function canada() {
  const response = restCountriesDetailResponseSchema.parse(detailFixture)
  return normalizeCountryDetail(response.data.objects[0])
}

describe("country structured data", () => {
  it("describes the localized catalog and every visible profile link", () => {
    const data = createCatalogStructuredData({
      countries: [{ code: canada().code, localizedName: "Canadá" }],
      description: "Explore países e informações geográficas.",
      locale: "pt-BR",
      name: "Descubra o mundo",
    })

    expect(data["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "WebSite",
          url: "https://atlasia-world.vercel.app/",
        }),
        expect.objectContaining({
          "@type": "CollectionPage",
          url: "https://atlasia-world.vercel.app/pt-BR",
          mainEntity: expect.objectContaining({
            numberOfItems: 1,
            itemListElement: [
              expect.objectContaining({
                name: "Canadá",
                url: "https://atlasia-world.vercel.app/pt-BR/paises/ca",
              }),
            ],
          }),
        }),
      ]),
    )
  })

  it("uses only available profile values in Country and BreadcrumbList", () => {
    const data = createCountryStructuredData({
      breadcrumbCatalog: "Countries",
      country: canada(),
      labels: {
        area: "Area",
        capital: "Capital",
        population: "Population",
      },
      locale: "en",
      localizedName: "Canada",
      localizedOfficialName: "Canada",
      region: "Americas",
    })

    expect(data["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "BreadcrumbList",
          itemListElement: expect.arrayContaining([
            expect.objectContaining({
              name: "Canada",
              item: "https://atlasia-world.vercel.app/en/countries/ca",
            }),
          ]),
        }),
        expect.objectContaining({
          "@type": "Country",
          name: "Canada",
          identifier: expect.arrayContaining([
            expect.objectContaining({ value: "CA" }),
            expect.objectContaining({ value: "CAN" }),
          ]),
          containedInPlace: {
            "@type": "Place",
            name: "Americas",
          },
        }),
      ]),
    )
  })
})
