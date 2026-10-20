# Design

## Context

See proposal.md. Current Astro collection and JSON datasets already generate compatible static HTML and v1 exports. Relationships are implicit, 34 active families are copied, archive detection and a path rationale are hardcoded in presentation, and lessons have two different heading structures.

## Goals / Non-Goals

Goals: keep authored sources small and predictable, build all discovery and export views from resolved records, and preserve all public identities and archive content. Non-goals: a runtime database, a CMS, importing the separate discussed-mechanics catalogs, or claiming a new external-source verification campaign.

## Decisions

1. Keep Markdown lesson bodies and type-specific bilingual data. Standardize the six lesson sections. Adapt every content type to one knowledge envelope (key/type/id/lang/title/summary/date/status/url/sources/sections/relations), rather than forcing a jam to pretend to be a lesson. Unknown dates remain explicit nulls.
2. Move the 34 shared active families to a shared source registry; children and education hold references plus placement. Resolve them before ordering/localization/validation. Keep archive source content intact. Definitions and categories are authored metadata, not repeated body text.
3. Add an editorial typed relation list for learning connections. Derive path membership, citation usage and reverse relationships; localize labels once. A shared link component consumes the same graph as individual exports. Keep free-form Markdown links as supplementary authored context.
4. Build a static per-language knowledge/search index and individual record endpoints. Stable source IDs derive from normalized source URLs; source usage and dates are derived without inventing checks. Search uses a shared pure normalizer and ranked token matching, with query/type in the URL; no service is required. Exclude archives from active discovery but retain direct access.
5. Five learning paths reuse lesson identities. Path outcomes, checks and practice rationales live in data. Lesson navigation renders every containing path. Two new practice records reuse the existing complete exercise schema.
6. Existing APIs remain intact; enrich archive/canonical metadata additively. Markdown mechanics retain explicit nested IDs. New knowledge JSON and Markdown share a common record format, while old content exports preserve their compatibility layouts.

## Risks / Trade-offs

- Moving shared families could break callers reading raw JSON: adapt repository tests and validators to resolve references; validate unknown refs and stable anchors.
- A new index could grow large: exclude bodies from the discovery index, expose separate per-language search text and one-record content endpoints.
- Generated backlinks could clutter cards: group by meaningful label and show links inside expanded cards; leave the definition visible before expansion.
- Broad content consistency could create filler: use existing definitions where meaningful and hand-author missing ones; keep type-specific sections instead of mandatory empty placeholders.

## Migration Plan

Resolve sources before rendering, preserve old IDs/URLs and complete archives, add new routes and fields, run full source/build/spec/browser verification, then publish through the existing Pages workflow. Rollback is a scoped revert; old public endpoints stay available throughout.
