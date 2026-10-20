# Learning-path contract

`src/data/learning-paths.json` joins existing content by stable IDs. Each path has a unique slug, editorial update date, RU/EN title and description, an ordered `lessons` array, `prerequisites` lesson IDs, `practice` task IDs and `lenses` perspective IDs. The initial four paths each contain three new lesson pairs.

Path and lesson sequence is pedagogical execution order; it is not sorted by catalog importance. Do not duplicate lesson bodies or localized lesson titles in this dataset. Every referenced lesson must exist in both languages. Lesson membership is unique across paths, and a path's own lessons cannot be its prerequisites. Reference arrays must be nonempty and contain no duplicate IDs.

The shared `src/lib/learning-paths.mjs` helper localizes records, constructs canonical URLs and validates cross-references. `npm run check:content` rejects invalid dates, missing translations, duplicate identities/membership and missing lesson, practice or lens targets. Add exercises/lenses to their own source datasets before referring to them.

Human pages are `{lang}/learn/{id}/` relative to `/game-dev-db/`. Four homepage cards expose them; complete prerequisites, lesson sequence and practice/lens links work without JavaScript. New lesson pages link back to their path and to available previous/next lessons. Language switching retains identity. Reading estimates sum lesson minutes and exclude exercise time.

`api/v1/learning-paths.json` is an additive v1 export advertised by the manifest and `llms.txt`. It has `schemaVersion`, `license`, `codeLicense`, `attribution` and a `paths` array. Each localized record includes `id`, `lang`, `title`, `description`, `updatedAt`, `url`, ordered `lessons` and `prerequisites` objects with `id`, `url`, `markdownUrl`, and `practice`/`lenses` objects with `id` and `url`. It retains license and attribution fields. Manifest `counts.learningPaths` counts shared path identities, not language records.

Existing lessons, Markdown endpoints, full corpus and JSON lesson exports keep their schema and now include the new content automatically. Built-output checks compare path JSON to the shared records and HTML ordering to exported IDs. Browser tests cover language switching, adjacent lessons, discovery, keyboard operation, script-free reading and narrow layouts.

Primary-source review and authorship limits are recorded in [the research notes](research/learning-paths.md). Use ordinary internal links to exercises and lenses in lesson Markdown so those connections survive when a lesson is fetched independently.

## Reusable paths and outcomes (2026-10-20)

Five paths now include a first verifiable prototype. Lesson membership is reusable:
a lesson can appear in several independently ordered paths, and its page shows each
path's previous/next navigation. Prerequisites may be empty for the starter path.
Each path has bilingual `outcome`, `checks` and `practiceRationale`; these fields
appear unchanged in localized HTML and JSON. NPC and balance link the new capstones.
The outcome and checks describe a deliverable to create, never a claimed test result.
This supersedes the earlier single-membership and nonempty-prerequisite constraints.
