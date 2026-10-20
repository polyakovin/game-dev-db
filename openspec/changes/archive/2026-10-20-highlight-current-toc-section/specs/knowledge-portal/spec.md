## ADDED Requirements

### Requirement: Current section in reading navigation
With JavaScript enabled, lesson and mechanic-reference TOCs SHALL mark one visible
section using accent styling, a vertical marker and `aria-current="location"`.
Tracking SHALL follow scrolling, anchor navigation and content resizing without
changing keyboard focus or the URL during ordinary scrolling.

#### Scenario: Reach either end of the article
- **WHEN** the reader is above the first section or reaches the document bottom
- **THEN** the first or last visible section respectively is current, including a short final section

#### Scenario: Read a long section and scroll backward
- **WHEN** a reader scrolls through a long expanded section and back to an earlier section
- **THEN** the active TOC link matches the section at the reading line, even while its heading is above the viewport

#### Scenario: Follow an anchor or direct link
- **WHEN** a reader uses a TOC link by keyboard or opens a section or nested mechanic anchor under `/game-dev-db/`
- **THEN** native navigation succeeds and the containing linked section becomes current

#### Scenario: Reflow and filter content
- **WHEN** a reader expands mechanics or filters out sections
- **THEN** the current link follows the resulting visible content and never marks a hidden section, including before any scrolling

#### Scenario: Read in either language or appearance
- **WHEN** a reader uses a Russian or English lesson or mechanic reference in light or dark appearance
- **THEN** the current link has the same accessible behavior and narrow layouts retain their existing fit

#### Scenario: Navigate without scripts
- **WHEN** a reader disables JavaScript
- **THEN** the complete content and native TOC fragment links remain usable without a misleading current marker
