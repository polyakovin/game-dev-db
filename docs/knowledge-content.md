# Consistent knowledge content

The authored sources remain lesson Markdown and type-specific bilingual JSON. All
materials also have one common representation built by `src/lib/knowledge.mjs`:
`key`, `type`, `id`, `lang`, `title`, `summary`, `updatedAt`, `status`, `url`,
`jsonUrl`, `markdownUrl`, `aliases`, `tags`, `sourceIds`, `sources`, `sections`,
`relations`, `placements`, `supersededBy`, `attributes`, licenses and provenance.
An unknown editorial date is `null`; it must never be inferred from a build date.

## Structure

Every source of one type follows the same contract. Lessons have six ordered H2
sections: prerequisites, principle, practical example, common mistakes, verification
and agent task. Specific example names are H3. Old H2 fragments are explicit anchors.
Exercises always contain goal, scenario/materials, constraints, steps, deliverable,
checks and reflection. Lenses contain principle, questions and attribution.
Mechanic families contain a visible definition, branches/variants, an optional
hypothetical example, context, sources and connections. Path outcomes, checks and
practice rationale are authored data. Optional sections carry real content rather
than empty filler; the common envelope does not make a jam imitate a tutorial.

All common records expose ordered `{id,title,body}` sections. `attributes` keeps
type-specific metadata such as lesson duration, lens number, source language or jam
dates. HTML uses the authored content and shared `KnowledgeLinks.astro`; JSON and
Markdown retain the same content, sources and graph. Existing v1 exports preserve
their original shapes for compatibility.

## Relationships and sources

`src/data/knowledge-relations.json` contains editorial `from`, `type`, `to` keys.
Types are `requires`, `explains`, `practices`, `reviews`, `contains`, `uses`,
`related` and `supersededBy`. The builder also derives path membership, existing
inline lesson links and links to cited curated resources. Reverse labels and links
are derived once. Do not hand-maintain inverse edges. Unknown endpoints, unknown
relationship types, self-links and prerequisite cycles fail validation.

A mechanic's canonical ID identifies the concept; `placements` retains every
catalog URL and anchor. The 34 shared children/education families become one common
record each, with two placements. Catalog-specific concepts and archives keep
separate IDs. Similar wording alone is not evidence that two concepts are identical.

Source IDs are stable hashes of normalized URLs (fragment and final slash removed).
Original citation URLs remain in each record. The source registry exposes localized
titles and `usedBy` keys. `verifiedAt: null` explicitly means the generator has no
independently recorded verification date; editorial dates are not source checks.
Curated resource cards use these connections to show where a source is used.

## Routes and discovery

For every active canonical mechanic, `attributes.preview` contains the compact
illustrated presentation at the same canonical URL. The full record sections
remain in machine formats and catalogs. Archived mechanic records and other
focused content types still render all sections. See [the preview contract](mechanic-previews.md).

All routes are relative to the `/game-dev-db/` site root:

- `{lang}/search/`: combined type/text search, aliases, query URLs and static section links.
- `api/v1/knowledge/{lang}/index.json`: active metadata only, without bodies.
- `api/v1/knowledge/{lang}/search.json`: metadata plus searchable text, loaded by the browser.
- `api/v1/knowledge/{lang}/{type}/{id}.json`: one complete common record.
- `content/knowledge/{lang}/{type}/{id}.md`: the same record as frontmatter and Markdown.
- `api/v1/sources.json`: shared source identities and bilingual usage locations.
- `{lang}/knowledge/{type}/{id}/`: focused active mechanic, exercise and lens pages.
- `llms/{lang}.txt` and `agent-instructions/{lang}.md`: localized discovery and optional project integration.

For active mechanics, exercises and lenses, the common record's `url` now cites
the focused HTML page; `placements` preserves collection fragments. Legacy
type-specific APIs retain their original URLs and shapes. Focused HTML renders
the same sections, sources, provenance and licenses as the common machine record.
See [search discovery](search-discovery.md) for sitemap behavior and webmaster setup.

Search excludes archives and expired jams; consumers must also check `endsAt` at
read time. Catalog filters stay available. Multiple mechanic categories affect
filtering while the primary section controls placement. Legacy APIs and old archive
URLs remain accessible, including complete original archive content.

## Verification

`npm run check:content` validates canonical headings, source parity, reference
resolution and graph integrity. `npm run check:dist` compares every individual JSON
and Markdown record with the source representation and resolves canonical and
relationship URLs. `tests/knowledge.spec.ts` checks numeric pathfinding expectations,
bilingual envelopes, source identities, archive exclusion, search and static
bidirectional navigation. Run `npm run verify` and `npm run test:e2e` before release.

Release validation on 2026-10-20 covered the combined 21 lesson pairs, 30 mechanic
catalogs, 14 exercises and 117 lenses. Canonical verification, formatting and all
283 Playwright tests passed; production previews were inspected in both languages,
themes and narrow/wide layouts. This verifies content contracts and site behavior,
not the outcomes of the hypothetical game-design examples.
