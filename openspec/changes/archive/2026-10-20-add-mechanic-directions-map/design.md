# Design

## Context

See proposal.md. The static mechanics index currently shows eight active catalogs. The agreed editorial map contains 329 topics in 32 groups. Concurrent content unification modifies existing catalog resolution; the public `getMechanics(lang)` interface remains the integration boundary.

## Goals / Non-Goals

Goals: one localized map for HTML and JSON, truthful readiness, complete script-free reading and combined client-side filters. This change does not write missing lessons or publish empty article pages.

## Decisions

1. Store bilingual group/topic labels and expected catalog IDs in a dedicated dataset. Preserve the map's stable topic identities. Resolve readiness from active catalogs at build time instead of storing manually maintained status booleans. Planned but unregistered catalogs remain in development.
2. Render the full map on the existing mechanics index, using compact consistent cards. Ready cards link to existing catalogs; unfinished cards are semantic non-link entries with a localized status. Keep active catalogs outside the map, including Game Mechanics, in a supplementary group so no existing catalog loses discovery.
3. Combine text search, group selection and an unchecked-by-default ready-only checkbox. Update visible entry/group counts, hide empty groups, provide reset and an empty state. Keep all content in static HTML and reveal controls only after successful script initialization. Preserve selected filters when switching language through URL parameters.
4. Expose an additive `/api/v1/mechanic-directions.json` containing localized groups, topics, statuses, catalog URLs when available and counts. Do not add unfinished directions to the full mechanic catalog endpoint or imply they have article bodies.
5. Keep changes in dedicated modules/components/tests and the previously clean index. Validate the complete bilingual source and current availability through the resolver; test the built HTML and JSON alongside browser behavior. Retain existing catalog discovery selectors.

## Risks / Trade-offs

- Many cards increase page length: use compact grouped grids, combined filters and result counts.
- Related topics overlap: retain the agreed editorial group placement and state that categories can intersect.
- Integration can register a catalog later: derive readiness and links without another status edit.
- Concurrent work owns existing dirty paths: avoid those paths, use explicit staging and validate the final checkout before publishing.

## Migration Plan

Add the dataset and index UI, verify both languages and exports, then publish through the existing Pages workflow when a coherent scoped commit can be pushed safely. Existing URLs are unchanged. Reverting the scoped commit restores the previous index.
