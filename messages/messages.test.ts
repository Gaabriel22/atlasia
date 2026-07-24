import { describe, expect, it } from "vitest"

import englishMessages from "./en.json"
import portugueseMessages from "./pt-BR.json"

function collectLeafKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return collectLeafKeys(child, path)
  })
}

describe("translation messages", () => {
  it("keeps the same message structure in every locale", () => {
    expect(collectLeafKeys(englishMessages).sort()).toEqual(
      collectLeafKeys(portugueseMessages).sort(),
    )
  })
})
