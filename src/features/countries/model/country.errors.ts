export type CountryDataErrorCode =
  | "authentication"
  | "rate-limit"
  | "network"
  | "invalid-contract"
  | "not-found"

type CountryDataErrorOptions = {
  code: CountryDataErrorCode
  retryable: boolean
  cause?: unknown
}

export abstract class CountryDataError extends Error {
  readonly code: CountryDataErrorCode
  readonly retryable: boolean

  protected constructor(
    message: string,
    { cause, code, retryable }: CountryDataErrorOptions
  ) {
    super(message, { cause })
    this.name = new.target.name
    this.code = code
    this.retryable = retryable
  }
}

export class CountryAuthenticationError extends CountryDataError {
  constructor(cause?: unknown) {
    super("Country data provider authentication failed", {
      code: "authentication",
      retryable: false,
      cause,
    })
  }
}

export class CountryRateLimitError extends CountryDataError {
  constructor(cause?: unknown) {
    super("Country data provider rate limit reached", {
      code: "rate-limit",
      retryable: true,
      cause,
    })
  }
}

export class CountryNetworkError extends CountryDataError {
  constructor(cause?: unknown) {
    super("Country data provider is unavailable", {
      code: "network",
      retryable: true,
      cause,
    })
  }
}

export class CountryContractError extends CountryDataError {
  constructor(cause?: unknown) {
    super("Country data provider returned an invalid response", {
      code: "invalid-contract",
      retryable: false,
      cause,
    })
  }
}

export class CountryNotFoundError extends CountryDataError {
  constructor() {
    super("Country was not found", {
      code: "not-found",
      retryable: false,
    })
  }
}
