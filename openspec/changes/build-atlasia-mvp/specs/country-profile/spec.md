## ADDED Requirements

### Requirement: Stable localized country profile
The system SHALL provide a directly addressable country profile identified by ISO alpha-2 code under each supported locale.

#### Scenario: Valid country profile
- **WHEN** a user visits a supported locale and valid country code
- **THEN** the system renders the corresponding localized country profile

#### Scenario: Invalid country profile
- **WHEN** a user visits an unsupported or unknown country code
- **THEN** the system renders the localized not-found experience

### Requirement: Structured country information
The country profile SHALL present every selected detail field returned by the normalized model in comprehensible groups rather than as raw JSON.

#### Scenario: Complete detail record
- **WHEN** the normalized country contains identity, geography, population, language, currency, code and connectivity data
- **THEN** the page displays those values under labeled sections

#### Scenario: Partial detail record
- **WHEN** optional normalized fields are absent
- **THEN** the page omits irrelevant rows or renders localized fallbacks without failing

### Requirement: Profile navigation
The country profile SHALL provide locale-aware navigation back to the catalog and SHALL preserve the current country when switching locale.

#### Scenario: Return to catalog
- **WHEN** the user activates the back navigation
- **THEN** the system opens the catalog in the active locale

#### Scenario: Switch profile locale
- **WHEN** the user changes language from a country profile
- **THEN** the system opens the same ISO country code in the selected locale

### Requirement: Country profile metadata
The system SHALL generate localized title, description, canonical URL, language alternatives, social image data and structured data for a valid country profile.

#### Scenario: Search engine requests a country profile
- **WHEN** metadata is generated for a valid profile
- **THEN** metadata uses the localized country name and points to all supported locale alternatives
