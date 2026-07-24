import type {
  RestCountriesDetailCountry,
  RestCountriesSummaryCountry,
} from "@/features/countries/api/rest-countries.schemas"
import {
  countryDetailSchema,
  countryRegionSchema,
  countrySummarySchema,
  type CountryDetail,
  type CountrySummary,
} from "@/features/countries/model/country.schemas"

const capitalRoleMappings = [
  ["primary", "primary"],
  ["administrative", "administrative"],
  ["constitutional", "constitutional"],
  ["executive", "executive"],
  ["judicial", "judicial"],
  ["legislative", "legislative"],
] as const

const membershipMappings = [
  ["african_union", "africanUnion"],
  ["arab_league", "arabLeague"],
  ["asean", "asean"],
  ["brics", "brics"],
  ["commonwealth", "commonwealth"],
  ["eu", "eu"],
  ["eurozone", "eurozone"],
  ["g20", "g20"],
  ["g7", "g7"],
  ["nato", "nato"],
  ["oecd", "oecd"],
  ["opec", "opec"],
  ["schengen", "schengen"],
  ["un", "un"],
] as const

function optionalText(value: string | undefined) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : undefined
}

function normalizeRegion(region: string | undefined) {
  const result = countryRegionSchema.safeParse(region)
  return result.success ? result.data : undefined
}

function normalizeFlag(flag: RestCountriesSummaryCountry["flag"]) {
  if (!flag) {
    return undefined
  }

  const normalizedFlag = {
    pngUrl: flag.url_png,
    svgUrl: flag.url_svg,
    description: optionalText(flag.description),
  }

  return Object.values(normalizedFlag).some(Boolean)
    ? normalizedFlag
    : undefined
}

function findPrimaryCapital(capitals: RestCountriesSummaryCountry["capitals"]) {
  const primaryCapital = capitals?.find(
    (capital) => capital.attributes?.primary,
  )

  return optionalText(primaryCapital?.name ?? capitals?.[0]?.name)
}

function normalizeCoordinates(
  coordinates:
    | NonNullable<RestCountriesDetailCountry["coordinates"]>
    | undefined,
) {
  if (!coordinates) {
    return undefined
  }

  return {
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  }
}

function normalizeCapitals(capitals: RestCountriesDetailCountry["capitals"]) {
  return (capitals ?? []).map((capital) => ({
    name: capital.name,
    coordinates: normalizeCoordinates(capital.coordinates),
    roles: capitalRoleMappings.flatMap(([providerRole, domainRole]) =>
      capital.attributes?.[providerRole] ? [domainRole] : [],
    ),
  }))
}

function normalizeNativeNames(
  nativeNames: RestCountriesDetailCountry["names"]["native"],
) {
  return Object.entries(nativeNames ?? {}).map(([languageCode, names]) => ({
    languageCode,
    commonName: names.common,
    officialName: names.official,
  }))
}

function normalizeDemonyms(demonyms: RestCountriesDetailCountry["demonyms"]) {
  return Object.entries(demonyms ?? {}).map(([languageCode, names]) => ({
    languageCode,
    feminine: optionalText(names.f),
    masculine: optionalText(names.m),
  }))
}

function normalizeMemberships(
  memberships: RestCountriesDetailCountry["memberships"],
) {
  return membershipMappings.flatMap(([providerName, domainName]) =>
    memberships?.[providerName] ? [domainName] : [],
  )
}

function normalizeClassification(
  classification: RestCountriesDetailCountry["classification"],
) {
  if (!classification) {
    return undefined
  }

  return {
    sovereign: classification.sovereign,
    unMember: classification.un_member,
    unObserver: classification.un_observer,
    disputed: classification.disputed,
    dependency: classification.dependency,
    dependencyType: optionalText(classification.dependency_type),
    isoStatus: optionalText(classification.iso_status),
  }
}

function normalizeLinks(links: RestCountriesDetailCountry["links"]) {
  if (!links) {
    return undefined
  }

  const normalizedLinks = {
    officialWebsite: links.official,
    wikipedia: links.wikipedia,
    openStreetMap: links.open_street_maps,
    googleMaps: links.google_maps,
  }

  return Object.values(normalizedLinks).some(Boolean)
    ? normalizedLinks
    : undefined
}

export function normalizeCountrySummary(
  country: RestCountriesSummaryCountry,
): CountrySummary {
  return countrySummarySchema.parse({
    code: country.codes.alpha_2,
    alpha3Code: country.codes.alpha_3,
    name: country.names.common,
    capital: findPrimaryCapital(country.capitals),
    region: normalizeRegion(country.region),
    population: country.population,
    flag: normalizeFlag(country.flag),
  })
}

export function normalizeCountryDetail(
  country: RestCountriesDetailCountry,
): CountryDetail {
  const summary = normalizeCountrySummary(country)

  return countryDetailSchema.parse({
    ...summary,
    officialName: optionalText(country.names.official),
    nativeNames: normalizeNativeNames(country.names.native),
    demonyms: normalizeDemonyms(country.demonyms),
    capitals: normalizeCapitals(country.capitals),
    subregion: optionalText(country.subregion),
    continents: country.continents ?? [],
    landlocked: country.landlocked,
    borderCodes: country.borders ?? [],
    areaSquareKilometers: country.area?.kilometers,
    coordinates: normalizeCoordinates(country.coordinates),
    timeZones: country.timezones ?? [],
    languages: (country.languages ?? []).map((language) => ({
      code: optionalText(language.bcp47 ?? language.iso639_1),
      name: language.name,
      nativeName: optionalText(language.native_name),
    })),
    currencies: (country.currencies ?? []).map((currency) => ({
      code: currency.code,
      name: currency.name,
      symbol: optionalText(currency.symbol),
    })),
    callingCodes: (country.calling_codes ?? []).map((code) => `+${code}`),
    topLevelDomains: country.tlds ?? [],
    drivingSide: country.cars?.driving_side,
    vehicleSigns: country.cars?.signs ?? [],
    postalCodeFormat: optionalText(country.postal_code?.format),
    startOfWeek: optionalText(country.date?.start_of_week),
    measurementSystem: optionalText(country.units?.measurement_system),
    temperatureScale: optionalText(country.units?.temperature_scale),
    classification: normalizeClassification(country.classification),
    memberships: normalizeMemberships(country.memberships),
    governmentType: optionalText(country.government_type),
    links: normalizeLinks(country.links),
    codes: {
      numeric: optionalText(country.codes.ccn3),
      olympic: optionalText(country.codes.cioc),
      football: optionalText(country.codes.fifa),
      fips: optionalText(country.codes.fips),
      gec: optionalText(country.codes.gec),
    },
  })
}
