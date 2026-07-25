"use client"

import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  const t = useTranslations("RouteStates")

  return (
    <div
      className="atlas-container py-8 sm:py-12"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">{t("loading")}</p>
      <div className="atlas-panel flex min-h-112 flex-col justify-end gap-5 p-6 sm:p-10">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-14 w-full max-w-2xl sm:h-20" />
        <Skeleton className="h-6 w-full max-w-xl" />
        <Skeleton className="h-6 w-4/5 max-w-lg" />
      </div>
    </div>
  )
}
