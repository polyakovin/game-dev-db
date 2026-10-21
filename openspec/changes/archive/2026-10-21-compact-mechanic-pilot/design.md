# Design

## Context

The existing knowledge builder already joins shared-family-02 across children and education. The focused route renders every record as a long article. Full taxonomy sections remain useful in catalogs and machine exports. See proposal.md for the requested pilot.

## Goals / Non-Goals

Provide a reusable compact renderer driven by optional bilingual authored data on the existing canonical record. Do not migrate other mechanics, deduplicate unrelated concepts by title, or introduce a second canonical route.

## Decisions

- Store pilot content in src/data/mechanic-previews.json keyed by canonical ID. Localize once into attributes.preview; retain full record sections unchanged. The same data supplies the HTML description, image, advice, examples and JSON/Markdown metadata.
- Render an optional compact mode in the shared layout, without the article TOC, global sidebar or long footer. Keep the brand, back navigation, theme/language controls and format links. A compact two-column desktop composition becomes stacked on phones.
- Use the official Hidden Folks jungle tutorial screenshot with numbered HTML overlays. Preserve the whole frame, including the target strip, with object-fit: contain. Keep screenshot credit and primary-source links visible. Third-party art retains its authors' rights and is excluded from CC BY 4.0.
- Provide a direct pilot link beside the shared family's title in both catalogs while preserving their legacy details and anchors.
- Fit default 1280×720, 1440×900, 375×667 and 390×844 viewports through concise content and bounded image size, not overflow hiding or tiny scaled text. At enlarged text or unusually short viewports, allow natural accessible flow.

## Risks / Trade-offs

- Screen size is not universal: explicitly test common desktop/phone sizes and zoom; never clip content to hide overflow.
- A family covers more variants than one screenshot: label Hidden Folks as a concrete example and keep full taxonomy available in catalogs and exports.
- Third-party image attribution: document exact origin, authors and retained rights; do not imply it is original portal artwork.

## Migration Plan

Deploy as one optional pilot through the existing GitHub Pages pipeline after verification. Roll back by removing the pilot registry entry; canonical URLs and full records remain stable.
