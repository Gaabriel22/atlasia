"use client"

import { ArrowUpRightIcon, FlagIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { CountryCatalogItem } from "@/features/countries/utils/country-catalog-items"
import { Link } from "@/i18n/navigation"

type CountryCardProps = {
  country: CountryCatalogItem
}

export function CountryCard({ country }: CountryCardProps) {
  const t = useTranslations("CountryCatalog")
  const countryCode = country.code.toLocaleLowerCase()

  return (
    <Link
      href={{
        pathname: "/countries/[code]",
        params: { code: countryCode },
      }}
      className="country-card-link group block h-full rounded-xl"
      aria-label={t("openCountry", { country: country.localizedName })}
    >
      <Card className="country-card h-full pt-0">
        <div className="relative aspect-8/5 overflow-hidden bg-muted">
          {country.flag?.pngUrl ? (
            <Image
              src={country.flag.pngUrl}
              alt={t("flagAlt", { country: country.localizedName })}
              fill
              sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 18rem"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <FlagIcon aria-hidden="true" />
              <span className="text-xs">{t("flagFallback")}</span>
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle>
            <h3 className="text-2xl leading-tight">{country.localizedName}</h3>
          </CardTitle>
          <CardDescription>
            {country.capital ?? t("unknownCapital")}
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">
              {country.region
                ? t(`regions.${country.region}`)
                : t("unknownRegion")}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <dt className="atlas-kicker">{t("capital")}</dt>
              <dd className="text-sm text-foreground">
                {country.capital ?? t("unknownCapital")}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="atlas-kicker">{t("population")}</dt>
              <dd className="text-sm text-foreground">
                {country.formattedPopulation ?? t("unknownPopulation")}
              </dd>
            </div>
          </dl>
        </CardContent>

        <CardFooter className="mt-auto justify-between">
          <span>{t("openProfile")}</span>
          <ArrowUpRightIcon aria-hidden="true" />
        </CardFooter>
      </Card>
    </Link>
  )
}
