# Design

## Context

See proposal.md for motivation. Six bilingual JSON catalogs already feed generic cards, routes, filters and exports. Catalog registration and the browser discovery matrix are explicit. Another task is editing table-of-contents rendering; this addition should not touch those paths.

## Goals / Non-Goals

**Goals:** Publish the discussed list using existing catalog behavior and accurate provenance.

**Non-Goals:** New UI, progression simulation, a monetization system, new dependencies or expansion beyond the requested 30 mechanics.

## Decisions

- Use `src/data/mechanics/rpg-grind.json` instead of a lesson because readers need the existing searchable taxonomy interface.
- Preserve the six original groups and order. Model each item as one family with one action/reward variant and an illustrative example; avoid inflating the reference with unsolicited variants.
- Use descriptive stable identities. Put combinations, classification boundaries and reward trade-offs into notes rather than counting them as new mechanics.
- Attach sources only to the Warframe mastery and Final Fantasy XIV token examples they support. Other examples are hypothetical. Set explicit original editorial provenance.
- Register the source in the shared module and existing browser matrix; generated discovery and v1 exports then include it automatically.

## Risks / Trade-offs

- Activities and reward systems overlap → explain the separate design layers and show how to combine them.
- Examples may look like claims about released games → label design examples and put sourced game observations in a separate note.
- Concurrent UI edits may affect local validation → preserve their files and validate the task's committed tree before publication.

## Migration Plan

Validate content and generated exports, run the existing browser matrix, inspect both localized pages and archive this change. Commit and push only task-owned paths; verify Pages deployment and live RU/EN routes and exports. Roll back by reverting the scoped commit.
