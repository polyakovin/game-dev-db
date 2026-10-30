# Proposal

## Why

The owner requested Cloudflare Web Analytics on 2026-10-30, superseding the earlier analytics exclusion. Measure visits and page performance using the existing Cloudflare property for `polyakovin.github.io`.

## What Changes

- Load the official deferred beacon on production RU/EN pages and the standalone 404 page; omit it during development and from the immediate root redirect.
- Reuse the public beacon token already deployed on the owner's Boss Fight Atlas site under the same hostname.
- Document the authorization, shared-hostname path filter, configuration and verification limits.
- Preserve bilingual content, static discovery and machine exports independently of analytics availability.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `search-discovery`: Permit the requested production Cloudflare integration while keeping discovery independent of analytics.

## Impact

The shared Astro layout, standalone 404 page, built-output verification and operational documentation change. No new dependencies, runtime secrets, content schema changes or API changes are required.
