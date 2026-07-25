import { z } from "zod"

const nonEmptyStringSchema = z.string().trim().min(1)
const alpha2CodeSchema = z.string().regex(/^[A-Z]{2}$/)
const alpha3CodeSchema = z.string().regex(/^[A-Z]{3}$/)

const httpsUrlSchema = z
  .url()
  .refine((value) => value.startsWith("https://"), "Expected an HTTPS URL")

const optionalHttpsUrlSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  httpsUrlSchema.optional(),
)

function createOptionalFlagUrlSchema(
  pathnamePattern: RegExp,
  expectedFormat: string,
) {
  return z.preprocess(
    (value) => (value === "" ? undefined : value),
    httpsUrlSchema
      .refine((value) => {
        const url = new URL(value)

        return (
          url.hostname === "flags.restcountries.com" &&
          url.port === "" &&
          url.search === "" &&
          url.hash === "" &&
          pathnamePattern.test(url.pathname)
        )
      }, `Expected a REST Countries ${expectedFormat} flag URL`)
      .optional(),
  )
}

const optionalPngFlagUrlSchema = createOptionalFlagUrlSchema(
  /^\/v5\/w640\/[a-z]{2}\.png$/,
  "PNG",
)
const optionalSvgFlagUrlSchema = createOptionalFlagUrlSchema(
  /^\/v5\/svg\/[a-z]{2}\.svg$/,
  "SVG",
)

const optionalNonEmptyStringSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  nonEmptyStringSchema.optional(),
)

function optionalStringSchema(schema: z.ZodString) {
  return z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  )
}

const coordinatesSchema = z
  .object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  })
  .strip()

const localizedNameSchema = z
  .object({
    common: nonEmptyStringSchema,
    official: nonEmptyStringSchema,
  })
  .strip()

const countryNamesSchema = z
  .object({
    common: nonEmptyStringSchema,
    official: nonEmptyStringSchema.optional(),
    native: z.record(z.string(), localizedNameSchema).optional(),
  })
  .strip()

const countryCodesSchema = z
  .object({
    alpha_2: alpha2CodeSchema,
    alpha_3: alpha3CodeSchema,
    ccn3: optionalStringSchema(z.string().regex(/^\d{3}$/)),
    cioc: optionalStringSchema(alpha3CodeSchema),
    fifa: optionalStringSchema(alpha3CodeSchema),
    fips: optionalStringSchema(alpha2CodeSchema),
    gec: optionalStringSchema(alpha2CodeSchema),
  })
  .strip()

const catalogCountryCodesSchema = countryCodesSchema.extend({
  alpha_2: optionalStringSchema(alpha2CodeSchema),
  alpha_3: optionalStringSchema(alpha3CodeSchema),
})

const capitalAttributesSchema = z
  .object({
    administrative: z.boolean().optional(),
    constitutional: z.boolean().optional(),
    executive: z.boolean().optional(),
    judicial: z.boolean().optional(),
    legislative: z.boolean().optional(),
    primary: z.boolean().optional(),
  })
  .strip()

const capitalSchema = z
  .object({
    name: nonEmptyStringSchema,
    coordinates: coordinatesSchema.optional(),
    attributes: capitalAttributesSchema.optional(),
  })
  .strip()

const flagSchema = z
  .object({
    url_png: optionalPngFlagUrlSchema,
    url_svg: optionalSvgFlagUrlSchema,
    description: optionalNonEmptyStringSchema,
  })
  .strip()

const languageSchema = z
  .object({
    bcp47: nonEmptyStringSchema.optional(),
    iso639_1: nonEmptyStringSchema.optional(),
    iso639_2b: nonEmptyStringSchema.optional(),
    iso639_2t: nonEmptyStringSchema.optional(),
    iso639_3: nonEmptyStringSchema.optional(),
    name: nonEmptyStringSchema,
    native_name: nonEmptyStringSchema.optional(),
  })
  .strip()

const currencySchema = z
  .object({
    code: z.string().regex(/^[A-Z]{3}$/),
    name: nonEmptyStringSchema,
    symbol: nonEmptyStringSchema.optional(),
  })
  .strip()

const demonymSchema = z
  .object({
    f: nonEmptyStringSchema.optional(),
    m: nonEmptyStringSchema.optional(),
  })
  .strip()

const classificationSchema = z
  .object({
    sovereign: z.boolean().optional(),
    un_member: z.boolean().optional(),
    un_observer: z.boolean().optional(),
    disputed: z.boolean().optional(),
    dependency: z.boolean().optional(),
    dependency_type: z.string().optional(),
    iso_status: z.string().optional(),
  })
  .strip()

