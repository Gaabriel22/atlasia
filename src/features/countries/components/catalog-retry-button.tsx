"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"

type CatalogRetryButtonProps = {
  label: string
}

export function CatalogRetryButton({ label }: CatalogRetryButtonProps) {
  const router = useRouter()

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="mt-5 min-h-11"
      onClick={() => router.refresh()}
    >
      {label}
    </Button>
  )
}
