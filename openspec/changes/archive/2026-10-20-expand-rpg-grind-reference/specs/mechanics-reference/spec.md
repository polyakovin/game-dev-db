# Spec Delta

## MODIFIED Requirements

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
