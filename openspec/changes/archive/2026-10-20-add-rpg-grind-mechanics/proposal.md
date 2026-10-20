# Proposal

## Why

The user requested publication of the 30 RPG grind mechanics discussed in this chat. Readers need a searchable reference that connects repeated actions to progression goals and rewards, alongside the site's other mechanic catalogs.

## What Changes

- Publish an originally authored `rpg-grind` catalog with the same 30 mechanics and six groups in Russian and English.
- Give each mechanic a concise explanation, a repeatable action/reward loop and an illustrative design example. Explain overlapping classification layers and reward design in notes.
- Retain the checked Warframe mastery and Final Fantasy XIV currency examples with primary-source links and accurate authorship.
- Include the catalog in existing cards, filters, static pages, JSON, Markdown, sitemap and agent discovery; extend the existing browser matrix.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mechanics-reference`: publish the dedicated bilingual RPG grind reference with complete existing discovery and exports.

## Impact

Add `src/data/mechanics/rpg-grind.json`, register it in `src/lib/mechanics.mjs`, extend `tests/mechanics.spec.ts` and update README and mechanic-content documentation. Reuse the current renderer and v1 schema without dependencies or route changes. Preserve unrelated ongoing table-of-contents work.
