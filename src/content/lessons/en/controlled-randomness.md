---
id: controlled-randomness
lang: en
title: 'Randomness and unlucky streaks'
description: 'Separate average probability from a short session and decide whether the game needs limits on outcome streaks.'
category: design
level: intermediate
minutes: 6
updatedAt: '2026-10-20'
tags: [balance, probability, testing]
sources:
  - title: 'Ian Schreiber: Level 4, Probability and Randomness'
    url: https://gamebalanceconcepts.wordpress.com/2010/07/28/level-4-probability-and-randomness/
  - title: 'Ian Schreiber: Level 5, Probability and Randomness Gone Horribly Wrong'
    url: https://gamebalanceconcepts.wordpress.com/2010/08/04/level-5-probability-and-randomness-gone-horribly-wrong/
---

## Prerequisites

A reward with a 25% chance need not appear once every four attempts. A short session can differ considerably from the average across many runs.

## The principle

Before implementation, name the event, its probability and dependencies between attempts. [Game Balance Concepts](https://gamebalanceconcepts.wordpress.com/2010/07/28/level-4-probability-and-randomness/) helps distinguish a probability model from one outcome. If you change the distribution for the player experience, update the rule's description too.

Independent rolls do not suit every design. You can limit failure streaks, but the next outcome then depends on history. That choice is not automatically fair: define whose experience and which behavior matter.

<span id="example-expedition-batteries"></span>

## Practical example

### Expedition batteries

In this teaching model, each crate independently contains a battery with probability 0.25. Across five crates, the expected battery count is `5 × 0.25 = 1.25`. The probability of finding none is `0.75^5 ≈ 23.73%`. An average above one coexists with a substantial chance of getting no batteries.

An alternative is to shuffle a bag of four tokens, one representing a battery. Each complete bag provides exactly one. Order is random, but outcomes are dependent. A battery at the beginning of one bag and at the end of the next permits six empty crates in a row. A four-token bag does not guarantee a reward in every sliding window of four attempts.

If a battery is required to finish the level, provide recovery from a poor outcome separately. A guarantee or fallback route changes the design, not just the random-number generator.

## Common mistakes

- Testing 25% with four rolls and declaring the generator broken.
- Applying independent-event formulas to dependent outcomes.
- Saving only the seed (the generator’s initial value) while losing the order of generator calls.

## Verify it

1. Recalculate the empty-streak probability analytically.
2. In simulation, record reward frequency and streak-length distribution, not only the mean.
3. For bags, check every position of the single battery in two adjacent bags.
4. Save the seed, algorithm version and event sequence to reproduce a failure.

## Prompt for an AI agent

> Compare independent rolls and bags over equal crate counts. Show assumptions, a reproducible run and the worst possible bag streak. Do not replace a guarantee calculation with a random simulation result.

Test the choice in [Weather Window](/game-dev-db/en/practice/#weather-window) and through the [Chance lens](/game-dev-db/en/lenses/#schell-036).
