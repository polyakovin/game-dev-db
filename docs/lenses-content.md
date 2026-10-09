# Design-lens content contract

Updated 2026-10-10. `src/data/lenses.json` is the only editorial source for HTML, JSON and Markdown. `src/lib/lenses.mjs` provides localization, generation and validation. Public identities are a catalog `id + lang` and a lens `id`.

## Coverage and provenance

The maintainer supplied a Russian second-edition Schell note containing all perspectives 1–113. It was used as a coverage reference, not copied into the published site. All summaries and review prompts are new editorial wording in RU/EN. The book’s perspective names identify the concepts; no long passages, illustrations or original card exercises are republished.

The [third-edition publisher preview](https://api.pageplace.de/preview/DT0400.9781351803649_A38251642/preview-9781351803649_A38251642.pdf), table of lenses, confirms the additions Metaphor 67½, Presence 93½ and Cheatability 95½. Their content was read in the [official Deck of Lenses](https://deck.artofgamedesign.com/), linked from [Schell Games](https://schellgames.com/art-of-game-design). There are 116 Schell perspectives. The deck displays Your Secret Purpose with a question mark; this catalog retains 113 from the note/book sequence.

The additional unnumbered entry, Intrinsic Skill Atoms, belongs to Sebastian Deterding. Its bibliography is recorded by the [University of York](https://pure.york.ac.uk/portal/en/publications/the-lens-of-intrinsic-skill-atoms-a-method-for-gameful-design/) and its methodology explained in the [author’s course](https://gamefuldesign.wordpress.com/). It addresses gameful design, including gamification. The review prompts are an editorial application, not a quotation from the paper.

Source verification took place on 2026-10-09. The public catalog was authored on 2026-10-10. No claim is made to have reviewed every chapter of the English book or every possible lens published online.

## Fields and identity

Each lens has a stable slug `id`, `number` (a Schell string or null), `theme`, `sourceId`, paired `title` and `description`, at least two paired `questions`, and a public HTTPS `referenceUrl`. Use `schell-067-5`, `schell-093-5` and `schell-095-5` for fractional identities; never rename them to 114–116. `deterding-skill-atoms` has `number: null`.

Themes are an editorial navigation aid, not the book’s chapter classification. Source groups carry author, edition, URL and paired descriptions. Keep localized meaning aligned, explain interpretive changes and preserve attribution. For example, Schell’s Accessibility addresses puzzle entry/progress here; it does not replace a disability-accessibility review. Spectation concerns watching play, and Character concerns the game’s distinctive qualities rather than an NPC.

## Presentation and exports

The pages `/ru/lenses/` and `/en/lenses/` contain every entry as native details. Theme/source filters and search progressively enhance them. Anchor links use stable lens ids; JavaScript opens a linked entry and resets conflicting filters. Without JavaScript, readers use native disclosures. Filters are hidden in that case.

`api/v1/lenses.json` has schemaVersion 1, project attribution, license metadata and two localized catalogs. Each contains the full lens records, sources, themes, counts, URLs and generated Markdown body. `content/lenses/{lang}/game-design.md` includes the complete body and catalog metadata. Manifest additions are `counts.lensCatalogs` (2 localized catalogs), `counts.lensPerspectives` (117 unique perspectives), `endpoints.lenses` and `endpoints.lensesMarkdownTemplate`. Existing v1 fields and routes remain intact.

Original editorial text is CC BY 4.0. The referenced concepts, external source text and names retain their authors’ rights; the license does not relicense the original books, deck or paper. The catalog’s rights/provenance fields and visible source section communicate this boundary.

## Checks

`npm run verify` checks paired fields, unique structural identities, valid references, exact source coverage, source/edition matching, HTML text, full JSON/Markdown equivalence, links and agent discovery. Browser tests check both languages, full-text/theme/source filtering, reset, keyboard disclosure, deep links, narrow layout, no-JavaScript reading and exports. Changes to the reference dataset must keep these checks passing.

## Local verification record

`npm run verify` passed in the target repository with Node 24 and the bundled Python runtime; source formatting passed. After fast-forward integration of the independently published Practice section, all 44 Playwright tests passed in the target checkout on an isolated server. This includes the eight new lens tests and the portal, references, mechanics and practice suites. Both export families and all existing routes passed built-output checks. Desktop and 375px mobile production-preview views of the lens section were visually reviewed, including an expanded third-edition entry.
