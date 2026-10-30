# Design

## Context

GitHub Pages serves static HTML under `/game-dev-db/`; Cloudflare cannot automatically inject a script into these responses. The owner's Cloudflare dashboard already lists `polyakovin.github.io`, and the public Boss Fight Atlas HTML provides its existing beacon token.

## Decisions

- Add one `CloudflareAnalytics.astro` component at the end of the shared layout and standalone 404 body. Render only when `import.meta.env.PROD` is true.
- Use the official `https://static.cloudflareinsights.com/beacon.min.js` script with `is:inline`, `defer` and `data-cf-beacon`. `is:inline` preserves a classic external script rather than Astro bundling or converting it to a module.
- Keep the public site token in the component. It identifies the analytics property; it is not an account API credential. No environment variable or deployment secret is necessary.
- Omit the root language redirect to avoid an extra page view immediately before the destination page. Include the standalone 404 to help identify broken URLs.
- Use Cloudflare's existing shared hostname property and filter paths by `/game-dev-db/` to distinguish this project. Do not change other sites' account settings.
- Verify every generated HTML document has the expected beacon exactly once, except the root redirect. Browser verification intercepts the beacon request to avoid sending local test traffic and confirms navigation and reading still work when the script cannot load.

## Risks and limits

Browser blockers or network failures can prevent reporting. A passing build or script response does not establish that Cloudflare has ingested a visit. Production collection requires publishing the changed HTML; dashboard ingestion must be checked separately after real visits.

## Sources

- https://developers.cloudflare.com/web-analytics/get-started/
- https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/
