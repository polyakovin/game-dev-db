# Proposal

## Why

Readers need a dedicated reference for designing detective games, where discovering information and making an inference are distinct player actions. The existing adventure catalog covers some related actions but does not explain the full investigation loop.

## What Changes

- Add a bilingual `detective` mechanic catalog covering evidence, testimony, reconstruction, reasoning, conclusions and investigation structure.
- Include original design examples, verified primary-source game references and practical notes on fair clues, uncertainty and testing.
- Reuse the existing searchable, accessible mechanic pages and additive JSON/Markdown exports, with accurate catalog provenance.
- Update discovery copy, documentation and browser coverage for four catalogs.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mechanics-reference`: include a dedicated detective catalog and distinguish its original authorship from the three imported taxonomies.

## Impact

Changes affect `src/data/mechanics/detective.json`, mechanic registration/provenance, mechanics index copy, documentation and browser checks. Existing `/api/v1/` fields, original catalog identities and variant counts remain compatible. No new dependency or server is required.
