# Mechanic reference content

The original three catalogs adapt the user-selected design discussions about voice/audio games, point-and-click adventures and children's educational games from 2026-10-09. Original Russian taxonomy text was extracted from the complete local HTML artifacts, without their scripts, styles or editor metadata. English variants were translated against the corresponding Russian entries. Public content does not depend on those local artifacts or private chat access.

The `detective` catalog was originally authored for Game Dev DB on 2026-10-19. It covers the investigation loop through six sections: evidence, testimony, reconstruction, reasoning, conclusions and investigation structure. Its 32 families have descriptions, illustrative design examples and 96 variants. Notes distinguish facts from hypotheses, explain fair clues and feedback, propose small prototypes and provide future playtest checks. They do not claim completed research or playtests.

| Catalog ID | Families | Branch lists | Variants |
| --- | --- | --- | --- |
| `voice-audio` | 27 | 81 | 324 |
| `point-and-click` | 44 | 44 | 355 |
| `children-education` | 64 | 64 | 749 |
| `detective` | 32 | 32 | 96 |

These are baseline counts, not a limit on future contributions. Counts in the site and exports are derived from current source data. A branch list in non-audio catalogs is simply the family's list of variants, while audio families preserve three named subbranches.

## Source and localization contract

Edit `src/data/mechanics/{id}.json`, never the built HTML, JSON or Markdown. A catalog has a stable `id`, editorial `updatedAt`, localized `title`, `description` and `intro`, `sections`, `families`, supplementary `notes` and `sources`. Every localized value is `{ "ru": "…", "en": "…" }`; optional family descriptions, design examples and note headings must be present or empty in both languages.

Sections, families, branches, variants, notes and note entries have shared IDs. Preserve them when correcting text because they are public HTML anchors and JSON identities. Each family references one section and optional source URLs present in the catalog's source list. Each branch has a title and a nonempty list of variant IDs and localized texts. Notes keep presentation methods, modifiers, combinations and classification limits separate from core families.

An optional nonempty `provenance` string overrides the exported origin statement for an individual catalog. The original three catalogs retain their existing fallback; `detective` identifies its original editorial authorship. This preserves the public v1 string field and avoids attributing newly written material to imported discussions.

Examples attached to children's families are hypothetical designs. Combination titles identify design concepts, not released games. Released-game sources support the specific technique described beside the link; no source certifies the entire original taxonomy. The educational papers supply methodological context, not evidence that all listed actions improve general cognitive skills or transfer outside the game. Age suitability and learning outcomes require separate assessment.

Primary source descriptions were reviewed during integration. A Blind Legend now links to its co-producer DOWiNO's explanation of binaural audio. The original DOI for Foundations of Game-Based Learning is retained; its text was checked through the ERIC-hosted paper when DOI retrieval was unavailable. No third-party article bodies or assets were imported.

Detective examples were checked against developer/publisher pages for The Case of the Golden Idol, Return of the Obra Dinn, Her Story, Unheard, Sherlock Holmes: Crimes and Punishments, Shadows of Doubt and Paradise Killer, plus Capcom's Dual Destinies controls manual. Mobius Digital's Outer Wilds page supports a clearly labeled neighboring-genre example of time-dependent exploration in a loop. Sources support the stated techniques, not every proposed family variant. Design scenarios are hypothetical, avoid case spoilers and do not present fictional forensics or court rules as real procedures.

## Public export contract

`src/lib/mechanics.mjs` localizes the source tree, calculates counts and generates Markdown. `/api/v1/mechanics.json` has `schemaVersion: 1`, license/attribution fields and a `catalogs` array with one record per catalog and language (currently eight records). Each record includes `id`, `lang`, content, tree identities, notes, sources, counts, canonical `url`, `markdownUrl`, licenses, attribution, provenance and the complete Markdown `body`.

`/content/mechanics/{lang}/{id}.md` contains the same generated body and frontmatter metadata. Tree arrays are represented in the body rather than duplicated in frontmatter. Source descriptions and classification limits are retained. The additive manifest fields are `endpoints.mechanics`, `endpoints.mechanicsMarkdownTemplate`, and the mechanic counts. Existing lesson counts and templates retain their previous meanings. `llms.txt`, `llms-full.txt`, the sitemap and agent guidance discover the new catalogs.

## Verification

`npm run check:content` rejects missing translations, invalid or duplicate identities, empty hierarchy nodes, unknown sections and unlisted source URLs. `npm run check:dist` compares every localized variant and note against static HTML, compares full JSON and Markdown records against the source, and checks corpus discovery. `npm run test:e2e` covers both languages, every catalog, combined filters, reset, native keyboard disclosure, deep links, narrow layouts, no-JavaScript reading and exports. Run `npm run verify` before delivery and the browser suite before publication.
