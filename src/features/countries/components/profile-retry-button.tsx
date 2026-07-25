"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"

type ProfileRetryButtonProps = {
  label: string
}

export function ProfileRetryButton({ label }: ProfileRetryButtonProps) {
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
