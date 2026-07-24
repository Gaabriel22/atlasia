import type {
  CountryCurrency,
  CountryLanguage,
} from "@/features/countries/model/country.schemas"

function getDisplayName(
  code: string,
  fallback: string,
  locale: string,
  type: Intl.DisplayNamesOptions["type"],
) {
  try {
    const displayName = new Intl.DisplayNames([locale], { type }).of(code)
    return displayName && displayName !== code ? displayName : fallback
  } catch {
    return fallback
  }
}

export function formatCountryName(
  code: string,
  fallbackName: string,
  locale: string,
) {
  return getDisplayName(code, fallbackName, locale, "region")
}

export function formatPopulation(population: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(population)
}

export function formatArea(areaSquareKilometers: number, locale: string) {
  const formattedArea = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(areaSquareKilometers)

  return `${formattedArea} km²`
}

export function formatCurrencyName(currency: CountryCurrency, locale: string) {
  return getDisplayName(currency.code, currency.name, locale, "currency")
}

export function formatLanguageName(language: CountryLanguage, locale: string) {
  if (!language.code) {
    return language.name
  }

  return getDisplayName(language.code, language.name, locale, "language")
}

export function formatList(values: string[], locale: string) {
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(values)
}

export function formatCoordinates(
  coordinates: { latitude: number; longitude: number },
  locale: string,
) {
  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  })

  return `${numberFormatter.format(coordinates.latitude)}°, ${numberFormatter.format(coordinates.longitude)}°`
}
