# Decisions — Game Dev DB

Append new records. Do not delete or rewrite an earlier decision; supersede it
with a dated record and explanation.

## Decision template

### YYYY-MM-DD — [gate] — `go | pivot | kill`

- Context:
- Evidence refs:
- Decision:
- Rationale:
- Maximum next-step budget:
- Maximum next-step founder hours:
- Review/kill date:
- What would reverse this decision:

### 2026-10-09 — open-source MVP scope — `go`

- Context: The repository was initialized with a commercial-first template that blocks full implementation before paid validation. The owner subsequently requested a bilingual, open-source game-development knowledge portal, preparation for agent development with OpenSpec, an MVP, and GitHub Pages hosting.
- Evidence refs: The owner's 2026-10-09 instruction in the project chat, naming `https://github.com/polyakovin/game-dev-db.git`, Russian and English readers, AI-agent consumers, community contributions, original material, and external resources.
- Decision: Proceed with the requested open-source MVP and publish it to `https://polyakovin.github.io/game-dev-db/`. This explicit scope authorization supersedes the template's paid-validation prerequisite for this work only. It does not set any commercial gate to `go`.
- Rationale: The requested outcome is a usable public knowledge portal, not a paid product experiment. A working static slice is needed to check bilingual navigation, a shared content model for human and agent consumption, contribution workflow, and actual GitHub Pages delivery. A document-only test cannot verify those integration points.
- Maximum next-step budget: Zero additional paid-service spend; no paid accounts or services may be purchased as part of this scope.
- Maximum next-step founder hours: One implementation session, capped at six hours. This is a limit, not a claim of measured time spent.
- Review/kill date: 2026-10-09, at the end of the implementation session. Review the build, content checks, agent exports, and deployed site. Report any unmet acceptance criteria; reduce or defer scope rather than exceeding the time or spending budget.
- What would reverse this decision: Withdrawal of the owner's request, a requirement for paid infrastructure, an unresolved licensing or security issue, or inability to deliver a verifiable static slice within the time box.
- Evidence integrity: Preserve `commercial-project.json` and all `pending` gates. Do not record implementation work as interviews, confirmed demand, customers, payments, or commercial validation.

### 2026-10-20 — discovery without analytics — `go`

- Context: The owner requested improved discovery by search engines and AI agents, deferred webmaster account setup, and explicitly declined analytics services.
- Evidence refs: The owner's 2026-10-20 instructions in the project chat.
- Decision: Publish static discovery pages, attributed exports, sitemap improvements and a manually invoked public-URL audit. Do not connect external analytics services, visitor counters or tracking scripts. External webmaster accounts are outside this release.
- Rationale: Searchable public content and reliable retrieval can be improved without collecting visitor data. HTTP checks do not establish indexing or AI citation; those outcomes remain unmeasured unless explicitly evaluated.
- What would reverse this decision: A later explicit owner request to change the analytics or external account scope.

### 2026-10-30 — Cloudflare Web Analytics — `go`

- Context: The owner explicitly requested Cloudflare Web Analytics on the site.
- Evidence refs: The owner's 2026-10-30 instruction and subsequent matching beacon token in the project chat; the existing `polyakovin.github.io` property in the owner's Cloudflare dashboard; the public beacon configuration on `https://polyakovin.github.io/boss-fight-atlas/en/`.
- Decision: Connect the official Cloudflare Web Analytics beacon on production RU/EN pages and the standalone 404 using that existing hostname property's public token. Supersede the analytics exclusion in the 2026-10-20 decision for this integration only. Keep development and the immediate root redirect free of the beacon.
- Rationale: Reuse the owner's configured account without creating credentials or changing hosting. Filter paths beginning with `/game-dev-db/` to distinguish this project from other sites on the shared hostname. Reading, discovery and machine exports must remain usable when analytics is unavailable.
- Maximum next-step budget: Zero additional paid-service spend.
- What would reverse this decision: The owner withdraws the request or changes the analytics property or provider.


### 2026-11-05 — custom production domain — `go`

- Context: The owner attached `gamemechanics.pro` to GitHub Pages and requested the required URL changes, checks and release.
- Evidence refs: The owner's 2026-11-05 project-chat request and supplied public Cloudflare Web Analytics token; GitHub Pages API reports `cname=gamemechanics.pro`, workflow publishing, an approved certificate and enforced HTTPS; public DNS resolves the apex to the four GitHub Pages IPv4 addresses.
- Decision: Publish at `https://gamemechanics.pro/` with an empty project prefix. Use that origin for canonical metadata, bilingual discovery, robots, assets and all v1 exports. This supersedes the production address in the 2026-10-09 decision, without changing commercial gates or hosting scope. Connect the supplied `gamemechanics.pro` analytics property and leave the shared `polyakovin.github.io` property unchanged.
- Rationale: GitHub Pages serves a custom domain at its root and redirects old github.io project URLs. Retaining the former prefix breaks the root language redirect and internal navigation. A separate analytics property keeps this site's visits distinct after the hostname change.
- Maximum next-step budget: Zero additional paid-service spend.
- Operational limitation: `www.gamemechanics.pro` still points to Porkbun parking. DNS owner access is required to replace its CNAME with `polyakovin.github.io`; the apex domain release does not depend on this optional alias. See `docs/custom-domain.md`.
- What would reverse this decision: The owner changes the production domain or analytics configuration.

### 2026-11-05 — service name — `go`

- Context: The owner named the service `gamemechanics.pro` in the project chat.
- Decision: Use `gamemechanics.pro` as the public name in both languages, page metadata, agent discovery, export attribution and current project documentation. This supersedes the former public name, Game Dev DB.
- Compatibility: Keep the GitHub repository URL, package identifier, stored preferences, content identifiers, routes and v1 schemas. Preserve earlier decisions and release records as history.

### 2026-11-06 — Codex Stop commit and release — `go`

- Context: The owner requested verification and setup of Stop hooks for committing task changes and releasing the current project version.
- Decision: Reuse the trusted global scoped-commit and synchronization hook. Opt main into its committed-snapshot release phase through `.codex/release.json`; hand publication to the existing verified Pages workflow for the exact commit. Keep full deployment and live-route confirmation available separately because the complete CI suite can exceed the Stop timeout.
- Scope: Existing GitHub Pages hosting only, with no additional spending, hosting service, concurrent commit hook or change to commercial evidence.
