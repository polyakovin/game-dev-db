---
id: running-a-playtest
lang: en
title: 'Running a playtest with a concrete question'
description: 'Prepare a short play session, separate observations from interpretations and choose the next change.'
category: workflow
level: beginner
minutes: 5
updatedAt: '2026-10-20'
tags: [playtesting, observation, iteration]
sources:
  - title: 'The Level Design Book: Playtesting'
    url: https://book.leveldesignbook.com/process/blockout/playtesting
---

## Prerequisites

“How did you like the game?” often produces a polite answer that is hard to act on. It is more useful to choose an uncertainty beforehand and observe what someone does in a specific play situation.

## The principle

Form a question, prepare a suitable game segment and observe. [The Level Design Book](https://book.leveldesignbook.com/process/blockout/playtesting) distinguishes self-playtests, critique with a colleague and observing an outside player. They serve different purposes.

Testing a first encounter requires someone who does not already know the solution. The same person's repeat attempt can check usability, but no longer reproduces first discovery. A few observations can reveal problems; they do not establish the preferences of an entire audience.

<span id="example-a-station-delivery"></span>

## Practical example

### A station delivery

The teaching question is: “Can a new player deliver a battery to the antenna without spoken explanation?” Prepare one level version, the same starting state and a consistent objective. Invite the person to play and explain that the game is being tested, not their abilities. Obtain consent before recording screen or voice.

During play, separate your notes:

| Observation                              | Possible explanation              | Next check                        |
| ---------------------------------------- | --------------------------------- | --------------------------------- |
| Approached a locked hatch three times    | Hatch suggests an available route | Change its signage                |
| Returned to the start after climbing     | Lost direction toward the goal    | Check antenna visibility upstairs |
| Asked whether the battery can be dropped | Allowed actions are unclear       | Check the carrying hint           |

These are example notes, not completed research. Do not supply the solution merely to get a successful run sooner. If a blocking bug requires intervention, record when and how you helped.

Afterward, ask which goal the player pursued at an ambiguous moment. Their answer helps refine an interpretation without erasing the observation. Choose one change connected to the question and test again.

## Common mistakes

- Changing the build midway through a series and treating conditions as equivalent.
- Recording “confused” without location, action or context.
- Changing camera, route and controls simultaneously and losing the cause of an effect.

## Verify it

- The report includes a question, build version, starting conditions and the participant's prior familiarity.
- Facts are separate from assumptions and author decisions.
- Assistance and blocking bugs are recorded separately.
- The next change connects to at least one observation.

## Prompt for an AI agent

> Prepare a five-minute station playtest: one question, a neutral task, an observation table and follow-up questions. Do not invent participants or results. After receiving real notes, propose one next experiment.

Use the [Playtesting lens](/game-dev-db/en/lenses/#schell-103) and [Three-Minute Museum](/game-dev-db/en/practice/#three-minute-museum).
