# gamemechanics.pro

gamemechanics.pro is an open-source game development reference in Russian and English. Use it to design a mechanic, test it in a prototype or give an AI agent a lesson with sources for the task at hand.

**Website:** [Русский](https://gamemechanics.pro/ru/) · [English](https://gamemechanics.pro/en/)

## What is here

- Original lessons about game foundations, design, engineering, and AI-assisted workflows.
- Five learning paths cover a first verifiable prototype, level design, balance, NPC behavior and game verification. Each pairs lessons with exercises, design lenses and checks.
- Curated links to primary documentation and useful external learning resources.
- Current and upcoming game jams with official entry links, automatic deadline expiry and discovery calendars in Russian and English.
- [Animation Lab](https://gamemechanics.pro/ru/animation-lab/): local 3D model and animation inspection, portrait PNG and browser video export, with RU/EN controls. See [usage and browser limits](docs/animation-lab.md).
- Bilingual mechanic references for genres, puzzles, dialogue, drawing, investigation, children and education, RPG grind, engagement, electronic devices and physical input. Includes complete discussion catalogs and the attributed Boss Fight Atlas and Game Mechanics indexes; see [coverage](docs/research/discussion-mechanics.md).
- The [card library](https://gamemechanics.pro/ru/mechanics/cards/) covers all 1268 active canonical mechanics. Each card has a short explanation in both languages and an annotated WebP screenshot.
- Charge, sweep, ground slam, summon and gap volley cards also have animated demonstrations using the Boss Fight Atlas characters, with phase explanations, seeking and a screenshot switch. See [demonstration coverage and controls](docs/mechanic-demonstrations.md).
- Fourteen original game-design exercises, including NPC and progression capstones, with constraints, deliverables and checks in Russian and English.
- 117 attributed game-design lenses with original review questions, thematic filters and bilingual exports.
- Russian and English versions with matching lesson identifiers.
- Static Markdown and JSON exports for AI agents and other tools.
- An OpenSpec workflow for discussing changes before implementing them.

Before applying an example in your game, check the linked documentation for the version of the engine you use.

## Run locally

Use Node.js 24, npm, and Python 3 (for the retained project-record check). Install the exact dependency versions from the lockfile:

```bash
npm ci
npm run dev
```

Open the local URL printed by Astro; the site runs at `/`. Before submitting a change:

```bash
npm run verify
```

`npm test` is an alias for the verification suite. Individual checks include `npm run check`, `npm run check:content`, `npm run build`, and `npm run check:dist`. For browser tests, install Chromium once with `npx playwright install chromium`, then run `npm run test:e2e`. The built site is written to `dist/` and deployed through GitHub Actions to GitHub Pages.

## Read with an agent

Start with [llms.txt](https://gamemechanics.pro/llms.txt), then fetch only the lessons needed for the task.

Language-specific starts: [Русский](https://gamemechanics.pro/llms/ru.txt)
and [English](https://gamemechanics.pro/llms/en.txt). The
[agent guide](https://gamemechanics.pro/en/for-agents/) includes an
AGENTS.md integration snippet. Individual mechanics, exercises and lenses have
focused bilingual HTML pages alongside JSON and Markdown. See
[discovery operations and evaluation](docs/search-discovery.md).

For cross-content retrieval, start with `api/v1/knowledge/{lang}/index.json` and
follow one record's `jsonUrl` or `markdownUrl`. Every content type uses the same
record envelope with sections, sources and typed connections. Human readers can
use the shared search at `{lang}/search/`. See [the common content contract](docs/knowledge-content.md).

| Format                      | Endpoint relative to the site root                |
| --------------------------- | ------------------------------------------------- |
| Agent index                 | `llms.txt`                                        |
| Full lesson corpus          | `llms-full.txt`                                   |
| Export manifest             | `api/v1/manifest.json`                            |
| Structured lessons          | `api/v1/lessons.json`                             |
| Learning paths              | `api/v1/learning-paths.json`                      |
| Resource catalog            | `api/v1/resources.json`                           |
| Game jams and calendars     | `api/v1/jams.json`                                |
| Mechanic catalogs           | `api/v1/mechanics.json`                           |
| Game-design practice        | `api/v1/practice.json`                            |
| Design lenses               | `api/v1/lenses.json`                              |
| Lens reference              | `content/lenses/{lang}/game-design.md`            |
| Individual lesson           | `content/{lang}/{id}.md`                          |
| Individual mechanic catalog | `content/mechanics/{lang}/{id}.md`                |
| Practice collection         | `content/practice/{lang}/game-design-practice.md` |

The production site root is `https://gamemechanics.pro/`. These are public files generated at build time, without an API key or server. Individual Markdown exports preserve lesson content and source metadata and add canonical URLs, attribution, and license fields to frontmatter. Read [the agent workflow](docs/agent-workflow.md) for attribution, language, and update guidance.

Production HTML includes Cloudflare Web Analytics using the owner's existing hostname property. Local development omits the beacon; reading and machine exports work without it. See [analytics configuration and verification](docs/web-analytics.md).

The owner's global Codex Stop hook commits scoped task changes and hands the
current `main` release to verified Pages CI through `.codex/release.json`. See [hook setup and
release recovery](docs/codex-hooks.md).

Game jams are available at [`ru/jams/`](https://gamemechanics.pro/ru/jams/) and [`en/jams/`](https://gamemechanics.pro/en/jams/). The browser hides events at their submission deadline. A daily verified deployment refreshes static snapshots; JSON consumers must filter `endsAt > now` at read time. New events remain curated editorial additions. See [the jam content contract](docs/jams-content.md).

## Contribute

Corrections, translations, focused lessons, source improvements, and code contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), [the content guide](docs/content-guide.md), and [AGENTS.md](AGENTS.md). Open an issue to discuss a large topic before writing it.

For a behavior, content contract, or architecture change, create an OpenSpec change:

```bash
npm run spec -- new change <change-name>
npm run spec -- validate --all --strict
```

See [architecture](docs/architecture.md) and [agent development workflow](docs/agent-workflow.md). Small spelling and broken-link corrections do not need a separate proposal.

## Быстрый старт на русском

На gamemechanics.pro можно разобраться в игровой механике, проверить её в прототипе или передать ИИ-агенту урок вместе с задачей. Материалы на русском и английском доступны на сайте, в Markdown и JSON.

Установите Node.js 24, выполните `npm ci`, затем `npm run dev`. Перед pull request запустите `npm run verify`. Чтобы добавить урок, создайте русскую и английскую версии с одинаковым `id`; формат и правила описаны в [руководстве по материалам](docs/content-guide.md). Для существенных изменений сначала оформите предложение в OpenSpec.

## Licenses and project scope

Software is licensed under [MIT](LICENSE). Original lessons and their translations are licensed under [CC BY 4.0](CONTENT-LICENSE.md). Linked resources retain their owners' licenses; a link does not grant permission to republish a resource.

The repository started from a commercial-project template. The [2026-10-09 decision](DECISIONS.md) authorizes this open-source MVP and its GitHub Pages publication. The retained commercial records do not represent validated demand, customers, or revenue.
