## ADDED Requirements

### Requirement: Grouped bilingual references
The portal SHALL expose the requested books, Platformer Toolkit and Curious Archive alongside additional curated books, channels and practice environments in its existing bilingual resources routes. It SHALL preserve existing resource records and group each record exactly once.

#### Scenario: Browse references without JavaScript
- **WHEN** a reader opens /game-dev-db/ru/resources/ with JavaScript disabled
- **THEN** books, channels, practice environments, research/courses and development documentation are readable as static groups with working jump links and external links

#### Scenario: Switch reference language
- **WHEN** a reader switches from Russian to English on the references page
- **THEN** /game-dev-db/en/resources/ displays the same resource identifiers and URLs with English descriptions and group labels

### Requirement: Attributed and actionable source records
Curated additions SHALL identify their authors or creators, explain their use, and state paid or platform access requirements where relevant. Practice suggestions SHALL be original editorial exercises. Recommendations SHALL NOT assert universal approval or fabricate reviews.

#### Scenario: Choose a paid creation game
- **WHEN** a reader encounters Super Mario Maker 2
- **THEN** the card identifies Nintendo Switch and paid access, links to Nintendo and offers an original level-design exercise

### Requirement: Compatible resource export
The resource export SHALL retain its current v1 envelope, identifiers and existing fields, including the existing kind enum. It MAY add an optional format and localized authors, access and practice metadata, which SHALL be validated when present.

#### Scenario: Retrieve the reference dataset
- **WHEN** an agent fetches /game-dev-db/api/v1/resources.json
- **THEN** the source records and optional localized metadata match the human-readable selection, without removing existing resource fields or changing the endpoint

#### Scenario: Reject incomplete optional metadata
- **WHEN** a resource contains an optional localized field without either language or an unsupported format
- **THEN** content validation fails before deployment
