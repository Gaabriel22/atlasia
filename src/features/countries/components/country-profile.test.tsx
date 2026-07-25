import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import detailFixture from "@/features/countries/api/__fixtures__/rest-countries-detail.json"
import { normalizeCountryDetail } from "@/features/countries/api/rest-countries.normalizers"
import { restCountriesDetailResponseSchema } from "@/features/countries/api/rest-countries.schemas"
import { CountryProfile } from "@/features/countries/components/country-profile"
import { countryDetailSchema } from "@/features/countries/model/country.schemas"

const translations = {
  breadcrumbCatalog: "Countries",
  backToCatalog: "Back to catalog",
  eyebrow: "Geographic dossier · {code}",
  officialName: "Official name",
  flagAlt: "Flag of {country}",
  flagCaption: "Flag description",
  capital: "Capital",
  population: "Population",
  area: "Area",
  unknownRegion: "Unknown region",
  unavailable: "Not provided",
  yes: "Yes",
  no: "No",
  densityValue: "{value} people/km²",
  externalLink: "Open {label} for {country} in a new tab",
  "sections.identity.title": "Identity",
  "sections.identity.description": "Identity description",
  "sections.geography.title": "Geography",
  "sections.geography.description": "Geography description",
  "sections.population.title": "Population",
  "sections.population.description": "Population description",
  "sections.languages.title": "Languages",
  "sections.languages.description": "Languages description",
  "sections.currencies.title": "Currencies",
  "sections.currencies.description": "Currencies description",
  "sections.codes.title": "Codes",
  "sections.codes.description": "Codes description",
  "sections.connectivity.title": "Connectivity",
  "sections.connectivity.description": "Connectivity description",
} as const

function interpolate(
  message: string,
  values?: Record<string, string | number>,
) {
  return Object.entries(values ?? {}).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    message,
  )
}

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async (namespace: string) => {
    return (key: string, values?: Record<string, string | number>) => {
      if (namespace === "CountryCatalog" && key === "regions.Americas") {
        return "Americas"
      }

      const message =
        translations[key as keyof typeof translations] ??
        key.split(".").at(-1) ??
        key

      return interpolate(message, values)
    }
  }),
}))

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    ...props
  }: Omit<React.ComponentProps<"a">, "href"> & {
    href: string
  }) => <a href={href} {...props} />,
}))

function completeCountry() {
  const response = restCountriesDetailResponseSchema.parse(detailFixture)
  return normalizeCountryDetail(response.data.objects[0])
}

describe("CountryProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("presents a complete country as localized, semantic sections", async () => {
    render(await CountryProfile({ country: completeCountry(), locale: "en" }))

    expect(
      screen.getByRole("heading", { name: "Canada", level: 1 }),
    ).toBeVisible()
    expect(screen.getByRole("img", { name: "Flag of Canada" })).toBeVisible()
    expect(screen.getByText("Ottawa")).toBeVisible()
    expect(screen.getAllByText("41,417,056")).toHaveLength(2)

    for (const heading of [
      "Identity",
      "Geography",
      "Population",
      "Languages",
      "Currencies",
      "Codes",
      "Connectivity",
    ]) {
      expect(
        screen.getByRole("heading", { name: heading, level: 2 }),
      ).toBeVisible()
    }

    const connectivity = screen
      .getByRole("heading", { name: "Connectivity" })
      .closest("[data-slot='card']")

    expect(connectivity).not.toBeNull()
    expect(
      within(connectivity as HTMLElement).getByRole("link", {
        name: /Open officialWebsite for Canada in a new tab/,
      }),
    ).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("omits absent fields and keeps every profile section readable", async () => {
    const source = completeCountry()
    const partialCountry = countryDetailSchema.parse({
      ...source,
      officialName: undefined,
      nativeNames: [],
      demonyms: [],
      capitals: [],
      capital: undefined,
      region: undefined,
      subregion: undefined,
      continents: [],
      borderCodes: [],
      population: undefined,
      areaSquareKilometers: undefined,
      coordinates: undefined,
      flag: undefined,
      languages: [],
      currencies: [],
      callingCodes: [],
      topLevelDomains: [],
      timeZones: [],
      vehicleSigns: [],
      classification: undefined,
      memberships: [],
      governmentType: undefined,
      links: undefined,
      codes: {},
    })

    render(await CountryProfile({ country: partialCountry, locale: "en" }))

    expect(
      screen.getByRole("heading", { name: "Canada", level: 1 }),
    ).toBeVisible()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(screen.getAllByText("Not provided").length).toBeGreaterThanOrEqual(6)
    expect(document.body).not.toHaveTextContent("undefined")
    expect(document.body).not.toHaveTextContent("[object Object]")
    expect(document.body).not.toHaveTextContent("officialName")
  })

  it("does not leak English provider prose into the Portuguese profile", async () => {
    const source = completeCountry()
    const albania = countryDetailSchema.parse({
      ...source,
      code: "AL",
      alpha3Code: "ALB",
      name: "Albania",
      officialName: "Republic of Albania",
      nativeNames: [
        {
          languageCode: "sqi",
          commonName: "Shqipëria",
          officialName: "Republika e Shqipërisë",
        },
      ],
      demonyms: [
        {
          languageCode: "eng",
          feminine: "Albanian",
          masculine: "Albanian",
        },
      ],
      governmentType: "Unitary parliamentary republic",
      subregion: "Southeast Europe",
      continents: ["Europe"],
      classification: {
        ...source.classification,
        isoStatus: "official",
      },
      flag: {
        ...source.flag,
        description:
          "The flag of Albania features a double-headed black eagle.",
      },
    })

    render(await CountryProfile({ country: albania, locale: "pt-BR" }))

    expect(screen.getByText("República parlamentarista unitária")).toBeVisible()
    expect(screen.getAllByText("Sudeste Europeu").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Republika e Shqipërisë")).toHaveLength(2)
    expect(screen.getByText("Oficial")).toBeVisible()
    expect(document.body).not.toHaveTextContent(
      "Unitary parliamentary republic",
    )
    expect(document.body).not.toHaveTextContent("Republic of Albania")
    expect(document.body).not.toHaveTextContent("The flag of Albania")
  })
})
