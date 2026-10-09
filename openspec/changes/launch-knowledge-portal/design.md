# Design

## Context
A new repository contains a commercial planning template but no application. The owner
has requested an open-source educational portal with equal human and agent access.

## Goals / Non-Goals
Deliver useful bilingual reading, discovery and contributions with a small static build.
Do not add user accounts, server APIs, a CMS, a chatbot or a game engine dependency.

## Decisions
- Astro static HTML minimizes client JavaScript and runs on GitHub Pages.
- Markdown frontmatter is validated at build time; language pairs share stable IDs.
- Routes live below /game-dev-db/ with real HTML files and language-preserving links.
- Search is a progressively enhanced local catalog filter. All lessons are readable without JS.
- The /api/v1/ contract contains explicit schemaVersion, provenance and licensing metadata.
- One source generates HTML, raw Markdown and JSON. No runtime fetch to third-party sources.
- GitHub pull requests and OpenSpec changes are the contribution and feature workflows.

## Risks / Trade-offs
Translations can drift: require paired IDs and review both translations in the same PR.
External sources can move: retain provenance and require periodic human link review.
Static search scales with the content corpus; the seed catalog needs no search service.

## Migration Plan
Build and verify locally, push the initial main branch, enable Pages Actions, then verify
the public HTML and machine exports. A failed deployment must not be reported as live.
