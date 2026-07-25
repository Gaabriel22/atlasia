import {
  BinaryIcon,
  CoinsIcon,
  ExternalLinkIcon,
  FingerprintIcon,
  LanguagesIcon,
  MapIcon,
  RadioTowerIcon,
  UsersIcon,
} from "lucide-react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import type { ComponentType, ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CountryDetail } from "@/features/countries/model/country.schemas"
import {
  formatArea,
  formatCoordinates,
  formatCountryName,
  formatCurrencyName,
  formatLanguageName,
  formatList,
  formatPopulation,
} from "@/features/countries/utils/country-formatters"
import {
  formatDependencyType,
  formatGeographicArea,
  formatGovernmentType,
  formatIsoStatus,
  formatOfficialName,
} from "@/features/countries/utils/country-value-localizers"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type CountryProfileProps = {
  country: CountryDetail
  locale: string
}

type DetailItem = {
  label: string
  value: ReactNode
}

type DetailSectionProps = {
  description: string
  emptyLabel: string
  icon: ComponentType<{ "aria-hidden"?: boolean }>
  items: DetailItem[]
  title: string
}

const localizedValueKeys = new Set([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "metric",
  "imperial",
  "celsius",
  "fahrenheit",
])

function DetailSection({
  description,
  emptyLabel,
  icon: Icon,
  items,
  title,
}: DetailSectionProps) {
  return (
    <Card className="country-detail-card h-full">
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl">{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Icon aria-hidden={true} />
        </CardAction>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <dl className="flex flex-col">
            {items.map((item, index) => (
              <div key={item.label}>
                {index > 0 ? <Separator aria-hidden="true" /> : null}
                <div className="grid gap-1.5 py-4 sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)] sm:gap-6">
                  <dt className="atlas-kicker">{item.label}</dt>
                  <dd className="min-w-0 leading-relaxed text-foreground">
                    {item.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        ) : (
          <p className="py-4 text-muted-foreground">{emptyLabel}</p>
        )}
      </CardContent>
    </Card>
  )
}

function optionalItem(label: string, value?: ReactNode): DetailItem[] {
  return value === undefined || value === null || value === ""
    ? []
    : [{ label, value }]
}

function optionalList(
  label: string,
  values: string[],
  locale: string,
): DetailItem[] {
  return values.length > 0 ? [{ label, value: formatList(values, locale) }] : []
}

function externalLink(href: string, label: string, accessibleLabel: string) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={accessibleLabel}
      className="inline-flex min-h-11 items-center gap-2 rounded-md text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {label}
      <ExternalLinkIcon aria-hidden="true" />
    </a>
  )
}

