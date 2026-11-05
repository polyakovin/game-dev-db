# Spec Delta

## MODIFIED Requirements

### Requirement: Typed direct and reverse relationships
The portal SHALL publish validated relationships that explain prerequisites, applications, practice and review. Both ends SHALL expose localized links and relationship labels without JavaScript. Shared sources SHALL expose their usage locations.

#### Scenario: Follow a mechanic application
- **WHEN** a reader follows a lesson's mechanic link under /
- **THEN** the exact family opens and links back to the explaining lesson with a meaningful label

#### Scenario: Reject an invalid relation
- **WHEN** a relationship references an unknown identity or language pair
- **THEN** source verification fails before publication

### Requirement: Cross-content search
The portal SHALL provide bilingual cross-content search covering active knowledge records, searchable definitions and aliases, type filters, result counts, empty state, reset and stable query URLs. Existing local catalog filters SHALL remain usable.

#### Scenario: Find a mechanic from the global search
- **WHEN** a reader searches for grind, a Russian synonym or text in a mechanic definition
- **THEN** matching mechanic results appear with their type, summary and exact canonical URL

#### Scenario: Read without scripts
- **WHEN** JavaScript is disabled on /ru/search/
- **THEN** localized content-type entry links and search guidance remain available
