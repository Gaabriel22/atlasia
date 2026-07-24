import type { RestCountriesClient } from "@/features/countries/api/rest-countries.client"
import { CountryContractError } from "@/features/countries/model/country.errors"
import { countrySummarySchema } from "@/features/countries/model/country.schemas"
import { loadAllCountries } from "@/features/countries/queries/load-all-countries"
import { describe, expect, it, vi } from "vitest"

const canada = countrySummarySchema.parse({
  code: "CA",
  alpha3Code: "CAN",
  name: "Canada",
})

const brazil = countrySummarySchema.parse({
  code: "BR",
  alpha3Code: "BRA",
  name: "Brazil",
})

describe("loadAllCountries", () => {
  it("loads every provider page in order", async () => {
    const getCountrySummaryPage = vi
      .fn<RestCountriesClient["getCountrySummaryPage"]>()
      .mockResolvedValueOnce({
        countries: [canada],
        more: true,
        nextOffset: 100,
        total: 2,
      })
      .mockResolvedValueOnce({
        countries: [brazil],
        more: false,
        total: 2,
      })

    await expect(loadAllCountries({ getCountrySummaryPage })).resolves.toEqual([
      canada,
      brazil,
    ])
    expect(getCountrySummaryPage).toHaveBeenNthCalledWith(1, 0)
    expect(getCountrySummaryPage).toHaveBeenNthCalledWith(2, 100)
  })

  it("rejects pagination that makes no progress", async () => {
    const getCountrySummaryPage = vi
      .fn<RestCountriesClient["getCountrySummaryPage"]>()
      .mockResolvedValue({
        countries: [canada],
        more: true,
        nextOffset: 0,
        total: 2,
      })

    await expect(
      loadAllCountries({ getCountrySummaryPage }),
    ).rejects.toBeInstanceOf(CountryContractError)
  })
})
