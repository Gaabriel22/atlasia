import { describe, expect, it } from "vitest"

import {
  countryCodeSchema,
  countryDetailSchema,
} from "@/features/countries/model/country.schemas"

describe("country domain schemas", () => {
  it.each(["../CA", "CA/../../admin", "CA%2Fadmin", "<script>", "C1", "CAN"])(
    "rejects an unsafe country route parameter: %s",
    (value) => {
      expect(countryCodeSchema.safeParse(value).success).toBe(false)
    },
  )

  it("rejects non-HTTPS external links at the domain boundary", () => {
    const result = countryDetailSchema.safeParse({
      code: "CA",
      alpha3Code: "CAN",
      name: "Canada",
      nativeNames: [],
      demonyms: [],
      capitals: [],
      continents: [],
      borderCodes: [],
      timeZones: [],
      languages: [],
      currencies: [],
      callingCodes: [],
      topLevelDomains: [],
      vehicleSigns: [],
      memberships: [],
      links: {
        officialWebsite: "javascript:alert(1)",
      },
      codes: {},
    })

    expect(result.success).toBe(false)
  })
})
