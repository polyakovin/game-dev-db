## Context

Astro renders lessons from Markdown and uses bilingual data for catalogs and exports. Some page introductions live directly in Astro components.

## Goals

- Put the action or rule first. Keep contrasts when they distinguish real choices or explain a failure mode.
- Review each edited passage alongside its translation.

## Decisions

Use Humanizer's pattern list to find candidates and rewrite passages in context. Compare the changes to the source for preserved facts, examples, caveats and attribution. Apply edits to prose fields and leave generated files to the existing build.

## Risks

Changing a title or repeated label can break navigation or search. Preserve established labels and link targets, and run the content, built-site and browser checks.
