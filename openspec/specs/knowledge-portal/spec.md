# knowledge-portal Specification

## Purpose
Help people building games with AI understand and apply game-development principles.
Provide readable Russian and English lessons and equivalent structured agent exports
from one attributed, openly licensed content source, with a verifiable contribution
and static publishing workflow.

## Requirements

### Requirement: Bilingual knowledge catalog
The portal SHALL provide Russian and English catalogs and eight paired original lessons,
with stable lesson IDs, categories, sources, reading time and language metadata.

#### Scenario: Read a lesson without JavaScript
- **WHEN** a reader opens /game-dev-db/ru/lessons/game-loop/ with JavaScript disabled
- **THEN** the complete lesson and its source links are available as static HTML

#### Scenario: Change article language
- **WHEN** a reader switches from Russian to English on a lesson
- **THEN** the matching English lesson with the same stable ID opens

### Requirement: Local discovery
The catalog SHALL support combined text search and category filtering, result counts,
an empty result state and reset, while retaining all lesson links without JavaScript.

#### Scenario: Search within a category
- **WHEN** a reader selects a category and enters a query
- **THEN** only lessons matching both conditions are displayed

#### Scenario: No matching lessons
- **WHEN** a query matches no lesson
- **THEN** a useful empty state and reset control are displayed

### Requirement: Machine readable publishing
The build SHALL generate /llms.txt, /llms-full.txt, versioned manifest/lesson/resource JSON
and /content/{lang}/{id}.md from the same Markdown source, with canonical URLs and licenses.

#### Scenario: Agent retrieves a lesson
- **WHEN** an agent follows the manifest to a Markdown or JSON lesson
- **THEN** it receives the complete content, stable identity, language, provenance and attribution

### Requirement: Contribution and release contract
The repository SHALL include OpenSpec, contributor instructions, explicit code/content licenses,
schema validation, browser smoke tests and a GitHub Actions workflow deploying verified output.

#### Scenario: Invalid translation pair
- **WHEN** a contribution omits a matching language record
- **THEN** validation fails before deployment

#### Scenario: Publish on GitHub Pages
- **WHEN** the checked main branch deploys
- **THEN** nested routes, assets and machine exports resolve under /game-dev-db/

### Requirement: Reader appearance preference
The portal SHALL offer localized, keyboard-accessible system, light and dark appearance choices on shared RU/EN pages. The initial appearance SHALL follow the system. An explicit choice SHALL persist across reloads, internal navigation and language changes when local storage is available. Unavailable storage SHALL NOT prevent switching or reading.

#### Scenario: Follow system appearance
- **WHEN** a reader has no saved choice or selects system appearance
- **THEN** the site follows the current system appearance and subsequent system changes

#### Scenario: Keep an explicit choice
- **WHEN** a reader selects dark appearance with a light system preference, reloads or follows a lesson or language link under /game-dev-db/
- **THEN** the site uses dark appearance from the first rendered frame and shows the corresponding selected control

#### Scenario: Operate with keyboard and unavailable storage
- **WHEN** a reader uses the localized theme controls with the keyboard while local storage access fails
- **THEN** the appearance changes for the current page, the selected control is announced and reading and navigation remain usable

### Requirement: Consistent light and dark reading
The portal SHALL use readable matching colors for navigation, text, cards, forms, callouts, diagrams and standalone pages in both appearances. It SHALL preserve keyboard focus visibility, narrow-screen layout and all static content. Without JavaScript it SHALL follow the system appearance and hide unavailable theme controls. Printed pages SHALL use a light appearance.

#### Scenario: Read every section in dark appearance
- **WHEN** a reader opens catalogs, lessons, mechanics, lenses, practice, references, agent guidance or the error page in dark appearance
- **THEN** content, controls and diagrams use the dark palette and remain readable without horizontal page overflow on a narrow screen

#### Scenario: Read without scripts
- **WHEN** JavaScript is disabled and the system appearance is dark
- **THEN** the static portal follows dark appearance, all content and navigation remain available and no inactive theme switch is shown

#### Scenario: Print a dark page
- **WHEN** a reader prints a page while dark appearance is selected
- **THEN** the print palette is light and the theme controls are omitted

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
