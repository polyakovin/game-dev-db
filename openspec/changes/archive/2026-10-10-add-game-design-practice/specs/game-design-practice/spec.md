## ADDED Requirements

### Requirement: Complete bilingual original exercises

The portal SHALL provide twelve exercises with shared stable identities, topics,
level and estimated duration, and equivalent Russian and English goals, briefs,
constraints, steps, deliverables, checks and reflection questions. It SHALL state
that the scenarios are original and reference both authors of the thematic source.

#### Scenario: Reject missing translation content

- **WHEN** an exercise lacks a translated field or has unequal translated list lengths
- **THEN** content verification fails before publication

### Requirement: Accessible practice discovery

The portal SHALL expose practice in navigation and on both home pages. The practice
page SHALL combine full-content text search, topic and maximum-duration filters,
result counts, empty state and reset, and provide keyboard-operable disclosures
and stable anchors under `/game-dev-db/`.

#### Scenario: Combine filters and recover

- **WHEN** a reader combines query, topic and duration and then resets a query with no results
- **THEN** only matching exercises appear first and all twelve return after reset

#### Scenario: Read without JavaScript

- **WHEN** a reader opens either practice page with JavaScript disabled
- **THEN** all exercises and sources remain available through native disclosures

#### Scenario: Open an exercise in another language

- **WHEN** a reader opens an exercise anchor and switches languages
- **THEN** the corresponding language page retains and opens that exercise

#### Scenario: Use a narrow viewport

- **WHEN** a reader opens either language at 375 pixels wide
- **THEN** exercises and navigation fit without horizontal page overflow

### Requirement: Equivalent practice exports

The build SHALL derive full bilingual practice JSON and Markdown from the same
source as HTML, retaining source context, canonical URLs and CC BY 4.0 attribution.
The manifest, agent indexes, full corpus and sitemap SHALL discover practice
additively without changing existing endpoint meanings.

#### Scenario: Retrieve the exercise collection

- **WHEN** an agent follows practice links in the manifest or discovery index
- **THEN** it receives the full localized exercises, checks, provenance and sources