const membershipsSchema = z
  .object({
    african_union: z.boolean().optional(),
    arab_league: z.boolean().optional(),
    asean: z.boolean().optional(),
    brics: z.boolean().optional(),
    commonwealth: z.boolean().optional(),
    eu: z.boolean().optional(),
    eurozone: z.boolean().optional(),
    g20: z.boolean().optional(),
    g7: z.boolean().optional(),
    nato: z.boolean().optional(),
    oecd: z.boolean().optional(),
    opec: z.boolean().optional(),
    schengen: z.boolean().optional(),
    un: z.boolean().optional(),
  })
  .strip()

const linksSchema = z
  .object({
    official: optionalHttpsUrlSchema,
    wikipedia: optionalHttpsUrlSchema,
    open_street_maps: optionalHttpsUrlSchema,
    google_maps: optionalHttpsUrlSchema,
  })
  .strip()

export const restCountriesSummaryCountrySchema = z
  .object({
    names: countryNamesSchema.pick({ common: true }),
    codes: countryCodesSchema.pick({ alpha_2: true, alpha_3: true }),
    capitals: z.array(capitalSchema).optional(),
    flag: flagSchema.optional(),
    region: nonEmptyStringSchema.optional(),
    population: z.number().int().nonnegative().optional(),
  })
  .strip()

const restCountriesCatalogCountrySchema =
  restCountriesSummaryCountrySchema.extend({
    codes: catalogCountryCodesSchema.pick({
      alpha_2: true,
      alpha_3: true,
    }),
  })

export const restCountriesDetailCountrySchema =
  restCountriesSummaryCountrySchema
    .extend({
      names: countryNamesSchema,
      codes: countryCodesSchema,
      capitals: z.array(capitalSchema).optional(),
      demonyms: z.record(z.string(), demonymSchema).optional(),
      subregion: nonEmptyStringSchema.optional(),
      continents: z.array(nonEmptyStringSchema).optional(),
      landlocked: z.boolean().optional(),
      borders: z.array(alpha3CodeSchema).optional(),
      area: z
        .object({
          kilometers: z.number().nonnegative().optional(),
          miles: z.number().nonnegative().optional(),
        })
        .strip()
        .optional(),
      coordinates: coordinatesSchema.optional(),
      timezones: z.array(nonEmptyStringSchema).optional(),
      languages: z.array(languageSchema).optional(),
      currencies: z.array(currencySchema).optional(),
      calling_codes: z.array(nonEmptyStringSchema).optional(),
      tlds: z.array(nonEmptyStringSchema).optional(),
      cars: z
        .object({
          driving_side: z.enum(["left", "right"]).optional(),
          signs: z.array(nonEmptyStringSchema).optional(),
        })
        .strip()
        .optional(),
      postal_code: z
        .object({
          format: z.string().optional(),
          regex: z.string().optional(),
        })
        .strip()
        .optional(),
      date: z
        .object({
          start_of_week: nonEmptyStringSchema.optional(),
        })
        .strip()
        .optional(),
      units: z
        .object({
          measurement_system: nonEmptyStringSchema.optional(),
          temperature_scale: nonEmptyStringSchema.optional(),
        })
        .strip()
        .optional(),
      classification: classificationSchema.optional(),
      memberships: membershipsSchema.optional(),
      government_type: nonEmptyStringSchema.optional(),
      links: linksSchema.optional(),
    })
    .strip()

const responseMetaSchema = z
  .object({
    total: z.number().int().nonnegative(),
    count: z.number().int().nonnegative().optional(),
    limit: z.number().int().positive().optional(),
    offset: z.number().int().nonnegative().optional(),
    more: z.boolean().optional(),
    request_id: z.string().optional(),
  })
  .strip()

function createResponseSchema<T extends z.ZodType>(countrySchema: T) {
  return z
    .object({
      data: z
        .object({
          objects: z.array(countrySchema),
          meta: responseMetaSchema,
        })
        .strip(),
    })
    .strip()
}

export const restCountriesSummaryResponseSchema = createResponseSchema(
  restCountriesCatalogCountrySchema,
)

export const restCountriesDetailResponseSchema = createResponseSchema(
  restCountriesDetailCountrySchema,
)

export type RestCountriesSummaryCountry = z.infer<
  typeof restCountriesSummaryCountrySchema
>
export type RestCountriesDetailCountry = z.infer<
  typeof restCountriesDetailCountrySchema
>
export type RestCountriesSummaryResponse = z.infer<
  typeof restCountriesSummaryResponseSchema
>
export type RestCountriesDetailResponse = z.infer<
  typeof restCountriesDetailResponseSchema
>
