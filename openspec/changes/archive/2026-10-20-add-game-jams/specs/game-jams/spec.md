## ADDED Requirements

### Requirement: Bilingual jam discovery

The portal SHALL provide RU/EN jam pages under `/game-dev-db/{lang}/jams/`, linked from shared navigation and the home page, with matching language switching. Pages SHALL provide official discovery calendars separately from dated events and preserve keyboard access and narrow layouts in both themes.

#### Scenario: Find and enter a jam
- **WHEN** a reader opens either language's jam page
- **THEN** they can read event dates and entry conditions and follow the official participation link

#### Scenario: Switch language
- **WHEN** the reader switches language on the jam page
- **THEN** the matching jam page opens with the same event identities

### Requirement: Deadline-driven visibility

An event SHALL be current exactly while its submission deadline is later than the comparison time. Before its start it SHALL be upcoming; from its start until its deadline it SHALL be open. Current events SHALL sort open first, by earliest deadline, then upcoming by earliest start. Builds SHALL omit expired events from HTML and event exports.

#### Scenario: Build after submissions close
- **WHEN** a build runs at or after a recorded event's submission deadline
- **THEN** the event is absent from generated jam cards and the event JSON

### Requirement: Browser expiry updates

Browsers with JavaScript SHALL recheck upon opening, at deadlines and starts while open, and when returning to the tab, independently of rebuilding, without briefly presenting expired cards as current. Counts and the empty state SHALL match visible events.

#### Scenario: Exact deadline
- **WHEN** the clock reaches an event's submission deadline, including during an already open session
- **THEN** its card is hidden and no longer counted, even if voting is still running

#### Scenario: Stale deployment
- **WHEN** a reader opens a previously built page after its events have expired
- **THEN** JavaScript hides expired events and displays the empty state and discovery calendars

### Requirement: Static access

Without JavaScript, the portal SHALL provide readable build-time current events and calendars, a snapshot timestamp and a visible freshness limitation. Scheduled daily verified rebuilds SHALL refresh static snapshots.

#### Scenario: Read with JavaScript disabled
- **WHEN** JavaScript is disabled
- **THEN** the build-time current events and calendars are readable, the snapshot timestamp and limitation are visible, and scheduled daily verified rebuilds refresh the static snapshot

### Requirement: Attributable static export

The portal SHALL publish `/game-dev-db/api/v1/jams.json` additively, discoverable from the manifest and agent index. It SHALL contain bilingual source-aligned current events, calendars, schema version, attribution, license, generation time and expiry-filter guidance. Machine consumers SHALL be told to reapply deadline filtering at read time.

#### Scenario: Agent reads an old snapshot
- **WHEN** an agent fetches the event JSON
- **THEN** it receives exact timestamps, generation time and the rule to discard events whose deadline is not later than its current time

### Requirement: Verified event metadata

Each event SHALL have a stable ID, localized original description and participation requirements, organizer, official HTTPS URL, verified date, and timezone-qualified start and submission deadline. Content checks SHALL reject duplicate IDs or URLs, missing translations, unsafe URLs, invalid or timezone-less timestamps, and deadlines not later than starts.

#### Scenario: Reject invalid event metadata
- **WHEN** an event lacks a translation, explicit timezone, valid verification date or consistent time interval
- **THEN** canonical content validation fails before publication
