import { describe, expect, it } from "vitest"

import { serializeJsonLd } from "@/lib/seo/json-ld"

describe("serializeJsonLd", () => {
  it("escapes markup that could terminate the JSON-LD script", () => {
    const serialized = serializeJsonLd({
      "@context": "https://schema.org",
      "@type": "Thing",
      name: "</script><script>alert('atlasia')</script>",
    })

    expect(serialized).not.toContain("<")
    expect(serialized).toContain("\\u003c/script>")
  })
})
