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
      <div className="mt-16 flex flex-col gap-8 sm:mt-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-12 w-full max-w-lg" />
            <Skeleton className="h-5 w-full max-w-md" />
          </div>
          <div className="atlas-filter-panel flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
        <div className="country-grid">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-96 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
