## ADDED Requirements

### Requirement: Complete direction structure with truthful availability

The mechanics index SHALL show the agreed 329 directions in 32 groups in RU and EN with matching stable identities. Directions with a registered active catalog SHALL link to that catalog; all others SHALL display «В разработке» or “In development” without a dead article link. Other active catalogs SHALL remain discoverable.

#### Scenario: Browse the complete structure

- **WHEN** a reader opens the mechanics index in either language
- **THEN** all 329 directions appear in their agreed groups, unfinished material has its localized label, and every active existing catalog remains linked under `/game-dev-db/`

#### Scenario: A prepared direction has no published material

- **WHEN** a direction names a catalog that is not registered as active
- **THEN** it remains in development and does not pretend to contain a finished article

### Requirement: Combined ready-only direction discovery

The direction index SHALL combine text search, group filtering and a ready-only filter, initially showing the complete structure. It SHALL update counts, hide groups with no matches and provide an empty state and reset. Language switching SHALL preserve active discovery filters.

#### Scenario: Browse only available material

- **WHEN** a reader enables the ready-only filter and selects a group or enters a query
- **THEN** only ready matching materials appear and the count reflects all active filters

#### Scenario: Reset an empty search

- **WHEN** combined filters return no result and a reader activates reset
- **THEN** query, group and readiness filters clear and the complete index reappears

### Requirement: Static accessible direction index and compatible exports

Both direction indexes SHALL remain readable without JavaScript, fit a 375-pixel viewport and support keyboard controls. The build SHALL expose the same localized identities, readiness and valid ready URLs in an additive v1 JSON direction endpoint. Existing mechanic catalog exports and routes SHALL retain their meanings.

#### Scenario: Read the planned structure without scripts

- **WHEN** JavaScript is disabled
- **THEN** every direction and readiness label is visible in static HTML and all existing ready catalog links work

#### Scenario: Retrieve the structure programmatically

- **WHEN** an agent reads `/game-dev-db/api/v1/mechanic-directions.json`
- **THEN** both languages have equivalent group/topic identities and statuses, unfinished entries have no article URL, and ready entries link to existing catalog routes
