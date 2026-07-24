import "server-only"

import { cache } from "react"

import { env } from "@/config/env"
import { createRestCountriesClient } from "@/features/countries/api/rest-countries.client"
import { CountryNotFoundError } from "@/features/countries/model/country.errors"
import { countryCodeSchema } from "@/features/countries/model/country.schemas"

export const getCountry = cache(async (untrustedCode: string) => {
  const code = countryCodeSchema.safeParse(untrustedCode)

  if (!code.success) {
    throw new CountryNotFoundError()
  }

  const client = createRestCountriesClient({
    apiKey: env.restCountriesApiKey,
  })

  return client.getCountryDetail(code.data)
})
