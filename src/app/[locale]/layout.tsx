import type { Metadata } from "next"
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server"

import { AppShell } from "@/components/layout/app-shell"
import { siteConfig } from "@/config/site"
import { routing } from "@/i18n/routing"
import {
  getCatalogLanguageAlternates,
  getCatalogUrl,
} from "@/lib/seo/localized-urls"

import "../globals.css"

const sourceSans = Source_Sans_3({
  variable: "--font-atlas-body",
  subsets: ["latin"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  variable: "--font-atlas-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
})

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "Metadata" })
  const canonical = getCatalogUrl(locale)

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    applicationName: siteConfig.name,
    category: "education",
    alternates: {
      canonical,
      languages: getCatalogLanguageAlternates(),
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        {
          url: siteConfig.icons.favicon,
          sizes: "32x32",
          type: "image/x-icon",
        },
        {
          url: siteConfig.icons.icon,
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: siteConfig.icons.apple,
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: [siteConfig.icons.favicon],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: canonical,
      locale: locale.replace("-", "_"),
      alternateLocale: routing.locales
        .filter((supportedLocale) => supportedLocale !== locale)
        .map((supportedLocale) => supportedLocale.replace("-", "_")),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${sourceSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppShell>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
