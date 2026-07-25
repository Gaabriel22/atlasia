"use client"

import { TriangleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations("RouteStates")

  return (
    <div className="atlas-container flex min-h-[60svh] items-center py-10">
      <Alert variant="destructive" className="atlas-state-card">
        <TriangleAlertIcon aria-hidden="true" />
        <AlertTitle role="heading" aria-level={1}>
          {t("errorTitle")}
        </AlertTitle>
        <AlertDescription>
          <p>{t("errorDescription")}</p>
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
