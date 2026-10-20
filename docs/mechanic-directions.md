# Mechanic direction map

The mechanics index includes the agreed editorial map of 329 directions in 32 groups, plus active general catalogs that do not correspond to one of those directions. It is a map of possible reference topics, not a claim that all articles have been written or that the classification exhausts game design.

## Source and availability

Edit `src/data/mechanic-directions.json`. Group and direction IDs are shared by Russian and English and are public HTML anchors; preserve them when changing titles. Every title must have complete `ru` and `en` values. `catalogId` identifies the existing or expected mechanic catalog for that topic. IDs and catalog associations must be unique.

`getMechanicDirections(lang)` resolves the source against active registered catalogs from `getMechanics(lang)`. A matching standalone catalog is preferred. An optional `materialRef` can instead target an existing family in an active group catalog; the ready URL then includes that family's anchor and its counts describe that one family. An absent, draft or archived target leaves its direction `in-development`, with `url: null` and `counts: null`. The visible labels are «В разработке» and “In development”. The map does not store a second readiness boolean and does not create empty article routes. See [overview authoring](mechanic-overviews.md).

Prepared discussion content stays in development until its catalog or precise family target is integrated. Counts are derived from current content, not stored editorial totals. A newly registered matching catalog becomes ready on the next build. Other active catalogs appear in the additional general-reference group so existing materials remain discoverable.

## Reading and filters

Both `/game-dev-db/ru/mechanics/` and `/game-dev-db/en/mechanics/` include the entire structure in static HTML. Ready and unfinished entries use the same compact card layout; ready entries are links, unfinished entries are non-interactive cards with a clear status.

The grouped map follows its agreed source order in HTML and its own JSON endpoint. The home page's completed-catalog cards and the internal trees of completed references retain their existing editorial importance order.

Search, group selection and “Только готовые” / “Ready only” combine. Empty groups disappear, result counts reflect the combined filters, and reset clears all three controls. Search includes both language labels so a query survives a language switch. URL parameters `q`, `group` and `ready=1` preserve filters on reload, language switching and shared links. All entries remain readable without JavaScript; inactive filtering controls remain hidden.

## Static export and validation

`/game-dev-db/api/v1/mechanic-directions.json` is an additive schema-version-1 endpoint with `indexes` for both languages. Each includes localized groups/directions, canonical index URL, statuses, ready catalog links, additional catalogs and derived counts. `directions` counts the agreed map, while `entries` also includes supplementary general catalogs. No unfinished article body is added to the existing mechanics endpoint.

The resolver validates source identities, catalog associations and complete localization when imported by the build. `tests/mechanic-directions.spec.ts` checks source parity, missing/archived/published availability transitions, complete rendered HTML and JSON, combined filters, URL state, language switching, keyboard use, themes, mobile layout and static reading. Run `npm run verify` and `npm run test:e2e` before publishing.
