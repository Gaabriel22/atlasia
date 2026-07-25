import { TriangleAlertIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProfileRetryButton } from "@/features/countries/components/profile-retry-button"

export async function CountryProfileUnavailable() {
  const t = await getTranslations("CountryProfile")

  return (
    <Alert variant="destructive" className="atlas-state-card">
      <TriangleAlertIcon aria-hidden="true" />
      <AlertTitle>
        <span className="atlas-kicker">{t("unavailableEyebrow")}</span>
        <span className="mt-3 block font-heading text-3xl text-foreground">
          {t("unavailableTitle")}
        </span>
      </AlertTitle>
      <AlertDescription>
        <p>{t("unavailableDescription")}</p>
        <ProfileRetryButton label={t("retry")} />
      </AlertDescription>
    </Alert>
  )
}
