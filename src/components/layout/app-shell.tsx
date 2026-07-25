import Image from "next/image"
import { getTranslations } from "next-intl/server"

import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/navigation"

type AppShellProps = Readonly<{
  children: React.ReactNode
}>

export async function AppShell({ children }: AppShellProps) {
  const t = await getTranslations("SiteShell")

  return (
    <div className="flex min-h-svh min-w-0 flex-col">
      <a className="skip-link" href="#main-content">
        {t("skipToContent")}
      </a>

      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md">
        <div className="atlas-container flex min-h-20 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="group flex min-h-11 min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={t("homeLabel")}
          >
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-black/20 transition-transform group-hover:-rotate-2 group-hover:scale-[1.03]">
              <Image
                src="/brand/atlasia-logo.png"
                alt=""
                width={48}
                height={48}
                loading="eager"
                className="size-full object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-2xl leading-none font-semibold tracking-wide text-parchment">
                Atlasia
              </span>
              <span className="mt-1 hidden truncate text-[0.65rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase min-[380px]:block">
                {t("tagline")}
              </span>
            </span>
          </Link>

          <nav aria-label={t("languageNavigation")}>
            <LocaleSwitcher />
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
        {children}
      </main>

      <footer className="atlas-container pb-7">
        <Separator aria-hidden="true" />
        <div className="flex flex-col gap-2 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footerStatement")}</p>
          <p className="font-heading text-base tracking-wide text-parchment/75">
            {t("footerCoordinates")}
          </p>
        </div>
      </footer>
    </div>
  )
}
