import { describe, expect, it } from "vitest"

import { parseServerEnv } from "@/config/env.schema"

describe("parseServerEnv", () => {
  it("returns a normalized server configuration", () => {
    expect(
      parseServerEnv({
        SITE_URL: "https://atlasia.example/",
      }),
    ).toEqual({
      siteUrl: "https://atlasia.example",
    })
  })

  it.each([
    {
      name: "non-HTTP site URL",
      environment: {
        SITE_URL: "javascript:alert(1)",
      },
    },
    {
      name: "site URL with a path",
      environment: {
        SITE_URL: "https://atlasia.example/catalog",
      },
    },
    {
      name: "public site URL over insecure HTTP",
      environment: {
        SITE_URL: "http://atlasia.example",
      },
    },
    {
      name: "site URL containing credentials",
      environment: {
        SITE_URL: "https://user:password@atlasia.example",
      },
    },
  ])("rejects $name without exposing its value", ({ environment }) => {
    expect(() => parseServerEnv(environment)).toThrow(
      "Invalid server environment configuration",
    )
  })

  it("allows an HTTP origin only for local development", () => {
    expect(
      parseServerEnv({
        SITE_URL: "http://localhost:3000",
      }).siteUrl,
    ).toBe("http://localhost:3000")
  })
})
