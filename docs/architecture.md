# Architecture

Game Dev DB is a static Astro site written in TypeScript. Node.js 24 and npm are development and build tools; the deployed site does not require a Node server, database, account system, or secret.

## One content source

Lessons are Markdown files in `src/content/lessons/{ru,en}/{id}.md`. The Astro content collection validates their frontmatter. A stable lesson `id` joins the Russian and English versions, while `lang` selects the language. See [the content guide](content-guide.md) for the field contract.

The same collection supplies lesson HTML, the catalog and its search data, and machine-readable lesson exports. This prevents a separate agent corpus from drifting away from the content people read. Lesson sources remain attached to each lesson. A separate curated collection in `src/data/resources.json` supplies the resource page and resource JSON export. External resources are linked and attributed; their full contents are not ingested or republished.

Do not edit build output in `dist/`. Change the Markdown source or the generator and rebuild.

## Public routes

All paths below are relative to the configured site root. In production that root is `https://polyakovin.github.io/game-dev-db/`.

| Route | Purpose |
| --- | --- |
| `ru/`, `en/` | Language-specific lesson catalogs and search |
| `{lang}/lessons/{id}/` | A rendered lesson |
| `{lang}/resources/` | Referenced external resources |
| `{lang}/mechanics/` | Mechanic reference index |
| `{lang}/mechanics/{id}/` | A complete mechanic taxonomy |
| `{lang}/for-agents/` | Guidance for machine consumers |
| `llms.txt` | Compact entry point for agents |
| `llms-full.txt` | Combined lesson text |
| `api/v1/manifest.json` | Export entry point and dataset metadata |
| `api/v1/lessons.json` | Structured lesson collection |
| `api/v1/resources.json` | Resource collection |
| `api/v1/mechanics.json` | Complete localized mechanic taxonomies |
| `content/{lang}/{id}.md` | One lesson as Markdown |
| `content/mechanics/{lang}/{id}.md` | One mechanic taxonomy as Markdown |

The `api` paths are static files, not a live server API. Clients should fetch a snapshot and process it locally. There is no authentication, mutation endpoint, or guaranteed refresh interval.

Individual Markdown exports retain the original lesson body and frontmatter data, then add `url` (the canonical HTML lesson URL), `markdownUrl`, `attribution` (`Game Dev DB contributors`), `license` (`CC-BY-4.0`), and `codeLicense` (`MIT`). The export serializer may change YAML formatting, so it is not a byte-for-byte copy of the source file. The authored source schema remains unchanged; these fields belong to the export layer.

## Boundaries

Mechanic taxonomies use bilingual JSON under `src/data/mechanics/` as their single source, following the resource catalog's localized-data model. `src/lib/mechanics.mjs` derives the language-specific tree, counts and complete Markdown for HTML and exports. Its validator is also used by the canonical content check. See [mechanic content](mechanics-content.md). Catalog exports extend `/api/v1/` additively; the lesson collection and its identifiers are unchanged.

- **Content:** lesson Markdown and validated frontmatter, plus the bilingual resource catalog in `src/data/resources.json`. Keep editorial content out of page components where it can be shared through the collection.
- **Presentation:** Astro layouts, components, styles, and language-specific interface labels. Use semantic HTML and preserve keyboard access.
- **Fonts:** Golos Text and IBM Plex Mono are bundled from the pinned Fontsource packages and served by the site. Preserve their separate OFL-1.1 notices when publishing the font assets.
- **Interaction:** client-side catalog search and filters. Core lesson reading must work without JavaScript.
- **Exports:** build-time transformations of the collection. Preserve identifiers, language, sources, canonical URLs, and license context.
- **Deployment:** GitHub Actions builds and publishes the generated artifact to GitHub Pages. GitHub Pages supplies HTTPS and static hosting.

## Compatibility and deployment

The repository is a GitHub project site, so a root-relative link such as `/ru/` points to the wrong location in production. Use the configured base path for navigation, assets, search, canonical links, and export URLs. Lesson URLs use trailing slashes; Markdown and JSON exports use their explicit file extensions.

The `v1` export route is a public compatibility boundary. Prefer additive metadata changes. Removing a field, changing its meaning, replacing a lesson identifier, or moving an endpoint needs a deliberate migration documented in OpenSpec. Review both consumers and generated output when changing the schema.

## Validation layers

Run `npm run verify` before delivery. It covers Astro type checks, content validation, a production build, built-output checks, OpenSpec validation, and the retained commercial records. `npm test` is an alias for this suite. Run the Playwright browser suite separately with `npm run test:e2e`; install its Chromium dependency once with `npx playwright install chromium`.

For a release, also inspect the real browser experience in both languages and check the live GitHub Pages routes and exports. A passing build cannot prove GitHub Pages permissions, deployment settings, or deployed URL behavior.

Browser tests start their own foreground development server, rather than reusing an existing server from another checkout. If the default port is occupied, use `PLAYWRIGHT_PORT=4324 npm run test:e2e`. All browser contexts, including non-JavaScript checks, use the configured base URL.
