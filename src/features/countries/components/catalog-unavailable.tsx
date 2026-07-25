import { TriangleAlertIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CatalogRetryButton } from "@/features/countries/components/catalog-retry-button"

export async function CatalogUnavailable() {
  const t = await getTranslations("CountryCatalog")

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
        <CatalogRetryButton label={t("retry")} />
      </AlertDescription>
    </Alert>
  )
}
