# mechanic-demonstrations Specification

## Purpose
Help readers understand the timing and spatial rules of a mechanic by watching and inspecting a short scene with the shared Boss Fight Atlas characters.

## Requirements

### Requirement: Demonstrations on matching mechanic pages
The portal SHALL show original, attributed scenes using the Boss Fight Atlas characters on the precision jumping, parrying, detection, independent movement and aim, and asymmetric roles cards in RU and EN. Boss Fight Atlas catalog cards SHALL retain their illustrated presentation without an embedded demonstration. Existing routes, screenshot examples and other mechanic cards SHALL remain available.

#### Scenario: Open an animated card
- **WHEN** a reader opens a supported mechanic page in either language
- **THEN** its demonstration appears with localized explanations and access to the original screenshot example

#### Scenario: Open a boss card
- **WHEN** a reader opens a card in the Boss Fight Atlas catalog
- **THEN** the existing screenshot is available without the animation player

### Requirement: Mechanic-specific visible rules
Each demonstration SHALL show an initial condition, an action and its outcome. Visible geometry and timing SHALL match the rule taught on that card. All movement and effects SHALL be deterministic at a chosen time, including a continuous or explicitly signaled loop return.

#### Scenario: Inspect a mechanic
- **WHEN** a reader seeks through a scene
- **THEN** they can see a jump land on a platform, a thrust meet a timed defense, a wall block sight, shots travel against the direction of movement, or a partner hold a bridge open, according to the card

#### Scenario: Inspect an active threat
- **WHEN** a reader seeks to the moment of contact in the parry scene
- **THEN** the thrust meets the defense plane during the parry window and rebounds

#### Scenario: Revisit a frame
- **WHEN** a reader seeks away from a timestamp and back
- **THEN** actor positions, poses and rule geometry match the earlier frame

### Requirement: Accessible playback and static reading
Demonstrations SHALL provide pause/play, restart, seeking, speed and phase selection with keyboard access. Reduced motion SHALL disable autoplay and hidden pages SHALL stop advancing. The static scene and explanation SHALL remain readable without JavaScript. Controls and actors SHALL remain reachable on narrow screens.

#### Scenario: Reduced motion or no scripts
- **WHEN** reduced motion is enabled or JavaScript is disabled
- **THEN** the reader sees an understandable still and explanation without automatic movement

#### Scenario: Pause and inspect
- **WHEN** a reader pauses, seeks or selects a phase
- **THEN** the complete scene freezes at the selected time and remains inspectable with the keyboard

### Requirement: Shared explanation and licensed artwork
Common v1 JSON and Markdown SHALL include the same localized demonstration rule, phases and attribution as HTML through additive fields. Artwork SHALL retain Boss Fight Atlas attribution and CC BY 4.0 notice; copied code SHALL retain MIT notices. Internal URLs SHALL use the site's path helpers.

#### Scenario: Read the machine export
- **WHEN** a consumer fetches a supported mechanic's common JSON or Markdown
- **THEN** the demonstration explanation and source are present alongside all previous content
