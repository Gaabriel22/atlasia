import { getTranslations, setRequestLocale } from "next-intl/server"

import { LocaleSwitcher } from "@/components/layout/locale-switcher"

type HomePageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("HomePage")

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section
        className="flex max-w-3xl flex-col items-start gap-6"
        aria-labelledby="home-title"
      >
        <p className="text-sm font-medium text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 id="home-title" className="text-4xl font-semibold text-balance">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("description")}
        </p>
        <LocaleSwitcher />
      </section>
    </main>
  )
}
