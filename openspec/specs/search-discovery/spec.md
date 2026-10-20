# search-discovery Specification

## Purpose
Help search engines and AI agents discover and cite focused bilingual game-development knowledge while preserving catalog navigation and source attribution.

## Requirements

### Requirement: Focused static knowledge pages
Active mechanics, exercises and lenses SHALL have standalone RU/EN HTML pages under `/game-dev-db/{lang}/knowledge/{type}/{id}/`. They SHALL preserve authored sections, sources, provenance and licenses from their common records, with corresponding language links and navigation to original collections. Existing catalog routes and anchors SHALL remain usable.

#### Scenario: Read and cite one mechanic without scripts
- **WHEN** a reader opens a mechanic from its catalog or the common index with JavaScript disabled
- **THEN** the complete individual record is readable and its canonical URL matches the index, JSON and Markdown

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
