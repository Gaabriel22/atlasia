import "server-only"

import { parseServerEnv } from "@/config/env.schema"

export const env = parseServerEnv({
  SITE_URL: process.env.SITE_URL,
  REST_COUNTRIES_API_KEY: process.env.REST_COUNTRIES_API_KEY,
})
