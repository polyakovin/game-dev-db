# Illustrated mechanic cards

Active canonical mechanics are being expanded from the reviewed Search and
discovery pilot into illustrated cards at their existing focused URLs. Shared
placements link to one canonical card. `/ru/mechanics/cards/` and its English
counterpart list authored cards in editorial priority order; the mechanics index
highlights the first six. Other records retain their full reference view until
their illustration and compact content have been checked.

`src/data/mechanic-card-order.json` covers every active canonical mechanic once.
Its order reflects cross-genre usefulness and first-prototype value, not measured
market popularity. Run `node scripts/mechanic-card-report.mjs` for the next pending
records, `--json` for the exhaustive inventory and `--require-complete` for the
final rollout gate. A reference page or queue entry does not count as an authored
illustrated card. Archived compatibility records are excluded.

`src/data/mechanic-previews.json` is keyed by canonical mechanic ID. Each entry
contains a short bilingual display title and description, screenshot alt text/caption and numbered markers,
one or two short application tips and primary-source example links. Image metadata keeps
the local source path, dimensions, original URL, source page, authors and rights.
Optional `image.crop` records a rectangle in published WebP pixels. It frames
the relevant area while keeping enough scene or interface context to explain the example.
Published raster illustrations are compressed WebP derivatives, at most 1440 pixels
on the long edge and 250 KiB each. Original source URLs remain in the metadata;
redundant PNG/JPEG originals are not shipped. HTML remaps percentage markers into
the cropped frame. Only the
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
The compact display title is also a search alias; the full record title remains
unchanged. Cards show at most two authored example links, while all original
reference sources and image source attribution remain in machine exports.

`src/lib/mechanic-preview-validation.mjs` is part of canonical content validation.
It checks both languages, short-content limits, HTTPS attribution, actual WebP
format, published dimensions and byte budgets, crop bounds and marker membership. Crop rectangles include
their origin and exclude their far edge; percentage coordinates are compared in
the same units without a tolerance that changes that boundary.

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

Prepare new screenshots with `node scripts/optimize-mechanic-images.mjs` to preview
conversion, then add `--write` to apply it. This editorial command requires the
`cwebp` CLI (libwebp); normal builds and validation need no native image dependency.
The converter starts at quality 82, reduces quality or dimensions when needed,
strips metadata, never upscales, rescales crop edges and retains percentage markers.
Review the result and tooltips visually before publication.

A frame extracted from a gameplay recording keeps the original clip URL in
`image.originalUrl` and its exact nonnegative timestamp in
`image.sourceFrameSeconds`. Attribute both the game and the recording source.
The Markdown export links to the clip and timestamp; JSON preserves the metadata.
Only the inspected compressed WebP frame is published, without the source video.
