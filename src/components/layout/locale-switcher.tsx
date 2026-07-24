"use client"

import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { usePathname, useRouter } from "@/i18n/navigation"
import { type AppLocale, routing } from "@/i18n/routing"

const localeLabels = {
  "pt-BR": "portuguese",
  en: "english",
} as const

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const t = useTranslations("LocaleSwitcher")
  const [isPending, startTransition] = useTransition()

  function changeLocale(values: string[]) {
    const nextLocale = values.at(-1)

    if (
      !nextLocale ||
      nextLocale === locale ||
      !routing.locales.includes(nextLocale as AppLocale)
    ) {
      return
    }

    startTransition(() => {
      router.replace(
        // The current pathname and its params are paired by the active route.
        // @ts-expect-error next-intl cannot infer that runtime relationship.
        { pathname, params },
        { locale: nextLocale },
      )
    })
  }

  return (
    <ToggleGroup
      value={[locale]}
      onValueChange={changeLocale}
      disabled={isPending}
      variant="outline"
      spacing={0}
      aria-label={t("label")}
    >
      {routing.locales.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          aria-label={t(localeLabels[option])}
        >
          {option === "pt-BR" ? "PT" : "EN"}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
