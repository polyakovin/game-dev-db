# Spec Delta

## MODIFIED Requirements

### Requirement: Accessible static catalog reading
All mechanic catalog content and sources SHALL be available in static HTML under `/`, with keyboard-operable disclosures, narrow layout support and corresponding language links.

#### Scenario: Read without JavaScript
- **WHEN** a reader disables JavaScript and opens a catalog
- **THEN** every family can be expanded through native disclosure controls and its variants and sources remain readable

#### Scenario: Use a narrow viewport
- **WHEN** a reader opens the mechanics index or any catalog at 375 pixels wide
- **THEN** content fits without horizontal page overflow

### Requirement: Dedicated detective mechanic reference
The portal SHALL publish a `detective` catalog in RU and EN with matching identities, covering evidence gathering, testimony, reconstruction, reasoning, conclusions and investigation structure. Families SHALL include descriptions, variants and illustrative design examples. Notes SHALL distinguish observations from hypotheses and explain fair clues, feedback and practical validation. Released-game examples SHALL cite primary sources without revealing case solutions.

#### Scenario: Discover and search detective mechanics
- **WHEN** a reader follows the detective card from the home page or mechanics index in either language
- **THEN** `/{lang}/mechanics/detective/` opens with section filtering, search and counts derived from the complete source

#### Scenario: Read and switch language without JavaScript
- **WHEN** JavaScript is disabled and a reader opens a detective family and follows the language link
- **THEN** the family remains readable through native disclosure and the matching translated catalog is available

#### Scenario: Retrieve complete detective exports
- **WHEN** an agent reads the mechanics JSON or detective Markdown endpoint
- **THEN** it receives the complete localized catalog with sources and the existing v1 license and canonical URL fields

### Requirement: Attributed external mechanic catalogs
The portal SHALL publish `boss-fight-atlas` and `game-mechanics` catalogs in RU and EN covering the source indexes checked on 2026-10-20. Each mechanic SHALL retain a direct source-page link and source categories, with original concise explanations, explicit provenance and linked game references. Third-party media and article bodies SHALL remain at their original sites.

#### Scenario: Discover both source catalogs
- **WHEN** a reader opens the home page or mechanic index in either language
- **THEN** both catalogs appear and open under `/{lang}/mechanics/{id}/` with the existing filters and disclosures

#### Scenario: Follow a game reference
- **WHEN** a reader expands a source-based mechanic, including without JavaScript
- **THEN** its source page and all recorded game-reference URLs are accessible as labeled links, with any unfinished source status identified

### Requirement: Dedicated RPG grind reference
The portal SHALL publish a bilingual `rpg-grind` reference with at least 110 families and 330 variants across activities, progression goals, reward rules and pacing/cost constraints. It SHALL cover economy, exploration, companions, delegation and metaprogression as well as combat, crafting and gear. Descriptions, illustrative examples, coverage notes and sourced game observations SHALL stay aligned across languages. Published identities SHALL remain valid.

#### Scenario: Discover and filter RPG grind mechanics
- **WHEN** a reader opens the home page or mechanics index in either language
- **THEN** the RPG grind card links to `/{lang}/mechanics/rpg-grind/`, where the expanded reference can be searched and filtered by explicit layer and subject groups

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
The portal SHALL expose `children` and `education` cards instead of the combined card on the home page and mechanics index. Each reference SHALL state its scope and link the other under `/{lang}/mechanics/`. Children's play SHALL include non-instructional play; education SHALL cover learners beyond children.

#### Scenario: Discover the separate catalogs
- **WHEN** a reader browses the home page or mechanics index in RU or EN
- **THEN** both successor cards appear and open independently with search, section filters, keyboard disclosures and narrow layouts

### Requirement: Complete direction structure with truthful availability
The mechanics index SHALL show all 329 directions in 32 groups in RU and EN with matching identities. A registered active standalone catalog SHALL be preferred; otherwise an explicit active catalog/family target SHALL link to that precise overview. Unresolved topics SHALL retain their localized development label without a dead link. Other active catalogs SHALL remain discoverable.

#### Scenario: Browse the complete structure
- **WHEN** a reader opens the mechanics index in either language
- **THEN** all 329 directions appear in their agreed groups, unfinished material has its localized label, and every active existing catalog remains linked under `/`

#### Scenario: A prepared direction has no published material
- **WHEN** a direction has neither an active standalone catalog nor an existing active catalog/family target
- **THEN** it remains in development and does not pretend to contain a finished article

