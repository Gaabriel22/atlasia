import { z } from "zod"

const nonEmptyStringSchema = z.string().trim().min(1)

export const countryCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(/^[A-Z]{2}$/))
  .brand<"CountryCode">()

export const countryAlpha3CodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(/^[A-Z]{3}$/))
  .brand<"CountryAlpha3Code">()

export const countryRegionSchema = z.enum([
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
])

const countryFlagSchema = z
  .object({
    pngUrl: z.url().optional(),
    svgUrl: z.url().optional(),
    description: nonEmptyStringSchema.optional(),
  })
  .strict()

export const countrySummarySchema = z
  .object({
    code: countryCodeSchema,
    alpha3Code: countryAlpha3CodeSchema,
    name: nonEmptyStringSchema,
    capital: nonEmptyStringSchema.optional(),
    region: countryRegionSchema.optional(),
    population: z.number().int().nonnegative().optional(),
    flag: countryFlagSchema.optional(),
  })
  .strict()

const capitalRoleSchema = z.enum([
  "primary",
  "administrative",
  "constitutional",
  "executive",
  "judicial",
  "legislative",
])

const coordinatesSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict()

const capitalSchema = z
  .object({
    name: nonEmptyStringSchema,
    coordinates: coordinatesSchema.optional(),
    roles: z.array(capitalRoleSchema),
  })
  .strict()

const localizedNameSchema = z
  .object({
    languageCode: nonEmptyStringSchema,
    commonName: nonEmptyStringSchema,
    officialName: nonEmptyStringSchema,
  })
  .strict()

const demonymSchema = z
  .object({
    languageCode: nonEmptyStringSchema,
    feminine: nonEmptyStringSchema.optional(),
    masculine: nonEmptyStringSchema.optional(),
  })
  .strict()

const languageSchema = z
  .object({
    code: nonEmptyStringSchema.optional(),
    name: nonEmptyStringSchema,
    nativeName: nonEmptyStringSchema.optional(),
  })
  .strict()

const currencySchema = z
  .object({
    code: z.string().regex(/^[A-Z]{3}$/),
    name: nonEmptyStringSchema,
    symbol: nonEmptyStringSchema.optional(),
  })
  .strict()

export const countryMembershipSchema = z.enum([
  "africanUnion",
  "arabLeague",
  "asean",
  "brics",
  "commonwealth",
  "eu",
  "eurozone",
  "g20",
  "g7",
  "nato",
  "oecd",
  "opec",
  "schengen",
  "un",
])

const classificationSchema = z
  .object({
    sovereign: z.boolean().optional(),
    unMember: z.boolean().optional(),
    unObserver: z.boolean().optional(),
    disputed: z.boolean().optional(),
    dependency: z.boolean().optional(),
    dependencyType: nonEmptyStringSchema.optional(),
    isoStatus: nonEmptyStringSchema.optional(),
  })
  .strict()

const countryLinksSchema = z
  .object({
    officialWebsite: z.url().optional(),
    wikipedia: z.url().optional(),
    openStreetMap: z.url().optional(),
    googleMaps: z.url().optional(),
  })
  .strict()

const countryCodesSchema = z
  .object({
    numeric: z.string().regex(/^\d{3}$/).optional(),
    olympic: z.string().regex(/^[A-Z]{3}$/).optional(),
    football: z.string().regex(/^[A-Z]{3}$/).optional(),
    fips: z.string().regex(/^[A-Z]{2}$/).optional(),
    gec: z.string().regex(/^[A-Z]{2}$/).optional(),
  })
  .strict()

export const countryDetailSchema = countrySummarySchema
  .extend({
    officialName: nonEmptyStringSchema.optional(),
    nativeNames: z.array(localizedNameSchema),
    demonyms: z.array(demonymSchema),
    capitals: z.array(capitalSchema),
    subregion: nonEmptyStringSchema.optional(),
    continents: z.array(nonEmptyStringSchema),
    landlocked: z.boolean().optional(),
    borderCodes: z.array(countryAlpha3CodeSchema),
    areaSquareKilometers: z.number().nonnegative().optional(),
    coordinates: coordinatesSchema.optional(),
    timeZones: z.array(nonEmptyStringSchema),
    languages: z.array(languageSchema),
    currencies: z.array(currencySchema),
    callingCodes: z.array(nonEmptyStringSchema),
    topLevelDomains: z.array(nonEmptyStringSchema),
    drivingSide: z.enum(["left", "right"]).optional(),
    vehicleSigns: z.array(nonEmptyStringSchema),
    postalCodeFormat: nonEmptyStringSchema.optional(),
    startOfWeek: nonEmptyStringSchema.optional(),
    measurementSystem: nonEmptyStringSchema.optional(),
    temperatureScale: nonEmptyStringSchema.optional(),
    classification: classificationSchema.optional(),
    memberships: z.array(countryMembershipSchema),
    governmentType: nonEmptyStringSchema.optional(),
    links: countryLinksSchema.optional(),
    codes: countryCodesSchema,
  })
  .strict()

export type CountryCode = z.infer<typeof countryCodeSchema>
export type CountryAlpha3Code = z.infer<typeof countryAlpha3CodeSchema>
export type CountryRegion = z.infer<typeof countryRegionSchema>
export type CountrySummary = z.infer<typeof countrySummarySchema>
export type CountryDetail = z.infer<typeof countryDetailSchema>
export type CountryCurrency = CountryDetail["currencies"][number]
export type CountryLanguage = CountryDetail["languages"][number]
