import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const SOURCE_URL =
  "https://raw.githubusercontent.com/mledoze/countries/9eff32e4eef26715aa59d99b200127d1ef150e7a/countries.json"
const OUTPUT_PATH = resolve(
  "src/features/countries/data/countries.snapshot.json",
)

function optionalText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function textArray(value) {
  return Array.isArray(value)
    ? value.flatMap((item) => optionalText(item) ?? [])
    : []
}

function coordinates(value) {
  if (
    !Array.isArray(value) ||
    value.length < 2 ||
    typeof value[0] !== "number" ||
    typeof value[1] !== "number"
  ) {
    return undefined
  }

  return {
    latitude: value[0],
    longitude: value[1],
  }
}

function callingCodes(idd) {
  const root = optionalText(idd?.root)

  if (!root) {
    return []
  }

  const suffixes = textArray(idd?.suffixes)
  return suffixes.length > 0
    ? [...new Set(suffixes.map((suffix) => `${root}${suffix}`))]
    : [root]
}

function optionalObject(value) {
  return Object.values(value).some((item) => item !== undefined)
    ? value
    : undefined
}

function normalizeCountry(country) {
  const code = optionalText(country.cca2)?.toUpperCase()
  const alpha3Code = optionalText(country.cca3)?.toUpperCase()

  if (!code || !alpha3Code) {
    return undefined
  }

  const names = country.name ?? {}
  const capitals = textArray(country.capital)
  const capitalCoordinates = coordinates(country.capitalInfo?.latlng)
  const lowerCode = code.toLowerCase()
  const links = optionalObject({
    googleMaps: optionalText(country.maps?.googleMaps),
    openStreetMap: optionalText(country.maps?.openStreetMaps),
  })
  const classification = optionalObject({
    sovereign:
      typeof country.independent === "boolean"
        ? country.independent
        : undefined,
    unMember:
      typeof country.unMember === "boolean" ? country.unMember : undefined,
    isoStatus: optionalText(country.status),
  })

  return {
    code,
    alpha3Code,
    name: names.common,
    ...(capitals[0] ? { capital: capitals[0] } : {}),
    ...(optionalText(country.region) ? { region: country.region } : {}),
    ...(Number.isInteger(country.population) && country.population >= 0
      ? { population: country.population }
      : {}),
    flag: {
      pngUrl: `https://flags.restcountries.com/v5/w640/${lowerCode}.png`,
      svgUrl: `https://flags.restcountries.com/v5/svg/${lowerCode}.svg`,
      ...(optionalText(country.flags?.alt)
        ? { description: country.flags.alt.trim() }
        : {}),
    },
    ...(optionalText(names.official) ? { officialName: names.official } : {}),
    nativeNames: Object.entries(names.native ?? {}).flatMap(
      ([languageCode, nativeName]) => {
        const commonName = optionalText(nativeName?.common)
        const officialName = optionalText(nativeName?.official)

        return commonName && officialName
          ? [{ languageCode, commonName, officialName }]
          : []
      },
    ),
    demonyms: Object.entries(country.demonyms ?? {}).map(
      ([languageCode, demonym]) => ({
        languageCode,
        ...(optionalText(demonym?.f) ? { feminine: demonym.f } : {}),
        ...(optionalText(demonym?.m) ? { masculine: demonym.m } : {}),
      }),
    ),
    capitals: capitals.map((name, index) => ({
      name,
      ...(index === 0 && capitalCoordinates
        ? { coordinates: capitalCoordinates }
        : {}),
      roles: index === 0 ? ["primary"] : [],
    })),
    ...(optionalText(country.subregion)
      ? { subregion: country.subregion }
      : {}),
    continents: textArray(country.continents),
    ...(typeof country.landlocked === "boolean"
      ? { landlocked: country.landlocked }
      : {}),
    borderCodes: textArray(country.borders).map((border) =>
      border.toUpperCase(),
    ),
    ...(typeof country.area === "number" && country.area >= 0
      ? { areaSquareKilometers: country.area }
      : {}),
    ...(coordinates(country.latlng)
      ? { coordinates: coordinates(country.latlng) }
      : {}),
    timeZones: textArray(country.timezones),
    languages: Object.entries(country.languages ?? {}).map(([code, name]) => ({
      code,
      name,
    })),
    currencies: Object.entries(country.currencies ?? {}).flatMap(
      ([currencyCode, currency]) => {
        const name = optionalText(currency?.name)

        return name
          ? [
              {
                code: currencyCode.toUpperCase(),
                name,
                ...(optionalText(currency?.symbol)
                  ? { symbol: currency.symbol }
                  : {}),
              },
            ]
          : []
      },
    ),
    callingCodes: callingCodes(country.idd),
    topLevelDomains: textArray(country.tld),
    ...(country.car?.side === "left" || country.car?.side === "right"
      ? { drivingSide: country.car.side }
      : {}),
    vehicleSigns: textArray(country.car?.signs),
    ...(optionalText(country.postalCode?.format)
      ? { postalCodeFormat: country.postalCode.format }
      : {}),
    ...(optionalText(country.startOfWeek)
      ? { startOfWeek: country.startOfWeek }
      : {}),
    ...(classification ? { classification } : {}),
    memberships: country.unMember === true ? ["un"] : [],
    ...(links ? { links } : {}),
    codes: {
      ...(optionalText(country.ccn3) ? { numeric: country.ccn3 } : {}),
      ...(optionalText(country.cioc) ? { olympic: country.cioc } : {}),
      ...(optionalText(country.fifa) ? { football: country.fifa } : {}),
    },
  }
}

const response = await fetch(SOURCE_URL)

if (!response.ok) {
  throw new Error(`Country snapshot source returned HTTP ${response.status}`)
}

const payload = await response.json()

if (!Array.isArray(payload)) {
  throw new TypeError("Country snapshot source must return an array")
}

const snapshot = payload
  .flatMap((country) => normalizeCountry(country) ?? [])
  .sort((left, right) => left.code.localeCompare(right.code))

if (snapshot.length < 200) {
  throw new Error(`Country snapshot is unexpectedly small: ${snapshot.length}`)
}

await mkdir(dirname(OUTPUT_PATH), { recursive: true })
await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8")

console.log(`Wrote ${snapshot.length} countries to ${OUTPUT_PATH}`)
