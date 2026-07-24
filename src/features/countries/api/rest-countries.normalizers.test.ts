import { describe, expect, it } from "vitest"

import detailFixture from "@/features/countries/api/__fixtures__/rest-countries-detail.json"
import summaryFixture from "@/features/countries/api/__fixtures__/rest-countries-summary.json"
import {
  normalizeCountryDetail,
  normalizeCountrySummary,
} from "@/features/countries/api/rest-countries.normalizers"
import {
  restCountriesDetailResponseSchema,
  restCountriesSummaryCountrySchema,
  restCountriesSummaryResponseSchema,
} from "@/features/countries/api/rest-countries.schemas"

describe("REST Countries normalizers", () => {
  it("maps the projected catalog DTO to a stable summary", () => {
    const response = restCountriesSummaryResponseSchema.parse(summaryFixture)
    const country = restCountriesSummaryCountrySchema.parse(
      response.data.objects[0],
    )

    expect(normalizeCountrySummary(country)).toEqual({
      code: "CA",
      alpha3Code: "CAN",
      name: "Canada",
      capital: "Ottawa",
      region: "Americas",
      population: 41417056,
      flag: {
        pngUrl: "https://flags.restcountries.com/v5/w640/ca.png",
        svgUrl: "https://flags.restcountries.com/v5/svg/ca.svg",
        description: "A red maple leaf centered between two red bands.",
      },
    })
  })

  it("maps all selected detail groups without provider field names", () => {
    const response = restCountriesDetailResponseSchema.parse(detailFixture)
    const country = normalizeCountryDetail(response.data.objects[0])

    expect(country).toMatchObject({
      code: "CA",
      officialName: "Canada",
      subregion: "North America",
      landlocked: false,
      areaSquareKilometers: 9984670,
      callingCodes: ["+1"],
      drivingSide: "right",
      postalCodeFormat: "@#@ #@#",
      memberships: ["commonwealth", "g20", "g7", "nato", "oecd", "un"],
      codes: {
        numeric: "124",
        olympic: "CAN",
        football: "CAN",
        fips: "CA",
        gec: "CA",
      },
    })
    expect(country.nativeNames).toHaveLength(2)
    expect(country.capitals[0]).toEqual({
      name: "Ottawa",
      coordinates: { latitude: 45.42, longitude: -75.7 },
      roles: ["primary"],
    })
    expect(country.languages).toEqual([
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "français" },
    ])
  })

  it("keeps a valid model when optional provider fields are absent", () => {
    const country = restCountriesSummaryCountrySchema.parse({
      names: { common: "Exampleland" },
      codes: { alpha_2: "EX", alpha_3: "EXP" },
      capitals: [],
    })

    expect(normalizeCountrySummary(country)).toEqual({
      code: "EX",
      alpha3Code: "EXP",
      name: "Exampleland",
    })
  })

  it("selects the explicitly primary capital", () => {
    const country = restCountriesSummaryCountrySchema.parse({
      names: { common: "Exampleland" },
      codes: { alpha_2: "EX", alpha_3: "EXP" },
      capitals: [
        { name: "Administrative City" },
        { name: "Primary City", attributes: { primary: true } },
      ],
    })

    expect(normalizeCountrySummary(country).capital).toBe("Primary City")
  })
})
