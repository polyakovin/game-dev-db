# Agent working agreement

## Scope and setup

- Game Dev DB is an open-source RU/EN knowledge portal for people and AI agents.
- Read `README.md`, `CONTRIBUTING.md`, `docs/architecture.md`, and the nearest instructions before editing.
- Resolve the Git root, inspect `git status`, and keep a task-owned path list. Preserve unrelated changes and stage explicit paths only.
- Use Node.js 24, npm, Python 3, and the committed lockfile: `npm ci`, then `npm run dev`.

## Architecture and content

- Astro builds a static site for `https://polyakovin.github.io/game-dev-db/`; all internal URLs must respect `/game-dev-db/`.
- Lessons live in `src/content/lessons/{ru,en}/{id}.md`. Frontmatter is the source of truth; see `docs/content-guide.md`.
- Each lesson has a matching RU/EN pair with the same stable `id`. Keep metadata, sources, examples, and meaning aligned.
- Generate lesson HTML, search data, Markdown, and JSON from the same content collection. Curated resources live in `src/data/resources.json`. Do not hand-edit generated exports or `dist/`.
- Keep schema and route changes compatible with `/api/v1/`. Update OpenSpec and documentation for a contract change.
- Prefer primary sources. Distinguish engine-independent principles from engine-specific behavior. Never fabricate references, results, or quotations.

## Change workflow and verification

- For substantial changes, use `npm run spec -- new change <name>` and write the proposal, specifications, and tasks before implementation. Read existing `openspec/` context first.
- Run `npm run verify` before delivery and `npm run test:e2e` before publication. Install the test browser once with `npx playwright install chromium`. `npm test` aliases verification; individual commands include `npm run check`, `npm run check:content`, `npm run build`, and `npm run check:dist`.
- Validate specifications with `npm run spec -- validate --all --strict`; archive an implemented, verified change with `npm run spec -- archive <name> --yes`.
- Use `npm run format` for source formatting and `npm run format:check` to check it.
- Check both languages, keyboard navigation, narrow layouts, search, lesson links, and machine exports when affected. Verify deployed URLs after publication; a local build does not prove a live deployment.
- Preserve the base path and trailing slash behavior when changing routing or deployment. Pages is static; no server-only feature or secret may be required at runtime.

## Release, licensing, and safety

- The user's 2026-10-09 request authorizes this MVP and GitHub Pages hosting. The dated `DECISIONS.md` entry supersedes the template's paid-validation prerequisite for this scope only.
- `commercial-project.json` remains the source of truth for commercial evidence. Pending gates stay pending until supported by real evidence. Validate it with `python3 scripts/commercial-project.py check .`.
- Code is MIT; original lessons and translations are CC BY 4.0. External resources retain their licenses. See `CONTENT-LICENSE.md`.
- Never commit credentials, private messages, personal customer data, `.env`, service accounts, or payment information. Commit only sanitized examples.
- External outreach, billing, spending, or publication beyond the authorized GitHub Pages scope requires explicit human authorization.
- Keep these instructions operational. Put design explanations in `docs/`, change contracts in OpenSpec, and dated decisions in the append-only `DECISIONS.md`.
