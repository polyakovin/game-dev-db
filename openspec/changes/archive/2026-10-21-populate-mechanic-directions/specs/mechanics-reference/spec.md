## MODIFIED Requirements

### Requirement: Complete direction structure with truthful availability
The mechanics index SHALL show all 329 directions in 32 groups in RU and EN with matching identities. A registered active standalone catalog SHALL be preferred; otherwise an explicit active catalog/family target SHALL link to that precise overview. Unresolved topics SHALL retain their localized development label without a dead link. Other active catalogs SHALL remain discoverable.

#### Scenario: Browse the complete structure
- **WHEN** a reader opens the mechanics index in either language
- **THEN** all 329 directions appear in their agreed groups, unfinished material has its localized label, and every active existing catalog remains linked under `/game-dev-db/`

#### Scenario: A prepared direction has no published material
- **WHEN** a direction has neither an active standalone catalog nor an existing active catalog/family target
- **THEN** it remains in development and does not pretend to contain a finished article

#### Scenario: Read a precise overview
- **WHEN** a direction resolves to an authored family inside a group catalog
- **THEN** its link opens that family anchor, its counts describe the targeted family and both languages retain the same direction and target identities

## ADDED Requirements

### Requirement: Substantive bilingual coverage of every direction
All directions SHALL resolve to a substantive existing topic-specific reference or an original RU/EN overview. New overviews SHALL contain a core action or decision loop, at least four explained variants, a hypothetical design scenario, a specific prototype check and attributed source context. Existing references SHALL remain available. Priority SHALL reflect cross-genre usefulness without claiming measured market share.

#### Scenario: Complete the agreed content map
- **WHEN** the content expansion is complete
- **THEN** all 329 directions resolve to substantive material and none requires the development label

#### Scenario: Assess an overview
- **WHEN** a reader opens a newly authored direction in either language
- **THEN** the definition, four or more variants, illustrative scenario, check and sources can be read without JavaScript under the GitHub Pages base path

### Requirement: Equivalent overview discovery and exports
New group catalogs and their direction families SHALL use the existing HTML, search, JSON, Markdown and knowledge export pipeline. Direction target metadata SHALL extend v1 additively. Invalid targets, incomplete localization or missing overview content SHALL fail validation before publication. Examples SHALL distinguish original design proposals from sourced observations and verified results.

#### Scenario: Retrieve the same overview with an agent
- **WHEN** an agent follows a ready direction or reads its underlying catalog in JSON or Markdown
- **THEN** it receives the complete same content and sources as the human page, with preserved identities and a valid canonical anchor

#### Scenario: Reject incomplete publication
- **WHEN** an authored overview lacks a translation, concrete variants, an example/check or an existing source association
- **THEN** content validation rejects publication rather than making the direction ready
