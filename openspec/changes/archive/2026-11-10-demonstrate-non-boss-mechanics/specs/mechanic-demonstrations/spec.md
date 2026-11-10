## MODIFIED Requirements

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
