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
Numbered markers are buttons with localized tooltips using the existing marker
labels. Pointer hover, keyboard focus and touch open the hint; Escape, pointer
exit or an outside tap dismiss it. The tooltip uses the browser's popover layer
to escape image cropping and is positioned inside the viewport without changing
page dimensions. The native title remains the no-JS fallback; larger layouts
also show the visible legend.
`src/lib/mechanic-previews.mjs` localizes it once; the knowledge builder exposes it
as optional `attributes.preview`, uses the description for `summary` and includes
example sources in the source registry. Existing taxonomy sections stay intact.

HTML and common JSON/Markdown use these same fields. The Markdown also renders
the concise explanation, illustration, marker labels, tips and example links.
Legacy catalog exports remain unchanged. See the [image credit](../public/images/mechanics/README.md).

The compact shell fills the available `100svh` height without a fixed maximum
width. In normal layouts its short toolbar keeps back navigation, language and theme controls;
the brand appears when space permits. Landscape screens place the heading and
definition beside the illustration, while portrait windows stack them. The
illustration uses its remaining container size in both axes. A compact caption
keeps image attribution visible; text licensing and full-format links stay below.

At up to 620px wide and 640px high, or up to 900px wide and 400px high, a minimal
view shows only the title, short definition and marked screenshot. The toolbar,
categories, image captions, advice, examples and footer are hidden. Narrow windows
up to 479px wide and 400px high float the image beside the definition so text
wraps around it. Taller portrait windows stack the core content; short wider
windows place the illustration beside the title and definition. The image has
no empty surrounding card. Resizing restores the secondary content.

Advice and additional examples are optional, as in the original brief. Height
and width media queries show them only when space permits. Attribution and full
content remain in authored metadata and JSON/Markdown at every size. Enlarged
text uses natural flow rather than hiding text to enforce a screen boundary.

Browser checks cover both languages/themes at 298×314, 375×375, 298×496, 319×849, 320×500, 375×667, 390×844,
400×500, 480×500, 516×314, 600×600, 700×500, 800×500, 1024×600, 1280×720, 1440×900,
1510×900 and 1920×1080. Resize checks cross layout breakpoints. They check visible
required content, no scroll/clipped text, full-width main layout, picture
occupancy, no-JS access, category links and exports. The image's intentional crop
is not mistaken for concealed text. Run `npm run verify` and `npm run test:e2e`.
