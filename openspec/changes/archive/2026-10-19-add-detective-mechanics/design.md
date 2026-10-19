# Design

## Context

See proposal.md for motivation. Three bilingual JSON taxonomies already feed generic Astro routes, cards, local search and v1 exports. Registration is explicit; the index and browser tests assume three catalogs. Export provenance currently describes all entries as imports from user-selected discussions.

## Goals / Non-Goals

**Goals:** Extend the existing data pipeline with a consistent fourth catalog and accurate attribution. Keep static, mobile and keyboard reading equivalent in both languages.

**Non-Goals:** A separate page renderer, a new search system, changes to lesson schemas, or a claim that the classification exhausts the genre.

## Decisions

- Use `src/data/mechanics/detective.json` and register it with the other catalogs. A separate lesson would duplicate discovery and export behavior.
- Organize 32 families and 96 variants into six investigation stages. Family descriptions explain the action and design examples are explicitly hypothetical. Notes carry real-game examples and design checks; this avoids presenting every proposed variant as a shipped feature.
- Add an optional nonempty `provenance` string to catalog source data. Preserve the existing fallback for imported catalogs and the public string field; changing the shared text would misattribute older catalogs.
- Remove the fixed catalog count from index prose and extend the existing browser matrix to the new catalog. Keep a checked list of catalog IDs so accidentally missing registration is detected through discovery tests.

## Risks / Trade-offs

- Families overlap → explain the classification boundary and separate core inference from presentation, progression and assistance.
- Source descriptions overstate shipped mechanics → cite only verified developer/publisher descriptions, label hypothetical examples and avoid case spoilers.
- Adding a source does not register it automatically → cover all four cards and eight localized records in existing browser and build checks.

## Migration Plan

Validate the source and generated pages, run browser checks, archive the specification change, and publish through the existing Pages workflow. Verify deployed RU/EN pages and exports. Revert the scoped commit to roll back the addition.
