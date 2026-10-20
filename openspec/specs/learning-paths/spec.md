# learning-paths Specification

## Purpose
Help readers apply game-development references through short ordered learning paths that connect bilingual lessons, exercises and design-review lenses.

## Requirements

### Requirement: Four practical learning paths
The portal SHALL expose the four level design, balance, NPC behavior and game verification paths and a first-prototype path in RU and EN. Each SHALL contain ordered lessons, optional prerequisites, practice, lenses, an explicit deliverable and completion checks. A lesson SHALL be reusable across paths without copying its text.

#### Scenario: Start from the knowledge base
- **WHEN** a reader opens either language homepage
- **THEN** five path cards lead to static localized path pages with ordered lesson links and explicit completion outcomes

#### Scenario: Read without scripts
- **WHEN** a reader opens /game-dev-db/ru/learn/level-design/ without JavaScript
- **THEN** the description, prerequisites, complete lesson list and practice/lens links remain usable

### Requirement: Lesson sequence navigation
New lessons SHALL link to their containing path and adjacent lessons in its authored sequence. Language switching SHALL preserve the lesson or path identity. Links SHALL retain `/game-dev-db/` and trailing slashes.

#### Scenario: Continue a path
- **WHEN** a reader finishes the second lesson of a path
- **THEN** localized previous, next and containing-path links are available by keyboard

#### Scenario: Change path language
- **WHEN** a reader changes language on an NPC path page
- **THEN** the same path opens in the other language with equivalent lesson order

### Requirement: Attributed practical lesson content
Each new lesson SHALL explain one principle, its limits, an original illustrative example, common mistakes, observable checks and an actionable exercise or agent prompt. Both versions SHALL preserve meaning and checked primary-source links without reproducing external chapters.

#### Scenario: Apply a lesson
- **WHEN** a reader studies controlled randomness
- **THEN** an independently calculated example, assumptions and reproducible checks are present in both languages

### Requirement: Equivalent path exports and validation
The build SHALL publish path metadata at `/api/v1/learning-paths.json` and advertise it in the manifest. HTML and JSON SHALL share identities, sequence, localized descriptions and related references. Invalid or duplicate path identities, absent translations and dangling cross-references SHALL fail validation.

#### Scenario: Agent follows a path
- **WHEN** an agent fetches the manifest and path JSON
- **THEN** it receives localized canonical URLs, ordered lesson IDs, prerequisites, practice and lens IDs, update dates and license context

#### Scenario: Detect a broken reference
- **WHEN** a path points to a missing lesson, exercise or lens
- **THEN** content verification fails before publication

### Requirement: Path context and rationale parity
Lessons SHALL show navigation for each containing path. Context explaining an indirect practice link SHALL be authored in the path data and retained in HTML and exported records.

#### Scenario: Reuse a lesson
- **WHEN** a lesson belongs to two paths
- **THEN** both containing paths and their independent adjacent lesson sequences are available
