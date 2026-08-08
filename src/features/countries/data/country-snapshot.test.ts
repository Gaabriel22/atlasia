import { describe, expect, it } from "vitest"

import {
  getCountryFromSnapshot,
  getCountrySnapshot,
} from "@/features/countries/data/country-snapshot"

describe("country snapshot", () => {
  it("contains a complete catalog with unique canonical codes", () => {
    const countries = getCountrySnapshot()
    const codes = countries.map((country) => country.code)

    expect(countries.length).toBeGreaterThanOrEqual(200)
    expect(new Set(codes).size).toBe(countries.length)
    expect(codes).toContain("BR")
    expect(codes).toContain("CA")
  })

  it("serves a detailed profile without external data", () => {
    expect(getCountryFromSnapshot("br")).toMatchObject({
      code: "BR",
      alpha3Code: "BRA",
      name: "Brazil",
      capital: "Brasília",
      currencies: [{ code: "BRL" }],
    })
  })

  it("rejects invalid and unknown codes", () => {
    expect(getCountryFromSnapshot("invalid")).toBeUndefined()
    expect(getCountryFromSnapshot("ZZ")).toBeUndefined()
  })
})
