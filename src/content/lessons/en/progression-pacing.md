---
id: progression-pacing
lang: en
title: 'Progression: capabilities and pacing'
description: 'Check whether upgrades change player actions and whether increasing numbers conceal repetition of the same task.'
category: design
level: intermediate
minutes: 5
updatedAt: '2026-10-20'
tags: [balance, progression, economy]
sources:
  - title: 'Ian Schreiber: Level 7, Advancement, Progression and Pacing'
    url: https://gamebalanceconcepts.wordpress.com/2010/08/18/level-7-advancement-progression-and-pacing/
---

## Prerequisites

A character's level can increase while their actions remain unchanged. Design progression by describing the experience between stages: a new capability, a different risk or a shorter route to a familiar goal.

## The principle

Separate numerical growth, skill development and unlocking actions. The [progression lecture](https://gamebalanceconcepts.wordpress.com/2010/08/18/level-7-advancement-progression-and-pacing/) examines advancement alongside game pacing. An experience curve alone cannot establish interest or an appropriate session length.

Start with an intended change: after the first upgrade, perhaps players can quickly clear a small obstacle and focus on choosing a route. Then choose numbers and check whether that change occurs. This is a design hypothesis, not a universal genre rule.

<span id="example-three-station-cleanup-stages"></span>

## Practical example

### Three station-cleanup stages

In this illustrative model, every hit connects, damage is constant and obstacles do not regenerate.

| Stage          | Damage | Obstacle durability | Hits to destroy |
| -------------- | -----: | ------------------: | --------------: |
| Start          |     10 |                  40 |               4 |
| Before upgrade |     12 |                  60 |               5 |
| After upgrade  |     20 |                  60 |               3 |

The first damage increase did not accelerate work: durability grew faster. The second upgrade crosses a hit-count threshold. If attack intervals, misses or animations differ, hit count still does not equal completion time.

Now add a price. An upgrade costing 60 parts, with 10 awarded per encounter, requires six encounters if no other income or expenses exist. The next costs 120 with rewards of 15, requiring eight. Check whether these eight encounters introduce new decisions. A longer wait does not by itself create development.

## Common mistakes

- Multiplying power and enemy health together without checking actual changes in actions.
- Counting income while overlooking mandatory repair costs.
- Measuring only total duration and hiding a long stretch without new decisions.

## Verify it

1. Calculate hits and the expected purchase path at each stage.
2. Check the threshold immediately before and after an upgrade against the same obstacles.
3. Record new decisions and places that repeat the previous task.
4. Compare the plan with an observed session instead of fitting the report to the curve.

## Prompt for an AI agent

> Build a table for three station stages. Show hit thresholds, income, mandatory expenses and encounters before an upgrade. Propose a capability change instead of just increasing a number. Label all values as illustrative.

Apply the [Reward](/game-dev-db/en/lenses/#schell-046) and [Visible Progress](/game-dev-db/en/lenses/#schell-055) lenses, then try [Remove the Market](/game-dev-db/en/practice/#remove-the-market).
