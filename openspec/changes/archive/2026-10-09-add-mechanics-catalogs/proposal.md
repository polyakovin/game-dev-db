# Proposal

## Why

Three requested discussions contain substantial mechanic taxonomies that are currently available only as local chat artifacts. Readers and agents need to discover and reuse these catalogs from the public portal.

## What Changes

- Add a mechanics index and three full catalogs: voice/audio games (27 families, 324 variants), point-and-click adventures (44 families, 355 variants), and children's educational games (64 families, 749 variants).
- Preserve the trees, design distinctions, illustrative examples and source context in Russian and English, with matching stable identities.
- Provide family search, section filters, disclosure controls, and complete static reading without JavaScript.
- Publish structured JSON and individual Markdown from the same catalog data; extend manifest, agent discovery and sitemap additively.

## Capabilities

### New Capabilities

- `mechanics-reference`: bilingual mechanic taxonomies, local discovery, and equivalent static machine exports.

### Modified Capabilities

None. Existing lesson and resource contracts remain compatible.

## Impact

New bilingual data under `src/data/mechanics/`, catalog routes and shared presentation, an additive `/api/v1/mechanics.json` endpoint, export generators, navigation, content/build verification, browser tests and documentation. No new dependency or runtime server is required. Public routes respect `/game-dev-db/`.
