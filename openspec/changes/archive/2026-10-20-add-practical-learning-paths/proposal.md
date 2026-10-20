# Proposal

## Why

The reference catalog points to strong public learning resources, but readers lack a short route from those references to a practical game-development task. Add four focused learning paths with original lessons, observable checks and existing design exercises.

## What Changes

- Add twelve paired RU/EN lessons: blockout, wayfinding, teaching a mechanic; choice costs, randomness, progression; NPC perception, action selection, pathfinding; playtesting, behavior acceptance, accessibility.
- Introduce four learning-path cards on the knowledge-base homepage and static path pages with ordered lessons, prerequisites, practice and lens links.
- Show the containing path and previous/next lesson on new lesson pages.
- Publish the path metadata additively under `/api/v1/`; existing lesson exports automatically include all new original content.
- Validate all cross-references and verify both languages, keyboard use, narrow layouts and script-free reading.

## Capabilities

### New Capabilities

- `learning-paths`: Localized, ordered learning paths joining original lessons to existing exercises and design lenses, with equivalent static exports.

### Modified Capabilities

- `knowledge-portal`: Expand the original eight lesson pairs to twenty without changing existing lesson identities or metadata semantics.

## Impact

Lesson Markdown, a bilingual path dataset and shared helper, homepage/path/lesson rendering, additive v1 path JSON and manifest metadata, validators, browser checks and contributor documentation. No new dependency, runtime service or copied external chapters.
