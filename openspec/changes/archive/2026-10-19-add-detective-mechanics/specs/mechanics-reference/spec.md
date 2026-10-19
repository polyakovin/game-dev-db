# Spec Delta

## ADDED Requirements

### Requirement: Dedicated detective mechanic reference
The portal SHALL publish a `detective` catalog in RU and EN with matching identities, covering evidence gathering, testimony, reconstruction, reasoning, conclusions and investigation structure. Families SHALL include descriptions, variants and illustrative design examples. Notes SHALL distinguish observations from hypotheses and explain fair clues, feedback and practical validation. Released-game examples SHALL cite primary sources without revealing case solutions.

#### Scenario: Discover and search detective mechanics
- **WHEN** a reader follows the detective card from the home page or mechanics index in either language
- **THEN** `/game-dev-db/{lang}/mechanics/detective/` opens with section filtering, search and counts derived from the complete source

#### Scenario: Read and switch language without JavaScript
- **WHEN** JavaScript is disabled and a reader opens a detective family and follows the language link
- **THEN** the family remains readable through native disclosure and the matching translated catalog is available

#### Scenario: Retrieve complete detective exports
- **WHEN** an agent reads the mechanics JSON or detective Markdown endpoint
- **THEN** it receives the complete localized catalog with sources and the existing v1 license and canonical URL fields

### Requirement: Accurate mechanic catalog provenance
Mechanic exports SHALL describe each catalog's actual origin. An originally authored catalog SHALL NOT inherit the provenance of an imported design discussion. Previously published catalog provenance and identities SHALL remain compatible.

#### Scenario: Export an original catalog
- **WHEN** the detective catalog is exported in either language
- **THEN** its provenance identifies an original editorial classification supported by specific primary-source examples

#### Scenario: Export an imported catalog
- **WHEN** an existing imported catalog is exported
- **THEN** its existing provenance remains unchanged
