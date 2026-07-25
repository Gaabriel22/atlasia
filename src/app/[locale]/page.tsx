import { getTranslations, setRequestLocale } from "next-intl/server"

type HomePageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("HomePage")

  return (
    <div className="atlas-container py-8 sm:py-12 lg:py-16">
      <section
        className="atlas-panel relative flex min-h-112 flex-col justify-end gap-5 overflow-hidden p-6 sm:p-10 lg:min-h-136 lg:p-14"
        aria-labelledby="home-title"
      >
        <div className="atlas-orbit" aria-hidden="true" />
        <p className="atlas-kicker relative">{t("eyebrow")}</p>
        <h1
          id="home-title"
          className="relative max-w-4xl font-heading text-5xl leading-[0.92] font-semibold text-balance sm:text-6xl lg:text-8xl"
        >
          {t("title")}
        </h1>
        <p className="relative max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          {t("description")}
        </p>
      </section>
    </div>
  )
}
