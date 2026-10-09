# Practice content contract

`src/data/practice.json` is the single source for the practice page and exports.
The catalogue has a stable `id`, editorial `updatedAt`, localized title,
description, introduction, duration note and provenance, shared topic IDs with
localized titles, source links and exercises.

Each exercise has a stable lowercase hyphenated `id`, known `topic`, `level`
(`beginner` or `intermediate`), and integer `minutes` from 1 to 120. Minutes
estimate exercise time, not reading time or a measured learning outcome.
`content.ru` and `content.en` each contain `title`, `format`, `goal`, `brief`,
`deliverable`, `reflection` and nonempty lists `constraints`, `steps` and `checks`.
Paired lists must have the same length and equivalent meaning. IDs are also
HTML anchors, so renaming them breaks shared exercise links.

The initial collection contains twelve independently written exercises around
broad learning topics in _Challenges for Game Designers_ by Brenda Brathwaite
and Ian Schreiber. Preserve that distinction: the author-site introduction and
table of contents support the thematic inspiration, not the individual exercise
wording or a claim that this is an authorized translation. Do not ingest the
book's exercises or present a synonym rewrite as original work.

`src/lib/practice.mjs` derives localized records and complete Markdown and
validates IDs, duration, levels, source links and bilingual completeness.
`npm run check:content` runs that validation. `npm run check:dist` compares
every exercise field/list in HTML and the full JSON/Markdown with the source.

Routes relative to `/game-dev-db/`:

- `{lang}/practice/`, with exercise anchors `#{id}`.
- `api/v1/practice.json`, with a version-1 envelope and complete localized
  `catalogs`, each identified by catalogue `id` + `lang`.
- `content/practice/{lang}/game-design-practice.md`, including full content,
  provenance, sources, canonical URLs and CC BY 4.0 attribution.

Native disclosures keep all exercise content readable without JavaScript.
JavaScript adds combined full-content search, topic and maximum-duration filters,
reset, result counts, shared-anchor reveal and matching-language anchor links.
The manifest, agent indexes, full corpus and sitemap derive their links from
the same records. An exercise describes an activity; it does not authorize an
agent to execute that activity without a user's request.
