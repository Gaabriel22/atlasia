import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { env } from "@/config/env"
import { CountryProfile } from "@/features/countries/components/country-profile"
import { CountryProfileUnavailable } from "@/features/countries/components/country-profile-unavailable"
import { CountryNotFoundError } from "@/features/countries/model/country.errors"
import {
  countryCodeSchema,
  type CountryDetail,
} from "@/features/countries/model/country.schemas"
import { getCountry } from "@/features/countries/queries/get-country"
import { formatCountryName } from "@/features/countries/utils/country-formatters"
import { getPathname } from "@/i18n/navigation"
import { type AppLocale, routing } from "@/i18n/routing"

type CountryPageProps = {
  params: Promise<{ code: string; locale: string }>
}

function getCountryPath(locale: AppLocale, code: string) {
  return getPathname({
    locale,
    href: {
      pathname: "/countries/[code]",
      params: { code: code.toLocaleLowerCase() },
    },
  })
}

function getAbsoluteCountryUrl(locale: AppLocale, code: string) {
  return new URL(getCountryPath(locale, code), env.siteUrl).toString()
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
  const canonical = getAbsoluteCountryUrl(locale, country.code)
  const languageAlternates = Object.fromEntries(
    routing.locales.map((supportedLocale) => [
      supportedLocale,
      getAbsoluteCountryUrl(supportedLocale, country.code),
    ]),
  )
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
      languages: {
        ...languageAlternates,
        "x-default": getAbsoluteCountryUrl(routing.defaultLocale, country.code),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Atlasia",
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

  return <CountryProfile country={country} locale={locale} />
}
