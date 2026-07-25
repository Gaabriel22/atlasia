import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { siteConfig } from "@/config/site"
import { CountryProfile } from "@/features/countries/components/country-profile"
import { CountryProfileUnavailable } from "@/features/countries/components/country-profile-unavailable"
import { CountryNotFoundError } from "@/features/countries/model/country.errors"
import {
  countryCodeSchema,
  type CountryDetail,
} from "@/features/countries/model/country.schemas"
import { getCountry } from "@/features/countries/queries/get-country"
import { formatCountryName } from "@/features/countries/utils/country-formatters"
import { createCountryStructuredData } from "@/features/countries/utils/country-structured-data"
import { formatOfficialName } from "@/features/countries/utils/country-value-localizers"
import { routing } from "@/i18n/routing"
import { JsonLd } from "@/lib/seo/json-ld"
import {
  getCountryLanguageAlternates,
  getCountryUrl,
} from "@/lib/seo/localized-urls"

type CountryPageProps = {
  params: Promise<{ code: string; locale: string }>
}

async function loadCountry(code: string): Promise<CountryDetail | undefined> {
  const parsedCode = countryCodeSchema.safeParse(code)

  if (!parsedCode.success) {
    return undefined
  }

  try {
    return await getCountry(parsedCode.data)
  } catch (error) {
    if (error instanceof CountryNotFoundError) {
      return undefined
    }

    throw error
  }
}

function notFoundMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { code, locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return notFoundMetadata("Atlasia")
  }

  const t = await getTranslations({ locale, namespace: "CountryProfile" })
  let country: CountryDetail | undefined

  try {
    country = await loadCountry(code)
  } catch {
    return notFoundMetadata(t("unavailableTitle"))
  }

  if (!country) {
    return notFoundMetadata(t("notFoundMetadataTitle"))
  }

  const localizedName = formatCountryName(country.code, country.name, locale)
  const title = t("metadataTitle", { country: localizedName })
  const description = t("metadataDescription", { country: localizedName })
  const canonical = getCountryUrl(locale, country.code)
  const images = country.flag?.pngUrl
    ? [
        {
          url: country.flag.pngUrl,
          width: 640,
          height: 400,
          alt: t("flagAlt", { country: localizedName }),
        },
      ]
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getCountryLanguageAlternates(country.code),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale.replace("-", "_"),
      alternateLocale: routing.locales
        .filter((supportedLocale) => supportedLocale !== locale)
        .map((supportedLocale) => supportedLocale.replace("-", "_")),
      title,
      description,
      url: canonical,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images?.map((image) => image.url),
    },
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code, locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  let country: CountryDetail | undefined

  try {
    country = await loadCountry(code)
  } catch {
    return (
      <div className="atlas-container flex min-h-[60svh] items-center py-10">
        <CountryProfileUnavailable />
      </div>
    )
  }

  if (!country) {
    notFound()
  }

  const [profileT, catalogT] = await Promise.all([
    getTranslations("CountryProfile"),
    getTranslations("CountryCatalog"),
  ])
  const localizedName = formatCountryName(country.code, country.name, locale)
  const structuredData = createCountryStructuredData({
    breadcrumbCatalog: profileT("breadcrumbCatalog"),
    country,
    labels: {
      area: profileT("area"),
      capital: profileT("capital"),
      population: profileT("population"),
    },
    locale,
    localizedName,
    localizedOfficialName: formatOfficialName(country, locale),
    region: country.region ? catalogT(`regions.${country.region}`) : undefined,
  })

  return (
    <>
      <JsonLd data={structuredData} />
      <CountryProfile country={country} locale={locale} />
    </>
  )
}
