import type { Graph, ListItem, PropertyValue } from "schema-dts"

import { siteConfig } from "@/config/site"
import type {
  CountryDetail,
  CountrySummary,
} from "@/features/countries/model/country.schemas"
import { getCatalogUrl, getCountryUrl } from "@/lib/seo/localized-urls"
import type { AppLocale } from "@/i18n/routing"

type CatalogStructuredDataInput = {
  countries: Array<Pick<CountrySummary, "code"> & { localizedName: string }>
  description: string
  locale: AppLocale
  name: string
}

type CountryStructuredDataInput = {
  breadcrumbCatalog: string
  country: CountryDetail
  labels: {
    area: string
    capital: string
    population: string
  }
  locale: AppLocale
  localizedName: string
  localizedOfficialName?: string
  region?: string
}

function propertyValue(
  name: string,
  value: string | number | undefined,
): PropertyValue | undefined {
  return value === undefined
    ? undefined
    : {
        "@type": "PropertyValue",
        name,
        value,
      }
}

export function createCatalogStructuredData({
  countries,
  description,
  locale,
  name,
}: CatalogStructuredDataInput): Graph {
  const canonical = getCatalogUrl(locale)
  const websiteId = `${siteConfig.url}/#website`
  const itemListElements: ListItem[] = countries.map((country, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: country.localizedName,
    url: getCountryUrl(locale, country.code),
  }))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${siteConfig.url}/`,
        name: siteConfig.name,
        inLanguage: ["pt-BR", "en"],
      },
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#collection`,
        url: canonical,
        name,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: countries.length,
          itemListElement: itemListElements,
        },
      },
    ],
  }
}

export function createCountryStructuredData({
  breadcrumbCatalog,
  country,
  labels,
  locale,
  localizedName,
  localizedOfficialName,
  region,
}: CountryStructuredDataInput): Graph {
  const canonical = getCountryUrl(locale, country.code)
  const catalogUrl = getCatalogUrl(locale)
  const externalReferences = Object.values(country.links ?? {}).filter(
    (url): url is string => Boolean(url),
  )
  const visibleProperties = [
    propertyValue(labels.capital, country.capital),
    propertyValue(labels.population, country.population),
    propertyValue(labels.area, country.areaSquareKilometers),
  ].filter((value): value is PropertyValue => Boolean(value))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: breadcrumbCatalog,
            item: catalogUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: localizedName,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Country",
        "@id": `${canonical}#country`,
        url: canonical,
        name: localizedName,
        alternateName: localizedOfficialName,
        image: country.flag?.pngUrl,
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "ISO 3166-1 alpha-2",
            value: country.code,
          },
          {
            "@type": "PropertyValue",
            propertyID: "ISO 3166-1 alpha-3",
            value: country.alpha3Code,
          },
        ],
        mainEntityOfPage: canonical,
        sameAs: externalReferences.length > 0 ? externalReferences : undefined,
        containedInPlace: region
          ? {
              "@type": "Place",
              name: region,
            }
          : undefined,
        geo: country.coordinates
          ? {
              "@type": "GeoCoordinates",
              latitude: country.coordinates.latitude,
              longitude: country.coordinates.longitude,
            }
          : undefined,
        additionalProperty:
          visibleProperties.length > 0 ? visibleProperties : undefined,
      },
    ],
  }
}
