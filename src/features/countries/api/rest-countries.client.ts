import "server-only"

import {
  normalizeCountryDetail,
  normalizeCountrySummary,
} from "@/features/countries/api/rest-countries.normalizers"
import {
  restCountriesDetailResponseSchema,
  restCountriesSummaryCountrySchema,
  restCountriesSummaryResponseSchema,
} from "@/features/countries/api/rest-countries.schemas"
import {
  CountryAuthenticationError,
  CountryContractError,
  CountryDataError,
  CountryNetworkError,
  CountryNotFoundError,
  CountryRateLimitError,
} from "@/features/countries/model/country.errors"
import type {
  CountryCode,
  CountryDetail,
  CountrySummary,
} from "@/features/countries/model/country.schemas"

const REST_COUNTRIES_BASE_URL = "https://api.restcountries.com/countries/v5"
const COUNTRY_CACHE_SECONDS = 60 * 60 * 24
const CATALOG_PAGE_SIZE = 100

const SUMMARY_RESPONSE_FIELDS = [
  "names",
  "codes",
  "capitals",
  "flag",
  "region",
  "population",
] as const

const DETAIL_RESPONSE_FIELDS = [
  "names",
  "codes",
  "capitals",
  "demonyms",
  "flag",
  "region",
  "subregion",
  "continents",
  "landlocked",
  "borders",
  "area",
  "coordinates",
  "timezones",
  "population",
  "languages",
  "currencies",
  "calling_codes",
  "tlds",
  "cars",
  "postal_code",
  "date.start_of_week",
  "units",
  "classification",
  "memberships",
  "government_type",
  "links",
] as const

type NextFetchOptions = RequestInit & {
  next: {
    revalidate: number
    tags: string[]
  }
}

type RestCountriesClientOptions = {
  apiKey: string
  fetcher?: typeof fetch
}

type ResponseSchema<T> = {
  safeParse: (
    value: unknown,
  ) => { success: true; data: T } | { success: false; error: unknown }
}

export type CountrySummaryPage = {
  countries: CountrySummary[]
  more: boolean
  nextOffset?: number
  total: number
}

function mapHttpError(status: number, notFoundIsExpected: boolean) {
  if (status === 401) {
    return new CountryAuthenticationError()
  }

  if (status === 403 || status === 429) {
    return new CountryRateLimitError()
  }

  if (status === 404 && notFoundIsExpected) {
    return new CountryNotFoundError()
  }

  return new CountryNetworkError()
}

async function parseResponse<T>(
  response: Response,
  schema: ResponseSchema<T>,
): Promise<T> {
  let payload: unknown

  try {
    payload = await response.json()
  } catch (error) {
    throw new CountryContractError(error)
  }

  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new CountryContractError(result.error)
  }

  return result.data
}

export function createRestCountriesClient({
  apiKey,
  fetcher = fetch,
}: RestCountriesClientOptions) {
  async function request<T>(
    url: URL,
    schema: ResponseSchema<T>,
    tags: string[],
    notFoundIsExpected = false,
  ) {
    let response: Response

    try {
      const options: NextFetchOptions = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        next: {
          revalidate: COUNTRY_CACHE_SECONDS,
          tags,
        },
      }

      response = await fetcher(url, options)
    } catch (error) {
      if (error instanceof CountryDataError) {
        throw error
      }

      throw new CountryNetworkError(error)
    }

    if (!response.ok) {
      throw mapHttpError(response.status, notFoundIsExpected)
    }

    return parseResponse(response, schema)
  }

  return {
    async getCountrySummaryPage(offset = 0): Promise<CountrySummaryPage> {
      const url = new URL(REST_COUNTRIES_BASE_URL)
      url.searchParams.set("limit", String(CATALOG_PAGE_SIZE))
      url.searchParams.set("offset", String(offset))
      url.searchParams.set("response_fields", SUMMARY_RESPONSE_FIELDS.join(","))

      const response = await request(url, restCountriesSummaryResponseSchema, [
        "countries",
      ])
      const { meta, objects } = response.data
      const currentOffset = meta.offset ?? offset
      const itemCount = meta.count ?? objects.length

      return {
        countries: objects.flatMap((country) => {
          const result = restCountriesSummaryCountrySchema.safeParse(country)

          return result.success ? [normalizeCountrySummary(result.data)] : []
        }),
        more: meta.more ?? currentOffset + itemCount < meta.total,
        nextOffset:
          (meta.more ?? currentOffset + itemCount < meta.total)
            ? currentOffset + itemCount
            : undefined,
        total: meta.total,
      }
    },

    async getCountryDetail(code: CountryCode): Promise<CountryDetail> {
      const url = new URL(
        `${REST_COUNTRIES_BASE_URL}/codes.alpha_2/${encodeURIComponent(code)}`,
      )
      url.searchParams.set("response_fields", DETAIL_RESPONSE_FIELDS.join(","))

      const response = await request(
        url,
        restCountriesDetailResponseSchema,
        ["countries", `country-${code.toLowerCase()}`],
        true,
      )
      const country = response.data.objects[0]

      if (!country) {
        throw new CountryNotFoundError()
      }

      return normalizeCountryDetail(country)
    },
  }
}

export type RestCountriesClient = ReturnType<typeof createRestCountriesClient>
