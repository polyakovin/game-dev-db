---
id: 'input-and-feedback'
lang: 'en'
title: 'Input and feedback'
description: 'Turn button presses into gameplay intent and show whether an action was accepted, rejected, or completed.'
category: 'foundations'
level: 'beginner'
minutes: 6
updatedAt: '2026-10-09'
tags: ['input', 'feedback', 'accessibility']
sources:
  [
    {
      'title': 'Godot: Using InputEvent',
      'url': 'https://docs.godotengine.org/en/stable/tutorials/inputs/inputevent.html',
    },
  ]
---

## Before you start

Use an early playable prototype with one action, such as interacting with a door. You need an input handler and a small amount of game state. The goal is for players to understand the result of a press while game rules remain independent of a particular key.

## The principle

Separate the physical signal, gameplay intent, and outcome. A keyboard key or gamepad button produces `interact`. Game rules decide whether a door can open. Presentation communicates what happened. This is easier to inspect than a key handler that also animates the door, plays audio, and edits the inventory.

An action mapping lets several input devices express the same intent. Godot provides InputMap for this purpose, and its event propagation can let the interface consume input before the game world receives it. See [Using InputEvent](https://docs.godotengine.org/en/stable/tutorials/inputs/inputevent.html).

Movement usually depends on a held input. Toggling a menu or using an item usually needs a press edge: the change from released to pressed. Toggling on every held frame makes one physical press repeatedly open and close the menu.

## Example: a locked door

Define three outcomes: opened, needs a key, and out of range. Game logic returns one outcome; presentation selects a suitable message, sound, or animation.

```text
tryInteract(player, door):
    if distance(player, door) > interactRange:
        return outOfRange
    if door.locked and not player.hasKey:
        return needsKey
    door.open = true
    return opened

onActionPressed(interact):
    result = tryInteract(player, selectedDoor)
    presentInteractionResult(result)
```

Place two doors in your exercise scene, one nearby and one outside interaction range. Check the outcomes before adding effects, then introduce a short explanation when an action is rejected. Do not play a successful opening animation before the rules accept the interaction.

When multiple doors exist, define target selection explicitly: nearest eligible object, object under the crosshair, or highlighted object. Show the selected target before the press. This makes target-selection errors distinguishable from incorrect key checks.

## Common mistakes

The same input must not activate a menu button and fire a weapon behind it. Closing a window must not leave movement permanently held. Clear held actions when focus is lost, because a release event may not arrive where your handler expects it.

Do not communicate rejection through red coloring alone or a quiet sound alone. In this example, include a reason label and a distinguishable door state. Rate-limit repeated rejection cues so that holding a button does not create a stream of identical sounds.

Do not automatically buffer every action. A buffered jump may help a particular movement design, while a delayed purchase confirmation or quit command can be surprising. The lifetime of an intent belongs in that action's rules.

## Verify it

- Keyboard and gamepad activate the same gameplay action.
- Holding a button does not repeat a single-shot action every frame.
- Menus receive input without triggering the world behind them.
- Losing and restoring focus does not leave movement stuck.
- Rejection reasons remain understandable without color discrimination or audio.
- Players can see the selected target before confirming.

## Prompt for an AI agent

> Separate input collection, interaction rules, and result presentation for a door. Preserve existing control bindings. Define held-input, interface, and focus-loss behavior. Add checks for the three outcomes and explain how players learn why an action was rejected. Do not add delay or input buffering without an explicit rule.
