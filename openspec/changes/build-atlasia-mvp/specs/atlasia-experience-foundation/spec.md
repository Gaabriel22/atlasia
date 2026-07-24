## ADDED Requirements

### Requirement: Atlasia visual identity
The system SHALL preserve the Atlasia explorer-atlas identity using the approved logo, favicon, editorial typography, cartographic texture and semantic earth, ink, parchment, bronze and ocean tokens.

#### Scenario: User opens Atlasia
- **WHEN** any public page renders
- **THEN** its shell is visually recognizable as Atlasia and not as an uncustomized component template

### Requirement: shadcn/ui composition
The system SHALL use shadcn/ui primitives for supported controls, cards, feedback, navigation and overlays while applying project styling through semantic tokens and documented variants.

#### Scenario: Standard UI primitive exists
- **WHEN** the interface needs a component available from the configured shadcn registry
- **THEN** the implementation composes that component instead of recreating its behavior with custom markup

### Requirement: Responsive experience
The system SHALL remain readable and operable on mobile, tablet and desktop layouts without horizontal page overflow.

#### Scenario: Mobile catalog
- **WHEN** the viewport is narrow
- **THEN** hero, controls and cards adapt to a touch-friendly single-column flow

#### Scenario: Desktop profile
- **WHEN** the viewport provides sufficient width
- **THEN** the profile uses an editorial multi-column composition without reducing readability

### Requirement: Accessible interaction
The system SHALL conform to WCAG 2.2 Level AA. Interactive elements SHALL be keyboard-operable, visibly focusable, semantically labeled and compliant with reduced-motion preferences.

#### Scenario: Keyboard-only discovery
- **WHEN** a user navigates search, region filter, cards and language selection by keyboard
- **THEN** focus order is logical and every control can be operated without a pointer

#### Scenario: Screen reader uses catalog
- **WHEN** search or filter changes the visible result count
- **THEN** a polite live region announces the new count without moving focus

#### Scenario: User zooms page
- **WHEN** a user zooms content to 200 percent
- **THEN** content remains readable and operable without loss of information

### Requirement: Accessible visual presentation
The system SHALL provide WCAG AA contrast, semantic landmarks, one logical primary heading, text alternatives, a skip link and touch-friendly interactive targets.

#### Scenario: Automated and manual accessibility validation
- **WHEN** a representative route is audited
- **THEN** it has no critical automated accessibility violations and passes keyboard, focus, heading, landmark and contrast checks

### Requirement: Global route states
The system SHALL provide localized loading, error and not-found experiences consistent with the Atlasia visual system.

#### Scenario: Unexpected route error
- **WHEN** a localized route throws a recoverable runtime error
- **THEN** an accessible error state explains the failure and offers a retry action

### Requirement: Public SEO foundation
The system SHALL provide localized site metadata, robots directives, sitemap entries, manifest, icons and structured data for indexable public routes.

#### Scenario: Search crawler indexes Atlasia
- **WHEN** a crawler requests a supported public route
- **THEN** the route exposes canonical and alternate locale URLs with indexable localized metadata

### Requirement: Accurate Schema.org structured data
The system SHALL render server-side JSON-LD that matches visible page content and uses valid absolute URLs.

#### Scenario: Catalog structured data
- **WHEN** the catalog renders
- **THEN** its JSON-LD represents the website and country collection without unsupported claims

#### Scenario: Country structured data
- **WHEN** a valid country profile renders
- **THEN** its JSON-LD represents breadcrumbs and that country using only available visible values

#### Scenario: Structured data validation
- **WHEN** release validation runs
- **THEN** representative JSON-LD passes Schema.org validation and applicable Google structured-data checks

### Requirement: Lighthouse performance budget
Representative production routes MUST score at least 90 for Performance, 100 for Accessibility, 95 for Best Practices and 100 for SEO in a controlled mobile Lighthouse run.

#### Scenario: Production performance audit
- **WHEN** the localized catalog and one country profile are audited from a production build
- **THEN** both routes meet the configured Lighthouse category budgets

### Requirement: Core Web Vitals targets
The implementation SHALL be designed to achieve LCP at or below 2.5 seconds, INP at or below 200 milliseconds and CLS at or below 0.1 at the 75th percentile.

#### Scenario: Performance review
- **WHEN** lab or field data identifies a Core Web Vital above its target
- **THEN** the metric is treated as a performance regression and investigated before adding speculative optimizations

### Requirement: Clean dependency boundaries
Country domain rules MUST remain testable without Next.js, React, network access or the REST Countries field structure.

#### Scenario: Domain unit test
- **WHEN** normalization, search or formatting logic is tested
- **THEN** the test runs with plain data and no web framework or network setup

### Requirement: Release quality gates
The system MUST pass lint, TypeScript validation, automated tests and production build before an implementation phase is considered complete.

#### Scenario: Release candidate validation
- **WHEN** a development phase is prepared for commit
- **THEN** all quality commands relevant to that phase complete successfully

### Requirement: Secure public delivery
The system SHALL keep credentials and external data access server-only, validate untrusted input, avoid exposing internal failures and send defensive browser security headers on public responses.

#### Scenario: Browser requests a public route
- **WHEN** Atlasia serves a localized page
- **THEN** the response includes a Content Security Policy, clickjacking protection, MIME sniffing protection, a restrictive permissions policy and a privacy-preserving referrer policy

#### Scenario: Production is accessed over HTTPS
- **WHEN** a production response is served
- **THEN** it instructs compatible browsers to continue using HTTPS

#### Scenario: External country data fails
- **WHEN** REST Countries returns an invalid payload or transport error
- **THEN** the user receives a controlled localized state without credentials, raw payloads or internal diagnostics

### Requirement: Security verification
The system MUST verify dependency vulnerabilities, accidental secret exposure and security-sensitive Next.js configuration before release.

#### Scenario: Release security review
- **WHEN** the MVP is prepared for deployment
- **THEN** dependency audit, secret checks, security header checks and focused review of proxy, dynamic parameters and outbound fetches complete with no unresolved high-risk finding
