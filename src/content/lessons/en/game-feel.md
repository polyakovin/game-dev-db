---
id: 'game-feel'
lang: 'en'
title: 'Game feel: making actions readable'
description: 'Tune response, emphasis, and effects so players understand an action while staying in control.'
category: 'design'
level: 'beginner'
minutes: 6
updatedAt: '2026-10-09'
tags: ['game-feel', 'feedback', 'accessibility']
sources:
  [
    {
      'title': 'GDC: Juice It or Lose It',
      'url': 'https://www.gdcvault.com/play/1016487/juice-it-or-lose',
    },
    {
      'title': 'Xbox Accessibility Guideline 117',
      'url': 'https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117',
    },
  ]
---

## Before you start

Begin with a mechanic that already follows its rules: jumping lands correctly, hits cause damage, or collected items enter the inventory. If the result is wrong, effects make diagnosis harder. Choose one action and keep a baseline version for comparison.

## The principle

Game feel depends on the relationship between player intent, control response, and the perceived result. It helps to distinguish preparation, confirmation, and recovery. Preparation makes an upcoming action understandable. Confirmation communicates an accepted result. Recovery returns the player to their next decision.

Give each effect a specific question to answer. A brief silhouette change confirms a hit. Particles identify the contact position. A sound distinguishes a block from damage. If you cannot explain what information an effect adds, first compare the action with that effect disabled.

The talk [Juice It or Lose It](https://www.gdcvault.com/play/1016487/juice-it-or-lose) is a useful starting point for studying expressive game reactions. The exercise and comparison criteria below are original practice material for this portal.

## Example: hitting a training target

Create a stationary target with three health points. Each accepted hit removes one point. Start by showing only the counter, then introduce confirmation effects one at a time.

```text
onDamageAccepted(event):
    updateHealthDisplay(event.remainingHealth)
    playImpactSound(event.surface)
    showHitShape(event.position)
    if settings.cameraShake > 0:
        addCameraImpulse(settings.cameraShake)
```

Game logic emits this event after accepting damage. A miss must not trigger hit confirmation. A block can trigger a separate cue. When several hits arrive together, cap the combined effect intensity and number of simultaneous sounds.

Add switches for sound, visual confirmation, and camera movement. Play the same sequence with different combinations. Record concrete observations: “I could not tell whether the third hit connected” is more useful than “needs more juice.” A small personal comparison is not evidence of every player's preferences.

## Common mistakes

Strong shake can hide the next threat. A long recovery can make a powerful hit feel like losing control. A fullscreen effect can make interface text harder to read. Define limits for amplitude and duration, then tune within those limits while playing.

Players should be able to disable camera movement without losing essential information. [Xbox Accessibility Guideline 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117) recommends avoiding these additional movements or offering a way to turn them off. Preserve another confirmation channel, such as a shape around the target and an updated health display.

Do not make a decorative particle responsible for applying damage. Do not change the collision shape just to stretch the visible sprite. If you add a brief action freeze, define which systems it affects: the world, animations, input, interface, and audio may need different treatment.

## Verify it

- Hits, misses, and blocks are distinguishable.
- Confirmation follows an accepted gameplay event.
- Disabling shake keeps the action understandable.
- Combined effects do not obscure hazards or essential text.
- Effect parameters can change without changing damage rules.
- Comparison with the baseline records observations, not just the author's taste.

## Prompt for an AI agent

> Break one gameplay action into preparation, confirmation, and recovery. Locate the event that confirms its result. Suggest two independently switchable effects and explain what information each adds. Check a miss, repeated hits, and disabled camera shake. Preserve the existing rules and provide a repeatable comparison scenario.
