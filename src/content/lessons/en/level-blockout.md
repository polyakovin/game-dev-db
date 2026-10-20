---
id: level-blockout
lang: en
title: 'Blockout: test space before art'
description: 'Build a rough playable level around actual character dimensions, speed and camera to test a gameplay question.'
category: design
level: beginner
minutes: 5
updatedAt: '2026-10-20'
tags: [level-design, prototyping, playtesting]
sources:
  - title: 'The Level Design Book: Blockout'
    url: https://book.leveldesignbook.com/process/blockout
  - title: 'The Level Design Book: Metrics'
    url: https://book.leveldesignbook.com/process/blockout/metrics
---

A blockout, or graybox, tests play in a space that is still easy to rebuild. Cubes, planes and placeholder signs are enough when the character already moves according to the real rules.

## The principle

A floor plan shows connections between rooms. A playable draft shows how those connections interact with movement speed, collision and the camera. [The Level Design Book](https://book.leveldesignbook.com/process/blockout) treats blockouts as a tool for early iteration. This does not mean a level will never change afterward.

Start with a question: for example, “Can the player notice the closing door and choose a detour in time?” An attractive editor view cannot answer it. If the core mechanic is missing, conclusions about suitable geometry remain provisional.

## Example: a warehouse door

This is an original teaching scenario, not a reported test result. The character is 0.8 m wide and moves at 4 m/s. A warehouse has a direct corridor of 12 m and a detour of 20 m. Without stops, they take 3 and 5 seconds. The direct door closes 4 seconds after a signal.

Build both routes with primitives. Use the gameplay camera and actual collision. Measure the route from where the player can first notice the signal, rather than a convenient editor marker. Turns and acceleration can increase travel time.

The first pass checks whether the door is reachable. The second checks whether an understandable exit remains after it closes. The third checks the return trip with cargo, if cargo affects movement.

## Common mistakes

- Flying an editor camera through the level: the passage looks wide while the character gets stuck.
- Using a temporary controller: changing the jump later invalidates the distances.
- Adding decoration early: the author protects an expensive room even when its route fails.

## Verify it

1. Walk both routes from the same start and record actual travel times.
2. Check narrow passages with the gameplay collider and camera.
3. Change one dimension, repeat the walk and explain the behavioral difference.
4. Record the unresolved question before adding final art.

## Prompt for an AI agent

> Build the warehouse from simple shapes. Expose dimensions, speed and door delay as parameters. Show the timer origin and travel time. Do not claim route clarity without observing a player. Prepare three manual acceptance scenarios.

Continue with [Paper Current](/game-dev-db/en/practice/#paper-current): test the rule in a cheap prototype before translating it into space.
