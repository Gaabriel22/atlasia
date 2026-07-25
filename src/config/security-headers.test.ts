import { describe, expect, it } from "vitest"

import {
  createContentSecurityPolicy,
  createSecurityHeaders,
} from "@/config/security-headers"

function headersToRecord(isDevelopment: boolean) {
  return Object.fromEntries(
    createSecurityHeaders(isDevelopment).map(({ key, value }) => [key, value]),
  )
}

describe("security headers", () => {
  it("keeps the production policy static and restricted to observed assets", () => {
    const policy = createContentSecurityPolicy(false)

    expect(policy).toContain("img-src 'self' https://flags.restcountries.com")
    expect(policy).toContain("connect-src 'self'")
    expect(policy).toContain("frame-src 'none'")
    expect(policy).toContain("worker-src 'none'")
    expect(policy).toContain("upgrade-insecure-requests")
    expect(policy).not.toContain("'unsafe-eval'")
    expect(policy).not.toContain("blob:")
    expect(policy).not.toContain("data:")
    expect(policy).not.toContain("connect-src 'self' https:")
  })

  it("only enables development capabilities required by the Next.js runtime", () => {
    const policy = createContentSecurityPolicy(true)

    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'")
    expect(policy).toContain("connect-src 'self' ws: wss:")
    expect(policy).not.toContain("upgrade-insecure-requests")
  })

  it("publishes browser isolation and long-lived HTTPS protections", () => {
    const headers = headersToRecord(false)

    expect(headers).toMatchObject({
      "Cross-Origin-Opener-Policy": "same-origin",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security":
        "max-age=63072000; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-Permitted-Cross-Domain-Policies": "none",
    })
    expect(headers["Permissions-Policy"]).toContain("geolocation=()")
    expect(headers["Permissions-Policy"]).toContain("payment=()")
  })
})
