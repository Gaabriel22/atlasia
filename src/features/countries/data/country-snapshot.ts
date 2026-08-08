import "server-only"

import snapshotPayload from "@/features/countries/data/countries.snapshot.json"
import {
  countryCodeSchema,
  countryDetailSchema,
  countrySummarySchema,
  type CountryDetail,
  type CountrySummary,
} from "@/features/countries/model/country.schemas"

const countrySnapshot = countryDetailSchema.array().parse(snapshotPayload)
const countriesByCode = new Map(
  countrySnapshot.map((country) => [country.code, country]),
)

function toSummary(country: CountryDetail): CountrySummary {
  return countrySummarySchema.parse({
    code: country.code,
    alpha3Code: country.alpha3Code,
    name: country.name,
    capital: country.capital,
    region: country.region,
    population: country.population,
    flag: country.flag,
  })
}

export function getCountrySnapshot(): CountrySummary[] {
  return countrySnapshot.map(toSummary)
}

export function getCountryFromSnapshot(
  untrustedCode: string,
): CountryDetail | undefined {
  const code = countryCodeSchema.safeParse(untrustedCode)
  return code.success ? countriesByCode.get(code.data) : undefined
}
