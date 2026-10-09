# MVP release record

## Scope

2026-10-09: the owner requested an open-source Russian/English game-development
knowledge portal, OpenSpec, agent-ready development, and GitHub Pages publication.

The MVP contains eight original lesson pairs, twelve curated primary resources,
client-side search and category filters, reading pages, language switching, a
contribution workflow, and static JSON/Markdown exports for agents. No backend,
account, telemetry, payment integration, or paid hosting was added.

## Verification

- `npm run verify`: Astro type checks, content schema and translation parity,
  static build, all internal links/anchors, source-to-export consistency,
  strict OpenSpec validation, and preserved commercial evidence validation.
- `npm run test:e2e`: Chromium search/filter/reset, language switching,
  resource/export navigation, mobile overflow, and reading without JavaScript.
- Desktop and mobile layouts were visually inspected. Small-text contrast and
  the mobile GitHub accessible name were corrected in review.
- Production dependency audit: zero reported vulnerabilities on 2026-10-09.

## Dependency follow-up

The full development dependency audit reports eight affected package entries
from two upstream advisory chains: OpenSpec → fast-glob → micromatch → braces
([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)), and
gray-matter → js-yaml → argparse → sprintf-js
([GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c)).
These tools run during local development and CI; they are not shipped as a live
server. The installed OpenSpec is 1.14.1, the latest published version checked
at setup. npm's offered fixes require incompatible downgrades. Keep dependency
updates under review; do not apply `npm audit fix --force` blindly.

## Task-owned paths

Application/configuration: `src/`, `public/`, `astro.config.mjs`, `tsconfig.json`,
`package.json`, `package-lock.json`, `.nvmrc`, `.gitignore`, `.prettier*`,
`playwright.config.ts`, `scripts/run-tool.mjs`, `scripts/verify-content.mjs`,
`scripts/verify-dist.mjs`, `tests/`.

Project context: `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
`SECURITY.md`, `LICENSE`, `CONTENT-LICENSE.md`, `docs/`, `COMMERCIAL.md`, and the
appended `DECISIONS.md` entry. Specifications/integrations: `openspec/`,
`.agents/`, `.claude/`, `.cursor/`, `.github/`.

The pre-existing untracked `.project-control-panel/.gitignore` is outside this
task and was not staged. `commercial-project.json`, `EXPERIMENTS.md`, and the
original commercial validator remain unchanged.

## Publication

The initial commit `9dd6920` was deployed successfully by [GitHub Actions](https://github.com/polyakovin/game-dev-db/actions/runs/37912984551) on 2026-10-09. The live site is [Game Dev DB](https://polyakovin.github.io/game-dev-db/ru/).

Post-deployment verification passed for 21 public URLs: both catalogs, a paired lesson, resources and agent pages, all JSON endpoints, llms files, paired Markdown, sitemap, favicon, font licenses, a stylesheet and a font asset. JSON and Markdown matched the locally verified build. The published catalog was opened in a browser and its search returned the expected single lesson and updated count.
