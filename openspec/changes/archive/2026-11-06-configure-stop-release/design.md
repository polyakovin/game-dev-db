# Design

Use the installed, trusted global lifecycle hooks rather than duplicating commit
or push logic in this repository. The global hook owns task-path selection,
verification gating, synchronization, release locking and execution from a Git
archive of the synchronized commit. The repository supplies an explicit `main`
release command with a bounded timeout.

The dependency-free Node.js release command uses `CODEX_RELEASE_COMMIT` and
`CODEX_RELEASE_SOURCE_REPO` supplied by the global hook. It observes the existing
push-triggered `.github/workflows/pages.yml` run for that SHA. Stop uses the
`--handoff` mode: wait for the matching run to appear, reject failure or changed
remote main, then return with a workflow URL. CI publishes only after verification
and browser checks pass. A successful handoff explicitly means queued publication.

The full CI run observed on 2026-11-06 took about 25 minutes, exceeding the global
Stop handler's 20-minute timeout. Keeping the handoff asynchronous avoids a
guaranteed false failure or changing the owner's trusted global hook. The normal
command mode separately waits up to 75 minutes for both required jobs, rejects
skipped or failed deployment, checks remote main again and fetches live RU/EN
pages and machine exports using the shared production URL configuration.

GitHub API requests reuse `GH_TOKEN` / `GITHUB_TOKEN`, or the source repository's
Git credential helper. Credentials remain in memory and are sent only to GitHub's
API. The snapshot needs Node.js 24 and Git but does not need npm dependencies or
Git metadata. Workflow checks install their own pinned dependencies.

The command only observes publication already triggered by push. Repeated runs
reuse that workflow; they do not dispatch duplicate deployments. Network errors,
API authorization failures, workflow failures and public-route failures produce
nonzero exit status for the global Stop hook to report.
