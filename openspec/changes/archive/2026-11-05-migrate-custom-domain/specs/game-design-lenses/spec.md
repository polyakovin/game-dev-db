# Spec Delta

## MODIFIED Requirements

### Requirement: Searchable accessible static reading
The portal SHALL expose lenses through navigation and home discovery under the configured site root. Readers SHALL be able to filter by text, theme and source, reset filters, use keyboard disclosures and open stable anchor links. Every entry SHALL be readable without JavaScript and at narrow viewport widths.

#### Scenario: Filter and reset
- **WHEN** a reader searches a question and combines theme/source filters
- **THEN** matching entries remain visible, the result count updates and reset restores the full catalog

#### Scenario: Follow a lens anchor
- **WHEN** a reader opens a link to a lens id
- **THEN** the matching disclosure opens and its content becomes visible

#### Scenario: Read without JavaScript
- **WHEN** JavaScript is disabled
- **THEN** filters are hidden and all lenses can be opened with native disclosure controls
