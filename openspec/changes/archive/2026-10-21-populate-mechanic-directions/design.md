# Design

## Context

See proposal.md. There are thirty registered source catalogs and 329 stable direction entries. Twenty-eight directions already have full standalone references; 301 remain unfinished. The common catalog renderer and exports already support definitions, variants, illustrative examples, notes, sources and precise family anchors.

## Goals / Non-Goals

Goals: useful authored content for every missing direction, a truthful readiness gate and unchanged access to all existing material. Each new overview is a first reference treatment, not an assertion that four variants exhaust a genre. No fabricated game example, measured popularity ranking, playtest result or hardware validation is introduced.

## Decisions

1. Reuse a substantive existing family when its rules cover the direction, requiring at least four variants and recording the editorial association in `docs/mechanic-content-reuse.json`. Otherwise author missing directions as families in one coherent catalog per existing map group. This lets related choices be compared on one page and reuses the established reference architecture rather than creating hundreds of shallow empty pages. Each family has a distinct definition, at least four explained variants, a hypothetical design scenario and a specific check. Existing complete standalone references remain preferred.
2. Add an optional `materialRef` with catalog/family identity to a direction. Preserve its existing direction ID and expected standalone `catalogId`. Resolve the standalone catalog first, otherwise require both the active referenced catalog and family. The resulting URL includes the exact family anchor; counts describe that family. Expose actual target metadata additively. Cards use the resolved URL.
3. Register ordinary bilingual JSON catalogs through a dedicated import list. All rendering, search, Markdown, v1 catalog records and knowledge records continue through the existing source transformation. No duplicated generated output is authored.
4. Use original editorial definitions and hypothetical examples. Primary developer, engine and standard documentation supports the stated narrow context; existing source disclaimers remain visible. Device entries describe capability conditions and validation tasks rather than claiming every device implements them.
5. Production order starts with movement, combat, shooting, exploration, RPG systems, tactics, strategy, puzzles and progression, followed by other genre systems and specialized inputs. The map's public group/topic order and anchors stay stable. Useful batches may be committed and published before all content tasks finish.

## Risks / Trade-offs

- Topic and genre boundaries overlap: state the scope and give concrete variants instead of claiming a universal taxonomy.
- Reused generic prose could disguise missing content: validate four variants, unique definitions, bilingual examples/checks and exact direction coverage, then inspect every authored family during composition.
- A catalog could exist while a target family is missing: keep that direction unfinished and test both missing and archived targets.
- Extra catalog volume affects exports and tests: derive test discovery from registered catalogs, preserve complete output checks and run the canonical build/browser suite.

## Migration Plan

Add precise targets and a first substantive catalog, validate target transitions, then add all remaining groups in order. Keep unfinished labels for work not yet authored. Verify and publish coherent batches, finally require zero unfinished directions and complete source/export parity before archiving the change.
