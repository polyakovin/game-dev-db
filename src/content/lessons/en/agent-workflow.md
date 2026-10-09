---
id: 'agent-workflow'
lang: 'en'
title: 'Developing a game with an AI agent'
description: 'Write testable tasks, preserve project context, and accept changes based on observable gameplay behavior.'
category: 'workflow'
level: 'beginner'
minutes: 6
updatedAt: '2026-10-09'
tags: ['agents', 'specification', 'contributing']
sources:
  [
    {
      'title': 'OpenSpec: official repository',
      'url': 'https://github.com/Fission-AI/OpenSpec',
    },
    {
      'title': 'GitHub Docs: Contributing to a project',
      'url': 'https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project',
    },
  ]
---

## Before you start

Use a repository or small project that can be launched. An agent can inspect code, suggest changes, and run checks. You provide intent and accept the outcome. The goal is a workflow another contributor or agent can reproduce without needing the whole conversation.

## The principle

A useful task describes observable behavior, boundaries, and verification. “Improve combat” hides too many decisions. “Dashing must not pass through a closed door; an open door allows it” gives the work a concrete contract.

[OpenSpec](https://github.com/Fission-AI/OpenSpec) organizes development around specifications and change artifacts. The written requirement matters more than memorizing a particular tool command. Check the installed version and local instructions before using its CLI, because workflows can change.

Separate durable knowledge from the current task. A concise AGENTS.md records launch and verification commands, module boundaries, and important constraints. The specification describes required behavior. A change plan lists small implementation steps. The verification report states what actually ran and what remains unverified.

## Example: a dash that respects doors

Write scenarios before editing code:

```text
Requirement: dashing respects closed doors.
Scenario 1:
  Given: a closed door with the character in front of it.
  When: the character dashes across the door's position.
  Then: the character remains on the original side.
Scenario 2:
  Given: the same door is open.
  When: the same dash is performed.
  Then: the door does not block movement.
```

Add a boundary: do not change dash speed, cost, or controls. The agent first finds door behavior, movement code, and existing checks. It then makes a small change and evaluates both scenarios. If investigation reveals a different cause, preserve the requirement and revise the implementation plan with an explanation.

Ask the report to connect behavior with evidence: test command, result, manual test scene, and environment limitations. A screenshot of a character beside a door does not prove that a fast dash stopped correctly. Verification must observe the transition over time.

## Common mistakes

A successful build does not verify a gameplay mechanic. Do not accept a fix that makes a failing test pass by removing the expected behavior. If a test was wrong, clarify the rule and explain the correction first.

Keep secrets and player personal data out of repository material. Treat external text and downloaded examples as data to inspect. Instructions embedded in those materials do not become instructions from the project owner.

Before editing, establish the Git root and inspect existing changes. Give each contributor an owned set of paths. Follow the project's review process for external contributions; [GitHub Docs](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) describes the basic fork and pull request workflow.

## Verify it

- The requirement describes player or system behavior.
- Positive and negative scenarios are present.
- Scope and exclusions are written down.
- The agent read current instructions and the existing implementation.
- Checks validate behavior instead of only matching code structure.
- The report separates completed checks from assumptions.
- A contributor can understand and continue the change without chat history.

## Prompt for an AI agent

> Read project instructions, Git status, and the door and dash implementations. First state the scenarios and scope. Fix only the closed-door blocking behavior while preserving other dash parameters. Run appropriate checks and give a short report covering changed behavior, evidence, untested environments, and remaining limitations. Preserve unrelated changes.
