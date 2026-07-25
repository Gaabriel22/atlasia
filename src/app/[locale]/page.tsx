import { setRequestLocale } from "next-intl/server"

import { CatalogUnavailable } from "@/features/countries/components/catalog-unavailable"
import { CountryCatalog } from "@/features/countries/components/country-catalog"
import { CountryHero } from "@/features/countries/components/country-hero"
import type { CountrySummary } from "@/features/countries/model/country.schemas"
import { getCountries } from "@/features/countries/queries/get-countries"
import { createCountryCatalogItems } from "@/features/countries/utils/country-catalog-items"

type HomePageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  let countries: CountrySummary[]

  try {
    countries = await getCountries()
  } catch {
    return (
      <div className="atlas-container flex min-h-[60svh] items-center py-10">
        <CatalogUnavailable />
      </div>
    )
  }

  const catalogItems = createCountryCatalogItems(countries, locale)

  return (
    <div className="atlas-container flex flex-col gap-16 py-8 sm:gap-20 sm:py-12 lg:gap-24 lg:py-16">
      <CountryHero countryCount={countries.length} />
      <CountryCatalog countries={catalogItems} />
    </div>
  )
}
