## MODIFIED Requirements

### Requirement: Bilingual knowledge catalog
The portal SHALL provide Russian and English catalogs and twenty paired original lessons,
with stable lesson IDs, categories, sources, reading time and language metadata.

#### Scenario: Read a lesson without JavaScript
- **WHEN** a reader opens /game-dev-db/ru/lessons/game-loop/ with JavaScript disabled
- **THEN** the complete lesson and its source links are available as static HTML

#### Scenario: Change article language
- **WHEN** a reader switches from Russian to English on a lesson
- **THEN** the matching English lesson with the same stable ID opens
