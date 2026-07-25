import "server-only"

import { getAbsoluteUrl } from "@/config/site"
import { getPathname } from "@/i18n/navigation"
import { type AppLocale, routing } from "@/i18n/routing"

export function getCatalogPath(locale: AppLocale) {
  return getPathname({ locale, href: "/" })
}

export function getCountryPath(locale: AppLocale, code: string) {
  return getPathname({
    locale,
    href: {
      pathname: "/countries/[code]",
      params: { code: code.toLocaleLowerCase() },
    },
  })
}

export function getCatalogUrl(locale: AppLocale) {
  return getAbsoluteUrl(getCatalogPath(locale))
}

export function getCountryUrl(locale: AppLocale, code: string) {
  return getAbsoluteUrl(getCountryPath(locale, code))
}

export function getCatalogLanguageAlternates() {
  return getLanguageAlternates((locale) => getCatalogUrl(locale))
}

export function getCountryLanguageAlternates(code: string) {
  return getLanguageAlternates((locale) => getCountryUrl(locale, code))
}

function getLanguageAlternates(getLocalizedUrl: (locale: AppLocale) => string) {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, getLocalizedUrl(locale)]),
    ),
    "x-default": getLocalizedUrl(routing.defaultLocale),
  }
}
