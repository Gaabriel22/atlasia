## ADDED Requirements

### Requirement: Versioned country data access
The system SHALL serve public country data from a validated, versioned snapshot and MUST NOT require an external API call or provider credential during navigation, build, or deployment.

#### Scenario: Catalog data request
- **WHEN** the localized catalog page requests country summaries
- **THEN** the server reads validated summary fields from the bundled snapshot

#### Scenario: Country detail request
- **WHEN** a country profile requests a supported ISO alpha-2 code
- **THEN** the server reads the validated detailed record from the bundled snapshot

### Requirement: Runtime validation at the snapshot boundary
The system SHALL validate the complete snapshot with Zod before exposing country data to application queries.

#### Scenario: Valid snapshot
- **WHEN** the bundled snapshot matches the expected detail schema
- **THEN** the system exposes stable internal country models

#### Scenario: Invalid snapshot
- **WHEN** any bundled record does not match the expected schema
- **THEN** validation fails before unvalidated fields can be rendered

### Requirement: Stable internal country models
The system SHALL expose distinct summary and detail models whose types are inferred from schemas and whose field names do not depend on provider naming.

#### Scenario: UI consumes country data
- **WHEN** a component receives country data
- **THEN** it receives a validated internal model and does not import the REST Countries response schema

### Requirement: Quota-independent country reads
The system SHALL keep public reads independent from external quotas and SHALL deduplicate equivalent reads within one render request.

#### Scenario: Repeated data read
- **WHEN** metadata and page rendering request the same country during one request
- **THEN** the system reuses the memoized snapshot result without issuing a network request

### Requirement: Controlled snapshot updates
The system SHALL update country data only through an explicit maintenance command and MUST preserve the last committed snapshot when the source is unavailable or invalid.

#### Scenario: Update source unavailable
- **WHEN** the maintenance command cannot download a valid catalog
- **THEN** the command fails without replacing the committed snapshot used by production

#### Scenario: Unknown country code
- **WHEN** the requested ISO code does not exist in the validated snapshot
- **THEN** the system resolves the country as not found
