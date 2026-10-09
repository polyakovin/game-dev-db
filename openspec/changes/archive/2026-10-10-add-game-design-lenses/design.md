# Design

Use `src/data/lenses.json` as the single editorial source. Each lens carries a stable id, a Schell number or null for external authors, theme id, source id, localized title, original explanatory summary and original review questions. Source groups identify author, edition and primary HTTPS references. Classify the three fractional numbers as third-edition additions rather than assigning artificial numbers 114–116. Deterding's entry has no Schell number.

Render all 117 entries on `/ru/lenses/` and `/en/lenses/` as native details elements. Filters narrow entries by theme, source and full text, with a live count, reset, deep-link reveal and expand/collapse. Controls remain hidden without JavaScript; native disclosures keep every entry readable. Use the existing typography and reference layout, with responsive controls and wrapping source links.

Export localized records to `/api/v1/lenses.json` and `/content/lenses/{lang}/game-design.md`. Add manifest metadata, links in llms.txt, full content in llms-full.txt and bilingual sitemap routes. Preserve current v1 endpoints and fields.

The user notes establish second-edition coverage. Public descriptions and prompts are newly written; external source material retains its rights. Source descriptions explain edition numbering and Deterding's distinct provenance. Automated validation rejects gaps, duplicate ids, mismatched fractional numbers, incomplete bilingual fields and unlisted sources. Distribution checks compare the dataset, HTML and exports; browser tests exercise actual reader behavior.
