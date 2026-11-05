# Design

## Context

See proposal.md. Astro configuration and src/lib/site.ts currently duplicate the old site/base; metadata, sitemap alternates, relationship parsing and validation also embed it. GitHub Pages already reports the custom domain, an approved TLS certificate and enforced HTTPS. Deployment uses Actions, so GitHub does not require or use a source CNAME file.

## Goals / Non-Goals

Make every public representation agree on one production origin and root. Preserve all content identities and relative endpoints. Do not change unrelated content, dependencies or external source URLs. Historical research and archived decisions remain historical.

## Decisions

Use a small shared JavaScript configuration for SITE and BASE so Astro, TypeScript helpers and Node verification cannot drift. Keep BASE empty for existing slash-joining helpers and pass / to Astro. Replace authored Markdown links and update the relationship parser together to preserve typed connections. Derive canonical URLs and sitemap alternates from shared helpers and URL paths, without the old prefix regex.

Retain GitHub Actions deployment and confirm the actual Pages settings through GitHub API. Publish a host-root robots.txt with the new sitemap. Update current instructions and add a dated decision instead of rewriting historical records.

Use the owner's supplied public token for the gamemechanics.pro Cloudflare property. Leave the shared github.io property unchanged because other projects use it. Verify snippet delivery independently of dashboard ingestion.

## Risks / Trade-offs

- Old absolute lesson links can silently escape root validation: explicitly reject the prior portal URL/prefix in generated local links and machine representations.
- A base change can erase lesson relationships: verify typed links in the common content tests.
- DNS/cache propagation and Pages redirects are outside the build: inspect production URLs after successful Actions deployment.
- The www alias remains parked at Porkbun: document the required CNAME correction and the lack of registrar access; release the configured apex independently.

## Migration Plan

Update shared origin/base and all authored internal links; run canonical verification and targeted production-preview browser checks; archive validated deltas; commit scoped paths and push main; require the existing CI full browser suite to pass before Pages deployment and audit the live domain and old address redirects. Roll back by reverting the migration and restoring the previous domain settings only if the owner decides to abandon the domain.
