# Proposal

## Why

The knowledge base has useful bilingual content but inconsistent lesson structures, copied mechanics and weak connections between reference entries and learning outcomes. Readers and agents need the same predictable format, explicit relationships and precise retrieval without losing existing public links.

## What Changes

- Standardize lesson sections and a common record envelope for every content type, including identity, summary, status, sources, sections and typed relationships.
- Correct the pathfinding exercise, show useful mechanic definitions before disclosure, preserve multiple categories and reuse shared active mechanic families by reference.
- Generate direct and reverse links from an editorial relationship registry, plus source usage backlinks.
- Add a cross-content search page, language-specific lightweight indexes and individual JSON/Markdown records.
- Mark compatibility archives in all formats, preserving old routes, anchors and v1 fields.
- Add a first-prototype path, allow reusable lessons across paths, and add NPC/progression capstone exercises with explicit outcomes and checks.
- Validate the shared format, translation parity, relations, sources and built output, and test both languages, themes, mobile and script-free reading.

## Capabilities

### New Capabilities

- `knowledge-content`: common content records, typed relationships, source reuse, cross-content discovery and precise exports.

### Modified Capabilities

- `knowledge-portal`: consistent lesson structure and additive knowledge discovery.
- `mechanics-reference`: reference reuse, descriptions, multiple category filters, archive status and stable Markdown identities.
- `learning-paths`: starter path, reusable lesson membership and explicit outcomes/rationales.
- `game-design-practice`: two original integration exercises and source-aligned exports.

## Impact

Markdown lessons, bilingual JSON data, shared build helpers, Astro components/routes, source and distribution validators, browser tests and content documentation. Existing `/game-dev-db/` routes and `/api/v1/` contracts remain compatible through additive fields and endpoints. No runtime server or additional dependency is needed. The separate unimplemented discussed-mechanics change remains independent.
