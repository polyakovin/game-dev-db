---
id: npc-pathfinding
lang: en
title: 'Pathfinding and following a route'
description: 'Choose a space representation and traversal costs while separating a computed path from actual NPC movement.'
category: engineering
level: intermediate
minutes: 6
updatedAt: '2026-10-20'
tags: [npc-ai, pathfinding, algorithms]
sources:
  - title: 'Amit Patel, Red Blob Games: Introduction to the A* Algorithm'
    url: https://www.redblobgames.com/pathfinding/a-star/introduction.html
---

## Prerequisites

Finding a sequence of cells and moving a character through it without getting stuck are separate tasks. Start with a space model, then check both parts.

## The principle

Search operates on a graph: nodes and allowed transitions between them. [Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html) applies the same idea to different spatial representations. A tile grid is convenient but optional.

With equal edge costs, breadth-first search (BFS) finds a path with the fewest transitions. With differing nonnegative costs, Dijkstra accounts for their sum. A* adds an estimate of the remaining cost. On a four-connected grid without diagonals, Manhattan distance multiplied by the minimum step cost is a suitable lower bound; unusual transitions such as teleporters can invalidate it.

<span id="example-maintenance-corridors"></span>

## Practical example

### Maintenance corridors

This illustrative graph has two routes from A to G. Only the listed edges exist, and each is bidirectional:

| Edge | Cost |
| ---- | ---: |
| A–B  |    1 |
| B–G  |    4 |
| A–C  |    2 |
| C–D  |    1 |
| D–G  |    1 |

A–B–G has two transitions and costs 5. A–C–D–G has three and costs 4. BFS solves the transition-count problem, not minimum cost. Dijkstra should select the second route. A* with a zero heuristic reduces to Dijkstra and provides a useful baseline check.

Now place the corridors in a game. Include robot width when computing traversability. A closing door can invalidate an old path. A navigation-change signal or detected blockage should trigger recomputation or an understandable failure, according to the project's rules.

## Common mistakes

- Assuming straight-line distance remains a guaranteed lower bound with cheap teleporters.
- Treating an empty path as success when the goal is unreachable. Start equal to goal is a separate case.
- Recomputing every frame without need or cost measurement.
- Forgetting that a smoothed segment can cut an impassable corner.

## Verify it

1. Calculate both path costs manually and compare the algorithm's result.
2. Remove D–G: route A–B–G must remain, with cost 5. Then remove B–G and check an explicit “no path” result.
3. Check start equal to goal and a door closing during travel.
4. Follow the computed route with the real collider, including narrow turns.

## Prompt for an AI agent

> Separate route search from robot movement. Return the route, total cost and status. Compare BFS and Dijkstra on the supplied graph, then handle blockages. Do not declare navigation complete based on one drawn line.

Review the model through the [Functional Space lens](/game-dev-db/en/lenses/#schell-026).
