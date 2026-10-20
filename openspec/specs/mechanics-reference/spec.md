# mechanics-reference Specification

## Purpose
Help readers and agents discover, compare and reuse complete bilingual mechanic taxonomies with explicit design context and attributed examples.

## Requirements

### Requirement: Complete bilingual mechanic catalogs
The portal SHALL publish voice/audio, point-and-click, children's play and educational mechanic catalogs with matching RU/EN catalog, section, family, branch and variant identities. Catalogs SHALL retain all 324 and 355 original voice/audio and point-and-click variants. Education SHALL retain all 749 original combined-catalog variants with their IDs, design context and attributed sources.

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

### Requirement: Dedicated detective mechanic reference
The portal SHALL publish a `detective` catalog in RU and EN with matching identities, covering evidence gathering, testimony, reconstruction, reasoning, conclusions and investigation structure. Families SHALL include descriptions, variants and illustrative design examples. Notes SHALL distinguish observations from hypotheses and explain fair clues, feedback and practical validation. Released-game examples SHALL cite primary sources without revealing case solutions.

#### Scenario: Discover and search detective mechanics
- **WHEN** a reader follows the detective card from the home page or mechanics index in either language
- **THEN** `/game-dev-db/{lang}/mechanics/detective/` opens with section filtering, search and counts derived from the complete source

#### Scenario: Read and switch language without JavaScript
- **WHEN** JavaScript is disabled and a reader opens a detective family and follows the language link
- **THEN** the family remains readable through native disclosure and the matching translated catalog is available

#### Scenario: Retrieve complete detective exports
- **WHEN** an agent reads the mechanics JSON or detective Markdown endpoint
- **THEN** it receives the complete localized catalog with sources and the existing v1 license and canonical URL fields

### Requirement: Accurate mechanic catalog provenance
Mechanic exports SHALL describe each catalog's actual origin. An originally authored catalog SHALL NOT inherit the provenance of an imported design discussion. Previously published catalog provenance and identities SHALL remain compatible.

#### Scenario: Export an original catalog
- **WHEN** the detective catalog is exported in either language
- **THEN** its provenance identifies an original editorial classification supported by specific primary-source examples

#### Scenario: Export an imported catalog
- **WHEN** an existing imported catalog is exported
- **THEN** its existing provenance remains unchanged

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

### Requirement: Dedicated RPG grind reference
The portal SHALL publish a bilingual `rpg-grind` reference with at least 110 families and 330 variants across activities, progression goals, reward rules and pacing/cost constraints. It SHALL cover economy, exploration, companions, delegation and metaprogression as well as combat, crafting and gear. Descriptions, illustrative examples, coverage notes and sourced game observations SHALL stay aligned across languages. Published identities SHALL remain valid.

#### Scenario: Discover and filter RPG grind mechanics
- **WHEN** a reader opens the home page or mechanics index in either language
- **THEN** the RPG grind card links to `/game-dev-db/{lang}/mechanics/rpg-grind/`, where the expanded reference can be searched and filtered by explicit layer and subject groups

#### Scenario: Read without scripts and switch language
- **WHEN** a reader opens the RPG grind reference without JavaScript or on a narrow screen
- **THEN** all mechanics, notes and sources remain readable through keyboard-operable native disclosures and the language link opens the matching translated catalog

#### Scenario: Retrieve the complete RPG grind reference
- **WHEN** an agent follows the existing mechanics JSON or RPG grind Markdown endpoint
- **THEN** it receives every family and variant with matching RU/EN identities, complete notes, checked sources, original provenance and the existing v1 license and canonical URL fields

#### Scenario: Follow a previously published identity
- **WHEN** a reader follows any original RPG grind section, family or variant fragment
- **THEN** that identity still resolves within the expanded reference and its original mechanic remains available

