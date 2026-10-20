# Proposal

## Why

Project discussions contain substantial mechanic catalogs that readers cannot yet find on the website. Consolidate all discussed additions into the existing bilingual reference system while preserving the complete item lists, practical limitations and attribution.

## What Changes

- Add catalogs for visual novels, dialogue, deck building, roguelike/roguelite, metroidvania, metroidbrainia, puzzles, engagement/retention, electronic devices, drawing, phone cameras, microphones, motion, flashlights, haptics, touch, magnetometers, keyboards, mice and trackpads.
- Add the ten discussed perception ideas and the later RPG grind additions without duplicating the original thirty entries.
- Preserve every source-list item and meaningful design note; translate the complete content into English, retain original identifiers where possible, and explain overlap, hypothetical examples and hardware requirements.
- Reuse static HTML, search, section filters, JSON/Markdown exports and editorial ordering. Record a sanitized coverage audit without private conversations or local artifact paths.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mechanics-reference`: complete coverage of project-discussed mechanic additions, with bilingual discovery, technical limits and compatible exports.

## Impact

New bilingual JSON catalogs under `src/data/mechanics/`, catalog registration, editorial ordering, coverage documentation and proportional browser coverage. The v1 schema, existing routes and IDs remain compatible. No runtime service or new dependency is required.
