import type { RestCountriesClient } from "@/features/countries/api/rest-countries.client"
import { CountryContractError } from "@/features/countries/model/country.errors"
import type { CountrySummary } from "@/features/countries/model/country.schemas"

const MAX_CATALOG_PAGES = 10

export async function loadAllCountries(
  client: Pick<RestCountriesClient, "getCountrySummaryPage">,
): Promise<CountrySummary[]> {
  const countries: CountrySummary[] = []
  let offset = 0

  for (let page = 0; page < MAX_CATALOG_PAGES; page += 1) {
    const result = await client.getCountrySummaryPage(offset)
    countries.push(...result.countries)

    if (!result.more) {
      return countries
    }

    if (result.nextOffset === undefined || result.nextOffset <= offset) {
      throw new CountryContractError()
    }

    offset = result.nextOffset
  }

  throw new CountryContractError()
}
