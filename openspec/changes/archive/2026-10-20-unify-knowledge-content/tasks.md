# Tasks

## 1. Consistent authored content and reusable mechanics

- [x] 1.1 Standardize lesson bodies and enforce the contract across all 42 localized lessons, correct pathfinding expectations and enforce heading/source parity; verify with content validation and a calculation regression.
- [x] 1.2 Resolve shared mechanic family references, author missing definitions, preserve additional categories and mark archives in every format; document the contract and verify exact variant/anchor preservation and reference failures.

## 2. Complete reusable learning paths

- [x] 2.1 Add the starter path, outcomes, checks and data-authored practice rationales; permit shared lesson membership and show all path navigation; verify bilingual static navigation and reference validation.
- [x] 2.2 Add complete bilingual NPC and progression integration exercises, update discovery documentation and verify practice schema, ordered content and source exports.

## 3. Shared knowledge representation and connections

- [x] 3.1 Build the uniform record adapter, editorial relationships and derived source registry; document the schema and verify identities, localization, dangling links, reverse relations and source usage.
- [x] 3.2 Render common direct/reverse knowledge links on lessons, mechanics, exercises, lenses, paths and resources; verify static links, accurate labels and narrow layouts.
- [x] 3.3 Publish lightweight per-language indexes and individual JSON/Markdown records, preserve old exports and advertise the new endpoints; verify built record parity, archive status and stable nested IDs.

## 4. Cross-content discovery and release validation

- [x] 4.1 Add localized search routes and shared query matching with aliases, body text, types, query URLs and reset; document usage and verify cross-type retrieval, keyboard interaction and no-script fallbacks.
- [x] 4.2 Run scoped formatting, canonical verify, full browser tests and production-preview visual checks in both themes/languages; fix confirmed failures and record actual results.

## Workflow follow-up

- Archive the implemented and verified change using the canonical OpenSpec command.
- Commit only task-owned paths, push the scoped change, and verify the authorized GitHub Pages deployment and key public exports.

## Verification record, 2026-10-20

- Combined source: 21 RU/EN lesson pairs, 30 bilingual mechanic catalogs, 14 exercises and 117 lenses.
- Node.js 24.15.0 and Python 3.13: canonical `npm run verify` and `npm run format:check` passed.
- All 283 Playwright tests passed against the built production preview. The uniform-record regression uses Node assertions to preserve exhaustive checks without emitting tens of thousands of runner steps.
- Russian/English search, starter path, NPC integration exercise and mechanic backlinks were inspected at 1440px and 390px in light/dark appearance. No page errors or horizontal overflow were observed.
- Existing endpoint shapes, source variants, nested anchors and the archive remain compatible. External examples and educational outcomes were not independently playtested in this implementation.
