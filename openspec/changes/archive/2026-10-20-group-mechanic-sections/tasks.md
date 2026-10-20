# Tasks

## 1. Grouped content and exports

- [x] 1.1 Add bilingual group metadata, concise RPG grind section titles, localization, validation and Markdown hierarchy; document the optional field and verify content and export checks.

## 2. Reading and navigation

- [x] 2.1 Render group subtitles in the contents and article, native selector optgroups and filtered group visibility; verify both languages, keyboard/current-section navigation, mobile layout and no-JavaScript reading with browser checks.

## 3. Integration

- [x] 3.1 Run canonical verification, browser tests and strict OpenSpec validation; inspect the rendered result and confirm identities remain unchanged.

## Verification results

- `npm run verify` passed, including content, production export and strict specification validation.
- The final full browser run passed 286 cases; its single English editorial-order case was interrupted by a dev-server navigation and passed when rerun alone with `--last-failed --workers=1`. All 287 cases passed across those runs, including four new group-specific cases.
- Desktop and 375 px mobile screenshots were reviewed. Source comparison confirmed unchanged families, notes, sources and section IDs; missing group translations were rejected.

## Workflow follow-up

- Archive the verified change, commit scoped paths and publish through the authorized GitHub Pages workflow; verify the live result.
