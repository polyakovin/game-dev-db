# Spec Delta

## MODIFIED Requirements

### Requirement: Bilingual jam discovery

The portal SHALL provide RU/EN jam pages under `/{lang}/jams/`, linked from shared navigation and the home page, with matching language switching. Pages SHALL provide official discovery calendars separately from dated events and preserve keyboard access and narrow layouts in both themes.

#### Scenario: Find and enter a jam
- **WHEN** a reader opens either language's jam page
- **THEN** they can read event dates and entry conditions and follow the official participation link

#### Scenario: Switch language
- **WHEN** the reader switches language on the jam page
- **THEN** the matching jam page opens with the same event identities

### Requirement: Attributable static export

The portal SHALL publish `/api/v1/jams.json` additively, discoverable from the manifest and agent index. It SHALL contain bilingual source-aligned current events, calendars, schema version, attribution, license, generation time and expiry-filter guidance. Machine consumers SHALL be told to reapply deadline filtering at read time.

#### Scenario: Agent reads an old snapshot
- **WHEN** an agent fetches the event JSON
- **THEN** it receives exact timestamps, generation time and the rule to discard events whose deadline is not later than its current time
