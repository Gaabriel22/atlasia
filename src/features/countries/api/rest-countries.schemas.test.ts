import { describe, expect, it } from "vitest"

import detailFixture from "@/features/countries/api/__fixtures__/rest-countries-detail.json"
import summaryFixture from "@/features/countries/api/__fixtures__/rest-countries-summary.json"
import {
  restCountriesDetailResponseSchema,
  restCountriesSummaryResponseSchema,
} from "@/features/countries/api/rest-countries.schemas"

describe("REST Countries v5 schemas", () => {
  it("accepts a projected catalog response", () => {
    const result = restCountriesSummaryResponseSchema.safeParse(summaryFixture)

    expect(result.success).toBe(true)
  })

  it("accepts a projected country detail response", () => {
    const result = restCountriesDetailResponseSchema.safeParse(detailFixture)

    expect(result.success).toBe(true)
  })

  it("rejects a response without a stable country identity", () => {
    const result = restCountriesSummaryResponseSchema.safeParse({
      data: {
        objects: [{ names: { common: "Canada" }, codes: {} }],
        meta: { total: 1 },
      },
    })

    expect(result.success).toBe(false)
  })

  it("strips additive provider fields outside the projection", () => {
    const result = restCountriesSummaryResponseSchema.parse({
      ...summaryFixture,
      data: {
        ...summaryFixture.data,
        objects: [
          {
            ...summaryFixture.data.objects[0],
            future_provider_field: "ignored",
          },
        ],
      },
    })

    expect(result.data.objects[0]).not.toHaveProperty("future_provider_field")
  })
})
