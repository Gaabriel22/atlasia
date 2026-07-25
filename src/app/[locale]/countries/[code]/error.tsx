"use client"

import { TriangleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type CountryProfileErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CountryProfileError({
  reset,
}: CountryProfileErrorProps) {
  const t = useTranslations("CountryProfile")

  return (
    <div className="atlas-container flex min-h-[60svh] items-center py-10">
      <Alert variant="destructive" className="atlas-state-card">
        <TriangleAlertIcon aria-hidden="true" />
        <AlertTitle role="heading" aria-level={1}>
          {t("unavailableTitle")}
        </AlertTitle>
        <AlertDescription>
          <p>{t("unavailableDescription")}</p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-5 min-h-11"
            onClick={reset}
          >
            {t("retry")}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
