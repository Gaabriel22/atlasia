import { getTranslations } from "next-intl/server"

type CountryHeroProps = {
  countryCount: number
}

export async function CountryHero({ countryCount }: CountryHeroProps) {
  const t = await getTranslations("HomePage")

  return (
    <section
      className="atlas-panel relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
      aria-labelledby="home-title"
    >
      <div className="atlas-orbit" aria-hidden="true" />
      <div className="relative grid items-end gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)] lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="atlas-kicker">{t("eyebrow")}</p>
          <h1
            id="home-title"
            className="atlas-hero-title max-w-4xl text-5xl leading-[0.92] font-semibold text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="atlas-stat">
            <p className="atlas-kicker">{t("countEyebrow")}</p>
            <p className="font-heading text-5xl leading-none text-primary">
              {t("countValue", { count: countryCount })}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("countDescription", { count: countryCount })}
            </p>
          </div>
          <div className="atlas-stat atlas-stat-ocean">
            <p className="atlas-kicker">{t("routeEyebrow")}</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("routeDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
