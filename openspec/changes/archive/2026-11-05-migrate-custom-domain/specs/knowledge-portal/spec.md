# Spec Delta

## MODIFIED Requirements

### Requirement: Bilingual knowledge catalog
The portal SHALL provide Russian and English catalogs and twenty-one paired original lessons,
with stable lesson IDs, categories, sources, reading time and language metadata.

#### Scenario: Read a lesson without JavaScript
- **WHEN** a reader opens /ru/lessons/game-loop/ with JavaScript disabled
- **THEN** the complete lesson and its source links are available as static HTML

#### Scenario: Change article language
- **WHEN** a reader switches from Russian to English on a lesson
- **THEN** the matching English lesson with the same stable ID opens

#### Scenario: Turn a fictional world into gameplay
- **WHEN** a reader opens `/{lang}/lessons/world-to-gameplay/` in either supported language
- **THEN** an original lesson explains a world rule, player action, consequence and scoped prototype with an illustrative example and observable checks
- **AND** it credits Yaropolk Rash / Yarr Rash and links the Iconic IP Guide as an influence, with matching attribution in generated Markdown and JSON
- **AND** it uses the existing lesson presentation and remains fully readable without JavaScript

### Requirement: Contribution and release contract
The repository SHALL include OpenSpec, contributor instructions, explicit code/content licenses,
schema validation, browser smoke tests and a GitHub Actions workflow deploying verified output.

#### Scenario: Invalid translation pair
- **WHEN** a contribution omits a matching language record
- **THEN** validation fails before deployment

#### Scenario: Publish on GitHub Pages
- **WHEN** the checked main branch deploys
- **THEN** nested routes, assets and machine exports resolve under /

### Requirement: Reader appearance preference
The portal SHALL offer localized, keyboard-accessible system, light and dark appearance choices on shared RU/EN pages. The initial appearance SHALL follow the system. An explicit choice SHALL persist across reloads, internal navigation and language changes when local storage is available. Unavailable storage SHALL NOT prevent switching or reading.

#### Scenario: Follow system appearance
- **WHEN** a reader has no saved choice or selects system appearance
- **THEN** the site follows the current system appearance and subsequent system changes

#### Scenario: Keep an explicit choice
- **WHEN** a reader selects dark appearance with a light system preference, reloads or follows a lesson or language link under /
- **THEN** the site uses dark appearance from the first rendered frame and shows the corresponding selected control

#### Scenario: Operate with keyboard and unavailable storage
- **WHEN** a reader uses the localized theme controls with the keyboard while local storage access fails
- **THEN** the appearance changes for the current page, the selected control is announced and reading and navigation remain usable

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
- **WHEN** a reader uses a TOC link by keyboard or opens a section or nested mechanic anchor under `/`
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

### Requirement: Editorial importance ordering
The portal SHALL order catalog groups and their entries by editorial importance: foundational decisions and broadly useful techniques before specialized variations. This SHALL cover lessons, mechanics at every tree level, lenses, practice and references. Procedural steps SHALL retain execution order. Jam events SHALL retain deadline order, followed by discovery calendars ranked by usefulness.

#### Scenario: Browse foundational material first
- **WHEN** a reader opens any catalog under `/` in either language
- **THEN** foundational groups precede specialized groups and each group presents its most useful material first, including without JavaScript

#### Scenario: Inspect a nested mechanic
- **WHEN** a reader opens a mechanic section, family or branch
- **THEN** its children follow the shared editorial order and retain their identities and complete content

#### Scenario: Follow a procedure or choose a jam
- **WHEN** a reader follows exercise steps or browses current jam events
- **THEN** the steps retain execution order and events retain open-first deadline ordering

## ADDED Requirements

### Requirement: Custom-domain publishing
The portal SHALL publish at https://gamemechanics.pro/ with root-relative navigation and assets, matching canonical and language alternate URLs, and unchanged relative v1 endpoints and stable content identities. The host-root robots policy SHALL allow public crawling and advertise the production sitemap.

#### Scenario: Open the domain root
- **WHEN** a reader opens https://gamemechanics.pro/ without JavaScript
- **THEN** the language redirect and manual language links lead to /ru/ and /en/ without the former project prefix

#### Scenario: Retrieve and cite on the custom domain
- **WHEN** an agent reads the sitemap, manifest, language indexes or a lesson export
- **THEN** internal URLs use https://gamemechanics.pro/ and canonical HTML, JSON and Markdown identify the same content

#### Scenario: Preserve authored knowledge connections
- **WHEN** a lesson links to another lesson, exercise or lens at the domain root
- **THEN** static HTML links resolve and its typed knowledge relationships retain the target identities
