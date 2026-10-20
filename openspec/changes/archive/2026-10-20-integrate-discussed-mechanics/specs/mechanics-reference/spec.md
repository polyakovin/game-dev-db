# Spec Delta

## ADDED Requirements

### Requirement: Discussed genre and design references
The portal SHALL publish complete bilingual catalogs for visual novels, dialogue, deck building, roguelike/roguelite, metroidvania, metroidbrainia, puzzles, engagement and retention, electronic devices and drawing. Every item in the audited discussion lists SHALL remain represented with equivalent meaning and relevant design notes. Overlapping classifications SHALL remain explicit.

#### Scenario: Browse all discussed design lists
- **WHEN** a reader opens any audited genre or design catalog in RU or EN
- **THEN** all listed entries, classification limits and source associations are available through the existing static catalog interface

### Requirement: Discussed hardware interaction references
The portal SHALL publish complete bilingual references for phone camera, microphone, motion, flashlight, haptics, touch, magnetometer, physical keyboard, mouse and trackpad interactions. Applicable hardware, recognition, calibration and platform restrictions SHALL remain available. Hypothetical applications SHALL NOT be presented as verified implementations.

#### Scenario: Read a hardware interaction without JavaScript
- **WHEN** a reader opens a hardware catalog under `/game-dev-db/{lang}/mechanics/` without JavaScript
- **THEN** its complete actions, applications and limitations are accessible through native disclosures, with the corresponding language link

### Requirement: Complete discussion additions and compatible discovery
The portal SHALL include the ten discussed perception ideas and later RPG grind additions, preserve previously published identities, and expose every new catalog in editorial order, search, JSON, Markdown, manifest, agent indexes and sitemap. A public coverage record SHALL identify covered topics and counts without reproducing private chats or local paths.

#### Scenario: Retrieve new and existing material
- **WHEN** a reader or agent follows a new catalog or an existing RPG grind link
- **THEN** the complete localized content and sources are available with stable identities, correct base-path URLs and existing v1 attribution fields
