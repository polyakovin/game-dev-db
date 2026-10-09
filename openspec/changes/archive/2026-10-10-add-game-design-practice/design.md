# Design

`src/data/practice.json` stores shared exercise IDs, topic IDs, level, time and
parallel RU/EN content. `src/lib/practice.mjs` validates the source and derives
localized records and complete Markdown. Time is an estimate for the exercise,
not a claimed learning result or guaranteed playtest duration.

One static page per language contains all exercises in native `details` elements.
The first exercise opens initially. JavaScript enhances discovery; reading and
source links remain available without it. Filters match query words against full
exercise content and combine them with topic and maximum duration. Stable anchors
can be shared; language switching preserves a known exercise anchor.

Exports add `/api/v1/practice.json` and
`/content/practice/{lang}/game-design-practice.md`. They retain full exercise
content, canonical URLs, provenance, sources and content licensing. The manifest,
discovery index, full corpus and sitemap extend the existing contract additively.

The book's author-site introduction and table of contents support the thematic
reference. They are not evidence that these original scenarios are exercises from
the book. Original exercise text is CC BY 4.0; linked material keeps its license.
