# Design

## Context

Astro publishes static HTML and JSON to GitHub Pages with a `/game-dev-db/` base. The shared layout already supplies translated navigation and theme tokens. Existing JSON catalogs use shared pure validation helpers and build-output parity checks. See proposal.md for motivation.

## Goals / Non-Goals

Support curated opportunities and robust deadline expiry without a server. Automatic discovery, scraping, registration, notifications and automatic rule interpretation are outside this change. Editors verify new events and changed dates against official pages.

## Decisions

- Use one bilingual `src/data/jams.json` with separate event and calendar arrays. Include five verified event editions; retain finished source records for provenance but filter their HTML/JSON at build time.
- Store exact timezone-qualified ISO instants for start and submission close. Use `deadline > now`, with inclusive start and exclusive deadline. Never use voting end or fabricate unknown event times. Format display dates consistently in UTC, with an explicit label.
- A shared small pure module owns state, filtering and sorting. A Node-side module validates/localizes source and produces export metadata. Tests use fixed clocks and mutations rather than waiting for real events.
- Hide event cards under a page-local JavaScript marker until the browser has checked its own time. The controller recalculates status, ordering, counts and empty state, schedules the next transition with a capped timeout, and refreshes on focus/visibility/pageshow. No network request is required.
- Without JavaScript, render a dated build snapshot with a clear limitation. A daily schedule extends the existing verified Pages workflow; scheduling can be delayed, so JavaScript provides exact expiry for normal browsers and consumers filter JSON themselves.
- Keep calendars available when every recorded event expires. Fresh additions remain an editorial operation, not an unrequested monitoring service.

## Risks / Trade-offs

- Incorrect client clocks affect local filtering; explicit UTC timestamps and official links let readers verify deadlines.
- Organizers can change rules or deadlines; preserve verified dates and document editorial updates.
- No-JavaScript pages and cached JSON cannot change between static deployments; expose generation time and consumer filtering rules, and rebuild daily.

## Migration Plan

Add routes and endpoint without changing existing identities. Run verification and browser tests, archive the completed specification, then push the scoped change to main for the authorized Pages deployment and check live RU/EN routes and JSON. Reverting this commit removes the additive feature.
