## ADDED Requirements

### Requirement: Bilingual knowledge catalog
The portal SHALL provide Russian and English catalogs and eight paired original lessons,
with stable lesson IDs, categories, sources, reading time and language metadata.

#### Scenario: Read a lesson without JavaScript
- **WHEN** a reader opens /game-dev-db/ru/lessons/game-loop/ with JavaScript disabled
- **THEN** the complete lesson and its source links are available as static HTML

#### Scenario: Change article language
- **WHEN** a reader switches from Russian to English on a lesson
- **THEN** the matching English lesson with the same stable ID opens

### Requirement: Local discovery
The catalog SHALL support combined text search and category filtering, result counts,
an empty result state and reset, while retaining all lesson links without JavaScript.

#### Scenario: Search within a category
- **WHEN** a reader selects a category and enters a query
- **THEN** only lessons matching both conditions are displayed

#### Scenario: No matching lessons
- **WHEN** a query matches no lesson
- **THEN** a useful empty state and reset control are displayed

### Requirement: Machine readable publishing
The build SHALL generate /llms.txt, /llms-full.txt, versioned manifest/lesson/resource JSON
and /content/{lang}/{id}.md from the same Markdown source, with canonical URLs and licenses.

#### Scenario: Agent retrieves a lesson
- **WHEN** an agent follows the manifest to a Markdown or JSON lesson
- **THEN** it receives the complete content, stable identity, language, provenance and attribution

### Requirement: Contribution and release contract
The repository SHALL include OpenSpec, contributor instructions, explicit code/content licenses,
schema validation, browser smoke tests and a GitHub Actions workflow deploying verified output.

#### Scenario: Invalid translation pair
- **WHEN** a contribution omits a matching language record
- **THEN** validation fails before deployment

#### Scenario: Publish on GitHub Pages
- **WHEN** the checked main branch deploys
- **THEN** nested routes, assets and machine exports resolve under /game-dev-db/
