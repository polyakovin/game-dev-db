# Design

## Context

See proposal.md. Sections currently have stable IDs and localized titles, and RPG grind embeds its layer label in those titles. HTML, section filters, Markdown and JSON share the same localized catalog.

## Goals / Non-Goals

**Goals:** Represent the four layers explicitly, retain reading order and preserve existing anchors. Keep other catalogs' flat presentation.

**Non-Goals:** Reclassifying mechanics, changing their text or adding navigation destinations.

## Decisions

- Add optional localized `group` on each source section and expose its localized string only when present. This is additive in v1 and avoids inferring hierarchy from title punctuation.
- Collect consecutive sections with the same group into shared presentation groups. Render a subtitle and child section links, native selector optgroups, and an article heading above its subsections. Ungrouped sections keep their existing heading levels.
- Increase nested heading levels in grouped HTML and Markdown. Hide empty article groups during filtering while leaving the contents available for navigation.
- Retain every existing section/family/branch/variant ID. Notes and sources remain outside the four layer groups.

## Risks / Trade-offs

- Empty subtitles after filtering → hide a group when all child sections are hidden.
- Group labels lost by machine consumers → localize and export the optional field and render the same hierarchy in Markdown.
- Mobile contents overflow → check both languages at narrow widths and retain wrapping.
