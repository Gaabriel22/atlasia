import { describe, expect, it } from "vitest"

import {
  filterCountries,
  normalizeCountrySearchText,
  type CountrySearchRecord,
} from "@/features/countries/utils/country-search"

const countries = [
  {
    localizedName: "Brasil",
    capital: "Brasília",
    region: "Americas",
  },
  {
    localizedName: "São Tomé e Príncipe",
    capital: "São Tomé",
    region: "Africa",
  },
  {
    localizedName: "Japão",
    capital: "Tóquio",
    region: "Asia",
  },
] satisfies CountrySearchRecord[]

describe("country search", () => {
  it("normalizes case and diacritics", () => {
    expect(normalizeCountrySearchText("  SÃO Tomé  ")).toBe("sao tome")
  })

  it("matches localized country names without case or accent sensitivity", () => {
    expect(filterCountries(countries, "SAO TOME", "all")).toEqual([
      countries[1],
    ])
  })

  it("matches capital names without accent sensitivity", () => {
    expect(filterCountries(countries, "brasilia", "all")).toEqual([
      countries[0],
    ])
  })

  it("combines the query and region filters", () => {
    expect(filterCountries(countries, "a", "Asia")).toEqual([countries[2]])
    expect(filterCountries(countries, "brasil", "Africa")).toEqual([])
  })
})
