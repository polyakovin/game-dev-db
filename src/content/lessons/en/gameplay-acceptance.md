---
id: gameplay-acceptance
lang: en
title: 'Verifying gameplay behavior'
description: 'Turn “the mechanic is done” into reproducible scenarios with initial conditions, an action and an observable result.'
category: workflow
level: beginner
minutes: 6
updatedAt: '2026-10-20'
tags: [testing, acceptance, debugging]
sources:
  - title: 'Cucumber: Gherkin reference'
    url: https://cucumber.io/docs/gherkin/reference/
  - title: 'Godot: Overview of debugging tools'
    url: https://docs.godotengine.org/en/stable/tutorials/scripting/debug/overview_of_debugging_tools.html
---

## Prerequisites

A game can launch and accept a button press while the mechanic still breaks its rule. Check promised behavior under known conditions, then separately assess how players experience it.

## The principle

Write the initial state, event and expected observable result. This matches the Given/When/Then structure in the [Gherkin reference](https://cucumber.io/docs/gherkin/reference/), but a manual check does not require installing Cucumber.

Separate a pure rule from integration. Charge consumption can be checked in a model; door collision, sound and recovery from pause need checks inside the game. Engine debugging tools help expose causes, but a clean console does not establish correct mechanics.

<span id="example-a-single-charge-dash"></span>

## Practical example

### A single-charge dash

In this teaching contract, a dash consumes one charge and lasts 0.2 seconds of game time. Pause stops the game timer. Death cancels dash movement without returning the charge. These are authored example rules, not universal requirements.

| Given                     | When                    | Then                                   |
| ------------------------- | ----------------------- | -------------------------------------- |
| Character alive, charge 1 | Dash request accepted   | Charge 0, dash state active            |
| Charge 0                  | Another request arrives | No new dash starts                     |
| Dash active               | Game is paused          | Duration does not advance during pause |
| Dash active               | Death event arrives     | Movement canceled, charge remains 0    |

Choose a priority for a simultaneous request and death beforehand: this model processes death first, so no dash starts. Reset initial state for each run; otherwise an earlier test consumes the next one's charge.

In a fixed-step model, check completion on the first tick where accumulated game time reaches 0.2 seconds. For manual observation, specify an acceptable tolerance and use a log rather than eyeballing duration.

## Common mistakes

- Testing only the successful case with full resources.
- Treating a screenshot as proof of correct duration.
- Requiring the same render-frame number at different rendering rates.
- Presenting an automated rule check as evidence of usable controls.

## Verify it

1. Execute each scenario from its specified state and retain the result.
2. Repeat integration checks at different rendering rates while preserving the simulation step.
3. Check pause, restart and simultaneous events.
4. For a failure, record build, input events, expected behavior and actual behavior.

## Prompt for an AI agent

> Implement the dash contract and scenario table. Automate pure transitions and describe the remaining checks for the target device. Separate executed checks, unexecuted checks and discrepancies in the report. Do not invent a successful run.

Compare transitions with [States and transitions](/game-dev-db/en/lessons/state-machines/) and the [Rules lens](/game-dev-db/en/lenses/#schell-033).
