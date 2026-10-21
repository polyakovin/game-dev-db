## Approach

Use CSS media queries, with no content duplication or viewport JavaScript.
At widths up to 620px and heights up to 640px, or widths up to 900px and heights
up to 400px, show only the heading, definition and marked screenshot. Hide the
compact toolbar and all secondary blocks. Keep source attribution in authored
metadata, full-size presentation and machine exports.

Place the figure before the definition in source order. Existing named grid
areas preserve the ordinary layout; the smallest mode can use a real float so
the definition flows around the image. At up to 479px wide and 400px high use
that flow; taller portrait windows stack, wider short windows use two columns.
Tooltips continue to use the popover layer and stay within the viewport.

## Verification

Cover the screenshot-like 298×314 window, narrow portrait, short landscape,
breakpoint transitions, no-JS titles, keyboard and touch tooltips in RU/EN.
Check absence of scrolling and hidden controls, image size, metadata recovery
when the viewport grows, and the existing enlarged-text fallback.
