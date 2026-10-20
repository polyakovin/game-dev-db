## MODIFIED Requirements

### Requirement: Complete bilingual mechanic catalogs
The portal SHALL publish voice/audio, point-and-click, children's play and educational mechanic catalogs with matching RU/EN catalog, section, family, branch and variant identities. Catalogs SHALL retain all 324 and 355 original voice/audio and point-and-click variants. Education SHALL retain all 749 original combined-catalog variants with their IDs, design context and attributed sources.

#### Scenario: Browse a complete taxonomy
- **WHEN** a reader opens a catalog in either language
- **THEN** all original families and variants are available and counts derive from the content

#### Scenario: Switch catalog language
- **WHEN** a reader switches language on a mechanic catalog
- **THEN** the corresponding catalog opens with equivalent content and matching identities

## ADDED Requirements

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
