# Proposal

## Why

Readers need a place to find game jams they can still enter. A static event list goes stale unless submission deadlines are enforced after publication.

## What Changes

- Add a bilingual game-jam section, navigation and a home-page entry point.
- Publish verified current and upcoming events, original summaries, exact submission times and official participation links, plus permanent discovery calendars.
- Exclude events at their submission deadline during builds and in the browser, including pages left open; show a useful empty state.
- Add an additive v1 JSON snapshot and daily verified Pages rebuilds for static readers.

## Capabilities

### New Capabilities

- `game-jams`: Bilingual discovery and automatic expiry of curated game-jam opportunities.

### Modified Capabilities

None. Existing lesson and export contracts remain compatible.

## Impact

New bilingual JSON source, validation and time helpers, Astro page, small browser script and styles. Shared navigation, home page, sitemap, manifest, agent discovery, documentation, content/build checks and Pages workflow gain additive entries. No new dependencies or runtime service.
