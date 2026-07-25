import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

type CatchAllPageProps = {
  params: Promise<{ locale: string; rest: string[] }>
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  notFound()
}
