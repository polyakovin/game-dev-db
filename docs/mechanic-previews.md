# Compact mechanic pilot

The Search and discovery record (`mechanic/shared-family-02`) has an authored
compact view at its existing `/{lang}/knowledge/mechanic/shared-family-02/` URL.
Both children and education catalog placements link there. Other mechanics retain
the article view until this pilot is reviewed.

`src/data/mechanic-previews.json` is keyed by canonical mechanic ID. Each entry
contains bilingual description, screenshot alt text/caption and numbered markers,
two short application tips and primary-source example links. Image metadata keeps
the local source path, dimensions, original URL, source page, authors and rights.
`src/lib/mechanic-previews.mjs` localizes it once; the knowledge builder exposes it
as optional `attributes.preview`, uses the description for `summary` and includes
example sources in the source registry. Existing taxonomy sections stay intact.

HTML and common JSON/Markdown use these same fields. The Markdown also renders
the concise explanation, illustration, marker labels, tips and example links.
Legacy catalog exports remain unchanged. See the [image credit](../public/images/mechanics/README.md).

The compact layout retains brand/back links, language/theme controls, categories,
sources, text license and full-format links. Default 1280×720, 1440×900, 375×667
and 390×844 views fit without page or internal scrolling. Smaller windows and
enlarged text keep natural document flow; no content is clipped or concealed.
Tests cover both languages/themes, no-JS access, direct links from both placements,
image loading and exports. Run `npm run verify` and `npm run test:e2e`.
