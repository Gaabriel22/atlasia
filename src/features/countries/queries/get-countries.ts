import "server-only"

import { cache } from "react"

import { env } from "@/config/env"
import { createRestCountriesClient } from "@/features/countries/api/rest-countries.client"
import { loadAllCountries } from "@/features/countries/queries/load-all-countries"

export const getCountries = cache(async () => {
  const client = createRestCountriesClient({
    apiKey: env.restCountriesApiKey,
  })

  return loadAllCountries(client)
})
