---
id: 'performance-budget'
lang: 'en'
title: 'A performance budget'
description: 'Set a measurable target, locate the bottleneck with a profiler, and compare changes under the same conditions.'
category: 'engineering'
level: 'intermediate'
minutes: 6
updatedAt: '2026-10-09'
tags: ['performance', 'profiling', 'frame-time']
sources:
  [
    {
      'title': 'Godot: General optimization tips',
      'url': 'https://docs.godotengine.org/en/stable/tutorials/performance/general_optimization.html',
    },
  ]
---

## Before you start

You need a playable scene and access to the target device, or an explicitly identified intermediate environment. This lesson turns “make it faster” into a measurement of a particular workload. Low-level optimization expertise is not required.

## The principle

Start with platform, resolution, build configuration, and target frame rate. At 60 frames per second, the interval between frames is about 16.67 ms; at 30, it is about 33.33 ms. This arithmetic provides a frame-pacing target, not a promise that any scene can finish within it.

Do not automatically add every CPU and GPU timing together, because their work may overlap. Learn what a measurement tool reports and identify what delays the next completed frame. Speeding up one function cannot resolve a bottleneck elsewhere.

[Godot's optimization guidance](https://docs.godotengine.org/en/stable/tutorials/performance/general_optimization.html) recommends finding bottlenecks through measurement and checking the effect of changes. It also distinguishes sustained slow execution, individual stalls, and long loading operations. Each needs an appropriate observation scenario.

## Example: an enemy arena

Suppose an empty arena feels smooth, but spawning a wave causes a stall. Do not start by rewriting movement. Create a repeatable scenario with the same arena, enemy count, random seed, and spawn timing.

```text
scenario: spawn-wave
device: exact model and power mode
build: production configuration
resolution: fixed value
warmup: 20 seconds
record: 60 seconds
report: median, p95, p99 frame time and longest frame
compare: baseline versus one isolated change
```

This is an example procedure. Choose durations that fit your game and keep them constant across comparisons. High frame-time percentiles help expose slower frames hidden by an average. A short recording can still miss rare failures.

Capture a profile around the spawn event. If object creation and resource preparation dominate, investigate preloading or spreading the work over time. If updating every object is consistently expensive, inspect update frequency and workload. Choose a fix from the evidence instead of selecting a fashionable optimization technique.

## Common mistakes

An object pool needs correct state reset. A reused enemy that retains old health or event subscriptions is still broken, even if it spawns faster. Verify gameplay outcomes alongside timing.

Comparing an editor run with a production build on another computer cannot isolate one code change. Record device, power mode, build, settings, and background workload. A run on a powerful laptop does not verify your minimum supported hardware.

Do not measure FPS alone. Initial loading, download size, peak memory, or menu response time may matter more for the problem being investigated. Select metrics that describe the observed issue and leave headroom for ordinary environmental variation.

## Verify it

- The target specifies a platform, scene, and settings.
- A baseline recording exists from before the change.
- Profile evidence explains the chosen optimization.
- Comparison runs use the same workload and conditions.
- Slow frames are inspected rather than relying only on average FPS.
- Gameplay and memory use have not silently regressed.
- Target devices that were not tested are named explicitly.

## Prompt for an AI agent

> First define a repeatable scenario and collect baseline measurements. Identify the main bottleneck with a profiler and suggest one small change. Compare frame times under the same conditions, then check gameplay behavior and memory. If target hardware is unavailable, state that limitation and do not claim its performance has been verified.
