# Design

## Context

See proposal.md for motivation. Four catalogs already share bilingual JSON, localization, native disclosures, search and generated HTML/Markdown/JSON. `sourceUrls` addresses catalog-wide sources but cannot retain a game's label beside its exact gallery or timestamped video link. The source indexes currently list 124 boss mechanics and 199 Game Mechanics entries.

## Goals / Non-Goals

**Goals:** Preserve complete checked index coverage and reference destinations while keeping the site build independent of both upstream services.

**Non-Goals:** Mirror media, import external article bodies, modify Boss Fight Atlas itself, or introduce scheduled scraping.

## Decisions

- Store checked editorial snapshots in `src/data/mechanics/{id}.json`. Retain source slugs in family identities and organize by the original source's categories. This keeps normal static builds reproducible; fetching during build would make availability and content depend on external sites.
- Use concise independently written definitions in the existing variant tree. Include original English labels where useful for search. The two local catalogs are reference indexes, not copies of the original full lessons.
- Add optional family `references: [{ title: { ru, en }, url }]`; localize it to labeled links in HTML/Markdown/JSON. Existing catalogs need no new fields. Using only the global sources list would lose the game-to-mechanic relation and produce a very large undifferentiated source list.
- Keep upstream mechanic pages in `sourceUrls` and reference titles/URLs as facts. Source notes state that original summaries use CC BY 4.0 while linked media and source material retain their rights. References document upstream attribution, not independent verification of every game's behavior.
- Derive displayed family numbers from ordered families rather than the final two ID characters, so slug-based identities and more than 99 entries render correctly.

## Risks / Trade-offs

- Upstream content changes → record the editorial check date and preserve source URLs; update snapshots deliberately.
- Sources may include examples with incomplete or generic videos → preserve their labels and qualify their provenance rather than upgrade their evidential status.
- Very large catalogs → keep native collapsed families and existing filtering; verify narrow layouts and source/reference parity in built output.
- Concurrent game-jam changes → stage only task-owned paths and preserve unrelated working changes.

## Migration Plan

Add two catalog files and optional metadata, run canonical verification and browser tests, then archive the completed change. Publish only the scoped commit through the existing authorized GitHub Pages workflow. Rollback removes the two catalog imports and reverts the additive presentation changes.
