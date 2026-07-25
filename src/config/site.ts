import "server-only"

import { env } from "@/config/env"

export const siteConfig = {
  name: "Atlasia",
  url: env.siteUrl,
  defaultLocale: "pt-BR",
  themeColor: "#0b1712",
  backgroundColor: "#050a08",
  icons: {
    favicon: "/brand/favicon.ico",
    icon: "/brand/icon.png",
    apple: "/brand/apple-touch-icon.png",
    logo: "/brand/atlasia-logo.png",
  },
} as const

export function getAbsoluteUrl(pathname: string) {
  if (!pathname.startsWith("/")) {
    throw new Error("Absolute site URLs require a root-relative pathname")
  }

  return new URL(pathname, `${siteConfig.url}/`).toString()
}
