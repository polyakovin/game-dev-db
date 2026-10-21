# search-discovery Specification

## Purpose
Help search engines and AI agents discover and cite focused bilingual game-development knowledge while preserving catalog navigation and source attribution.

## Requirements

### Requirement: Focused static knowledge pages
Active mechanics, exercises and lenses SHALL have standalone RU/EN HTML pages under `/game-dev-db/{lang}/knowledge/{type}/{id}/`. Pages SHALL preserve sources, provenance, licenses and collection navigation. An authored compact mechanic view SHALL show its concise content while linking full taxonomy in collections and machine formats; other pages SHALL retain full authored sections. Existing catalog routes and anchors SHALL remain usable.

#### Scenario: Read and cite one mechanic without scripts
- **WHEN** a reader opens a mechanic from its catalog or the common index with JavaScript disabled
- **THEN** its authored view is readable, full detail remains available through linked formats and collections, and its canonical URL matches the index, JSON and Markdown

#### Scenario: Open an existing catalog fragment
- **WHEN** a reader follows an old exercise, lens or mechanic catalog fragment
- **THEN** the original entry remains present and offers a link to its standalone page

### Requirement: Accurate discovery metadata
Focused pages SHALL expose a unique title, description, self-canonical URL, matching RU/EN alternate links, individual JSON/Markdown alternates and structured metadata consistent with visible content. Editorial dates SHALL retain authored values; missing dates SHALL remain omitted. Site pages SHALL link the agent entry point.

#### Scenario: Inspect a focused page
- **WHEN** an agent fetches an individual page
- **THEN** metadata identifies that record, its formats, real sources and license without an invented publication or verification date

### Requirement: Complete canonical sitemap
The sitemap SHALL contain unique indexable HTML URLs including active standalone records, language alternates and known editorial last-modification dates. It SHALL exclude archived catalogs and machine exports while retaining their accessible compatibility routes.

#### Scenario: Discover a shared family
- **WHEN** a mechanic has multiple catalog placements
- **THEN** the sitemap contains its single canonical page per language and both language alternates resolve

### Requirement: Bounded agent retrieval
Agent guidance and indexes SHALL describe how to select a language and topic, fetch individual records and preserve citations. A public reusable repository instruction example SHALL support deliberate adoption without claiming automatic installation or guaranteed discovery.

#### Scenario: Connect a game project
- **WHEN** a developer follows the agent integration example
- **THEN** the agent can locate the chosen language index and fetch one attributed JSON or Markdown record without fetching the full corpus

### Requirement: Reproducible discovery verification
The project SHALL provide a public-URL audit and paired RU/EN discovery questions with explicit unevaluated results. Operations documentation SHALL distinguish site deployment, search indexing and AI citation, and record account-dependent webmaster steps without claiming unperformed registration or submission.

#### Scenario: Check the production deployment
- **WHEN** the audit runs against the published site
- **THEN** it checks entry points, sitemap and representative focused pages, records observed failures and exits unsuccessfully for broken required endpoints

### Requirement: Discovery without visitor tracking
Discovery improvements SHALL NOT connect external analytics services, visitor counters or tracking scripts. The public-URL audit SHALL run only when explicitly invoked and SHALL NOT collect visitor behavior. External webmaster accounts SHALL remain outside this release.

#### Scenario: Read a focused page
- **WHEN** a reader opens a focused page in either language
- **THEN** its discovery metadata and machine formats work without an analytics integration or visitor tracking request

### Requirement: Compact mechanic pilot
The pilot SHALL keep its short RU/EN definition and marked real-game screenshot visible without scrolling or clipped text. Secondary content SHALL appear only when space permits; the smallest windows SHALL show only the title, definition and image with tooltips. The illustration SHALL use available space. Enlarged text SHALL keep natural flow; full attribution and content SHALL remain in metadata and machine exports. Other mechanics SHALL retain their current view.

#### Scenario: Inspect the pilot at standard sizes
- **WHEN** a reader opens either language at 1280×720, 1440×900, 375×667 or 390×844 using default text size
- **THEN** all displayed pilot content and navigation fit the viewport, the image loads locally, and its marked scene and target strip remain visible

#### Scenario: Resize a short or intermediate window
- **WHEN** the default viewport is resized through 320×500, 400×500, 516×314, 600×600, 700×500, 800×500 or 1024×600
- **THEN** required content remains visible without page/internal scrolling or clipping, and secondary content appears only when it fits

#### Scenario: Read in the smallest window
- **WHEN** either language opens at 298×314 using default text size
- **THEN** only the title, short definition and screenshot with two working marker tooltips are visible, the text flows around the illustration, and the page fits without scrolling
- **AND** enlarging the window restores controls, categories, captions, attribution and format links

#### Scenario: Read minimal content without JavaScript
- **WHEN** a reader opens the minimal view without JavaScript
- **THEN** the title, definition and screenshot remain visible, and the marker explanations remain available through native titles

#### Scenario: Use fullscreen and tall windows
- **WHEN** the default viewport is 319×849, 1510×900 or 1920×1080
- **THEN** the page uses the available main area and the illustration grows into its remaining space instead of leaving fixed external margins or a vacant lower half

#### Scenario: Enlarge text
- **WHEN** the reader enlarges the page to 200 percent
- **THEN** text and links remain readable and reachable in normal document flow without concealed content

#### Scenario: Reuse one mechanic from two categories
- **WHEN** a reader follows Search and discovery in children or education
- **THEN** both links open the same language-specific canonical page under /game-dev-db/ and that page links back to both catalog placements when space permits

#### Scenario: Retrieve the compact content
- **WHEN** an agent fetches the pilot JSON or Markdown
- **THEN** it receives the same concise definition, illustration metadata, advice and example links alongside the unchanged full taxonomy sections
