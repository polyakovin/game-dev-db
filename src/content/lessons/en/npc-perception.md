---
id: npc-perception
lang: en
title: 'NPC perception and target memory'
description: 'Separate world state from character knowledge: visibility, last observation, forgetting and readable reactions.'
category: engineering
level: intermediate
minutes: 6
updatedAt: '2026-10-20'
tags: [npc-ai, perception, state-machines]
sources:
  - title: 'Martin Walsh: Modeling Perception and Awareness in Splinter Cell Blacklist'
    url: https://www.gameaipro.com/GameAIPro2/GameAIPro2_Chapter28_Modeling_Perception_and_Awareness_in_Tom_Clancy%27s_Splinter_Cell_Blacklist.pdf
---

## Prerequisites

Game code knows every object's coordinates. An NPC does not have to. Here, AI means a character behavior algorithm rather than a language model.

## The principle

Separate observation from decision. Perception reports “target visible” or “noise heard,” memory retains the last known location, and behavior selects an action. Martin Walsh's Game AI Pro 2 chapter examines perception and awareness as game models where consistent rules and feedback matter.

Start with [States and transitions](/game-dev-db/en/lessons/state-machines/). Explicitly define which information each state can access. If an NPC uses hidden player coordinates after losing sight, that should be a deliberate game rule rather than accidental data leakage.

<span id="example-an-observation-drone"></span>

## Practical example

### An observation drone

In this original teaching model, a drone detects the player within a 90° sector and 8 m range if a ray to a target sample point is unobstructed. Radius alone is insufficient: a wall blocks observation. A ray to one point is also a simplification and can behave oddly at cover edges.

While the target is visible, the drone updates its last known position. After losing sight, it searches that position for two seconds, then resumes its route. It does not update memory through a wall.

Illustrative pseudocode, not code for a particular engine:

```text
visible = within_range(target) and within_cone(target) and clear_ray(target)
if visible:
    memory.position = target.position
    memory.expires_at = now + 2.0
    state = tracking
else if now < memory.expires_at:
    state = searching
    search_position = memory.position
else:
    state = patrol
```

Before the first observation, memory is assumed to be expired. This variant provides short memory without modeling accumulating suspicion. Add suspicion only if the gameplay rule needs it.

## Common mistakes

- Range checks without obstruction checks let the NPC see through walls.
- Search uses the hidden target's current location, making memory effectively omniscient.
- States change without a cue, leaving the player unsure whether detection occurred.

## Verify it

- Display the debug sector, ray, state and memory position.
- Check a target in front, behind, behind a wall and at the range boundary.
- Move the player after losing visibility and confirm the memory point stays fixed.
- With discrete updates, check memory expiry on the first tick after its deadline.

## Prompt for an AI agent

> Implement separate observation, memory and drone state. Prepare four test scenes and log transition reasons. State the ray and update-frequency simplifications. Visually identify searching without relying on color alone.

Review through the [State Machine](/game-dev-db/en/lenses/#schell-028) and [Feedback](/game-dev-db/en/lenses/#schell-063) lenses.
