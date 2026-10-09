# Design

## Context

The portal currently has eight paired Markdown lessons, a bilingual resource JSON file, static Astro routes and content/build/browser checks. Three user-selected chats produced local HTML catalogs, with 27/44/64 families and 324/355/749 variants. Their HTML includes standalone styling and scripts inappropriate for copying into the site.

## Goals / Non-Goals

**Goals:** Preserve the taxonomies in maintainable bilingual data and reuse the existing site layout, base-path helpers and release checks. Keep all taxonomy text available in static HTML.

**Non-Goals:** Reclassifying focused lessons, ingesting third-party article bodies, or implementing playable demonstrations.

## Decisions

- Store each catalog in `src/data/mechanics/{id}.json`, with shared structural IDs and localized text objects. This follows the resource catalog's established bilingual JSON approach and makes variant parity intrinsic. Separate Markdown copies would require manually maintaining hierarchy and counts across four representations.
- Derive localized records, counts and Markdown from one shared module. Use the same records for HTML and JSON. Keep the lesson schema and existing endpoints intact; add mechanics endpoints and manifest fields.
- Render grouped native `details` elements with explicit branch lists and IDs. Progressive client search checks family/branch context and individual variants, opens matches and hides empty sections. Controls appear only after JavaScript initializes; native disclosures remain available without it.
- Preserve illustrative designs separately from sourced released-game examples. Imported chat identifiers and local paths remain in an internal provenance document rather than public exports. Verify primary source claims before publishing.
- Extend canonical content/build checks for bilingual nonempty text, identities, hierarchy/counts and full JSON/Markdown/HTML equivalence. Browser checks cover combined filtering, reset, locale switching, deep links, keyboard access, mobile and no-JavaScript reading.

## Risks / Trade-offs

- Long catalogs increase HTML and corpus size → serve static content, use disclosure sections and avoid shipping a second full search JSON payload.
- Working classifications overlap and include design proposals → preserve explicit limits and avoid claiming exhaustive scientific classification or demonstrated learning outcomes.
- Translation can drift → keep shared identities and review every translated family and variant against its Russian source; validate nonempty localized values.

## Migration Plan

Add routes and export fields without changing existing lesson/resource identities. Run verification and browser checks, archive the verified change, push a scoped commit to main for the authorized Pages deployment, and inspect live routes and exports. A scoped revert removes the additive feature if needed.
