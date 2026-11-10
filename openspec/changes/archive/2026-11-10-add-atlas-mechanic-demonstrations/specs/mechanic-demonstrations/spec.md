## Purpose

Help readers understand the timing and spatial rules of a mechanic by watching and inspecting a short scene with the shared Boss Fight Atlas characters.

## ADDED Requirements

### Requirement: Demonstrations on matching mechanic pages
The portal SHALL show attributed boss/player demonstrations on the charge, sweep, ground-slam, summon and gap-volley mechanic cards in RU and EN. Existing routes, screenshot examples and other mechanic cards SHALL remain available.

#### Scenario: Open an animated card
- **WHEN** a reader opens a supported mechanic page in either language
- **THEN** its demonstration appears with localized explanations and access to the original screenshot example

### Requirement: Mechanic-specific visible rules
Each demonstration SHALL show its own warning, committed action and recovery, with threat geometry consistent with the displayed movement and a reachable player response. All movement and effects SHALL be deterministic at a chosen time, including a continuous or explicitly signaled loop return.

#### Scenario: Inspect an active threat
- **WHEN** a reader seeks through an attack
- **THEN** its active geometry agrees with its visible source and the demonstrated response clears the player's complete collision extent

#### Scenario: Revisit a frame
- **WHEN** a reader seeks away from a timestamp and back
- **THEN** actor positions, poses and threat geometry match the earlier frame

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
