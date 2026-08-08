import "server-only"

import { cache } from "react"

import { getCountryFromSnapshot } from "@/features/countries/data/country-snapshot"
import { CountryNotFoundError } from "@/features/countries/model/country.errors"
import { countryCodeSchema } from "@/features/countries/model/country.schemas"

export const getCountry = cache(async (untrustedCode: string) => {
  const code = countryCodeSchema.safeParse(untrustedCode)

  if (!code.success) {
    throw new CountryNotFoundError()
  }

  const country = getCountryFromSnapshot(code.data)

  if (!country) {
    throw new CountryNotFoundError()
  }

  return country
})
