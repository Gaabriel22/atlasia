import type { CountrySummary } from "@/features/countries/model/country.schemas"
import {
  formatCountryName,
  formatPopulation,
} from "@/features/countries/utils/country-formatters"

export type CountryCatalogItem = CountrySummary & {
  localizedName: string
  formattedPopulation?: string
}

export function createCountryCatalogItems(
  countries: CountrySummary[],
  locale: string,
): CountryCatalogItem[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base" })

  return countries
    .map((country) => ({
      ...country,
      localizedName: formatCountryName(country.code, country.name, locale),
      formattedPopulation:
        country.population === undefined
          ? undefined
          : formatPopulation(country.population, locale),
    }))
    .toSorted((first, second) =>
      collator.compare(first.localizedName, second.localizedName),
    )
}
