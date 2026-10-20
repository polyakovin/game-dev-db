# Design

## Context

See proposal.md for motivation. The current source has 64 families and 749 variants under `children-education`. Shared localization powers cards, static HTML and complete machine exports. Existing checks compare every exported family and variant with HTML.

## Goals / Non-Goals

Goals: distinguish audience and instructional purpose without losing public identifiers; keep full static reading and bilingual parity. No curriculum, age certification or learning efficacy claim is introduced.

## Decisions

- Add separate authored JSON catalogs. Education retains all original families; children reuses play-relevant families. The scopes overlap intentionally: a mechanic can serve both purposes. Stable original IDs remain inside their new catalog namespaces. New families use descriptive IDs.
- Keep the old source unchanged as a compatibility archive. Default discovery omits it; HTML generation and exports explicitly include archives. This avoids an arbitrary redirect and preserves original deep links and existing API clients. Its page prominently links both successors; new pages link each other.
- Add ten families to each catalog. Children's additions cover open-ended toys, pretend play, care, decoration, pursuit, traversal, vehicles, sensory materials, comic surprises and guessing. Educational additions cover source verification, evidence-based arguments, concept maps, documentation use, peer review, procedural simulations, dialogue practice, laboratory records, distributed expertise and client projects. Notes distinguish learning support from player actions and require outcome checks outside rewarded play.
- Use developer pages for specific play examples and research/PhET materials for specific instructional approaches. Other examples are explicitly hypothetical. Avoid claiming the entire taxonomy is validated.

## Risks / Trade-offs

- Overlapping content can drift: shared IDs and preservation tests protect imported coverage; documentation requires reviewing both catalogs when changing shared entries.
- Archived counts can confuse readers: cards and the mechanics index use active catalogs; manifest export totals include the archive, preserving their meaning as dataset totals.
- Adult education can inherit child-focused examples: examples remain illustrative, while the scope and new training scenarios explicitly cover mixed ages and adult learners.

## Migration Plan

Build and verify both languages, original anchors, additive exports, search, keyboard use and narrow layouts. Archive the verified OpenSpec change, publish through the existing Pages workflow and check live successor and compatibility routes. Reverting the scoped commit restores the original catalog.
