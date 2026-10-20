# Design

## Context

See proposal.md for motivation. A shared Astro layout loads global CSS and most pages; 404 and the language redirect have standalone HTML. Existing CSS mixes six root variables with fixed light colors, and the catalog contains an inline SVG. There is no client router or appearance state.

## Goals / Non-Goals

**Goals:** One semantic palette, early appearance resolution, graceful storage and JavaScript fallbacks, and localized compact controls that fit the header.

**Non-Goals:** Changes to content, search logic, export schemas, URLs, dependencies or server behavior.

## Decisions

- Extract color variables into shared theme CSS with light defaults and a dark override. Resolve system appearance in CSS when no explicit root attribute exists. Compared with per-component dark selectors, this keeps every component on the same palette and supports no-JavaScript reading. Force light variables for print.
- Use a small shared head component with a synchronous inline initializer. Read a namespaced local-storage preference defensively, resolve the root attribute before body content, update browser theme color, and react to system and storage changes. A deferred-only initializer could flash the wrong palette during navigation.
- Use three native buttons with recognizable system, sun and moon icons, localized accessible names and pressed states. Reveal the group only after binding its events. Compared with a custom menu, native buttons minimize interaction and keyboard complexity; compared with cycling one button, every available choice is explicit.
- Keep standalone pages minimal, loading the same palette and head component. Keep syntax-highlighted code on its existing dark surface and map inline SVG colors to semantic tokens.

## Risks / Trade-offs

- Fixed colors left behind could create light patches or low contrast → audit all presentation color literals and inspect representative pages in a browser.
- Storage can throw or contain invalid data → validate values, catch reads and writes, and keep an in-memory preference for the current page.
- Extra header controls could overflow small screens → compact icon buttons, reduced mobile spacing and browser checks down to 320 pixels.

## Migration Plan

Run canonical verification and browser coverage, archive the completed change, commit only owned paths, publish through the existing Pages workflow and verify live RU/EN pages. Revert the scoped commit to roll back.
