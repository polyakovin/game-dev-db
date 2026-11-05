# Tasks

## 1. Production URL migration

- [x] 1.1 Share the custom-domain configuration; migrate routes, metadata, sitemap, robots, authored lesson links and relationship parsing. Verify generated links and typed relationships through content/dist checks and updated browser assertions; document the root in current project instructions.

## 2. Hosting and analytics operations

- [x] 2.1 Inspect Pages domain, HTTPS, DNS and analytics configuration; apply available required migration settings and record observed results and account-dependent limits in deployment/analytics documentation and DECISIONS.md.

## 3. Integration and release

- [x] 3.1 Pass npm run verify, targeted production-preview browser tests and formatting checks for changed source files; inspect both languages, narrow layouts, keyboard navigation, search and exports. The unchanged Pages workflow must pass the full browser suite before publication.

## Workflow follow-up

- Archive the implemented verified change and validate the resulting specifications.
- Publish the scoped commit through the existing Pages workflow; verify live RU/EN routes, assets, exports, sitemap/robots and redirects from the old github.io project URL.
