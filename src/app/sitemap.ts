import type { MetadataRoute } from "next"

import { getCountries } from "@/features/countries/queries/get-countries"
import {
  getCatalogLanguageAlternates,
  getCatalogUrl,
  getCountryLanguageAlternates,
  getCountryUrl,
} from "@/lib/seo/localized-urls"
import { routing } from "@/i18n/routing"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCountries()
  const catalogAlternates = getCatalogLanguageAlternates()

  const catalogs: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: getCatalogUrl(locale),
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: catalogAlternates,
    },
  }))

  const profiles: MetadataRoute.Sitemap = countries.flatMap((country) => {
    const alternates = getCountryLanguageAlternates(country.code)

    return routing.locales.map((locale) => ({
      url: getCountryUrl(locale, country.code),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: alternates,
      },
    }))
  })

  return [...catalogs, ...profiles]
}
