---
id: 'game-loop'
lang: 'en'
title: 'The game loop and time'
description: 'Separate simulation speed from frame rate and verify pauses, frame drops, and focus changes.'
category: 'foundations'
level: 'beginner'
minutes: 6
updatedAt: '2026-10-09'
tags: ['game-loop', 'time', 'simulation']
sources:
  [
    {
      'title': 'Robert Nystrom: Game Loop',
      'url': 'https://gameprogrammingpatterns.com/game-loop.html',
    },
    {
      'title': 'MDN: requestAnimationFrame',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame',
    },
    {
      'title': 'Glenn Fiedler: Fix Your Timestep!',
      'url': 'https://github.com/mas-bandwidth/gafferongames/blob/main/content/post/fix_your_timestep.md',
    },
  ]
---

## Before you start

You only need variables, functions, and coordinates. By the end, you should be able to identify what updates the world, state the units of movement speed, and explain why a rendered frame is not necessarily one simulation step.

## The principle

A game loop connects input, state updates, and presentation. The world can keep changing while the player stands still. An engine already owns this loop; connect your behavior to its appropriate update callbacks. [Game Loop](https://gameprogrammingpatterns.com/game-loop.html) explains this basic model.

The expression `x += 3` moves three units per call. More calls therefore produce more movement. The expression `x += speed * dt` describes movement through elapsed time, with speed in units per second and `dt` in seconds. This does not make every physics simulation stable for arbitrary time steps.

A simulation sensitive to step size can use a fixed update interval. Accumulated real time is consumed in equal simulation steps, while rendering happens independently. Limiting catch-up steps requires a deliberate overload policy, such as letting simulation time fall behind. [Fix Your Timestep!](https://github.com/mas-bandwidth/gafferongames/blob/main/content/post/fix_your_timestep.md) explores that tradeoff.

## A concrete exercise

Start with one square and no collisions. Give it a speed of 120 units per second. After two seconds of uninterrupted movement, it should travel 240 units, regardless of how many frames were displayed.

```text
update(dtSeconds, input):
    if input.moveRight:
        player.x += 120 * dtSeconds

render():
    drawSquare(player.x, player.y)
```

This is teaching pseudocode, not a complete engine loop. Call `update` 120 times using `1/60`, then run a fresh case with 60 calls using `1/30`. Compare final positions with a small numerical tolerance. Finally, try uneven intervals whose sum is still two seconds.

In a browser, `requestAnimationFrame` schedules a callback before repainting and normally pauses in background tabs. Its timestamp uses milliseconds; see the [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame). Define a resume policy. For this exercise, discard the old timestamp when focus returns so that the square continues from a paused position.

## Common mistakes

Do not modify movement in both physics and presentation callbacks. Do not multiply by elapsed time twice when an engine method already handles it. Do not start another loop whenever the level restarts. Hiding a tab is also not a complete pause implementation: audio, network events, and timers may follow different lifecycles.

Check raw movement before introducing interpolation. Once the simulation is correct, add visual smoothing as a separate change. A smooth picture can otherwise conceal incorrect speed or update order.

## Verify it

- Equal simulation time produces equal travel at different update frequencies.
- Pausing stops the intended systems while keeping the menu usable.
- Returning from a background tab does not teleport the player.
- Restarting the scene does not double movement speed.
- Variable names or comments make time and speed units explicit.

## Prompt for an AI agent

> Locate the owner of the game loop and every place that changes player position. Explain the units of speed and elapsed time. Propose the smallest fix for frame-rate-dependent movement, then check travel over two seconds with several dt sequences. State pause and focus-resume behavior separately. Do not replace the physics backend without evidence that it is necessary.
