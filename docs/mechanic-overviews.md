# Mechanic direction overviews

The 329-direction map combines full standalone catalogs with authored topic overviews inside group catalogs. Existing full catalogs remain preferred. Group overviews fill the missing topics in order of cross-genre usefulness; this order is an editorial choice, not a measured popularity ranking.

## Content contract

Group catalogs are ordinary bilingual JSON sources in `src/data/mechanics/`, registered in `src/lib/mechanic-overviews.mjs`. Their `overviewGroupId` refers to a stable map group. Reuse an existing substantive family when it already covers a direction, with at least four variants; the reviewed associations are recorded in `docs/mechanic-content-reuse.json`. Otherwise each missing topic becomes a family with the same stable direction ID and paired title, a distinct definition of its action/decision loop, at least four explained variants, an illustrative scenario, a `prototypeCheck` and one or more listed source associations.

The scenario describes a hypothetical design. The check is work the reader should perform, not a claim of completed validation. Source descriptions state their narrow support: implementation examples, a specific released-game observation or device capability. They do not certify every editorial variant. Hardware concepts must retain capability and failure conditions; no physical-device or educational-effect claim follows from listing an idea.

`prototypeCheck` is authored separately from the example. Localization appends it with the “Проверка прототипа” / “Prototype check” label to the existing example field, so HTML, Markdown, v1 and individual knowledge records include the complete check without requiring a second source or a breaking schema change.

## Precise targets and readiness

An optional `materialRef: {catalogId, familyId}` on a direction identifies its existing reference family or group overview. The direction's original `id` and expected standalone `catalogId` remain stable. Resolution first prefers an active standalone catalog. Otherwise both the referenced active catalog and its target family must exist. The resulting canonical URL includes `#familyId`, and counts describe the one targeted family rather than the entire parent catalog. The direction JSON exposes the resolved `materialRef` additively.

Cards use the resolved URL, including its anchor. Registering a parent catalog alone never makes a missing family ready. Supplementary catalog discovery excludes parents already represented by topic targets, while the home page and complete catalog exports still discover every active catalog.

## Quality and verification

`validateMechanicOverviews` verifies group/topic membership, matching bilingual titles, unique substantive definitions, scenarios and checks, four distinct explained variants per language and listed sources. `validateDirectionMaterials` rejects authored references whose active catalog/family target does not exist. The canonical content check runs both validators. Ordinary catalog validation still checks tree identities, translation parity, dates and source/reference URLs.

Review each family while authoring; word counts and structural validation do not establish factual correctness or design quality. Run the complete `npm run verify` and browser suite before a batch is published. At final completion require all 329 directions to be ready, retain every existing URL/anchor, and inspect common and specialized examples in both languages, themes and narrow layouts. Preserve incomplete labels until their content passes this process.

## Coverage at completion

The 2026-10-21 audit covers all 329 directions in 32 groups: 28 existing standalone references, 65 reviewed existing family targets and 236 newly authored overviews across 32 group catalogs. The new overviews contain 944 explained variants. The map has no unresolved direction. The general Game Mechanics catalog remains an additional entry, so the discovery index contains 330 ready entries in total.
