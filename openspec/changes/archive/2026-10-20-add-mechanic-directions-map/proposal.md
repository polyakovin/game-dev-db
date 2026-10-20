# Proposal

## Why

Readers can only discover completed mechanic catalogs, while the agreed map covers 329 directions in 32 groups. Show the complete structure as the normal mechanics catalog, identify unfinished material clearly, and let readers focus on material they can read now.

## What Changes

- Add the complete agreed direction map with matching RU/EN labels and stable group/topic identities.
- Show each direction on the mechanics index, using the same visual structure for available material and entries labeled «В разработке» / “In development”.
- Derive readiness from registered active mechanic catalogs; unfinished entries have no fabricated article or broken link.
- Combine search, group selection and a “Ready only” filter with counts, reset and an empty state.
- Preserve existing catalog routes and discovery, including the general Game Mechanics reference, and expose the direction structure through an additive static JSON endpoint.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mechanics-reference`: complete bilingual direction discovery and filtering by actual material availability.

## Impact

A bilingual direction dataset, resolver, index component and script, dedicated styles, additive v1 direction endpoint, content documentation and focused validation/browser coverage. Existing completed catalog data, exports and URLs stay compatible. No dependency or runtime service is added. Unrelated ongoing content unification and discussion integration changes are outside this change.
