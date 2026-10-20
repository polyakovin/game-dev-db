# Design

## Context

See proposal.md for motivation. The current source has thirty families, six sections and one variant per family. Existing generic rendering, search and exports derive content from that source. Several unrelated changes are in progress in the primary checkout, so this change uses a managed worktree.

## Goals / Non-Goals

**Goals:** Broad, auditable design-space coverage without inflating the count through renamed duplicates. Preserve old anchors and machine compatibility.

**Non-Goals:** A new renderer, simulation, exhaustive enumeration of combinations, monetization guidance or unrelated knowledge-format migration.

## Decisions

- Expand the existing source, retain all original structural IDs and variant text, and add two concrete options per original family. New families have three concrete variants and a hypothetical example.
- Use eighteen section labels prefixed by one of four design layers. Keep the original six section IDs while regrouping families by their dominant purpose. These are compatible anchor/content changes rather than an export-schema extension.
- Cover activities in six groups, goals in seven, reward rules in three and constraints in two. Public notes supply a coverage matrix, combinations, economic/reward checks and boundaries. Classification overlap is explained rather than hidden.
- Cite checked official game documentation only for the particular observation it supports. Keep other variants and examples explicitly hypothetical; do not reproduce game articles or assets.
- Extend the existing generic browser matrix through the changed source and add a focused source/legacy-link/coverage test in a new file. Update the baseline-count documentation and README, preserving unrelated edits when integrating.

## Risks / Trade-offs

- Number growth can conceal duplicates → assign a distinct repeated decision or progression variable to every family and review adjacent families explicitly.
- Long pages can be hard to scan → reuse section filters, text search and native disclosures; verify full expansion on mobile.
- Parallel source migrations can change integration → fetch before publication, rebase only the task branch when safe, and rerun checks when changed contracts affect this catalog.

## Migration Plan

Validate both languages and exports, run the browser suite, inspect the expanded page, archive and validate specifications, commit explicit task paths and publish through the existing Pages workflow. Verify live content and original fragments. Revert the scoped commit to roll back.
