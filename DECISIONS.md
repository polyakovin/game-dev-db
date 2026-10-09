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
