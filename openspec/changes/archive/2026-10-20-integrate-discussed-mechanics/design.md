# Design

## Context

See proposal.md for motivation. Existing JSON catalogs share a bilingual tree and derive HTML, JSON, Markdown, discovery and validation from `src/lib/mechanics.mjs`. Discussion outputs use several incompatible JSON layouts, static HTML data and Markdown lists. The shared checkout also contains unrelated local changes.

## Goals / Non-Goals

**Goals:** preserve every source-list item, translate its full meaning, keep classifications and capability notes visible, and make coverage independently reviewable.

**Non-Goals:** redesign the catalog schema, copy external articles or media, publish private transcripts, or claim real-device/playtest validation.

## Decisions

- Normalize discussion groups into families and their individual records into variants. Separate layer labels become sections. Existing source IDs become stable normalized structural IDs. This preserves granularity without creating thousands of navigation headings.
- Keep source descriptions and family-level URL associations; retain application and limitation columns as labeled variant text. Put modifiers, boundary cases and methodology into supplementary notes. Avoid a separate raw-data runtime or duplicated public files.
- Use complete RU/EN values in authored JSON. A temporary translation tool may assist preparation; review terminology, capability restrictions, numeric coverage and locale completeness before publishing. No translation service is used at runtime.
- Record sanitized topic/count coverage in project research documentation. Keep local extraction scripts, translation caches and private transcript data outside Git.
- Register catalogs explicitly and extend editorial ordering, preserving all existing routes. Adopt the authoritative expanded RPG grind reference, which already covers the twelve later discussion gaps, rather than duplicating those concepts. Verify the complete shared source and scope commits to task-owned paths.

## Risks / Trade-offs

- Similar actions occur across genres and devices. Preserve contextual catalogs and state overlap rather than removing useful applications.
- Hardware assumptions can be lost during import. Preserve every action/application/limit and capability legend; check primary documentation and do not claim hardware testing.
- Large exports increase download size. Preserve full compatible exports and per-catalog Markdown so agents can request only relevant topics.
- Machine-assisted translations can distort terminology. Review bilingual samples, all headings and hardware exceptions, and reject missing or untranslated entries.

## Migration Plan

Run canonical verification and browser tests, archive the completed change, commit explicit task paths, push the authorized Pages branch and verify deployed bilingual routes and exports. A scoped revert restores the former catalogs; no destructive migration is required.
