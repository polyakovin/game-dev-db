# Spec Delta

## ADDED Requirements

### Requirement: Reusable and understandable mechanic records
Active catalogs SHALL reuse identical family definitions through stable references. Every active family SHALL expose a meaningful bilingual definition before expansion. Primary placement and additional thematic categories SHALL remain distinguishable; filtering SHALL include all recorded categories.

#### Scenario: Correct a shared family
- **WHEN** a shared family definition is edited
- **THEN** both children and education publish the same correction without duplicated authored text and retain their existing URLs and anchors

#### Scenario: Filter a secondary category
- **WHEN** a reader selects Weather in Game Mechanics
- **THEN** Raindrops on screen remains discoverable despite its primary Camera placement

### Requirement: Explicit archival and addressable Markdown
Compatibility catalogs SHALL retain their original content and identities while all formats explicitly expose archived status and successors. Mechanic Markdown SHALL retain stable family, branch and variant IDs and canonical family links. Active and archived counts SHALL be distinguishable without changing existing total-count meanings.

#### Scenario: Retrieve the combined archive
- **WHEN** a reader or agent opens children-education in HTML, JSON or Markdown
- **THEN** the original 64 families and 749 variants remain available with archived status and links to children and education
