import { describe, expect, it } from "vitest"

import { parseServerEnv } from "@/config/env.schema"

describe("parseServerEnv", () => {
  it("returns a normalized server configuration", () => {
    expect(
      parseServerEnv({
        SITE_URL: "https://atlasia.example/",
        REST_COUNTRIES_API_KEY: " secret-key ",
      }),
    ).toEqual({
      siteUrl: "https://atlasia.example",
      restCountriesApiKey: "secret-key",
    })
  })

  it.each([
    {
      name: "missing API key",
      environment: { SITE_URL: "https://atlasia.example" },
    },
    {
      name: "non-HTTP site URL",
      environment: {
        SITE_URL: "javascript:alert(1)",
        REST_COUNTRIES_API_KEY: "secret-key",
      },
    },
    {
      name: "site URL with a path",
      environment: {
        SITE_URL: "https://atlasia.example/catalog",
        REST_COUNTRIES_API_KEY: "secret-key",
      },
    },
  ])("rejects $name without exposing its value", ({ environment }) => {
    expect(() => parseServerEnv(environment)).toThrow(
      "Invalid server environment configuration",
    )
  })
})
