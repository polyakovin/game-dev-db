---
id: choice-cost
lang: en
title: 'Choice costs and situational value'
description: 'Compare options through time, resources and context to uncover a dominant choice.'
category: design
level: beginner
minutes: 5
updatedAt: '2026-10-20'
tags: [balance, choices, economy]
sources:
  - title: 'Ian Schreiber: Level 3, Transitive Mechanics and Cost Curves'
    url: https://gamebalanceconcepts.wordpress.com/2010/07/21/level-3-transitive-mechanics-and-cost-curves/
---

Two weapons with different numbers may offer the same decision: take the one that is better in every situation. Begin balancing by asking what the player pays and when they receive value.

## The principle

Cost can include resources, time, an occupied slot and a forgone opportunity. Comparison through a common cost model, as in [Ian Schreiber's lecture](https://gamebalanceconcepts.wordpress.com/2010/07/21/level-3-transitive-mechanics-and-cost-curves/), helps identify a suspicious option. A single ratio cannot describe all gameplay value.

An option dominates another in the selected model if it is no worse on every relevant criterion and better on at least one. “Relevant” requires explicit assumptions: range or accuracy cannot silently disappear from a real game's comparison.

## Example: rescue tools

In an illustrative game, players cut through debris. A saw removes 12 durability per action and consumes 3 charges. A cutter removes 8 and consumes 2. Both remove 4 durability per charge. That does not establish equivalence.

For debris with 8 durability, the cutter finishes in one action and 2 charges, while the saw needs one action and 3. For debris with 12 durability, the saw needs one action and 3 charges; the cutter needs two actions and 4. Rounding action counts changes the preferred option. This model has no misses, energy recovery or damage to the rescuer; revisit it when adding those systems.

List situations before changing numbers. To give the saw a role, test different debris durability and time limits. Do not invent cutter immunity merely to justify its neighbor: first ask whether a second tool is needed.

## Common mistakes

- Comparing only damage per second when scarce charges determine the decision.
- Equalizing averages while ignoring rounding and thresholds.
- Making every option equal in every situation and removing the reason to choose.

## Verify it

- Compute action count by rounding durability divided by tool strength upward.
- Record actions, charge consumption and the reason for preference in three situations.
- Find a justified use for every option you intend to keep.
- Check the model in play: waiting for animation may also be a cost.

## Prompt for an AI agent

> Make a table for debris with durability 8, 12 and 20. Count actions and charges separately and state assumptions. Propose one change if a tool is never useful. Do not claim the table proves balance.

Continue with [Last Ferry](/game-dev-db/en/practice/#last-ferry) and the [Meaningful Choices lens](/game-dev-db/en/lenses/#schell-039).
