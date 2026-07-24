import detailFixture from "@/features/countries/api/__fixtures__/rest-countries-detail.json"
import summaryFixture from "@/features/countries/api/__fixtures__/rest-countries-summary.json"
import { createRestCountriesClient } from "@/features/countries/api/rest-countries.client"
import {
  CountryAuthenticationError,
  CountryContractError,
  CountryNetworkError,
  CountryNotFoundError,
  CountryRateLimitError,
} from "@/features/countries/model/country.errors"
import { countryCodeSchema } from "@/features/countries/model/country.schemas"
import { describe, expect, it, vi } from "vitest"

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  })
}

function createClientReturning(response: Response) {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response)
  const client = createRestCountriesClient({
    apiKey: "test-api-key",
    fetcher,
  })

  return { client, fetcher }
}

describe("REST Countries client", () => {
  it("fetches and validates a projected catalog page", async () => {
    const { client, fetcher } = createClientReturning(
      jsonResponse(summaryFixture),
    )

    const result = await client.getCountrySummaryPage(0)

    expect(result).toMatchObject({
      countries: [
        {
          code: "CA",
          name: "Canada",
          capital: "Ottawa",
        },
      ],
      more: false,
      total: 1,
    })

    const [requestUrl, requestOptions] = fetcher.mock.calls[0]
    const url = new URL(String(requestUrl))
    const headers = new Headers(requestOptions?.headers)
    const nextOptions = (
      requestOptions as RequestInit & {
        next: { revalidate: number; tags: string[] }
      }
    ).next

    expect(url.origin + url.pathname).toBe(
      "https://api.restcountries.com/countries/v5",
    )
    expect(url.searchParams.get("limit")).toBe("100")
    expect(url.searchParams.get("response_fields")).toContain("names")
    expect(url.toString()).not.toContain("test-api-key")
    expect(headers.get("Authorization")).toBe("Bearer test-api-key")
    expect(nextOptions).toEqual({
      revalidate: 86_400,
      tags: ["countries"],
    })
  })

  it("excludes provider entities without canonical ISO codes", async () => {
    const response = structuredClone(summaryFixture)
    response.data.objects.unshift({
      ...response.data.objects[0],
      names: { common: "Abkhazia" },
      codes: { alpha_2: "", alpha_3: "" },
    })
    response.data.meta.total = 2
    response.data.meta.count = 2
    const { client } = createClientReturning(jsonResponse(response))

    const result = await client.getCountrySummaryPage()

    expect(result.countries).toHaveLength(1)
    expect(result.countries[0].code).toBe("CA")
  })

  it("fetches and validates a detailed country by ISO alpha-2 code", async () => {
    const { client, fetcher } = createClientReturning(
      jsonResponse(detailFixture),
    )
    const code = countryCodeSchema.parse("ca")

    const result = await client.getCountryDetail(code)

    expect(result).toMatchObject({
      code: "CA",
      name: "Canada",
      officialName: "Canada",
      currencies: [{ code: "CAD" }],
    })

    const [requestUrl, requestOptions] = fetcher.mock.calls[0]
    const url = new URL(String(requestUrl))
    const nextOptions = (
      requestOptions as RequestInit & {
        next: { revalidate: number; tags: string[] }
      }
    ).next

    expect(url.pathname).toBe("/countries/v5/codes.alpha_2/CA")
    expect(url.searchParams.get("response_fields")).toContain("languages")
    expect(nextOptions.tags).toEqual(["countries", "country-ca"])
  })

  it.each([
    [401, CountryAuthenticationError],
    [403, CountryRateLimitError],
    [429, CountryRateLimitError],
  ])("maps HTTP %i to a safe domain error", async (status, ErrorType) => {
    const { client } = createClientReturning(jsonResponse({}, status))

    await expect(client.getCountrySummaryPage()).rejects.toBeInstanceOf(
      ErrorType,
    )
  })

  it("maps a missing country to not found", async () => {
    const { client } = createClientReturning(jsonResponse({}, 404))

    await expect(
      client.getCountryDetail(countryCodeSchema.parse("ZZ")),
    ).rejects.toBeInstanceOf(CountryNotFoundError)
  })

  it("maps transport failures without exposing their message", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("secret upstream diagnostic"))
    const client = createRestCountriesClient({
      apiKey: "test-api-key",
      fetcher,
    })

    await expect(client.getCountrySummaryPage()).rejects.toMatchObject({
      message: "Country data provider is unavailable",
      code: "network",
    })
    await expect(client.getCountrySummaryPage()).rejects.toBeInstanceOf(
      CountryNetworkError,
    )
  })

  it.each([
    new Response("not-json", { status: 200 }),
    jsonResponse({ data: { objects: [{}], meta: { total: 1 } } }),
  ])("maps invalid provider data to a contract error", async (response) => {
    const { client } = createClientReturning(response)

    await expect(client.getCountrySummaryPage()).rejects.toBeInstanceOf(
      CountryContractError,
    )
  })

  it("treats an empty successful detail response as not found", async () => {
    const { client } = createClientReturning(
      jsonResponse({
        data: {
          objects: [],
          meta: { total: 0 },
        },
      }),
    )

    await expect(
      client.getCountryDetail(countryCodeSchema.parse("ZZ")),
    ).rejects.toBeInstanceOf(CountryNotFoundError)
  })
})
