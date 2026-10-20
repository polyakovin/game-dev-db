# Proposal

## Why

Boss Fight Atlas and Game Mechanics are currently listed only as external resources. Readers and agents need their mechanic coverage inside the local mechanic index, with the original mechanic pages and game references preserved.

## What Changes

- Add bilingual `boss-fight-atlas` and `game-mechanics` catalogs covering the publicly listed mechanics checked on 2026-10-20.
- Write concise original RU/EN explanations and retain source titles, categories, identities and released-game references with direct URLs.
- Preserve source publication status where the atlas distinguishes unfinished entries. Link to original animations and galleries rather than copying third-party media or lesson bodies.
- Reuse the existing search, disclosures and static HTML/Markdown/JSON pipeline. Extend reference metadata additively if required to preserve game-specific links.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mechanics-reference`: Two attributed source-based mechanic catalogs, including source-specific game references in every public representation.

## Impact

Mechanic source data, localization/export helpers, catalog presentation, source and distribution checks, browser tests and mechanic documentation. Existing v1 fields, catalog identities, base paths and lesson exports remain compatible. No runtime service or new dependency is required. Pre-existing game-jam work is outside this change.
