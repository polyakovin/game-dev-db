## ADDED Requirements

### Requirement: Canonical mechanic card discovery
All catalog placements of an authored illustrated mechanic SHALL link to its same language-specific canonical card under the GitHub Pages base path. Compact display titles SHALL not replace stable record identities, full taxonomy content or source attribution in machine exports. Archived compatibility records SHALL retain their prior behavior.

#### Scenario: Discover a card from multiple catalogs
- **WHEN** the same canonical mechanic appears in multiple active categories
- **THEN** each card link resolves to one shared illustrated page in the selected language

#### Scenario: Retrieve full content from a short card
- **WHEN** an agent follows its JSON or Markdown link
- **THEN** the compact presentation data and unchanged full reference sections and sources are available together
