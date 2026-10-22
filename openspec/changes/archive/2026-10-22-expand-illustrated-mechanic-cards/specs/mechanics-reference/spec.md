## ADDED Requirements

### Requirement: Canonical mechanic card discovery
All catalog placements of an authored illustrated mechanic SHALL link to its same language-specific canonical card under the GitHub Pages base path. Compact display titles SHALL not replace stable record identities, full taxonomy content or source attribution in machine exports. Archived compatibility records SHALL retain their prior behavior.

#### Scenario: Discover a card from multiple catalogs
- **WHEN** the same canonical mechanic appears in multiple active categories
- **THEN** each card link resolves to one shared illustrated page in the selected language

#### Scenario: Retrieve full content from a short card
- **WHEN** an agent follows its JSON or Markdown link
- **THEN** the compact presentation data and unchanged full reference sections and sources are available together

### Requirement: Bounded WebP illustrations
Published raster mechanic illustrations SHALL be valid compressed WebP files,
with neither dimension exceeding 1440 pixels and each file no larger than
250 KiB. Image metadata, crops and markers SHALL match the published dimensions.
Original source URLs, authorship and rights SHALL remain available.

#### Scenario: Prepare an oversized source screenshot
- **WHEN** an editor imports a larger PNG or JPEG source screenshot
- **THEN** the image pipeline produces a compressed WebP without upscaling, rebases the crop and preserves the marker positions and source attribution

#### Scenario: Reject an unoptimized illustration
- **WHEN** a published screenshot uses another raster format or exceeds a dimension or byte budget
- **THEN** canonical content verification reports the offending image and fails
