import { describe, expect, it } from "vitest"

import {
  formatArea,
  formatCoordinates,
  formatCountryName,
  formatCurrencyName,
  formatLanguageName,
  formatList,
  formatPopulation,
} from "@/features/countries/utils/country-formatters"

describe("country formatters", () => {
  it.each([
    {
      locale: "pt-BR",
      countryName: "Canadá",
      population: "41.417.056",
      area: "9.984.670 km²",
      currency: "Dólar canadense",
      language: "francês",
      list: "inglês e francês",
      coordinates: "60°, -95°",
    },
    {
      locale: "en",
      countryName: "Canada",
      population: "41,417,056",
      area: "9,984,670 km²",
      currency: "Canadian Dollar",
      language: "French",
      list: "English and French",
      coordinates: "60°, -95°",
    },
  ])("formats country values for $locale", (expected) => {
    const language = { code: "fr", name: "French", nativeName: "français" }
    const currency = { code: "CAD", name: "Canadian dollar", symbol: "$" }

    expect(formatCountryName("CA", "Canada", expected.locale)).toBe(
      expected.countryName,
    )
    expect(formatPopulation(41417056, expected.locale)).toBe(
      expected.population,
    )
    expect(formatArea(9984670, expected.locale)).toBe(expected.area)
    expect(formatCurrencyName(currency, expected.locale)).toBe(
      expected.currency,
    )
    expect(formatLanguageName(language, expected.locale)).toBe(
      expected.language,
    )
    expect(
      formatList(
        [
          formatLanguageName({ code: "en", name: "English" }, expected.locale),
          formatLanguageName(language, expected.locale),
        ],
        expected.locale,
      ),
    ).toBe(expected.list)
    expect(
      formatCoordinates({ latitude: 60, longitude: -95 }, expected.locale),
    ).toBe(expected.coordinates)
  })

  it("uses provider names when Intl cannot resolve a code", () => {
    expect(formatCountryName("XX", "Exampleland", "en")).toBe("Exampleland")
    expect(
      formatLanguageName({ code: "invalid", name: "Example language" }, "en"),
    ).toBe("Example language")
  })
})
