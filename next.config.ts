import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

import { createSecurityHeaders } from "./src/config/security-headers"

const isDevelopment = process.env.NODE_ENV === "development"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flags.restcountries.com",
        port: "",
        pathname: "/v5/w640/**",
        search: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: createSecurityHeaders(isDevelopment),
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

export default withNextIntl(nextConfig)