#### Scenario: Check the scope of the reference
- **WHEN** a designer reads the coverage and combination notes
- **THEN** the reference distinguishes repeated actions, development goals, reward rules and constraints, explains their combinations and states its scope without claiming that every possible combination has been enumerated

### Requirement: Separate children's play and educational discovery
The portal SHALL expose `children` and `education` cards instead of the combined card on the home page and mechanics index. Each reference SHALL state its scope and link the other under `/game-dev-db/{lang}/mechanics/`. Children's play SHALL include non-instructional play; education SHALL cover learners beyond children.

#### Scenario: Discover the separate catalogs
- **WHEN** a reader browses the home page or mechanics index in RU or EN
- **THEN** both successor cards appear and open independently with search, section filters, keyboard disclosures and narrow layouts

### Requirement: Expanded play and instructional coverage
Each successor SHALL add at least ten distinct families beyond the original combined taxonomy, with bilingual descriptions, variants, hypothetical design examples, classification notes and attributed sources. Educational support SHALL be distinguished from player actions and SHALL NOT imply proven learning outcomes from game completion alone.

#### Scenario: Read the additions without JavaScript
- **WHEN** JavaScript is disabled and a reader opens either successor
- **THEN** all additions and sources remain available, including open-ended play in children and professional procedure practice in education

### Requirement: Compatible combined catalog migration
The original `children-education` HTML route and anchors, v1 JSON record and Markdown endpoint SHALL retain the original complete content and identifiers. Its HTML page SHALL prominently link both successors without JavaScript. New catalogs SHALL be added to JSON, Markdown, manifest, agent indexes and sitemap without a v1 schema change.

#### Scenario: Follow an existing link or agent endpoint
- **WHEN** a reader opens an original family or variant fragment, or an agent fetches its JSON or Markdown
- **THEN** the original 64 families and 749 variants remain available, while HTML offers both separate references

### Requirement: Complete direction structure with truthful availability

The mechanics index SHALL show the agreed 329 directions in 32 groups in RU and EN with matching stable identities. Directions with a registered active catalog SHALL link to that catalog; all others SHALL display «В разработке» or “In development” without a dead article link. Other active catalogs SHALL remain discoverable.

#### Scenario: Browse the complete structure

- **WHEN** a reader opens the mechanics index in either language
- **THEN** all 329 directions appear in their agreed groups, unfinished material has its localized label, and every active existing catalog remains linked under `/game-dev-db/`

#### Scenario: A prepared direction has no published material

- **WHEN** a direction names a catalog that is not registered as active
- **THEN** it remains in development and does not pretend to contain a finished article

### Requirement: Combined ready-only direction discovery

The direction index SHALL combine text search, group filtering and a ready-only filter, initially showing the complete structure. It SHALL update counts, hide groups with no matches and provide an empty state and reset. Language switching SHALL preserve active discovery filters.

#### Scenario: Browse only available material

- **WHEN** a reader enables the ready-only filter and selects a group or enters a query
- **THEN** only ready matching materials appear and the count reflects all active filters

#### Scenario: Reset an empty search

- **WHEN** combined filters return no result and a reader activates reset
- **THEN** query, group and readiness filters clear and the complete index reappears

### Requirement: Static accessible direction index and compatible exports

Both direction indexes SHALL remain readable without JavaScript, fit a 375-pixel viewport and support keyboard controls. The build SHALL expose the same localized identities, readiness and valid ready URLs in an additive v1 JSON direction endpoint. Existing mechanic catalog exports and routes SHALL retain their meanings.

#### Scenario: Read the planned structure without scripts

- **WHEN** JavaScript is disabled
- **THEN** every direction and readiness label is visible in static HTML and all existing ready catalog links work

#### Scenario: Retrieve the structure programmatically

- **WHEN** an agent reads `/game-dev-db/api/v1/mechanic-directions.json`
- **THEN** both languages have equivalent group/topic identities and statuses, unfinished entries have no article URL, and ready entries link to existing catalog routes
