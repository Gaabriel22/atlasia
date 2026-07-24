## ADDED Requirements

### Requirement: Server-only country data access
The system SHALL access REST Countries only from server-side modules and MUST NOT expose API credentials or raw provider responses to browser code.

#### Scenario: Catalog data request
- **WHEN** the localized catalog page requests country summaries
- **THEN** the server fetches the configured summary fields without sending the provider credential to the client

#### Scenario: Country detail request
- **WHEN** a country profile requests a supported ISO alpha-2 code
- **THEN** the server fetches the configured detailed fields for that country

### Requirement: Runtime validation at the external boundary
The system SHALL validate every REST Countries response with Zod before normalization and SHALL treat unparsed JSON as unknown data.

#### Scenario: Valid provider response
- **WHEN** the provider returns a payload matching the expected schema
- **THEN** the system normalizes it into an internal country model

#### Scenario: Invalid provider response
- **WHEN** the provider returns a payload that does not match the expected schema
- **THEN** the system returns a controlled domain error without rendering unvalidated fields

### Requirement: Stable internal country models
The system SHALL expose distinct summary and detail models whose types are inferred from schemas and whose field names do not depend on provider naming.

#### Scenario: UI consumes country data
- **WHEN** a component receives country data
- **THEN** it receives a validated internal model and does not import the REST Countries response schema

### Requirement: Country data caching
The system SHALL cache successful provider responses with a documented daily revalidation policy and SHALL deduplicate equivalent reads within one render request.

#### Scenario: Repeated data read
- **WHEN** metadata and page rendering request the same country during one request
- **THEN** the system reuses the memoized result instead of issuing a duplicate provider request

### Requirement: Controlled provider failures
The system SHALL distinguish not-found, authentication, rate-limit, network and schema failures sufficiently to render a safe user-facing state and useful server diagnostics.

#### Scenario: Provider unavailable
- **WHEN** the provider cannot return a valid catalog
- **THEN** the catalog renders a localized retryable error state without leaking credentials or internal error details

#### Scenario: Unknown country code
- **WHEN** the provider confirms that a requested ISO code has no country
- **THEN** the system resolves the country as not found
