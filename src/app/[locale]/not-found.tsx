"use client"

import { MapPinnedIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export default function NotFound() {
  const t = useTranslations("RouteStates")

  return (
    <div className="atlas-container flex min-h-[60svh] items-center py-10">
      <Empty className="atlas-state-card border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinnedIcon aria-hidden="true" />
          </EmptyMedia>
          <p className="atlas-kicker">{t("notFoundEyebrow")}</p>
          <EmptyTitle role="heading" aria-level={1}>
            {t("notFoundTitle")}
          </EmptyTitle>
          <EmptyDescription>{t("notFoundDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "min-h-11")}
          >
            {t("backHome")}
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  )
}
