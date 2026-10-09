# Writing and translating lessons

A lesson should help a developer make one concrete decision or verify one part of a game. Write for someone who can ask an AI to produce code but still needs to understand the behavior, tradeoffs, and checks that make the result usable.

## Files and metadata

Create a pair of files with the same lowercase, hyphen-separated identifier:

```text
src/content/lessons/en/example-topic.md
src/content/lessons/ru/example-topic.md
```

The identifier is also used in public URLs. Keep it stable when editing a title or translation. Each file starts with frontmatter in this form:

```yaml
---
id: example-topic
lang: en
title: A clear, specific lesson title
description: One sentence explaining the decision or skill this lesson helps with.
category: foundations
level: beginner
minutes: 6
updatedAt: '2026-10-09'
tags:
  - game-loop
  - testing
sources:
  - title: Primary documentation title
    url: https://example.org/documentation
---
```

The sample title and source URL above are placeholders. Replace them with the actual lesson metadata and a checked source before publishing.

| Field         | Meaning                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------- |
| `id`          | Stable lesson identifier; identical in the RU and EN pair                                |
| `lang`        | `ru` or `en`, matching the containing directory                                          |
| `title`       | Human-readable localized title                                                           |
| `description` | Nonempty localized summary for catalog and agent selection, at most 200 characters       |
| `category`    | `foundations`, `design`, `engineering`, or `workflow`                                    |
| `level`       | `beginner` or `intermediate`                                                             |
| `minutes`     | Integer from 1 to 120 estimating reading time; not a measured learning outcome           |
| `updatedAt`   | Date of a substantive editorial update, in `YYYY-MM-DD` format                           |
| `tags`        | Nonempty list of unique topic identifiers; use consistent tags across the pair           |
| `sources`     | At least one source with a descriptive `title` and public HTTPS `url`; no duplicate URLs |

Use the same category, level, update date, and conceptual tags in a translation pair. Reading time may differ with the translated text. Update dates should reflect the actual editorial update, not be refreshed automatically on every build.

The published Markdown endpoint adds `url`, `markdownUrl`, `attribution`, `license: CC-BY-4.0`, and `codeLicense: MIT` to the source metadata while retaining the lesson body. Do not add or maintain those generated fields in the lesson source. The exporter derives them consistently for every language version.

## Lesson structure

The page supplies its title from frontmatter. Start the body with a brief explanation, then use `##` sections with localized headings. Cover these elements in a natural order:

1. The principle and the problem it solves.
2. When it applies and where its limits are.
3. A small concrete example, with pseudocode labeled as such.
4. Common mistakes and their observable symptoms.
5. Checks a person or agent can perform on the result.
6. A specific task or prompt that turns the principle into development work.

These are editorial requirements, not literal mandatory English headings. Automated checks require at least 120 words and three `##` sections in each language. Avoid a long tutorial that mixes many unrelated principles. Use fenced code blocks with a language identifier. Prefer standard Markdown that remains readable outside the website.

## Evidence and outside resources

Prefer engine documentation, specifications, original research, and material published by the author of the technique. Check that a link supports the claim next to it; a familiar domain is not sufficient. Mention the engine or version when a claim depends on it. Distinguish a design recommendation from a requirement.

List lesson sources in frontmatter so the lesson page and agent exports can retain them. Add inline links where a reader needs to verify a particular claim. Avoid unsupported promises such as “always faster”, invented benchmark numbers, or claims that an example was tested when it was not.

Write original explanations. Quote only what is necessary and clearly attribute it. Do not copy paid courses, book chapters, external articles, or code with incompatible license terms. External sources keep their original licenses.

## Mechanic reference catalogs

Full taxonomies live in `src/data/mechanics/{id}.json`. They use one shared hierarchy with RU/EN text values and produce HTML, JSON and Markdown through the same module. Keep all variants, design notes, source descriptions and classification limits aligned across languages. See [the mechanic content contract](mechanics-content.md) for identities, provenance, validation and exports. Use focused lesson Markdown for tutorials; use this catalog format for a browsable taxonomy.

## Game-design practice

Exercises live in `src/data/practice.json`, with shared metadata and complete
paired RU/EN content. Keep goals, scenarios, constraints, steps, deliverables,
checks and reflection questions aligned. Use the [practice contract](practice-content.md)
for source attribution, validation and exports. Estimated exercise time is
different from a lesson's reading time.

## Design lenses

Use the bilingual `src/data/lenses.json` dataset for the dedicated Lenses section. Write original concise summaries and review prompts, preserve author and edition identities, and distinguish third-edition fractional numbers from another author’s unnumbered lens. See [the lens content contract](lenses-content.md). Do not copy book passages or card questions into the public dataset.

## Curated resource catalog

Add independent resource recommendations to `src/data/resources.json`. Each record needs a unique lowercase, hyphen-separated `id`, a public HTTPS `url`, a lesson `category`, a `language` (`en`, `ru`, or `multi`), and a `kind` (`documentation`, `book`, `article`, or `tool`). Both `title` and `description` are objects with nonempty `ru` and `en` strings. The descriptions should explain when the resource is useful, not promise results.

Keep resource URLs unique. A translated description does not mean the destination itself is available in that language; set `language` according to the linked resource. Listing a resource does not relicense its contents.

References may add localized `authors`, `access` and `practice` objects, each with nonempty `ru` and `en` values. Identify authors or creators in new recommendations; explain paid access and platform requirements without maintaining volatile prices. Practice prompts are original suggestions, not copied book exercises.

The optional `format` is `channel`, `game` or `course`. Preserve the existing coarse `kind` values for v1 clients: channels and courses use `documentation`, creation/practice games use `tool`. The UI displays the specific format when present. All source fields pass through unchanged to `api/v1/resources.json`. The resources page groups each record once into books, channels, practice, research/courses or development documentation. See [reference selection notes](research/design-references.md) for provenance and verification limits.

## Translation review

A Russian and English pair should teach the same principle, with equivalent examples, warnings, and sources. Translate for meaning and natural phrasing; do not copy awkward word order. Keep API names and conventional technical terms when translation would obscure them. Explain a specialist term the first time it appears.

When correcting a substantive issue, check both versions. If a contribution is not ready in both languages, keep it in a draft pull request rather than publishing an incomplete pair.

## Before a pull request

- Verify source links and the factual claims they support.
- Review the rendered lesson in both languages, including code blocks and narrow screens.
- Check matching IDs and complete metadata.
- Run `npm run verify`.
- Confirm the generated Markdown/JSON still contains readable content, sources, and the correct language.
- State any example that is illustrative rather than executed, and any check you could not complete.

## По-русски

Один урок должен помогать принять конкретное решение или проверить часть игры. Объясните принцип, покажите небольшой пример, назовите типичные ошибки и дайте проверку результата. Это особенно важно для разработчика, который поручает написание кода ИИ.

Создавайте пару `ru/{id}.md` и `en/{id}.md` с одинаковым стабильным `id`. Заголовки и описания переводятся, категория и смысл материала сохраняются. Источники указываются в `sources`; проверяйте, что они подтверждают утверждения. Перед pull request просмотрите обе версии и выполните `npm run verify`.
