import { z } from "zod"

const siteUrlSchema = z
  .url()
  .refine((value) => {
    const url = new URL(value)
    const isSecureOrigin = url.protocol === "https:"
    const isLocalDevelopmentOrigin =
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")

    return (
      (isSecureOrigin || isLocalDevelopmentOrigin) &&
      url.username === "" &&
      url.password === "" &&
      url.pathname === "/" &&
      url.search === "" &&
      url.hash === ""
    )
  }, "SITE_URL must be a secure origin without credentials, path, query, or hash")
  .transform((value) => new URL(value).origin)

export const serverEnvSchema = z
  .object({
    SITE_URL: siteUrlSchema,
  })
  .strict()
  .transform(({ SITE_URL }) => ({
    siteUrl: SITE_URL,
  }))

export type ServerEnv = z.infer<typeof serverEnvSchema>

type EnvironmentSource = Partial<Pick<NodeJS.ProcessEnv, "SITE_URL">>

export function parseServerEnv(environment: EnvironmentSource): ServerEnv {
  const result = serverEnvSchema.safeParse({
    SITE_URL: environment.SITE_URL,
  })

  if (!result.success) {
    throw new Error("Invalid server environment configuration")
  }

  return result.data
}
