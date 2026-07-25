import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default async function CountryProfileLoading() {
  const t = await getTranslations("CountryProfile")

  return (
    <div
      className="atlas-container flex flex-col gap-10 py-8 sm:py-12 lg:gap-14 lg:py-16"
      aria-label={t("loading")}
      aria-busy="true"
    >
      <Skeleton className="h-5 w-56" />

      <div className="atlas-panel grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14">
        <div className="flex flex-col gap-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-4/5" />
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-11 w-44" />
        </div>
        <Skeleton className="aspect-8/5 w-full rounded-2xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>

      <div className="country-detail-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="min-h-80">
            <CardHeader className="flex flex-col gap-3">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
