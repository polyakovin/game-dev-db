# Search and agent discovery

The portal can be crawled and retrieved without JavaScript, accounts or an API key.
Technical accessibility does not establish search indexing or AI citations.

## Public entry points

All paths are relative to `https://polyakovin.github.io/game-dev-db/`:

- `llms.txt`: common entry map and existing collection exports.
- `llms/{lang}.txt`: compact localized topic and retrieval guide.
- `api/v1/knowledge/{lang}/index.json`: metadata for selecting records.
- `api/v1/knowledge/{lang}/search.json`: a static full-text snapshot, not a query service.
- Each record's `url`, `jsonUrl` and `markdownUrl`: canonical citation and individual formats.
- `agent-instructions/{lang}.md`: optional instructions to copy into a game project's AGENTS.md.
- `sitemap.xml`: active HTML pages, matching language URLs and known authored dates.

Active mechanics, exercises and lenses have focused pages at
`{lang}/knowledge/{type}/{id}/`. These pages render existing record sections and
sources. Common records cite them; old collections, anchors and type-specific v1
exports remain valid. `placements` preserves original locations. Archived entries
remain accessible with an explicit archive notice; their catalogs use noindex and
are absent from the sitemap. Dates are editorial dates, never build timestamps.

Focused pages and lessons expose per-record Markdown/JSON alternate links and
LearningResource structured data. Shared HTML links the llms entry point. These
are navigation and semantic aids, not special ranking permissions. Google states
that its AI search features need no special AI files or schema:
[AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).

## Register and inspect search indexing

Use the existing owner accounts. Do not create accounts, accept terms or claim
verification on the owner's behalf without the required authenticated flow.

1. In [Google Search Console](https://search.google.com/search-console), add the
   URL-prefix property `https://polyakovin.github.io/game-dev-db/`. Use the exact
   property prefix, not a domain property for `github.io`. Choose HTML-file
   verification. Put the exact supplied public verification file in `public/`,
   deploy, then click Verify. A supplied meta tag can instead be added to the
   shared Layout and root landing page. Never invent a verification token.
2. In [Bing Webmaster Tools](https://www.bing.com/webmasters/), import the verified
   Search Console property if available, or use its supplied verification file.
3. In [Yandex Webmaster](https://webmaster.yandex.ru/), add the same site prefix and
   follow the supplied verification flow for the hosted path. Verify the service
   accepts that path; a requirement for host-wide verification belongs to the
   separate user-site repository and needs its owner access.
4. Submit `https://polyakovin.github.io/game-dev-db/sitemap.xml` in each verified
   site's Sitemaps section. Check processing, crawl errors and indexed pages.
5. Inspect representative RU/EN lessons and focused mechanic pages using each
   service's URL inspection and recrawl tools. Save real submission and crawl
   dates. HTTP 200 and sitemap acceptance do not prove that a page is indexed.

The production HTTP audit is reproducible:

```bash
npm run check:discovery
npm run check:discovery -- http://127.0.0.1:4322/game-dev-db/
```

It validates entry points, sitemap membership and representative canonical HTML,
JSON and Markdown records in both languages. It exits nonzero for broken required
endpoints and reports host robots separately. It does not submit URLs or measure
AI citations. Run `npm run preview -- --host 127.0.0.1 --port 4322` for the local target.

CI browser tests use the built preview after verification, so the checked pages
match the deployable artifact and cannot be interrupted by development reloads.
Locally, use `PLAYWRIGHT_PREVIEW=1 npm run test:e2e` after `npm run verify` to test
the same artifact. Screenshots use Playwright's per-test output directory on all platforms.

## Host robots and AI crawlers

Only `https://polyakovin.github.io/robots.txt` controls this host. The project file
at `/game-dev-db/robots.txt` remains a compatibility file, not effective host policy.
Its presence must not be reported as configured crawler access. A host-root 404
does not prohibit crawling. A valid sitemap can be submitted directly through
webmaster accounts. See [Google robots placement](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

If the separate `polyakovin.github.io` user-site repository is available, merge
the following sitemap directive into its existing root policy without changing
other hosted projects' rules:

```text
Sitemap: https://polyakovin.github.io/game-dev-db/sitemap.xml
```

Keep Googlebot, Bingbot, YandexBot, OAI-SearchBot, PerplexityBot and Claude-SearchBot
allowed for the project. Blanket allow rules are unnecessary when nothing blocks
them. If a proxy or WAF is introduced, check official published crawler IPs rather
than assuming a forged user-agent proves identity.

Search discovery and model training are independently controlled. OAI-SearchBot
supports ChatGPT search; GPTBot controls training use. Allowing training does not
guarantee recommendations. Sources: [OpenAI crawlers](https://developers.openai.com/api/docs/bots),
[Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers),
[Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).

## Evaluate discovery and citation

`discovery-questions.json` contains 15 paired task questions and relevant record
keys. The questions intentionally omit the site name and URL. Expected keys are
editorial relevance targets, not evidence of an AI system retrieving the page.

For each system, run a fresh conversation with web search available and one exact
question. Record date, system/model, search setting, cited URLs and whether a cited
page actually supports the answer. Do not give the resource URL in the discovery
test. Test deliberate integration separately by supplying the localized entry point.
Use canonical URLs to deduplicate translations, formats and catalog fragments.

Track three separate outcomes: indexed pages, successful targeted retrieval, and
supported citations in unbranded answers. A missing log is unknown, not zero.
[Bing AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)
can report citations on supported Microsoft surfaces; its scope is not all AI
services. GitHub Pages does not expose full crawler access logs through this repo.

Public references from relevant projects and useful original worked examples are
an editorial distribution activity. Prepare material before any outreach; this
change does not post messages or manufacture backlinks. MCP and paid SEO services
are not needed for the existing public static retrieval contract.