#### Scenario: Read a precise overview
- **WHEN** a direction resolves to an authored family inside a group catalog
- **THEN** its link opens that family anchor, its counts describe the targeted family and both languages retain the same direction and target identities

### Requirement: Static accessible direction index and compatible exports

Both direction indexes SHALL remain readable without JavaScript, fit a 375-pixel viewport and support keyboard controls. The build SHALL expose the same localized identities, readiness and valid ready URLs in an additive v1 JSON direction endpoint. Existing mechanic catalog exports and routes SHALL retain their meanings.

#### Scenario: Read the planned structure without scripts

- **WHEN** JavaScript is disabled
- **THEN** every direction and readiness label is visible in static HTML and all existing ready catalog links work

#### Scenario: Retrieve the structure programmatically

- **WHEN** an agent reads `/api/v1/mechanic-directions.json`
- **THEN** both languages have equivalent group/topic identities and statuses, unfinished entries have no article URL, and ready entries link to existing catalog routes

### Requirement: Discussed hardware interaction references
The portal SHALL publish complete bilingual references for phone camera, microphone, motion, flashlight, haptics, touch, magnetometer, physical keyboard, mouse and trackpad interactions. Applicable hardware, recognition, calibration and platform restrictions SHALL remain available. Hypothetical applications SHALL NOT be presented as verified implementations.

#### Scenario: Read a hardware interaction without JavaScript
- **WHEN** a reader opens a hardware catalog under `/{lang}/mechanics/` without JavaScript
- **THEN** its complete actions, applications and limitations are accessible through native disclosures, with the corresponding language link

### Requirement: Explicit mechanic section groups
The portal SHALL display authored section groups as localized subtitles with concise child section names in the contents, article and section selector. Ungrouped catalogs SHALL retain their flat presentation. Group labels SHALL be available without JavaScript, appear in Markdown and additive v1 JSON metadata, and preserve existing identities and URLs.

#### Scenario: Read grouped RPG grind sections
- **WHEN** a reader opens `/{lang}/mechanics/rpg-grind/` in either language, including without JavaScript or at a narrow width
- **THEN** activities, goals, rewards and constraints each appear once as a group subtitle in the contents, and their child links use section names without repeating that subtitle
- **AND** those links resolve to the existing section anchors with the same hierarchy in the article

#### Scenario: Filter grouped sections
- **WHEN** a reader selects a section within a group or searches for a mechanic
- **THEN** the selector retains group context, empty article groups are hidden, reset restores every group, and current-section highlighting still follows the visible sections

#### Scenario: Retrieve grouped exports
- **WHEN** an agent fetches the mechanics v1 JSON or RPG grind Markdown
- **THEN** section IDs and all mechanic identities remain stable, JSON sections retain their localized group labels, and Markdown presents group headings above shorter section headings

#### Scenario: Reject an incomplete group translation
- **WHEN** an authored section group lacks either language
- **THEN** content validation rejects it

### Requirement: Substantive bilingual coverage of every direction
All directions SHALL resolve to a substantive existing topic-specific reference or an original RU/EN overview. New overviews SHALL contain a core action or decision loop, at least four explained variants, a hypothetical design scenario, a specific prototype check and attributed source context. Existing references SHALL remain available. Priority SHALL reflect cross-genre usefulness without claiming measured market share.

#### Scenario: Complete the agreed content map
- **WHEN** the content expansion is complete
- **THEN** all 329 directions resolve to substantive material and none requires the development label

#### Scenario: Assess an overview
- **WHEN** a reader opens a newly authored direction in either language
- **THEN** the definition, four or more variants, illustrative scenario, check and sources can be read without JavaScript under the configured site root

### Requirement: Canonical mechanic card discovery
All catalog placements of an authored illustrated mechanic SHALL link to its same language-specific canonical card under the configured site root. Compact display titles SHALL not replace stable record identities, full taxonomy content or source attribution in machine exports. Archived compatibility records SHALL retain their prior behavior.

#### Scenario: Discover a card from multiple catalogs
- **WHEN** the same canonical mechanic appears in multiple active categories
- **THEN** each card link resolves to one shared illustrated page in the selected language

#### Scenario: Retrieve full content from a short card
- **WHEN** an agent follows its JSON or Markdown link
- **THEN** the compact presentation data and unchanged full reference sections and sources are available together
