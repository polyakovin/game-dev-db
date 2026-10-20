## Context

Lessons and mechanic references render native fragment links in separate TOCs.
Mechanic search hides sections and disclosures change their size. Both affect
section positions without necessarily causing a scroll event.

## Goals / Non-Goals

- Show the current visible section consistently in both languages and appearances.
- Keep native keyboard and fragment navigation and static reading intact.
- Do not change editorial content, fragment IDs, URLs or exports.

## Decisions

Use one optional client script on both templates, selecting explicit TOC and
content data attributes. At a reading line 32 pixels from the viewport top, select
the last visible linked target already reached, defaulting to the first visible
target before the article starts. At the document bottom select the last visible
target so short final sections can become current. Ignore hidden section targets.

Coalesce scroll, resize, hash and page restoration events with requestAnimationFrame.
Observe content and target sizes with ResizeObserver to account for disclosures,
filters and font/layout changes. Change only aria-current on the links, preserving
the URL and keyboard focus. CSS uses the existing accent token and a vertical
marker without changing link geometry. Native links remain usable without scripts.

## Risks / Trade-offs

The mobile mechanic TOC remains above the content as before, with a compact marker
on each current link. Lesson TOCs retain their existing responsive visibility.
Browser checks must cover long expanded sections, hidden sections, deep links,
backward scrolling, short final sections and JavaScript-disabled navigation.
