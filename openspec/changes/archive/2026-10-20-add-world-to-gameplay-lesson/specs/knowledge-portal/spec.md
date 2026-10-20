## MODIFIED Requirements

### Requirement: Bilingual knowledge catalog
The portal SHALL provide Russian and English catalogs and twenty-one paired original lessons,
with stable lesson IDs, categories, sources, reading time and language metadata.

#### Scenario: Read a lesson without JavaScript
- **WHEN** a reader opens /game-dev-db/ru/lessons/game-loop/ with JavaScript disabled
- **THEN** the complete lesson and its source links are available as static HTML

#### Scenario: Change article language
- **WHEN** a reader switches from Russian to English on a lesson
- **THEN** the matching English lesson with the same stable ID opens

#### Scenario: Turn a fictional world into gameplay
- **WHEN** a reader opens `/game-dev-db/{lang}/lessons/world-to-gameplay/` in either supported language
- **THEN** an original lesson explains a world rule, player action, consequence and scoped prototype with an illustrative example and observable checks
- **AND** it credits Yaropolk Rash / Yarr Rash and links the Iconic IP Guide as an influence, with matching attribution in generated Markdown and JSON
- **AND** it uses the existing lesson presentation and remains fully readable without JavaScript
