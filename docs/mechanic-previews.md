# Compact mechanic pilot

The Search and discovery record (`mechanic/shared-family-02`) has an authored
compact view at its existing `/{lang}/knowledge/mechanic/shared-family-02/` URL.
Both children and education catalog placements link there. Other mechanics retain
the article view until this pilot is reviewed.

`src/data/mechanic-previews.json` is keyed by canonical mechanic ID. Each entry
contains bilingual description, screenshot alt text/caption and numbered markers,
two short application tips and primary-source example links. Image metadata keeps
the local source path, dimensions, original URL, source page, authors and rights.
Optional `image.crop` records a rectangle in original screenshot pixels. It removes
unused white margins while retaining the scene, clue and target strip. The PNG
stays unchanged; HTML remaps percentage markers into the cropped frame. Only the
image is framed with clipping; text and navigation are never clipped.
`src/lib/mechanic-previews.mjs` localizes it once; the knowledge builder exposes it
as optional `attributes.preview`, uses the description for `summary` and includes
example sources in the source registry. Existing taxonomy sections stay intact.

HTML and common JSON/Markdown use these same fields. The Markdown also renders
the concise explanation, illustration, marker labels, tips and example links.
Legacy catalog exports remain unchanged. See the [image credit](../public/images/mechanics/README.md).

The compact shell fills the available `100svh` height without a fixed maximum
width. Its short toolbar keeps back navigation, language and theme controls;
the brand appears when space permits. Landscape screens place the heading and
definition beside the illustration, while portrait windows stack them. The
illustration uses its remaining container size in both axes. A compact caption
keeps image attribution visible; text licensing and full-format links stay below.

Advice and additional examples are optional, as in the original brief. Height
and width media queries show them only when space permits. The short definition,
marked screenshot, categories, attribution and format links remain visible.
Complete advice and examples remain in JSON/Markdown at every size. Enlarged
text uses natural flow rather than hiding text to enforce a screen boundary.

Browser checks cover both languages/themes at 319×849, 320×500, 375×667, 390×844,
400×500, 516×314, 600×600, 700×500, 800×500, 1024×600, 1280×720, 1440×900,
1510×900 and 1920×1080. Resize checks cross layout breakpoints. They check visible
required content, no scroll/clipped text, full-width main layout, picture
occupancy, no-JS access, category links and exports. The image's intentional crop
is not mistaken for concealed text. Run `npm run verify` and `npm run test:e2e`.
