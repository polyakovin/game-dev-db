# Design

## Context

See proposal.md for motivation. Localizers already feed both HTML and machine exports. Most arrays use source/import order. Existing lessons have a separate hardcoded order; resource grouping exists only in the Astro page. Other tasks have uncommitted edits to mechanic JSON and page styles.

## Goals / Non-Goals

Keep the ranking editable and independent of locale and imported source numbers. Preserve complete authored content and existing working-copy changes. No automatic text scoring, popularity claims, new routes or public schema fields.

## Decisions

- Use one editorial ordering registry keyed by stable content scope and identity. Explicit ranked entries precede unranked entries; equal/unranked entries retain authored order. Author order remains the editorial baseline for already coherent fine-grained lists, with overrides for branches and variants that need adjustment.
- Sort copies in shared data accessors before localization, rather than sorting the DOM or mutating source JSON. This also keeps no-script HTML and exports aligned and avoids touching mechanic data owned by other tasks.
- Order a grouped dataset by group importance, then item importance within that group, so exported flat arrays follow reading order. Preserve original Schell numbers as attribution, independently of display position.
- Extract resource grouping into a shared module so JSON follows the same group/item order as HTML. Keep the v1 envelope and all existing resource fields.
- Validate every configured scope/identity and duplicate against source datasets. New unranked content remains visible at the end, allowing independent additions.
- Preserve authored procedural structures: lesson explanations, exercise steps, question dependencies and source attribution. Jam events already express actionability through deadline order.

## Risks / Trade-offs

- Importance is editorial and context dependent → document the prototype-first criteria and keep priorities explicit and reviewable.
- Existing tests use import indexes as display positions → replace position assumptions with stable identities or the shared ordered catalog.
- A renamed entry can leave a stale ranking → fail canonical content validation on unknown references.

## Migration Plan

Ship through the existing verified static build. No data migration is required; reverting the scoped commit restores the previous order.
