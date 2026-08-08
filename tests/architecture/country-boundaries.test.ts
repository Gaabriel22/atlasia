import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

const pureCountryDirectories = [
  join(process.cwd(), "src", "features", "countries", "model"),
  join(process.cwd(), "src", "features", "countries", "utils"),
]

const forbiddenDependencies = [
  /from\s+["']next(?:\/|["'])/,
  /from\s+["']react(?:\/|["'])/,
  /from\s+["']@\/features\/countries\/api(?:\/|["'])/,
  /import\s+["']server-only["']/,
  /\bfetch\s*\(/,
]

const runtimeCountryDataFiles = [
  join(
    process.cwd(),
    "src",
    "features",
    "countries",
    "data",
    "country-snapshot.ts",
  ),
  join(
    process.cwd(),
    "src",
    "features",
    "countries",
    "queries",
    "get-countries.ts",
  ),
  join(
    process.cwd(),
    "src",
    "features",
    "countries",
    "queries",
    "get-country.ts",
  ),
]

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectTypeScriptFiles(entryPath)
    }

    return entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")
      ? [entryPath]
      : []
  })
}

describe("country dependency boundaries", () => {
  it("keeps domain models and pure utilities independent from outer layers", () => {
    const protectedFiles = pureCountryDirectories.flatMap(
      collectTypeScriptFiles,
    )

    expect(protectedFiles.length).toBeGreaterThan(0)

    for (const file of protectedFiles) {
      const source = readFileSync(file, "utf8")

      for (const forbiddenDependency of forbiddenDependencies) {
        expect(source, file).not.toMatch(forbiddenDependency)
      }
    }
  })

  it("keeps public country reads independent from external APIs", () => {
    for (const file of runtimeCountryDataFiles) {
      const source = readFileSync(file, "utf8")

      expect(source, file).not.toMatch(/features\/countries\/api/)
      expect(source, file).not.toMatch(/\bfetch\s*\(/)
      expect(source, file).not.toMatch(/REST_COUNTRIES_API_KEY/)
    }
  })
})
