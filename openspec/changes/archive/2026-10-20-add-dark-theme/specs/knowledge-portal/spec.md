# Spec Delta

## ADDED Requirements

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