export async function CountryProfile({ country, locale }: CountryProfileProps) {
  const t = await getTranslations("CountryProfile")
  const catalogT = await getTranslations("CountryCatalog")
  const localizedName = formatCountryName(country.code, country.name, locale)
  const localizedOfficialName = formatOfficialName(country, locale)
  const region = country.region
    ? catalogT(`regions.${country.region}`)
    : t("unknownRegion")
  const subregion = country.subregion
    ? formatGeographicArea(country.subregion, locale)
    : undefined
  const continents = country.continents.flatMap((continent) => {
    const localizedContinent = formatGeographicArea(continent, locale)
    return localizedContinent ? [localizedContinent] : []
  })
  const formattedPopulation =
    country.population === undefined
      ? undefined
      : formatPopulation(country.population, locale)
  const formattedArea =
    country.areaSquareKilometers === undefined
      ? undefined
      : formatArea(country.areaSquareKilometers, locale)
  const density =
    country.population !== undefined &&
    country.areaSquareKilometers !== undefined &&
    country.areaSquareKilometers > 0
      ? new Intl.NumberFormat(locale, {
          maximumFractionDigits: 1,
        }).format(country.population / country.areaSquareKilometers)
      : undefined

  const localizedValue = (value: string | undefined) => {
    if (!value) {
      return undefined
    }

    const key = value.toLocaleLowerCase()
    return localizedValueKeys.has(key) ? t(`values.${key}`) : value
  }

  const nativeNames = country.nativeNames.map((nativeName) => {
    const language = formatLanguageName(
      { code: nativeName.languageCode, name: nativeName.languageCode },
      locale,
    )
    return `${language}: ${nativeName.commonName} — ${nativeName.officialName}`
  })
  const demonyms = country.demonyms.map((demonym) => {
    const language = formatLanguageName(
      { code: demonym.languageCode, name: demonym.languageCode },
      locale,
    )
    const names = [demonym.feminine, demonym.masculine].filter(
      (value): value is string => Boolean(value),
    )
    return names.length > 0
      ? `${language}: ${formatList([...new Set(names)], locale)}`
      : language
  })
  const capitals = country.capitals.map((capital) => {
    const roles = capital.roles.map((role) => t(`capitalRoles.${role}`))
    const details = [
      roles.length > 0 ? formatList(roles, locale) : undefined,
      capital.coordinates
        ? formatCoordinates(capital.coordinates, locale)
        : undefined,
    ].filter((value): value is string => Boolean(value))

    return details.length > 0
      ? `${capital.name} (${details.join(" · ")})`
      : capital.name
  })
  const languages = country.languages.map((language) => {
    const localizedLanguage = formatLanguageName(language, locale)
    return language.nativeName && language.nativeName !== localizedLanguage
      ? `${localizedLanguage} (${language.nativeName})`
      : localizedLanguage
  })
  const currencies = country.currencies.map((currency) => {
    const details = [currency.code, currency.symbol].filter(
      (value): value is string => Boolean(value),
    )
    return `${formatCurrencyName(currency, locale)} (${details.join(" · ")})`
  })
  const memberships = country.memberships.map((membership) =>
    t(`memberships.${membership}`),
  )
  const borderCountries = country.borderCodes.map((code) =>
    formatCountryName(code, code, locale),
  )

  const identityItems = [
    ...optionalItem(t("fields.commonName"), localizedName),
    ...optionalItem(t("fields.officialName"), localizedOfficialName),
    ...optionalList(t("fields.nativeNames"), nativeNames, locale),
    ...optionalList(t("fields.demonyms"), demonyms, locale),
    ...optionalItem(
      t("fields.governmentType"),
      formatGovernmentType(country.governmentType, locale),
    ),
    ...optionalItem(
      t("fields.sovereign"),
      country.classification?.sovereign === undefined
        ? undefined
        : country.classification.sovereign
          ? t("yes")
          : t("no"),
    ),
    ...optionalItem(
      t("fields.unMember"),
      country.classification?.unMember === undefined
        ? undefined
        : country.classification.unMember
          ? t("yes")
          : t("no"),
    ),
    ...optionalItem(
      t("fields.unObserver"),
      country.classification?.unObserver === undefined
        ? undefined
        : country.classification.unObserver
          ? t("yes")
          : t("no"),
    ),
    ...optionalItem(
      t("fields.disputed"),
      country.classification?.disputed === undefined
        ? undefined
        : country.classification.disputed
          ? t("yes")
          : t("no"),
    ),
    ...optionalItem(
      t("fields.dependency"),
      country.classification?.dependency === undefined
        ? undefined
        : country.classification.dependency
          ? t("yes")
          : t("no"),
    ),
    ...optionalItem(
      t("fields.dependencyType"),
      formatDependencyType(country.classification?.dependencyType, locale),
    ),
    ...optionalItem(
      t("fields.isoStatus"),
      formatIsoStatus(country.classification?.isoStatus, locale),
    ),
    ...optionalList(t("fields.memberships"), memberships, locale),
  ]

  const geographyItems = [
    ...optionalItem(t("fields.region"), region),
    ...optionalItem(t("fields.subregion"), subregion),
    ...optionalList(t("fields.continents"), continents, locale),
    ...optionalList(t("fields.capitals"), capitals, locale),
    ...optionalItem(
      t("fields.landlocked"),
      country.landlocked === undefined
        ? undefined
        : country.landlocked
          ? t("yes")
          : t("no"),
    ),
    ...optionalList(t("fields.borders"), borderCountries, locale),
    ...optionalItem(t("fields.area"), formattedArea),
    ...optionalItem(
      t("fields.coordinates"),
      country.coordinates
        ? formatCoordinates(country.coordinates, locale)
        : undefined,
    ),
    ...optionalItem(
      t("fields.drivingSide"),
      country.drivingSide
        ? t(`drivingSides.${country.drivingSide}`)
        : undefined,
    ),
    ...optionalItem(t("fields.postalCodeFormat"), country.postalCodeFormat),
    ...optionalItem(
      t("fields.startOfWeek"),
      localizedValue(country.startOfWeek),
    ),
    ...optionalItem(
      t("fields.measurementSystem"),
      localizedValue(country.measurementSystem),
    ),
    ...optionalItem(
      t("fields.temperatureScale"),
      localizedValue(country.temperatureScale),
    ),
  ]

  const populationItems = [
    ...optionalItem(t("fields.population"), formattedPopulation),
    ...optionalItem(
      t("fields.density"),
      density ? t("densityValue", { value: density }) : undefined,
    ),
  ]

  const codeItems = [
    ...optionalItem(t("fields.alpha2"), country.code),
    ...optionalItem(t("fields.alpha3"), country.alpha3Code),
    ...optionalItem(t("fields.numeric"), country.codes.numeric),
    ...optionalItem(t("fields.olympic"), country.codes.olympic),
    ...optionalItem(t("fields.football"), country.codes.football),
    ...optionalItem(t("fields.fips"), country.codes.fips),
    ...optionalItem(t("fields.gec"), country.codes.gec),
    ...optionalList(t("fields.vehicleSigns"), country.vehicleSigns, locale),
  ]

  const connectivityItems = [
    ...optionalList(t("fields.callingCodes"), country.callingCodes, locale),
    ...optionalList(
      t("fields.topLevelDomains"),
      country.topLevelDomains,
      locale,
    ),
    ...optionalList(t("fields.timeZones"), country.timeZones, locale),
    ...optionalItem(
      t("fields.officialWebsite"),
      country.links?.officialWebsite
        ? externalLink(
            country.links.officialWebsite,
            t("fields.officialWebsite"),
            t("externalLink", {
              country: localizedName,
              label: t("fields.officialWebsite"),
            }),
          )
        : undefined,
    ),
    ...optionalItem(
      t("fields.wikipedia"),
      country.links?.wikipedia
        ? externalLink(
            country.links.wikipedia,
            t("fields.wikipedia"),
            t("externalLink", {
              country: localizedName,
              label: t("fields.wikipedia"),
            }),
          )
        : undefined,
    ),
    ...optionalItem(
      t("fields.openStreetMap"),
      country.links?.openStreetMap
        ? externalLink(
            country.links.openStreetMap,
            t("fields.openStreetMap"),
            t("externalLink", {
              country: localizedName,
              label: t("fields.openStreetMap"),
            }),
          )
        : undefined,
    ),
    ...optionalItem(
      t("fields.googleMaps"),
      country.links?.googleMaps
        ? externalLink(
            country.links.googleMaps,
            t("fields.googleMaps"),
            t("externalLink", {
              country: localizedName,
              label: t("fields.googleMaps"),
            }),
          )
        : undefined,
    ),
  ]

  return (
    <article className="atlas-container flex flex-col gap-10 py-8 sm:py-12 lg:gap-14 lg:py-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              {t("breadcrumbCatalog")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{localizedName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="country-profile-hero atlas-panel relative overflow-hidden">
        <div className="atlas-orbit" aria-hidden="true" />
        <div className="relative grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center">
          <div className="min-w-0">
            <p className="atlas-kicker">
              {t("eyebrow", { code: country.code })}
            </p>
            <h1 className="mt-5 max-w-3xl font-heading text-5xl leading-[0.94] font-semibold text-parchment sm:text-6xl lg:text-7xl">
              {localizedName}
            </h1>
            {localizedOfficialName ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {t("officialName")}:
                </span>{" "}
                {localizedOfficialName}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>{region}</Badge>
              {subregion ? (
                <Badge variant="secondary">{subregion}</Badge>
              ) : null}
              <Badge variant="outline">{country.alpha3Code}</Badge>
            </div>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-8 min-h-11",
              )}
            >
              {t("backToCatalog")}
            </Link>
          </div>

          <figure className="min-w-0">
            <div className="country-profile-flag relative aspect-8/5 overflow-hidden rounded-2xl bg-muted">
              {country.flag?.pngUrl ? (
                <Image
                  src={country.flag.pngUrl}
                  alt={t("flagAlt", { country: localizedName })}
                  fill
                  priority
                  sizes="(max-width: 1023px) calc(100vw - 5rem), 32rem"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  {t("unavailable")}
                </div>
              )}
            </div>
            {locale === "en" && country.flag?.description ? (
              <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="sr-only">{t("flagCaption")}: </span>
                {country.flag.description}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </header>

      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="atlas-stat">
          <dt className="atlas-kicker">{t("capital")}</dt>
          <dd className="font-heading text-3xl text-parchment">
            {country.capital ?? t("unavailable")}
          </dd>
        </div>
        <div className="atlas-stat atlas-stat-ocean">
          <dt className="atlas-kicker">{t("population")}</dt>
          <dd className="font-heading text-3xl text-parchment">
            {formattedPopulation ?? t("unavailable")}
          </dd>
        </div>
        <div className="atlas-stat">
          <dt className="atlas-kicker">{t("area")}</dt>
          <dd className="font-heading text-3xl text-parchment">
            {formattedArea ?? t("unavailable")}
          </dd>
        </div>
      </dl>

      <div className="country-detail-grid">
        <DetailSection
          title={t("sections.identity.title")}
          description={t("sections.identity.description")}
          emptyLabel={t("unavailable")}
          icon={FingerprintIcon}
          items={identityItems}
        />
        <DetailSection
          title={t("sections.geography.title")}
          description={t("sections.geography.description")}
          emptyLabel={t("unavailable")}
          icon={MapIcon}
          items={geographyItems}
        />
        <DetailSection
          title={t("sections.population.title")}
          description={t("sections.population.description")}
          emptyLabel={t("unavailable")}
          icon={UsersIcon}
          items={populationItems}
        />
        <DetailSection
          title={t("sections.languages.title")}
          description={t("sections.languages.description")}
          emptyLabel={t("unavailable")}
          icon={LanguagesIcon}
          items={optionalList(t("fields.languages"), languages, locale)}
        />
        <DetailSection
          title={t("sections.currencies.title")}
          description={t("sections.currencies.description")}
          emptyLabel={t("unavailable")}
          icon={CoinsIcon}
          items={optionalList(t("fields.currencies"), currencies, locale)}
        />
        <DetailSection
          title={t("sections.codes.title")}
          description={t("sections.codes.description")}
          emptyLabel={t("unavailable")}
          icon={BinaryIcon}
          items={codeItems}
        />
        <DetailSection
          title={t("sections.connectivity.title")}
          description={t("sections.connectivity.description")}
          emptyLabel={t("unavailable")}
          icon={RadioTowerIcon}
          items={connectivityItems}
        />
      </div>
    </article>
  )
}
