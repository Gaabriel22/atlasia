import { describe, expect, it } from "vitest"

import {
  formatDependencyType,
  formatGeographicArea,
  formatGovernmentType,
  formatIsoStatus,
  formatOfficialName,
} from "@/features/countries/utils/country-value-localizers"

describe("country provider value localizers", () => {
  it("localizes controlled provider values in Brazilian Portuguese", () => {
    expect(
      formatGovernmentType("Unitary parliamentary republic", "pt-BR"),
    ).toBe("República parlamentarista unitária")
    expect(formatGeographicArea("Southeast Europe", "pt-BR")).toBe(
      "Sudeste Europeu",
    )
    expect(formatGeographicArea("Western Africa", "pt-BR")).toBe(
      "África Ocidental",
    )
    expect(
      formatGovernmentType("Unitary semi-presidential republic", "pt-BR"),
    ).toBe("República semipresidencialista unitária")
    expect(formatDependencyType("autonomous_region", "pt-BR")).toBe(
      "Região autônoma",
    )
    expect(formatIsoStatus("official", "pt-BR")).toBe("Oficial")
  })

  it("preserves provider values on the English route", () => {
    expect(formatGovernmentType("Unitary parliamentary republic", "en")).toBe(
      "Unitary parliamentary republic",
    )
    expect(formatGeographicArea("Southeast Europe", "en")).toBe(
      "Southeast Europe",
    )
  })

  it("omits unknown controlled values from non-English routes", () => {
    expect(formatGovernmentType("A new provider category", "pt-BR")).toBe(
      undefined,
    )
  })

  it("prefers the local official name outside the English route", () => {
    const countryNames = {
      officialName: "Republic of Albania",
      nativeNames: [
        {
          languageCode: "sqi",
          commonName: "Shqipëria",
          officialName: "Republika e Shqipërisë",
        },
      ],
    }

    expect(formatOfficialName(countryNames, "pt-BR")).toBe(
      "Republika e Shqipërisë",
    )
    expect(formatOfficialName(countryNames, "en")).toBe("Republic of Albania")
  })
})
