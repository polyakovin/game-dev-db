# Spec Delta

## ADDED Requirements

### Requirement: Dedicated RPG grind reference
The portal SHALL publish a bilingual `rpg-grind` catalog containing the 30 requested mechanics in six groups. Each mechanic SHALL describe a repeatable action, its progression goal and an illustrative design example. Notes SHALL explain overlapping classification layers and reward design. Released-game claims SHALL link to primary sources and remain distinct from hypothetical examples.

#### Scenario: Discover and filter RPG grind mechanics
- **WHEN** a reader opens the home page or mechanics index in either language
- **THEN** the RPG grind card links to `/game-dev-db/{lang}/mechanics/rpg-grind/`, where all 30 mechanics can be searched and filtered by the six groups

#### Scenario: Read without scripts and switch language
- **WHEN** a reader opens the RPG grind reference without JavaScript or on a narrow screen
- **THEN** all mechanics, notes and sources remain readable through keyboard-operable native disclosures and the language link opens the matching translated catalog

#### Scenario: Retrieve the complete RPG grind reference
- **WHEN** an agent follows the existing mechanics JSON or RPG grind Markdown endpoint
- **THEN** it receives all 30 mechanics with matching RU/EN identities, complete notes, checked sources, original provenance and the existing v1 license and canonical URL fields
