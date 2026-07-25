import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"

import portugueseMessages from "../../../../messages/pt-BR.json"
import { CountryCard } from "@/features/countries/components/country-card"
import { CountryCatalog } from "@/features/countries/components/country-catalog"
import {
  countrySummarySchema,
  type CountrySummary,
} from "@/features/countries/model/country.schemas"
import type { CountryCatalogItem } from "@/features/countries/utils/country-catalog-items"

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    ...props
  }: Omit<React.ComponentProps<"a">, "href"> & {
    href:
      | string
      | {
          pathname: string
          params: { code: string }
        }
  }) => {
    const localizedHref =
      typeof href === "string" ? href : `/pt-BR/paises/${href.params.code}`

    return <a href={localizedHref} {...props} />
  },
}))

const brazil = countrySummarySchema.parse({
  code: "BR",
  alpha3Code: "BRA",
  name: "Brazil",
  capital: "Brasília",
  region: "Americas",
  population: 212_583_750,
  flag: {
    pngUrl: "https://flags.restcountries.com/v5/w640/br.png",
  },
})

const japan = countrySummarySchema.parse({
  code: "JP",
  alpha3Code: "JPN",
  name: "Japan",
  capital: "Tóquio",
  region: "Asia",
  population: 123_970_000,
})

const saoTome = countrySummarySchema.parse({
  code: "ST",
  alpha3Code: "STP",
  name: "São Tomé and Príncipe",
  capital: "São Tomé",
  region: "Africa",
  population: 209_607,
})

function renderInPortuguese(children: React.ReactNode) {
  return render(
    <NextIntlClientProvider
      locale="pt-BR"
      messages={portugueseMessages}
      timeZone="America/Sao_Paulo"
    >
      {children}
    </NextIntlClientProvider>,
  )
}

function toCatalogItem(country: CountrySummary): CountryCatalogItem {
  return {
    ...country,
    localizedName: country.name,
    formattedPopulation:
      country.population === undefined
        ? undefined
        : new Intl.NumberFormat("pt-BR").format(country.population),
  }
}

describe("CountryCard", () => {
  it("renders the summary and a localized profile link", () => {
    renderInPortuguese(
      <CountryCard
        country={{
          ...toCatalogItem(brazil),
          localizedName: "Brasil",
        }}
      />,
    )

    const link = screen.getByRole("link", { name: "Explorar Brasil" })

    expect(link).toHaveAttribute("href", "/pt-BR/paises/br")
    expect(screen.getByRole("heading", { name: "Brasil" })).toBeVisible()
    expect(screen.getByAltText("Bandeira de Brasil")).toBeVisible()
    expect(screen.getByText("Américas")).toBeVisible()
    expect(screen.getByText("212.583.750")).toBeVisible()
  })

  it("renders localized fallbacks for missing optional data", () => {
    const partialCountry = countrySummarySchema.parse({
      code: "AQ",
      alpha3Code: "ATA",
      name: "Antarctica",
    })

    renderInPortuguese(
      <CountryCard
        country={{
          ...toCatalogItem(partialCountry),
          localizedName: "Antártida",
        }}
      />,
    )

    expect(screen.getByText("Bandeira indisponível")).toBeVisible()
    expect(screen.getAllByText("Capital não informada")).toHaveLength(2)
    expect(screen.getByText("Região não informada")).toBeVisible()
    expect(screen.getByText("População não informada")).toBeVisible()
  })
})

describe("CountryCatalog", () => {
  it("combines accent-insensitive search and region filtering", async () => {
    const user = userEvent.setup()
    renderInPortuguese(
      <CountryCatalog
        countries={[
          { ...toCatalogItem(brazil), localizedName: "Brasil" },
          { ...toCatalogItem(japan), localizedName: "Japão" },
          {
            ...toCatalogItem(saoTome),
            localizedName: "São Tomé e Príncipe",
          },
        ]}
      />,
    )

    expect(screen.getByRole("status")).toHaveTextContent("3 países encontrados")

    await user.type(
      screen.getByRole("searchbox", {
        name: "Buscar por país ou capital",
      }),
      "sao tome",
    )

    expect(
      await screen.findByRole("link", {
        name: "Explorar São Tomé e Príncipe",
      }),
    ).toBeVisible()
    expect(screen.getByRole("status")).toHaveTextContent("1 país encontrado")

    await user.click(screen.getByRole("button", { name: "Américas" }))

    expect(
      await screen.findByRole("heading", {
        name: "Nenhuma coordenada corresponde aos filtros.",
      }),
    ).toBeVisible()
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhum país encontrado",
    )

    await user.click(screen.getByRole("button", { name: "Limpar filtros" }))

    expect(screen.getByRole("status")).toHaveTextContent("3 países encontrados")
    expect(screen.getByRole("searchbox")).toHaveValue("")
  })

  it("exposes every region filter as a labelled toggle", () => {
    renderInPortuguese(
      <CountryCatalog
        countries={[{ ...toCatalogItem(brazil), localizedName: "Brasil" }]}
      />,
    )

    const filters = screen.getByLabelText("Filtrar por região")

    expect(within(filters).getAllByRole("button")).toHaveLength(7)
    expect(
      within(filters).getByRole("button", { name: "Todas" }),
    ).toHaveAttribute("aria-pressed", "true")
  })
})
