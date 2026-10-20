# Design

## Context

See proposal.md for motivation. Common records already preserve sections, relationships and individual machine exports. Catalog fragments are the canonical HTML address for mechanics, lenses and exercises. Astro 7 provides a static Markdown renderer through its installed Satteri package. GitHub Pages serves this repository below `/game-dev-db/`; host-root robots changes belong to a separate user-site repository.

## Goals / Non-Goals

Goals: reusable focused pages, bounded retrieval, preserved legacy routes, observable deployment and honest external indexing status.

Non-goals: training-model inclusion, ranking guarantees, fabricated examples or review dates, bulk outreach, a paid hosting migration or a new MCP service.

## Decisions

- Use `/knowledge/{type}/{id}/` for active mechanic, practice and lens records. Common `url` and relationships resolve there; preserve original addresses as `placements`. Lessons keep their existing canonical pages. Archived entries keep catalog URLs and are excluded from new page generation and sitemap.
- Render the existing common record sections at build time using the same Markdown engine as Astro, declared as an exact direct dependency. Avoid a custom Markdown parser and avoid new authored copies of existing content.
- Add focused links through shared KnowledgeLinks, keeping existing expandable catalogs intact. Add per-record format alternates to focused pages and lessons, and an llms link to the shared document head.
- Build one deduplicated sitemap from existing human routes plus focused records, known authored dates and RU/EN pairs. Escape XML, avoid build-time lastmod values and exclude archives.
- Keep llms.txt as an entry map and publish short per-language topic indexes. Provide an AGENTS.md snippet through the agent guide and a public text endpoint. Use WebPage/CreativeWork metadata only when supported by visible authored content.
- Keep external registration separate from code validation: inspect accessible webmaster sessions, submit verified URLs when authorized access exists, otherwise deliver exact account steps. Root robots is optional for crawling; document the separate user-site ownership rather than falsely fixing it inside this repository.
- Add a dependency-free production audit and 15 paired discovery questions. Record observations without claiming AI citations that were never measured.

## Risks / Trade-offs

- More generated pages increase build and link-validation work: share data, reuse styling and validate every focused canonical, source and section.
- New common canonical URLs change downstream links: retain all catalog anchors and legacy APIs; test both paths.
- Metadata and machine entry points do not guarantee search indexing or citations: track account status and discovery results independently.

## Migration Plan

Verify content, build, all local links, formats, bilingual pages and browser behavior; deploy a scoped commit through the existing Pages workflow; run the production audit. Revert the scoped commit to roll back while preserving legacy routes throughout.
