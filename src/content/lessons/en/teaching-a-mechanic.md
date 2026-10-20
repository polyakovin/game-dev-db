---
id: teaching-a-mechanic
lang: en
title: 'Teaching one mechanic through a level'
description: 'Build a short sequence in which players try a rule, receive feedback and apply it in a new situation.'
category: design
level: beginner
minutes: 5
updatedAt: '2026-10-20'
tags: [level-design, learning, feedback]
sources:
  - title: 'Patrick Holleman: Reverse Design, Super Mario World'
    url: https://thegamedesignforum.com/features/RD_SMW_1.html
---

## Prerequisites

Players can read a hint without understanding the rule. To check understanding, let them perform an action and independently transfer it to a slightly different situation.

## The principle

Choose one skill the level should clarify. A useful aspect of [Reverse Design: Super Mario World](https://thegamedesignforum.com/features/RD_SMW_1.html) is its method: examine individual challenges and their sequences instead of relying on a general instruction to “make it harder.”

For your prototype, separate introduction, independent attempt and skill transfer. This is a working structure, not a mandatory law for every level. It does not replace understandable controls, accessible hints or testing with your audience.

<span id="example-a-pulse-platform"></span>

## Practical example

### A pulse platform

This invented level teaches a platform that rises for one second after a button press. In the first room, the button and platform are visible together, and a failed jump returns the player to safe ground. They can observe the relationship between action and movement without losing progress.

In the second room, the button is slightly farther away. The rule is unchanged, but movement must begin immediately after the press. The third room offers two possible platforms, and the player chooses one that reaches the exit. Adding a new enemy, button type and jump at once would make the reason for failure unclear.

Change one parameter between attempts. If the player waits for the platform but never jumps, check jump controls. If they do not connect the button with the platform, fix feedback before tightening timing.

## Common mistakes

- The first encounter immediately punishes failure with death and a long replay.
- The second room requires a different rule that has never been introduced.
- The author explains the solution aloud and mistakes completion for independent understanding.

## Verify it

1. Record which action would demonstrate understanding in each room.
2. Observe an attempt without spoken hints; record any help separately.
3. Ask the player to describe the rule afterward without supplying the wording.
4. After failure, change one element and observe a new participant.

## Prompt for an AI agent

> Describe three pulse-platform rooms. For each, name the known rule, new question, safe retry and observable sign of understanding. Do not add mechanics outside this skill.

Develop the sequence in [Signal Room](/game-dev-db/en/practice/#signal-room) and review it through the [Skill lens](/game-dev-db/en/lenses/#schell-034).
