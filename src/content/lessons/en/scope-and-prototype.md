---
id: 'scope-and-prototype'
lang: 'en'
title: 'Scope and a testable prototype'
description: 'Choose one question, limit the work, and decide what to do after evaluating a prototype.'
category: 'design'
level: 'beginner'
minutes: 6
updatedAt: '2026-10-09'
tags: ['scope', 'prototyping', 'playtesting']
sources:
  [
    {
      'title': 'Unity Learn: Prototyping',
      'url': 'https://learn.unity.com/pathway/creative-core/unit/prototyping',
    },
  ]
---

## Before you start

You do not need an engine or an existing project. You need an idea for a player action and an uncertainty that blocks the next decision. The outcome is a small investigation with a clear stopping point, rather than a list of everything the game might eventually include.

## The principle

A prototype earns its place by reducing a specific uncertainty. “Make a roguelike” does not identify what to test. “Can a player distinguish two attacks from their warning cues?” describes an observable question. [Unity Learn: Prototyping](https://learn.unity.com/pathway/creative-core/unit/prototyping) introduces choosing a prototyping approach to fit a project's question.

Limit the action, environment, and outcome. One enemy, one room, and two warning cues may provide the observations you need. Inventory, progression, and story do not yet help answer this question. Put them on a separate list so that returning to them is a deliberate choice.

Distinguish an idea prototype from a vertical slice. Investigation may only need placeholder graphics and a manually triggered scenario. A slice demonstrates an integrated piece of intended production quality, so it has different costs. Choose the form that supports the upcoming decision.

## Example: can players read an attack?

Write an experiment card before development:

```text
Question: can players distinguish two attack warnings?
Material: one arena, one enemy, two attacks, quick restart.
Budget: one evening to build, then a short observation session.
Observation: which attack does the player predict before it starts?
Continue if: 8 of 10 predictions are correct after introduction.
Otherwise: change one cue and repeat the exercise.
Stop: after two variants, reconsider the attack designs themselves.
```

These numbers illustrate a preselected decision criterion, not an industry standard. Ten attempts by one person do not prove that a broad audience understands the mechanic. The result can guide the next change without replacing sessions with additional players.

Show each attack separately first. Then vary their order and ask the player to predict the attack before it executes. Record mistakes, when the decision was made, and comments about visibility. If the author reveals an answer through a hint or explanation, mark that attempt as influenced by assistance.

## Common mistakes

Do not change color, duration, audio, and trajectory simultaneously. You will not know which change helped. Do not add rewards to improve impressions of a warning-cue experiment. A positive comment is not evidence of readability; observe the relevant player action.

Avoid rebuilding the prototype into an ideal architecture before deciding whether to keep the idea. Still preserve a reliable way to launch the scene and repeat the exercise. A short launch guide and known-limitations list cost less than recovering forgotten settings.

When the time budget ends, record the result even if it is inconvenient. Continue with a concrete next question, change the approach, or stop pursuing the mechanic. A negative result can also reduce uncertainty.

## Verify it

- The question fits into one sentence.
- Every implemented feature helps answer that question.
- Deadline and effort limit were written before work started.
- The criterion measures behavior instead of compliments.
- Test conditions and limitations are recorded.
- The evaluation ends with a concrete next decision.

## Prompt for an AI agent

> Turn this mechanic idea into one testable question. Propose the cheapest prototype, explicit exclusions, a time budget, and an observable criterion. First consider a test without code. Do not present invented outcomes as a completed playtest. After implementation, provide launch instructions and a blank observation template.
