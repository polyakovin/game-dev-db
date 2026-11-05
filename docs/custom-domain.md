# Custom-domain deployment

The production root is `https://gamemechanics.pro/`. GitHub Pages remains the static host; source and Actions stay in `polyakovin/game-dev-db`. The 2026-11-05 owner request authorizes this migration; see [DECISIONS.md](../DECISIONS.md).

## Source configuration

`src/lib/site-config.mjs` supplies `SITE` and the empty `BASE` to Astro, shared URL helpers, distribution validation and the HTTP discovery audit. Astro receives `/` as its base. HTML uses trailing slashes; JSON, Markdown and text exports retain their explicit filenames and v1 schemas. Authored lesson links use `/ru/` and `/en/`; the knowledge relationship parser accepts those same links.

Canonical and Open Graph URLs, RU/EN alternates, sitemap, robots policy and agent indexes/exports use the production domain. The root redirects to `/en/` without JavaScript, uses `/en/` as its canonical URL and keeps manual links to both languages. `public/robots.txt` now becomes the effective host-root policy and advertises `https://gamemechanics.pro/sitemap.xml`.

## Hosting and DNS observations

Checked on 2026-11-05 before release:

- GitHub Pages reports the configured custom domain, `build_type=workflow`, an approved TLS certificate and `https_enforced=true`.
- Apex A records resolve to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`. No AAAA record is published; the IPv4-only configuration is supported.
- HTTP redirects to HTTPS. The former `https://polyakovin.github.io/game-dev-db/ru/` returns a 301 to `https://gamemechanics.pro/ru/`.
- `www.gamemechanics.pro` still has `CNAME pixie.porkbun.com.` and fails the HTTPS handshake. The DNS owner can replace that record with `CNAME polyakovin.github.io.`. GitHub Pages can then redirect the www alias to the configured apex after DNS/certificate provisioning. This alias is optional and does not block the apex site.

No CNAME file is needed for this Actions deployment: GitHub's custom-domain setting is authoritative, and Actions publishing ignores source CNAME files. See [GitHub custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Release checks

Run `npm run verify`, then `PLAYWRIGHT_PREVIEW=1 npm run test:e2e`. Publish the checked main commit through the existing Pages workflow and wait for the deployment job to succeed. Run `npm run check:discovery` against production; inspect `/`, both language homepages, a lesson, a focused mechanic, assets, `robots.txt`, `sitemap.xml`, `llms.txt`, the manifest and representative JSON/Markdown exports. Check old github.io links redirect to the corresponding root-relative paths.

Cloudflare Web Analytics uses the owner-supplied property for `gamemechanics.pro`; see [analytics configuration and limits](web-analytics.md). Successful delivery of the snippet does not establish dashboard ingestion, search indexing or AI citation.
