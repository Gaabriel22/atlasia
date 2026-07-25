import type { CountryRegion } from "@/features/countries/model/country.schemas"

export type CountryRegionFilter = CountryRegion | "all"

export type CountrySearchRecord = {
  localizedName: string
  capital?: string
  region?: CountryRegion
}

const DIACRITICS_PATTERN = /\p{Diacritic}/gu

export function normalizeCountrySearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLocaleLowerCase()
    .trim()
}

export function filterCountries<T extends CountrySearchRecord>(
  countries: T[],
  query: string,
  region: CountryRegionFilter,
) {
  const normalizedQuery = normalizeCountrySearchText(query)

  return countries.filter((country) => {
    const matchesRegion = region === "all" || country.region === region

    if (!matchesRegion || normalizedQuery.length === 0) {
      return matchesRegion
    }

    return [country.localizedName, country.capital].some(
      (value) =>
        value && normalizeCountrySearchText(value).includes(normalizedQuery),
    )
  })
}
