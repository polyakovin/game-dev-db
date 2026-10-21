## MODIFIED Requirements

### Requirement: Focused static knowledge pages
Active mechanics, exercises and lenses SHALL have standalone RU/EN HTML pages under `/game-dev-db/{lang}/knowledge/{type}/{id}/`. Pages SHALL preserve sources, provenance, licenses and collection navigation. An authored compact mechanic view SHALL show its concise content while linking full taxonomy in collections and machine formats; other pages SHALL retain full authored sections. Existing catalog routes and anchors SHALL remain usable.

#### Scenario: Read and cite one mechanic without scripts
- **WHEN** a reader opens a mechanic from its catalog or the common index with JavaScript disabled
- **THEN** its authored view is readable, full detail remains available through linked formats and collections, and its canonical URL matches the index, JSON and Markdown

#### Scenario: Open an existing catalog fragment
- **WHEN** a reader follows an old exercise, lens or mechanic catalog fragment
- **THEN** the original entry remains present and offers a link to its standalone page

## ADDED Requirements

### Requirement: Compact mechanic pilot
The Search and discovery pilot SHALL present a short definition, an attributed real-game screenshot with explanatory markers, advice and example links in RU/EN. Its default view SHALL fit desktop and phone viewports without page or internal scrolling, clipping or collapsed content. Enlarged text SHALL remain readable through natural flow. Other mechanics SHALL keep their current presentation pending review.

#### Scenario: Inspect the pilot at standard sizes
- **WHEN** a reader opens either language at 1280×720, 1440×900, 375×667 or 390×844 using default text size
- **THEN** all pilot content and navigation fit the viewport, the image loads locally, and its marked scene and target strip remain visible

#### Scenario: Reuse one mechanic from two categories
- **WHEN** a reader follows Search and discovery in children or education
- **THEN** both links open the same language-specific canonical page under /game-dev-db/ and that page links back to both catalog placements

#### Scenario: Retrieve the compact content
- **WHEN** an agent fetches the pilot JSON or Markdown
- **THEN** it receives the same concise definition, illustration metadata, advice and example links alongside the unchanged full taxonomy sections
