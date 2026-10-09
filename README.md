# Game Dev DB

A bilingual, open-source knowledge base for developers building games with AI assistance. Learn the principles behind a working game, use practical checks during development, and give agents structured, attributable context.

**Website:** [Русский](https://polyakovin.github.io/game-dev-db/ru/) · [English](https://polyakovin.github.io/game-dev-db/en/)

## What is here

- Original lessons about game foundations, design, engineering, and AI-assisted workflows.
- Curated links to primary documentation and useful external learning resources.
- Complete mechanic references for voice/audio games, point-and-click adventures and children's educational games, in Russian and English.
- Twelve original game-design exercises with constraints, deliverables and checks, in Russian and English.
- 117 attributed game-design lenses with original review questions, thematic filters and bilingual exports.
- Russian and English versions with matching lesson identifiers.
- Static Markdown and JSON exports for AI agents and other tools.
- An OpenSpec workflow for discussing changes before implementing them.

The initial release is a small reference library, not an exhaustive curriculum. Examples explain principles; verify engine-specific details against the linked documentation and your project's actual version.

## Run locally

Use Node.js 24, npm, and Python 3 (for the retained project-record check). Install the exact dependency versions from the lockfile:

```bash
npm ci
npm run dev
```

Open the local URL printed by Astro, including the `/game-dev-db/` base path. Before submitting a change:

```bash
npm run verify
```

`npm test` is an alias for the verification suite. Individual checks include `npm run check`, `npm run check:content`, `npm run build`, and `npm run check:dist`. For browser tests, install Chromium once with `npx playwright install chromium`, then run `npm run test:e2e`. The built site is written to `dist/` and deployed through GitHub Actions to GitHub Pages.

## Read with an agent

Start with [llms.txt](https://polyakovin.github.io/game-dev-db/llms.txt), then fetch only the lessons needed for the task.

| Format                      | Endpoint relative to the site root                |
| --------------------------- | ------------------------------------------------- |
| Agent index                 | `llms.txt`                                        |
| Full lesson corpus          | `llms-full.txt`                                   |
| Export manifest             | `api/v1/manifest.json`                            |
| Structured lessons          | `api/v1/lessons.json`                             |
| Resource catalog            | `api/v1/resources.json`                           |
| Mechanic catalogs           | `api/v1/mechanics.json`                           |
| Game-design practice        | `api/v1/practice.json`                            |
| Design lenses | `api/v1/lenses.json` |
| Lens reference | `content/lenses/{lang}/game-design.md` |
| Individual lesson           | `content/{lang}/{id}.md`                          |
| Individual mechanic catalog | `content/mechanics/{lang}/{id}.md`                |
| Practice collection         | `content/practice/{lang}/game-design-practice.md` |

The production site root is `https://polyakovin.github.io/game-dev-db/`. These are public files generated at build time, without an API key or server. Individual Markdown exports preserve lesson content and source metadata and add canonical URLs, attribution, and license fields to frontmatter. Read [the agent workflow](docs/agent-workflow.md) for attribution, language, and update guidance.

## Contribute

Corrections, translations, focused lessons, source improvements, and code contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), [the content guide](docs/content-guide.md), and [AGENTS.md](AGENTS.md). Open an issue to discuss a large topic before writing it.

For a behavior, content contract, or architecture change, create an OpenSpec change:

```bash
npm run spec -- new change <change-name>
npm run spec -- validate --all --strict
```

See [architecture](docs/architecture.md) and [agent development workflow](docs/agent-workflow.md). Small spelling and broken-link corrections do not need a separate proposal.

## Быстрый старт на русском

Game Dev DB помогает разработчикам, которые делают игры с ИИ, понимать игровые системы и проверять результат работы агентов. Материалы доступны на русском и английском, а Markdown и JSON можно использовать как контекст для ИИ.

Установите Node.js 24, выполните `npm ci`, затем `npm run dev`. Перед pull request запустите `npm run verify`. Чтобы добавить урок, создайте русскую и английскую версии с одинаковым `id`; формат и правила описаны в [руководстве по материалам](docs/content-guide.md). Для существенных изменений сначала оформите предложение в OpenSpec.

## Licenses and project scope

Software is licensed under [MIT](LICENSE). Original lessons and their translations are licensed under [CC BY 4.0](CONTENT-LICENSE.md). Linked resources retain their owners' licenses; a link does not grant permission to republish a resource.

The repository started from a commercial-project template. The [2026-10-09 decision](DECISIONS.md) authorizes this open-source MVP and its GitHub Pages publication. The retained commercial records do not represent validated demand, customers, or revenue.
