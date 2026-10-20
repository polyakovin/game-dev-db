# Tasks

## 1. Original bilingual lesson

- [x] 1.1 Write the RU/EN world-to-gameplay lesson pair; review source credit, original wording, example logic and translation parity, then pass content validation and formatting for both files.

## 2. Integration verification

- [x] 2.1 Pass npm run verify and npm run test:e2e; inspect both new rendered pages at desktop/mobile sizes, keyboard navigation, search, no-JavaScript reading, lesson links and attributed Markdown/JSON exports.

Verified on 2026-10-20 in an isolated snapshot of tracked HEAD plus this change:
`npm run verify` and all 131 Playwright tests passed with bundled Node 24 and Python.
RU/EN production previews were visually reviewed, including 375px layouts, language
switching, keyboard skip navigation and catalog search. Generated HTML, Markdown
and JSON retain the author link and complete content. Source comparison found no
shared consecutive eight-word phrases with the reviewed Russian guide.

## Workflow follow-up

- Archive the verified change and validate the resulting specifications.
- Commit and push only task-owned paths; check the deployed lesson pages and exports after Pages completes.
