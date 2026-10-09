---
id: 'collision-basics'
lang: 'en'
title: 'Collision fundamentals'
description: 'Separate overlap detection, physical response, and gameplay events; check boundaries, fast objects, and repeated damage.'
category: 'engineering'
level: 'intermediate'
minutes: 6
updatedAt: '2026-10-09'
tags: ['collision', 'physics', 'testing']
sources:
  [
    {
      'title': 'MDN: 2D collision detection',
      'url': 'https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection',
    },
    {
      'title': 'Godot: Physics introduction',
      'url': 'https://docs.godotengine.org/en/stable/tutorials/physics/physics_introduction.html',
    },
  ]
---

## Before you start

You need coordinates and basic conditions. Begin with two unrotated rectangles. The goal is to define exactly what contact means without confusing geometry with damage rules.

## The principle

Detection asks whether shapes intersect. Collision resolution decides how to remove penetration and change movement. Gameplay response decides what contact means: damage, picking up an item, or opening a door. These tasks can share an event while following different rules.

For axis-aligned rectangles, compare their intervals on both axes. A larger scene can first select possible neighbors and then run more precise checks. [MDN: 2D collision detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection) introduces these techniques.

When using an engine, first learn its physics object types and interaction filters. The [Godot physics introduction](https://docs.godotengine.org/en/stable/tutorials/physics/physics_introduction.html), for example, distinguishes detection areas from physical bodies and explains collision layers and masks. Do not place custom movement on top of a physics solver without understanding their update order.

## Example: a hazard area

Assume rectangle coordinates describe the top-left corner and dimensions are positive. For this exercise, touching edges without overlapping area does not count as a hit.

```text
overlap(a, b):
    separatedX = a.right <= b.left or b.right <= a.left
    separatedY = a.bottom <= b.top or b.bottom <= a.top
    return not (separatedX or separatedY)
```

Now define the gameplay rule: entering a hazard causes one hit. Keep a set of pairs that overlapped during the previous step. For each current pair, emit an entry event only if that pair was absent before. After processing, replace the previous set with the current one. Identify pairs with stable object identifiers, not positions.

This deliberately differs from applying damage every frame. If the hazard needs periodic damage, give it a separate interval measured in seconds. If a projectile must hit only once during its entire lifetime, entry history is insufficient: mark it consumed after the first accepted hit.

## Common mistakes

A visible sprite and its collision shape do not have to match exactly, but the difference should be intentional. Enable collision debugging and inspect local coordinates, scale, and anchor points.

A fast object may cross a thin wall between two discrete checks. For that case, investigate the engine's continuous collision detection, a sweep over the traveled segment, or another method suited to your shapes. Making every wall thicker hides the symptom without explaining it.

Avoid deleting items from a collection while iterating if doing so shifts the indices of objects that still need processing. Collect events, apply responses, and remove objects in a defined order. Clear stored contact information when an object is destroyed.

## Verify it

- Separated, overlapping, and exactly touching shapes produce the intended outcomes.
- A shape fully contained inside another is detected.
- Entry causes one hit; exit and re-entry follow the written rule.
- Deleting an object does not leave a stale contact.
- The fastest projectile is checked against the thinnest supported wall.
- Collision layers exclude pairs that should never interact.

## Prompt for an AI agent

> Locate collision shapes and response rules. Document the edge-touch convention, event ordering, and damage frequency. Check containment, re-entry, deletion during contact, and a fast projectile. Use the selected engine's capabilities; do not introduce a custom physics engine for a single trigger.
