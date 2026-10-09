# game-design-lenses Specification

## Purpose
Provide readers and AI agents with a complete, attributed bilingual collection of game-design perspectives, original review prompts and equivalent static exports, so they can examine a game from several angles and plan a concrete playtest.

## Requirements

### Requirement: Complete attributed bilingual lens catalog
The portal SHALL provide 113 second-edition Schell perspectives, the third-edition additions numbered 67½, 93½ and 95½, and Deterding's separately attributed intrinsic skill atoms lens. Each entry SHALL have a stable identity, theme, source, original localized explanation and review questions. External entries SHALL NOT receive Schell numbers. External source material SHALL retain its rights.

#### Scenario: Browse a complete catalog
- **WHEN** a reader opens either language's lenses page
- **THEN** the same 117 identities are available with equivalent RU/EN content and author/edition attribution

#### Scenario: Reject incomplete coverage
- **WHEN** a source entry is missing, duplicated, incorrectly numbered, untranslated or refers to an unknown theme/source
- **THEN** canonical content validation fails before publication

### Requirement: Searchable accessible static reading
The portal SHALL expose lenses through navigation and home discovery under the GitHub Pages base path. Readers SHALL be able to filter by text, theme and source, reset filters, use keyboard disclosures and open stable anchor links. Every entry SHALL be readable without JavaScript and at narrow viewport widths.

#### Scenario: Filter and reset
- **WHEN** a reader searches a question and combines theme/source filters
- **THEN** matching entries remain visible, the result count updates and reset restores the full catalog

#### Scenario: Follow a lens anchor
- **WHEN** a reader opens a link to a lens id
- **THEN** the matching disclosure opens and its content becomes visible

#### Scenario: Read without JavaScript
- **WHEN** JavaScript is disabled
- **THEN** filters are hidden and all lenses can be opened with native disclosure controls

### Requirement: Compatible machine exports
The portal SHALL derive localized lens HTML, structured JSON and complete Markdown from the same dataset. New endpoints, manifest counts and discovery links SHALL extend v1 additively and preserve attribution, sources, language and license boundaries.

#### Scenario: Fetch lens references as an agent
- **WHEN** an agent follows the manifest or llms.txt lens link
- **THEN** JSON and Markdown contain all localized lens records with the same identities, explanations, questions and source references as the human pages
