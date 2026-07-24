## ADDED Requirements

### Requirement: Supported locales
The system SHALL support `pt-BR` and `en`, with `pt-BR` as the default locale.

#### Scenario: Portuguese route
- **WHEN** a user opens a route under `pt-BR`
- **THEN** interface content, formatting and metadata are rendered in Brazilian Portuguese

#### Scenario: English route
- **WHEN** a user opens a route under `en`
- **THEN** interface content, formatting and metadata are rendered in English

### Requirement: Locale negotiation
The system SHALL redirect a request without a locale prefix to the best supported locale derived from the request, falling back to `pt-BR`.

#### Scenario: Supported browser language
- **WHEN** a user opens the root URL with English preferred
- **THEN** the system redirects to the English catalog route

#### Scenario: Unsupported browser language
- **WHEN** a user opens the root URL without a supported language preference
- **THEN** the system redirects to the Brazilian Portuguese catalog route

### Requirement: Locale-aware navigation
All internal public navigation SHALL use next-intl routing helpers and SHALL retain the active locale unless the user explicitly switches it.

#### Scenario: Navigate from catalog to profile
- **WHEN** an English catalog card is activated
- **THEN** the destination remains under the English locale

### Requirement: Language selector
The system SHALL provide an accessible language selector that changes locale while preserving the equivalent current route and country identity when available.

#### Scenario: Switch catalog language
- **WHEN** the user changes from `pt-BR` to `en` on the catalog
- **THEN** the English catalog opens

#### Scenario: Switch country language
- **WHEN** the user changes locale on country code `br`
- **THEN** the profile for code `br` opens in the selected locale

### Requirement: Localized message completeness
Every production message key used by the application MUST exist in both locale dictionaries.

#### Scenario: Build validates messages
- **WHEN** the project is validated for release
- **THEN** missing or structurally inconsistent translation keys cause a test failure
