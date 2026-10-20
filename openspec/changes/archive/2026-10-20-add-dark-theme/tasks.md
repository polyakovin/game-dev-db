# Tasks

## 1. Theme behavior and presentation

- [x] 1.1 Add shared light/dark tokens, migrate fixed presentation and SVG colors, and include standalone pages; verify all sections in both appearances and light print output.
- [x] 1.2 Add early preference initialization and localized accessible controls with storage fallbacks; document the approach and verify system changes, persistence, keyboard access, no-JavaScript reading and blocked storage in browser tests.

## 2. Integration validation

- [x] 2.1 Format owned files, run `npm run verify` and `npm run test:e2e`, and inspect RU/EN desktop and mobile pages in a real browser. Canonical verification and all 59 Chromium tests passed; both palettes fit 320px, and the dark catalog was visually inspected.

## Workflow follow-up

- Archive the implemented and verified change and validate all specifications strictly.
- Commit and push only owned paths, then verify the deployed RU/EN theme behavior on GitHub Pages.
