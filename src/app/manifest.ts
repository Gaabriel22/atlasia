import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atlasia — Atlas mundial",
    short_name: "Atlasia",
    description:
      "Explore países, capitais e informações geográficas em um atlas moderno.",
    start_url: "/pt-BR",
    scope: "/",
    display: "standalone",
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    categories: ["education", "reference", "travel"],
    lang: siteConfig.defaultLocale,
    icons: [
      {
        src: siteConfig.icons.icon,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: siteConfig.icons.apple,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
