## MODIFIED Requirements

### Requirement: Compact mechanic pilot
The pilot SHALL show its short RU/EN definition, attributed real-game screenshot, categories and format links within the viewport. The illustration SHALL fill remaining space while retaining the marked scene and clue. Advice and extra examples SHALL appear when space permits. Default portrait, landscape and fullscreen views SHALL avoid page/internal scrolling and clipped text. Enlarged text SHALL retain natural flow. Other mechanics SHALL keep their current view.

#### Scenario: Inspect the pilot at standard sizes
- **WHEN** a reader opens either language at 1280×720, 1440×900, 375×667 or 390×844 using default text size
- **THEN** all displayed pilot content and navigation fit the viewport, the image loads locally, and its marked scene and target strip remain visible

#### Scenario: Resize a short or intermediate window
- **WHEN** the default viewport is resized through 320×500, 400×500, 516×314, 600×600, 700×500, 800×500 or 1024×600
- **THEN** required content remains visible without page/internal scrolling or clipping, and optional content appears only when it fits

#### Scenario: Use fullscreen and tall windows
- **WHEN** the default viewport is 319×849, 1510×900 or 1920×1080
- **THEN** the page uses the available main area and the illustration grows into its remaining space instead of leaving fixed external margins or a vacant lower half

#### Scenario: Enlarge text
- **WHEN** the reader enlarges the page to 200 percent
- **THEN** text and links remain readable and reachable in normal document flow without concealed content

#### Scenario: Reuse one mechanic from two categories
- **WHEN** a reader follows Search and discovery in children or education
- **THEN** both links open the same language-specific canonical page under /game-dev-db/ and that page links back to both catalog placements

#### Scenario: Retrieve the compact content
- **WHEN** an agent fetches the pilot JSON or Markdown
- **THEN** it receives the same concise definition, illustration metadata, advice and example links alongside the unchanged full taxonomy sections
