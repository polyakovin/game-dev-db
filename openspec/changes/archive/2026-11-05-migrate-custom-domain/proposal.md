# Proposal

## Why

The owner has attached gamemechanics.pro to GitHub Pages. The current build still redirects to the project subdirectory and publishes old canonical URLs, breaking navigation on the new domain.

## What Changes

- **BREAKING**: publish the site at https://gamemechanics.pro/ with no /game-dev-db prefix. GitHub Pages redirects the prior github.io project URLs.
- Align RU/EN navigation, assets, lesson links, search, canonical/hreflang metadata, sitemap, robots policy and all machine exports with the new root.
- Keep stable content IDs, language pairs, v1 schemas, filenames and trailing slashes.
- Share production URL configuration across build, exports and verification; update browser checks and operational documentation.
- Inspect Pages HTTPS, redirects and Cloudflare analytics after migration; record any account-dependent limitation honestly.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `knowledge-portal`: use the custom-domain root for existing routes and examples.
- `mechanics-reference`: use the custom-domain root for existing routes and examples.
- `design-references`: use the custom-domain root for existing routes and examples.
- `game-jams`: use the custom-domain root for existing routes and examples.
- `game-design-practice`: use the custom-domain root for existing routes and examples.
- `game-design-lenses`: use the custom-domain root for existing routes and examples.
- `search-discovery`: use the custom-domain root for existing routes and examples.
- `knowledge-content`: use the custom-domain root for existing routes and examples.
- `learning-paths`: use the custom-domain root for existing routes and examples.

## Impact

Astro/site URL configuration, shared metadata, lesson Markdown links, knowledge relationships, sitemap/robots, build/audit checks, browser tests and current documentation. GitHub Pages remains the host, with no new runtime service or dependency. Historical research and archived changes retain their original URLs.
