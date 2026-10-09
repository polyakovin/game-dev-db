---
id: 'state-machines'
lang: 'en'
title: 'States and transitions'
description: 'Define legal character states, event priority, and transition checks without a growing tangle of flags.'
category: 'foundations'
level: 'beginner'
minutes: 6
updatedAt: '2026-10-09'
tags: ['state-machines', 'architecture', 'testing']
sources:
  [
    {
      'title': 'Robert Nystrom: State (author repository)',
      'url': 'https://github.com/munificent/game-programming-patterns/blob/master/book/state.markdown',
    },
  ]
---

## Before you start

You need conditions, functions, and a simple enumeration. Use a character that can move, dash, and die. The useful outcome is a transition table that explains which actions are allowed at each moment.

## The principle

Flags such as `isDashing`, `isDead`, and `canMove` can contradict each other. A finite state machine keeps one state for a chosen system and changes it through explicit events. Transitions may have guards, while entering and leaving a state can trigger one-time actions. Robert Nystrom explains the underlying pattern in [State](https://github.com/munificent/game-programming-patterns/blob/master/book/state.markdown).

Do not put the entire game into one enumeration. Movement and menu visibility may be independent concerns. Start with a boundary: this machine controls the character's available actions. Health, position, and remaining dash duration remain ordinary data.

## Example: a short dash

Assume a dash lasts 0.18 seconds and death interrupts it immediately. These are exercise parameters, not universal recommendations for responsive controls.

| Current state    | Event and guard                  | Next state                 |
| ---------------- | -------------------------------- | -------------------------- |
| ready            | dashPressed and charge available | dashing                    |
| dashing          | dash time expires                | ready                      |
| ready or dashing | health reaches zero              | dead                       |
| dead             | restart                          | ready after resetting data |

```text
update(dt, events):
    if state == dead and events.restart:
        resetCharacterData()
        transitionTo(ready)
        return
    if health <= 0:
        transitionTo(dead)
        return
    if state == ready and events.dashPressed and chargeReady:
        transitionTo(dashing)
    else if state == dashing:
        dashRemaining -= dt
        if dashRemaining <= 0:
            transitionTo(ready)
```

`transitionTo` does nothing when the requested state already matches the current state. For a real transition, it runs exit logic, changes state, and then runs entry logic. Spend a charge when entering `dashing`, rather than on every frame. You can also capture the dash direction at that point.

Notice the ordering: death is checked first and ends the update. This gives simultaneous events a defined priority. A different game may choose another ordering, but the decision should be written down.

## Common mistakes

An animation callback must not accidentally revive a dead character by reporting that a dash has finished. Accept an event only in a compatible state. For delayed callbacks, checking the identity of the action that created them can also be useful.

Avoid building a framework for dozens of imagined future states. Start with an enumeration and a small transition function. If the table fills up with combinations such as running-with-weapon and running-without-weapon, check whether independent systems have been combined unnecessarily.

Assigning `ready` is not a complete restart. Health, charges, timers, and subscriptions must return to their intended initial values too. List that reset data explicitly and exercise the scene a second time.

## Verify it

- A single dash request spends exactly one charge.
- Death interrupts a dash and prevents new actions.
- A late animation event cannot change a dead character's state.
- Every row of the transition table has a focused check.
- Illegal events have a defined outcome, such as being ignored or logged.
- Restarting restores the full initial data set.

## Prompt for an AI agent

> Find the flags controlling dash and death. First produce a table of legal transitions and the priority of simultaneous events. Then propose a small state machine without a general framework. Check double presses, death during a dash, a late callback, and a second scene start. Explain which data remains separate from the current state.
