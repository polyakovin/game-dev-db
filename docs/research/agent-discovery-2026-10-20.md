# Agent discovery release validation, 2026-10-20

The release adds 2,326 focused HTML pages: 1,032 mechanics, 14 exercises and 117
lenses in each language. Existing catalog pages and anchors remain valid. The
canonical sitemap contains 2,452 unique active HTML URLs with language pairs and
known editorial dates.

## Local verification

- Node.js 24.15.0 and Python 3.13.14; exact dependencies installed with npm ci.
- `npm run verify`: passed, including 2,456 HTML pages, local links and anchors,
  machine exports, strict specifications and the retained project-record check.
- `npm run test:e2e -- --workers=4`: all 296 Chromium tests passed.
- `npm run format:check`: passed.
- Local HTTP discovery audit: 33 responses inspected, no failures; sitemap
  membership checked against both complete language indexes.
- RU/EN focused mechanic pages visually inspected at 375 and 1280 pixels, with
  light and dark appearances; no-script reading and keyboard TOC checks passed.

## Production and external services

Production deployment and HTTP audit are pending this commit's Pages workflow.

Google Search Console, Bing Webmaster Tools and Yandex Webmaster registration
remain pending owner authentication and their genuine verification values. No
registration, sitemap submission, indexed-page count or AI citation is claimed.
Host-root robots.txt is outside this project repository; a 404 there does not
prohibit crawling. Follow [the setup guide](../search-discovery.md) to complete
verification and submit the public sitemap.

The [15 paired questions](../discovery-questions.json) are ready for unbranded
discovery and supported-citation evaluation. Their outcome is explicitly
not-evaluated. HTTP accessibility is separate from inclusion in any search index.
