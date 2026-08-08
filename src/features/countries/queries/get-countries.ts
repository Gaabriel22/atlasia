import "server-only"

import { cache } from "react"

import { getCountrySnapshot } from "@/features/countries/data/country-snapshot"

export const getCountries = cache(async () => getCountrySnapshot())
