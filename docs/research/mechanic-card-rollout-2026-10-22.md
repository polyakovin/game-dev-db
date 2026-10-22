# Complete illustrated mechanic coverage

The 2026-10-22 rollout covers all 1268 active canonical mechanic records in both
Russian and English, including specialized device directions and genre entries.
Every record has an authored compact card at its existing canonical URL. Shared
catalog placements resolve to the same localized card. Archived compatibility
records retain their previous full reference presentation.

## Content and imagery

Each card has a short localized title and definition, an inspected game or
application image, numbered contextual tooltips, concise advice and example
links. Small windows retain the title, definition and marked image. Optional
material returns when the viewport has room. Full taxonomy, attribution and
source information remain in JSON and Markdown exports.

The 747 unique published raster files are actual WebP images. The image audit
measured 45.45 MiB in total, approximately 62 KiB per image on average, a largest
file of 249 KiB and a longest edge of 1440 pixels. No PNG, JPEG, GIF or other
raster format remains under `public/` or `src/`. SVG interface icons remain
vectors. Shared illustrations are reused across appropriate records.

Image metadata preserves the original source, game or application, authorship
and rights. Recording frames also preserve the original clip and source time.
Captions distinguish active actions from preparation, conditional rules,
historical interfaces, developer examples and proposed device-based game rules.
External graphics keep their original rights; see the
[image credits](../../public/images/mechanics/README.md).

The editorial production order is recorded in
`src/data/mechanic-card-order.json`. It prioritizes broad design usefulness and
first-prototype value; it is not a measured market-popularity ranking.

## Verification

- `npm run verify` passed, including Astro checks, content validation, the static
  build, 2994 generated HTML pages, local links, RU/EN routes, JSON and Markdown
  exports, strict OpenSpec validation and the retained project-record check.
- All 3144 Chromium tests passed. Every card was checked in both languages at
  298×314, 375×667, 516×314, 1280×720 and 1920×1080, including no page overflow,
  visible required content, contextual hover tooltips, Escape dismissal and
  exported metadata. Shared component tests additionally cover keyboard, touch,
  no-JavaScript access, theme and layout breakpoints.
- `npm run format:check` passed.
- `node scripts/mechanic-card-report.mjs --require-complete` reports
  1268/1268 illustrated records and zero remaining.

The completeness gate now runs within `npm run check:content`, so a new active
record without an authored card fails publication checks. Image format,
dimensions, size, crop bounds, marker membership and localization remain
mandatory validation gates. GitHub Actions repeats the release checks before
deploying Pages and exposes browser failures as GitHub check annotations.
