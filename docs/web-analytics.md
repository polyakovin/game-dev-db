# Cloudflare Web Analytics

The owner's 2026-10-30 request authorizes this integration, superseding the earlier analytics exclusion for Cloudflare Web Analytics only. See [the dated decision](../DECISIONS.md).

## Configuration

`src/components/CloudflareAnalytics.astro` contains the public beacon token for the existing `polyakovin.github.io` property in the owner's Cloudflare account. The same token is already present in the public Boss Fight Atlas HTML under that hostname. This site identifier is published in HTML; it is not a Cloudflare API credential. No account API key, secret or new dependency is needed.

The shared layout and standalone 404 include the component just before the closing body tag. It renders only for production builds, including Astro preview. Development pages omit it. The immediate `/game-dev-db/` redirect omits it to avoid reporting a second view before the destination page.

The script loads from `https://static.cloudflareinsights.com/beacon.min.js` as a classic deferred script. Astro's `is:inline` preserves the official external script and its `data-cf-beacon` configuration. GitHub Pages continues to host the site; no DNS or proxy change is required.

The hostname property covers other projects too. In Cloudflare **Analytics & Logs → Web analytics**, select `polyakovin.github.io` and filter paths by the `/game-dev-db/` prefix, or select individual paths to inspect this site's pages. Do not treat all hostname traffic as Game Dev DB traffic.

To replace the property, copy the public token from **Manage site** in Cloudflare, update the component and the expected token in `scripts/verify-dist.mjs`, verify, and publish. Keep account credentials outside Git.

## Verification

- Run `npm run verify`. Built-output validation checks exactly one correctly configured deferred beacon on every HTML page except the root redirect.
- Run `PLAYWRIGHT_PREVIEW=1 npm run test:e2e` against the built site. Analytics browser checks block the beacon request and verify that both language homepages, a lesson and the 404 remain usable.
- Run `npm run test:e2e -- tests/analytics.spec.ts` against the development server to check that the beacon is absent.
- After publishing, inspect live RU/EN HTML for the beacon and use a browser to confirm the external script loads. Cloudflare's dashboard may take a few minutes to display data after real visits.

The Playwright configuration blocks Cloudflare analytics hosts in Chromium so production-preview tests do not report local visits. The analytics-specific checks also intercept beacon requests to verify attempted loading and reading after failure. Successful HTML or script responses establish delivery, not Cloudflare ingestion. Blockers, disabled JavaScript and network failures can prevent reporting; static reading, navigation, discovery metadata, Markdown and JSON exports must still work.

## Official references

- [Manual setup for sites not proxied through Cloudflare](https://developers.cloudflare.com/web-analytics/get-started/#sites-not-proxied-through-cloudflare)
- [Beacon origin, data collection and reporting endpoint](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/)
