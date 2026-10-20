# Tasks

## 1. Editorial order

- [x] 1.1 Define documented prototype-first rankings for every catalog and nested mechanic scope; implement stable shared sorting and validate duplicate/unknown references with focused regression checks.

## 2. Shared presentation and exports

- [x] 2.1 Apply group/item order in lessons, mechanics, lenses, practice, references and jam calendars; verify RU/EN HTML and JSON/Markdown order, filtering and no-script reading with browser regressions.

## 3. Integration

- [x] 3.1 Run canonical verification, formatting and full browser checks; preserve unrelated changes and record concrete verification results.

## Verification

- `npm run verify`: passed, including Astro diagnostics, source validation, the static build, links/anchors, exports, strict OpenSpec validation and the retained project-record check.
- `npm run format:check`: passed.
- `PLAYWRIGHT_PORT=4337 npm run test:e2e -- --workers=2`: 108 passed, including six editorial-order regressions and the independently added RPG catalog present in the shared working copy.
- Unrelated project-control files and RPG additions are excluded from this change's commit.

## Workflow follow-up

- Archive the verified change, then commit and push only task-owned paths.
- Check the deployed site if publication succeeds.
