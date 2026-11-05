# Spec Delta

## MODIFIED Requirements

### Requirement: Accessible practice discovery

The portal SHALL expose practice in navigation and on both home pages. The practice page SHALL combine full-content text search, topic and maximum-duration filters, result counts, empty state and reset, and provide keyboard-operable disclosures and stable anchors under /.

#### Scenario: Combine filters and recover
- **WHEN** a reader combines query, topic and duration and then resets a query with no results
- **THEN** only matching exercises appear first and all fourteen return after reset

#### Scenario: Read without JavaScript
- **WHEN** a reader opens either practice page with JavaScript disabled
- **THEN** all exercises and sources remain available through native disclosures

#### Scenario: Open an exercise in another language
- **WHEN** a reader opens an exercise anchor and switches languages
- **THEN** the corresponding language page retains and opens that exercise

#### Scenario: Use a narrow viewport
- **WHEN** a reader opens either language at 375 pixels wide
- **THEN** exercises and navigation fit without horizontal page overflow
