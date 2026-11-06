# Codex commit and Pages release

The owner's trusted global `~/.codex/hooks.json` handles this repository's Git
lifecycle. At Stop it commits only task-owned changes relative to the request's
baseline after a canonical check has run. It then requires a fetch and safe
upstream synchronization; if the commit is ahead, Codex continues to perform a
normal push. Pre-existing unrelated files stay outside the task commit.

The tracked `.codex/release.json` opts `main` into that global hook's release
phase. No project-local `hooks.json` is needed. Codex runs matching hooks
concurrently, so adding another commit/publish Stop handler would create competing
writers. See the [official hook documentation](https://developers.openai.com/codex/hooks).

The global release runner executes `node scripts/release-pages.mjs` from a Git
archive of the synchronized commit, using `--handoff`, with `CODEX_RELEASE_COMMIT` and
`CODEX_RELEASE_SOURCE_REPO`. The command needs Node.js 24 and Git, without local
`node_modules` or Git metadata in that archive.

## Publication checks

Push to `main` already starts `.github/workflows/pages.yml`. Stop waits up to two
minutes for that exact SHA's push run to appear, rejects a failed run or changed
remote main SHA, then hands publication to CI. The workflow
installs the lockfile dependencies, runs `npm run verify` and `npm run test:e2e`,
and publishes the verified `dist/` artifact only after those checks succeed. The
command does not dispatch another workflow or create a GitHub Release/tag.

This handoff is asynchronous: the global hook's completed release-command record
confirms that CI accepted the current commit, not that the site is already live.
The observed full workflow took about 25 minutes on 2026-11-06, longer than the
global Stop handler's 20-minute limit. CI remains the publication gate, including
after the chat turn ends. Its failure or cancellation is visible in GitHub Actions.

To confirm a finished release, run the command without `--handoff`:

```bash
CODEX_RELEASE_COMMIT="$(git rev-parse HEAD)" \
CODEX_RELEASE_SOURCE_REPO="$PWD" node scripts/release-pages.mjs
```

This mode waits up to 75 minutes and requires both `Verify content and site` and
`Deploy GitHub Pages` jobs to finish successfully for the exact commit.

Afterwards it checks the remote `main` SHA and production `/ru/`, `/en/`,
`/api/v1/manifest.json` and `/llms.txt`, using `src/lib/site-config.mjs`. The
successful workflow and required jobs identify the published commit; public HTTP
checks verify availability, language and export structure rather than claiming
byte-for-byte comparison of the complete live site.

API access uses `GH_TOKEN` or `GITHUB_TOKEN` when available, otherwise the existing
Git credential helper for this repository. Tokens remain in memory, are sent only
to `api.github.com`, and are never printed or written into the repository. Public
API reads also work anonymously when rate limits permit. API operations only
observe the existing workflow and branch.

## Inspection and recovery

- Inspect the global handlers and trust status in Codex **Settings > Hooks** or
  CLI `/hooks`. The project is trusted on the owner's machine. Other clones need
  the equivalent trusted global lifecycle implementation; `release.json` alone
  is not a built-in Codex hook registration.
- The global runner writes its result to
  `~/.codex/hooks/state/release-logs/game-dev-db-<commit>.log`. A failed or cancelled
  workflow, changed branch SHA or API error makes handoff fail. The full
  confirmation mode also rejects skipped required jobs and failed public routes.
- Fix a failed check before publishing another task commit. A rerun of the same
  command observes the existing workflow without creating another deployment.
  To retry a cached global-hook release failure for the same commit, run the
  next hook invocation with `CODEX_HOOK_RETRY_RELEASE=1` in its environment.
- Requests explicitly forbidding commit or release are handled by the global
  hook's existing opt-out logic. Feature branches do not run the release command.

Release-gate regression checks run with `npm run test:release` and are part of
`npm run verify`. Browser checks remain `npm run test:e2e` before publication.

The GitHub REST contracts are documented under
[workflow runs](https://docs.github.com/en/rest/actions/workflow-runs#list-workflow-runs-for-a-workflow)
and [workflow jobs](https://docs.github.com/en/rest/actions/workflow-jobs#list-jobs-for-a-workflow-run).
