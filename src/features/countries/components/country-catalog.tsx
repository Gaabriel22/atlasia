"use client"

import {
  SearchIcon,
  SearchXIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react"
import { useDeferredValue, useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CountryCard } from "@/features/countries/components/country-card"
import type { CountryCatalogItem } from "@/features/countries/utils/country-catalog-items"
import {
  filterCountries,
  type CountryRegionFilter,
} from "@/features/countries/utils/country-search"

const REGION_FILTERS = [
  "all",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
] as const satisfies readonly CountryRegionFilter[]

type CountryCatalogProps = {
  countries: CountryCatalogItem[]
}

function isCountryRegionFilter(value: string): value is CountryRegionFilter {
  return REGION_FILTERS.some((region) => region === value)
}

export function CountryCatalog({ countries }: CountryCatalogProps) {
  const t = useTranslations("CountryCatalog")
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState<CountryRegionFilter>("all")
  const deferredQuery = useDeferredValue(query)

  const visibleCountries = useMemo(
    () => filterCountries(countries, deferredQuery, region),
    [countries, deferredQuery, region],
  )
  const isPending = query !== deferredQuery
  const hasActiveFilters = query.length > 0 || region !== "all"

  function clearFilters() {
    setQuery("")
    setRegion("all")
  }

  function updateRegion(values: string[]) {
    const nextRegion = values.at(-1)

    if (nextRegion && isCountryRegionFilter(nextRegion)) {
      setRegion(nextRegion)
    }
  }

  return (
    <section className="flex flex-col gap-8" aria-labelledby="catalog-title">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(28rem,1.2fr)] lg:items-end">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="atlas-kicker">{t("eyebrow")}</p>
          <h2
            id="catalog-title"
            className="font-heading text-4xl leading-tight font-semibold text-balance sm:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="max-w-xl leading-7 text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="atlas-filter-panel flex min-w-0 flex-col gap-5">
          <div>
            <label htmlFor="country-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <InputGroup className="h-12">
              <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="country-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder={t("searchPlaceholder")}
                autoComplete="off"
                className="atlas-search-input h-12"
              />
              {query ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    aria-label={t("clearSearch")}
                    onClick={() => setQuery("")}
                  >
                    <XIcon aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>
              ) : null}
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <p
              id="region-filter-label"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <SlidersHorizontalIcon aria-hidden="true" />
              {t("regionLabel")}
            </p>
            <div className="max-w-full min-w-0 overflow-x-auto pb-1">
              <ToggleGroup
                value={[region]}
                onValueChange={updateRegion}
                aria-labelledby="region-filter-label"
                variant="outline"
                spacing={2}
              >
                {REGION_FILTERS.map((regionFilter) => (
                  <ToggleGroupItem
                    key={regionFilter}
                    value={regionFilter}
                    className="min-h-11 px-3"
                  >
                    {t(`regions.${regionFilter}`)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-8 items-center justify-between gap-4">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-medium text-muted-foreground"
        >
          {isPending
            ? t("updating")
            : t("results", { count: visibleCountries.length })}
        </p>
        {hasActiveFilters && visibleCountries.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            className="min-h-11"
            onClick={clearFilters}
          >
            <XIcon data-icon="inline-start" />
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>

      {visibleCountries.length > 0 ? (
        <div
          className="country-grid"
          aria-busy={isPending}
          data-pending={isPending ? "" : undefined}
        >
          {visibleCountries.map((country) => (
            <CountryCard key={country.code} country={country} />
          ))}
        </div>
      ) : (
        <Empty className="atlas-empty border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {hasActiveFilters ? (
                <SearchXIcon aria-hidden="true" />
              ) : (
                <SearchIcon aria-hidden="true" />
              )}
            </EmptyMedia>
            <EmptyTitle role="heading" aria-level={3}>
              {t("emptyTitle")}
            </EmptyTitle>
            <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
          </EmptyHeader>
          {hasActiveFilters ? (
            <EmptyContent>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-11"
                onClick={clearFilters}
              >
                {t("clearFilters")}
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      )}
    </section>
  )
}
