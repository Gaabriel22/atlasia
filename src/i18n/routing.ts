import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["pt-BR", "en"],
  defaultLocale: "pt-BR",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/countries/[code]": {
      "pt-BR": "/paises/[code]",
      en: "/countries/[code]",
    },
  },
})

export type AppLocale = (typeof routing.locales)[number]
