# Configure the Codex Stop release

## Why

The trusted global Stop hook already creates scoped task commits and requires
upstream synchronization. This repository has no opt-in release configuration,
so Stop cannot confirm that its current commit reached GitHub Pages.

## What changes

- Opt `main` into the existing global release hook through `.codex/release.json`.
- Hand publication to the existing Pages workflow for the exact committed SHA.
  Keep full deployment and public-route confirmation as a separate command mode
  because the CI suite can take longer than the Stop handler's timeout.
- Document the global hook dependency, safe credential reuse and recovery.
- Include focused release-gate tests in canonical verification.

## Impact

The existing Pages workflow remains the publisher. Reader content, translations,
URLs and `/api/v1/` contracts stay compatible. No separate concurrent Stop hook
or additional hosting service is introduced.
