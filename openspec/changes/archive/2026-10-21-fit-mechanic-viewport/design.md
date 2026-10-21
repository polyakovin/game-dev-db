# Design

## Context

The compact main element currently caps width at 1200px and the illustration derives height from its width. The narrow layout always stacks the full illustration before advice. These constraints explain the user's screenshots. The current in-app browser also exposes a 319×849 CSS viewport at devicePixelRatio 2, so physical screenshot pixels are not device preset dimensions.

## Decisions

- Use a compact shell with a flexible main row filling 100svh; remove its maximum width and reserve only a short toolbar and footer. Allow normal document expansion under text enlargement rather than hiding overflow.
- Use one grid: portrait places the flexible illustration between definition and optional advice; landscape places the illustration alongside the heading, definition and optional content. Size the illustration from its available container using container size units, not just viewport width.
- Add an authored crop rectangle covering x=600..1680 and y=80..1152. Present the unmodified image within that frame and remap annotation coordinates from original pixels. This removes empty white margins while preserving both marked elements and their context. Only image framing uses clipping; text never does.
- Reduce secondary chrome and caption spacing. Height/width media queries omit only the optional tips/examples when they cannot fit; the primary screenshot, definition, source, categories and format links remain visible.
- Exercise supported default windows from 300px high landscape to tall narrow and 1920×1080 fullscreen in both languages/themes. Check continuous resizing near layout breakpoints, screenshot bounds, visible text bounds and efficient main/illustration occupancy. Enlarged text retains reachable full content.

## Risks / Trade-offs

- Finite space cannot accommodate every optional section at readable size. Prioritize the required explanation and real example, keeping complete advice and sources in machine formats.
- A screenshot crop must not sever the clue or target strip. Check both annotation positions against the authored crop and visually inspect the source region.
- Large-type accessibility may require scrolling. Preserve flow and keyboard access instead of clipping to the viewport.
