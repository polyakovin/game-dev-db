# Mechanic reference content

The three catalogs adapt the user-selected design discussions about voice/audio games, point-and-click adventures and children's educational games from 2026-10-09. Original Russian taxonomy text was extracted from the complete local HTML artifacts, without their scripts, styles or editor metadata. English variants were translated against the corresponding Russian entries. Public content does not depend on those local artifacts or private chat access.

| Catalog ID | Families | Branch lists | Variants |
| --- | --- | --- | --- |
| `voice-audio` | 27 | 81 | 324 |
| `point-and-click` | 44 | 44 | 355 |
| `children-education` | 64 | 64 | 749 |

These are the import baseline counts, not a limit on future contributions. Counts in the site and exports are derived from current source data. A branch list in the latter two catalogs is simply the family's list of variants, while audio families preserve three named subbranches.

## Source and localization contract

Edit `src/data/mechanics/{id}.json`, never the built HTML, JSON or Markdown. A catalog has a stable `id`, editorial `updatedAt`, localized `title`, `description` and `intro`, `sections`, `families`, supplementary `notes` and `sources`. Every localized value is `{ "ru": "…", "en": "…" }`; optional family descriptions, design examples and note headings must be present or empty in both languages.

Sections, families, branches, variants, notes and note entries have shared IDs. Preserve them when correcting text because they are public HTML anchors and JSON identities. Each family references one section and optional source URLs present in the catalog's source list. Each branch has a title and a nonempty list of variant IDs and localized texts. Notes keep presentation methods, modifiers, combinations and classification limits separate from core families.

Examples attached to children's families are hypothetical designs. Combination titles identify design concepts, not released games. Released-game sources support the specific technique described beside the link; no source certifies the entire original taxonomy. The educational papers supply methodological context, not evidence that all listed actions improve general cognitive skills or transfer outside the game. Age suitability and learning outcomes require separate assessment.

Primary source descriptions were reviewed during integration. A Blind Legend now links to its co-producer DOWiNO's explanation of binaural audio. The original DOI for Foundations of Game-Based Learning is retained; its text was checked through the ERIC-hosted paper when DOI retrieval was unavailable. No third-party article bodies or assets were imported.

## Public export contract

`src/lib/mechanics.mjs` localizes the source tree, calculates counts and generates Markdown. `/api/v1/mechanics.json` has `schemaVersion: 1`, license/attribution fields and a `catalogs` array of six localized records. Each record includes `id`, `lang`, content, tree identities, notes, sources, counts, canonical `url`, `markdownUrl`, licenses, attribution, provenance and the complete Markdown `body`.

`/content/mechanics/{lang}/{id}.md` contains the same generated body and frontmatter metadata. Tree arrays are represented in the body rather than duplicated in frontmatter. Source descriptions and classification limits are retained. The additive manifest fields are `endpoints.mechanics`, `endpoints.mechanicsMarkdownTemplate`, and the mechanic counts. Existing lesson counts and templates retain their previous meanings. `llms.txt`, `llms-full.txt`, the sitemap and agent guidance discover the new catalogs.

## Verification

`npm run check:content` rejects missing translations, invalid or duplicate identities, empty hierarchy nodes, unknown sections and unlisted source URLs. `npm run check:dist` compares every localized variant and note against static HTML, compares full JSON and Markdown records against the source, and checks corpus discovery. `npm run test:e2e` covers both languages, every catalog, combined filters, reset, native keyboard disclosure, deep links, narrow layouts, no-JavaScript reading and exports. Run `npm run verify` before delivery and the browser suite before publication.
