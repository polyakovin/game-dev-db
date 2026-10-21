## MODIFIED Requirements

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
