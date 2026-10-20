## ADDED Requirements

### Requirement: Attributed external mechanic catalogs
The portal SHALL publish `boss-fight-atlas` and `game-mechanics` catalogs in RU and EN covering the source indexes checked on 2026-10-20. Each mechanic SHALL retain a direct source-page link and source categories, with original concise explanations, explicit provenance and linked game references. Third-party media and article bodies SHALL remain at their original sites.

#### Scenario: Discover both source catalogs
- **WHEN** a reader opens the home page or mechanic index in either language
- **THEN** both catalogs appear and open under `/game-dev-db/{lang}/mechanics/{id}/` with the existing filters and disclosures

#### Scenario: Follow a game reference
- **WHEN** a reader expands a source-based mechanic, including without JavaScript
- **THEN** its source page and all recorded game-reference URLs are accessible as labeled links, with any unfinished source status identified

### Requirement: Preserve mechanic reference metadata in exports
Mechanic JSON and Markdown SHALL preserve all source-based mechanics, matching RU/EN identities, source links and game-reference labels and URLs. Optional reference metadata SHALL extend v1 additively. Source validation SHALL reject malformed reference links and incomplete translations.

#### Scenario: Read references through an agent
- **WHEN** an agent reads either new catalog from the existing v1 endpoint or Markdown export
- **THEN** it receives the same mechanic coverage and reference links available in static HTML, together with source provenance and external licensing context

#### Scenario: Reject an invalid reference
- **WHEN** a mechanic reference lacks a translated label or contains an invalid public HTTPS URL
- **THEN** content validation fails before publication
