# Design

Use `src/data/resources.json` as the sole editorial source for both languages and the unchanged resource export. Add optional `format` (`channel`, `game`, `course`), `authors`, `access` and `practice` fields. Localized optional fields must contain both RU and EN values. `kind` keeps its existing coarse values: instructional channels/courses are documentation, and playable creation environments are tools. The optional format supplies the more precise presentation label without expanding the v1 kind enum.

Derive five non-overlapping groups from category, kind and format. Render groups and jump links as static HTML; do not add client filtering or JavaScript. Resource cards display the destination language, author, useful context, access requirement and an optional original exercise. Avoid embeddings, copyrighted artwork, copied chapters, popularity counters and universal endorsements.

Keep `/ru/resources/`, `/en/resources/`, their language switch and the GitHub Pages base path. Change the navigation label to References. Isolate presentation rules in a resources stylesheet. Verify the six requested links, all source records in both rendered pages and the unchanged JSON export, then run the canonical verification and browser suites before publishing.
