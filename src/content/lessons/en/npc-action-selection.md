---
id: npc-action-selection
lang: en
title: 'How an NPC selects an action'
description: 'Separate eligibility, priority and execution so a character makes explainable decisions without rapidly switching between them.'
category: engineering
level: intermediate
minutes: 6
updatedAt: '2026-10-20'
tags: [npc-ai, decision-making, debugging]
sources:
  - title: 'Dawe et al.: Behavior Selection Algorithms, An Overview'
    url: https://www.gameaipro.com/GameAIPro/GameAIPro_Chapter04_Behavior_Selection_Algorithms.pdf
  - title: 'David Rez Graham: An Introduction to Utility Theory'
    url: https://www.gameaipro.com/GameAIPro/GameAIPro_Chapter09_An_Introduction_to_Utility_Theory.pdf
---

## Prerequisites

A character may need charging, repairs and helping the player simultaneously. Write the selection rule explicitly before adding behavioral architecture.

## The principle

First filter eligible actions, then select one, then execute it. Do not let each subsystem independently control movement. The Game AI Pro overview compares state machines, behavior trees and other selection methods; there is no universal winner.

A state machine suits a few distinct modes. A behavior tree suits sequences of conditions and actions. Comparing situational value can use a common scoring scale, as described in the utility-theory chapter. Scoring does not replace prohibitions or eligibility checks.

<span id="example-a-maintenance-robot"></span>

## Practical example

### A maintenance robot

In this teaching model, a robot can charge, repair a pump or help the player open a heavy door. Battery is normalized from 0 to 1. Below 0.1, a mandatory rule sends it to an available charger. If no route exists, it waits safely and reports why.

Otherwise, compare eligible candidates:

| Action | Score in this model | Eligibility                             |
| ------ | ------------------- | --------------------------------------- |
| Charge | `1 - battery`       | Charger reachable                       |
| Repair | `leakSeverity`      | Parts available and pump reachable      |
| Help   | `requestUrgency`    | Request still active and door reachable |

All inputs are bounded to 0..1. With battery 0.6, leak severity 0.8 and urgency 0.5, repair wins. These are authored design scores, not measurements of human desires.

To prevent close scores causing rapid switching, retain the current action until a competitor scores at least 0.15 higher. Release completed or ineligible actions immediately. Break ties with a stable order. Tune the margin after observation; the mandatory low-battery rule still takes priority.

## Common mistakes

- Comparing distance in meters with urgency on a 0..1 scale without conversion.
- Restarting repair every frame and resetting its progress.
- Retaining an action for stability after its target has been destroyed.

## Verify it

- Log inputs, excluded actions, scores and selection reasons.
- Check tied scores, lost targets and no eligible candidates.
- Vary urgency around the margin and check for excessive switching.
- Separately check mandatory charging and an unreachable charger.

## Prompt for an AI agent

> Implement selection as a pure function of a world snapshot and current action. Keep execution separate. Prepare a boundary-case table and explain every result without random selection. Do not connect a language model to per-frame control.

Review through the [Action](/game-dev-db/en/lenses/#schell-031) and [Transparency](/game-dev-db/en/lenses/#schell-062) lenses.
