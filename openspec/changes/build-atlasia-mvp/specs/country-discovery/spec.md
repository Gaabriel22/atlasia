## ADDED Requirements

### Requirement: Country catalog
The system SHALL render a responsive catalog of validated country summaries on the localized home page.

#### Scenario: Catalog loads successfully
- **WHEN** country summaries are available
- **THEN** the page displays one card per country and reports the total result count

### Requirement: Informative country cards
Each country card SHALL display a flag, localized country name, capital, region and localized population, and SHALL link to the matching localized country profile.

#### Scenario: User opens a country
- **WHEN** the user activates a country card
- **THEN** navigation opens that country's profile in the active locale

#### Scenario: Optional card value is absent
- **WHEN** a country lacks a capital, flag or region
- **THEN** the card remains usable and displays a localized fallback without layout breakage

### Requirement: Instant country search
The catalog SHALL allow case-insensitive and accent-insensitive client-side search by localized country name and capital without a page reload.

#### Scenario: Search matches a country name
- **WHEN** the user enters part of a displayed country name
- **THEN** the catalog shows matching cards and updates the result count

#### Scenario: Search matches a capital
- **WHEN** the user enters part of a capital name
- **THEN** the catalog shows countries with matching capitals

### Requirement: Region filtering
The catalog SHALL allow the user to filter countries by region and combine the selected region with the current search query.

#### Scenario: Region selected
- **WHEN** the user selects a region
- **THEN** only countries from that region that also match the current query remain visible

#### Scenario: All regions selected
- **WHEN** the user selects the localized all-regions option
- **THEN** the region constraint is removed

### Requirement: Discovery states
The catalog SHALL provide localized loading, empty and retryable error states using accessible shadcn/ui primitives.

#### Scenario: No countries match
- **WHEN** search and region filters produce zero results
- **THEN** the page displays an empty state with guidance for clearing or changing filters

#### Scenario: Catalog is loading
- **WHEN** the localized catalog route is awaiting data
- **THEN** the page displays a layout-stable skeleton
