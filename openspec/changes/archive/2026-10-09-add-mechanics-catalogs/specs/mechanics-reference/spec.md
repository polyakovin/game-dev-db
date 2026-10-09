# Spec Delta

## Purpose

Help readers and agents discover, compare and reuse complete bilingual mechanic taxonomies with explicit design context and attributed examples.

## ADDED Requirements

### Requirement: Complete bilingual mechanic catalogs
The portal SHALL publish voice/audio, point-and-click and children's educational mechanic catalogs with matching RU/EN catalog, section, family, branch and variant identities. Catalogs SHALL retain all 324, 355 and 749 original variants respectively, with design context and attributed sources.

#### Scenario: Browse a complete taxonomy
- **WHEN** a reader opens a catalog in either language
- **THEN** all original families and variants are available and counts derive from the content

#### Scenario: Switch catalog language
- **WHEN** a reader switches language on a mechanic catalog
- **THEN** the corresponding catalog opens with equivalent content and matching identities

### Requirement: Local mechanic discovery
The portal SHALL expose a mechanics index in navigation and on the home catalog. Each mechanic catalog SHALL combine text search and section filtering with result counts, an empty state, reset and disclosure controls.

#### Scenario: Search a variant within a section
- **WHEN** a reader selects a section and searches for text found in a variant
- **THEN** matching families open, only matching variants appear and counts reflect the combined filter

#### Scenario: Recover from no results
- **WHEN** a search has no matches and the reader activates reset
- **THEN** the query and section filter clear and the complete catalog returns

### Requirement: Accessible static catalog reading
All mechanic catalog content and sources SHALL be available in static HTML under `/game-dev-db/`, with keyboard-operable disclosures, narrow layout support and corresponding language links.

#### Scenario: Read without JavaScript
- **WHEN** a reader disables JavaScript and opens a catalog
- **THEN** every family can be expanded through native disclosure controls and its variants and sources remain readable

#### Scenario: Use a narrow viewport
- **WHEN** a reader opens the mechanics index or any catalog at 375 pixels wide
- **THEN** content fits without horizontal page overflow

### Requirement: Equivalent mechanic exports
The build SHALL generate `/api/v1/mechanics.json` and `/content/mechanics/{lang}/{id}.md` from the catalog source, including full content, stable identities, source links, canonical URLs and CC BY 4.0 attribution. Manifest, agent indexes and sitemap SHALL discover catalogs additively while existing exports remain compatible.

#### Scenario: Retrieve a taxonomy with an agent
- **WHEN** an agent follows the manifest mechanics endpoint or an individual Markdown link
- **THEN** it receives the complete language-specific taxonomy and its provenance, license and source context

#### Scenario: Reject incomplete localization
- **WHEN** a source variant has an empty RU or EN value or a duplicate identity
- **THEN** content validation fails before publication
