## ADDED Requirements

### Requirement: Editorial importance ordering
The portal SHALL order catalog groups and their entries by editorial importance: foundational decisions and broadly useful techniques before specialized variations. This SHALL cover lessons, mechanics at every tree level, lenses, practice and references. Procedural steps SHALL retain execution order. Jam events SHALL retain deadline order, followed by discovery calendars ranked by usefulness.

#### Scenario: Browse foundational material first
- **WHEN** a reader opens any catalog under `/game-dev-db/` in either language
- **THEN** foundational groups precede specialized groups and each group presents its most useful material first, including without JavaScript

#### Scenario: Inspect a nested mechanic
- **WHEN** a reader opens a mechanic section, family or branch
- **THEN** its children follow the shared editorial order and retain their identities and complete content

#### Scenario: Follow a procedure or choose a jam
- **WHEN** a reader follows exercise steps or browses current jam events
- **THEN** the steps retain execution order and events retain open-first deadline ordering

### Requirement: Equivalent localized content order
HTML, navigation, filter options, JSON and Markdown SHALL share editorial order for equivalent content in RU and EN. Ordering SHALL preserve identifiers, anchors, source numbers, attribution, counts and existing v1 fields. Unranked additions SHALL follow ranked entries without disappearing; invalid editorial references and duplicate ranks SHALL fail content validation.

#### Scenario: Switch language or representation
- **WHEN** a reader switches language or an agent fetches a catalog export
- **THEN** equivalent groups and entries occur in the same order as the human page with all content and stable links preserved

#### Scenario: Catch invalid priorities
- **WHEN** an ordering list repeats an identity or refers to absent content
- **THEN** content validation reports the invalid list before publication
