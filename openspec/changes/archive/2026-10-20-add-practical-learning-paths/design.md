# Design

## Context

See proposal.md for the reader outcome. The existing Markdown collection already supplies lesson pages, search, full text, JSON and individual Markdown. Coarse lesson categories and v1 fields are public compatibility boundaries. Path sequence is procedural, unlike catalog importance order.

## Goals / Non-Goals

**Goals:** Make the four paths discoverable without adding four global navigation entries. Reuse the existing collection and static publishing model; validate references at source and output boundaries.

**Non-Goals:** A new engine tutorial, automatic course progress, accounts, or reproduction of linked books. Source examples are illustrative design proposals, not claims of executed playtests.

## Decisions

- Store path IDs, paired titles/descriptions, ordered lesson IDs, prerequisite IDs, exercise IDs and lens IDs in `src/data/learning-paths.json`. A pure shared helper localizes and validates them. Keeping paths outside lesson frontmatter avoids changing existing lesson metadata or duplicating lesson bodies.
- Add `/learn/{id}/` pages under each language. Four homepage cards lead to these pages; the existing catalog continues to list every lesson and support category search. An inline lesson component supplies path and adjacent-lesson links.
- Generate additive path JSON and manifest discovery from the same helper. Keep existing endpoint fields and lesson IDs. Link lesson Markdown from path pages and include ordinary internal links in lesson bodies so existing exports remain useful independently.
- Write all twelve examples independently. Cite specific primary pages for the relevant principle; document source verification and the limits of mathematical models. Do not ingest outside text, artwork or code.
- Keep new path styles in components/pages using semantic theme tokens. Validate bilingual coverage, unique membership and references to real source IDs in canonical content checks. Built checks compare exported path order with HTML and existing exports.

## Risks / Trade-offs

- Small examples can sound universal: mark numbers as illustrative and name the assumptions and failure cases.
- Added paths can overwhelm the homepage: use four compact cards and retain one shared lesson catalog.
- Parallel repository work can overlap: implement in an isolated clone, stage only task paths and rebase against fetched main before publication.

## Migration Plan

Add content and routes, run formatting, canonical verification and browser tests, archive the verified OpenSpec change, then publish through the existing verified Pages workflow. Verify deployed path pages and exports. A scoped revert removes the additions; existing lesson routes remain stable.
