# Contributing to Game Dev DB

Contributions may be in Russian or English. Public issues and pull requests should contain no secrets, private messages, customer data, or other personal information.

## Choose a contribution

- Correct a factual error or an unclear explanation.
- Improve an existing translation or lesson example.
- Add a focused lesson with a clear outcome and a practical check.
- Suggest a primary source and explain which lesson it supports.
- Improve accessibility, search, exports, tests, or the contribution workflow.

For a new large topic or feature, open an issue first to explain the learner's need and the smallest useful scope. You can also open a draft pull request early. A draft may contain one language while it is being translated; a publishable lesson needs both.

## Local workflow

1. Fork the repository and create a branch, preferably `feature/<short-description>`.
2. Use Node.js 24 and run `npm ci`.
3. Read [AGENTS.md](AGENTS.md), [architecture](docs/architecture.md), and the relevant existing lessons or specifications.
4. For a substantial behavior, architecture, or content-contract change, create an OpenSpec change with `npm run spec -- new change <name>`. Describe the problem, expected behavior, and acceptance checks before implementation.
5. Make one focused change. Keep Russian and English lesson pairs consistent.
6. Run `npm run verify` and `npm run spec -- validate --all --strict`. For interface changes, run `npm run test:e2e` (install the browser once with `npx playwright install chromium`).
7. Open a pull request describing the reader-visible result, sources, and verification. Mention any incomplete checks or translation work.

Spelling corrections, small clarifications, and straightforward source-link repairs do not need a separate OpenSpec proposal. A maintainer may help finish or archive a change after review.

## Content standards

Follow [the content guide](docs/content-guide.md). Explain why a principle matters, show how to apply it, and give the reader a way to check their implementation. Prefer a small, runnable or clearly marked illustrative example over a long unexplained code dump.

Use original wording. Link to external material instead of copying it. Verify claims against primary documentation where possible, state relevant engine/version limitations, and avoid presenting taste as a universal rule. Do not invent benchmarks, user research, citations, or results.

Translations should preserve meaning, examples, and caveats while sounding natural in the target language. Keep the lesson `id` stable, and review the paired version when changing a lesson's substance.

## AI-assisted contributions

AI-assisted work is welcome. The contributor is responsible for checking facts, sources, licensing, code behavior, and both language versions. Review every generated diff, remove invented citations and unnecessary content, and run the same checks required for human-written work. Describe material validation limits in the pull request.

## Licensing and conduct

Submit only material you have permission to contribute. By submitting software, you agree to its distribution under [MIT](LICENSE); by submitting original lesson content or a translation, you agree to [CC BY 4.0](CONTENT-LICENSE.md). Clearly identify third-party material and its applicable license. Do not add material under incompatible terms.

Follow the [Code of Conduct](CODE_OF_CONDUCT.md). For vulnerabilities, follow [SECURITY.md](SECURITY.md) rather than publishing exploit details.

## Участие на русском

Можно предлагать исправления, уроки, переводы, полезные источники и улучшения сайта. Для большой темы сначала откройте issue с задачей читателя и предлагаемым объёмом. Обсуждение и pull request могут быть на русском или английском.

Для работы нужны Node.js 24 и npm: `npm ci`, затем `npm run dev`. Перед pull request выполните `npm run verify` и `npm run spec -- validate --all --strict`. Существенные изменения сначала опишите в OpenSpec; исправлению опечатки отдельное предложение не требуется.

Публикуемый урок должен иметь русскую и английскую версии с одинаковым `id`. Пишите своими словами, проверяйте ссылки и указывайте ограничения примеров. ИИ можно использовать, но проверка фактов, лицензий, переводов и кода остаётся обязанностью автора вклада. Код распространяется по MIT, оригинальные уроки и переводы по CC BY 4.0.
