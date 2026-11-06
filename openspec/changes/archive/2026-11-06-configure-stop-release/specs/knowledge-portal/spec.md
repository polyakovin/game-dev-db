## ADDED Requirements

### Requirement: Codex Stop release handoff
The repository SHALL configure main-branch release handoff through the trusted
global Codex Stop hook. The command SHALL identify the existing Pages push run
for the exact synchronized current commit before handing publication to CI. It
SHALL run from a committed snapshot without npm dependencies, protect credentials
and distinguish asynchronous handoff from confirmed deployment.

#### Scenario: Publish the current task commit
- **WHEN** the global Stop hook has committed verified task-owned changes on main and synchronized them with upstream
- **THEN** the configured release command confirms the Pages workflow for that commit and hands publication to CI, which publishes only after canonical and browser checks pass

#### Scenario: Reject an incomplete or superseded release
- **WHEN** the matching workflow has failed or been cancelled, never appears within the handoff deadline, or remote main no longer matches the requested commit
- **THEN** the release command exits unsuccessfully and does not report successful handoff

#### Scenario: Reuse the existing publisher
- **WHEN** release confirmation runs again for a previously deployed commit
- **THEN** it observes the existing workflow and checks public routes without creating another deployment

### Requirement: Full Pages release confirmation
The release command SHALL offer a separate waiting mode that requires successful
verification and Pages deployment jobs for the requested current commit, checks
live Russian and English pages, the v1 manifest and agent index, and reports
failure for skipped jobs, public-route errors or its bounded deadline.

#### Scenario: Confirm the live release
- **WHEN** the command runs without the Stop handoff option
- **THEN** it waits for the exact commit's successful required jobs and checks production routes before reporting a completed release
