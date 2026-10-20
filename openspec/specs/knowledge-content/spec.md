# knowledge-content Specification

## Purpose
Give readers and agents predictable bilingual knowledge records, meaningful connections, reusable sources and precise cross-content discovery.

## Requirements

### Requirement: Common knowledge record format
Every lesson, mechanic family, exercise, lens, learning path, resource and jam SHALL have a common localized record with stable identity, type, title, summary, editorial date or explicit unknown date, status, canonical URL, sources, ordered sections and relationships. HTML and individual JSON/Markdown exports SHALL preserve the same meaning.

#### Scenario: Retrieve different content types
- **WHEN** an agent retrieves a lesson, mechanic or exercise through the knowledge index
- **THEN** each record uses the same envelope and contains meaningful type-specific sections, source context and attribution

### Requirement: Typed direct and reverse relationships
The portal SHALL publish validated relationships that explain prerequisites, applications, practice and review. Both ends SHALL expose localized links and relationship labels without JavaScript. Shared sources SHALL expose their usage locations.

#### Scenario: Follow a mechanic application
- **WHEN** a reader follows a lesson's mechanic link under /game-dev-db/
- **THEN** the exact family opens and links back to the explaining lesson with a meaningful label

#### Scenario: Reject an invalid relation
- **WHEN** a relationship references an unknown identity or language pair
- **THEN** source verification fails before publication

### Requirement: Cross-content search
The portal SHALL provide bilingual cross-content search covering active knowledge records, searchable definitions and aliases, type filters, result counts, empty state, reset and stable query URLs. Existing local catalog filters SHALL remain usable.

#### Scenario: Find a mechanic from the global search
- **WHEN** a reader searches for grind, a Russian synonym or text in a mechanic definition
- **THEN** matching mechanic results appear with their type, summary and exact canonical URL

#### Scenario: Read without scripts
- **WHEN** JavaScript is disabled on /game-dev-db/ru/search/
- **THEN** localized content-type entry links and search guidance remain available

### Requirement: Precise attributed exports
The build SHALL publish lightweight per-language indexes and individual knowledge JSON/Markdown records with stable keys, source IDs and direct canonical URLs. Existing v1 endpoints SHALL remain compatible. Archives SHALL be explicitly marked and excluded from active discovery.

#### Scenario: Fetch only one record
- **WHEN** an agent follows an index record's JSON or Markdown URL
- **THEN** it receives only that record in the chosen language with full content, source and relationship context

#### Scenario: Compare source usage
- **WHEN** an agent reads the source registry
- **THEN** stable source identities list canonical URLs, available editorial dates and all corresponding usage keys without claiming unperformed verification
