import { describe, expect, it } from "vitest"

import {
  CountryAuthenticationError,
  CountryContractError,
  CountryDataError,
  CountryNetworkError,
  CountryNotFoundError,
  CountryRateLimitError,
} from "@/features/countries/model/country.errors"

describe.each([
  [CountryAuthenticationError, "authentication", false],
  [CountryRateLimitError, "rate-limit", true],
  [CountryNetworkError, "network", true],
  [CountryContractError, "invalid-contract", false],
  [CountryNotFoundError, "not-found", false],
] as const)("%s", (ErrorType, code, retryable) => {
  it("exposes a safe domain classification", () => {
    const error = new ErrorType()

    expect(error).toBeInstanceOf(CountryDataError)
    expect(error.code).toBe(code)
    expect(error.retryable).toBe(retryable)
  })
})
