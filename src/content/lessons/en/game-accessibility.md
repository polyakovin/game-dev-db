---
id: game-accessibility
lang: en
title: 'Basic accessibility across a play session'
description: 'Find barriers from launch to task completion: controls, text, cues, reaction time and camera motion.'
category: design
level: beginner
minutes: 6
updatedAt: '2026-10-20'
tags: [accessibility, input, feedback]
sources:
  - title: 'Game Accessibility Guidelines: Basic'
    url: https://gameaccessibilityguidelines.com/basic/
  - title: 'Microsoft Xbox Accessibility Guideline 117: Visual distractions'
    url: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117
---

A barrier can appear before the first gameplay task: tiny menus, mandatory button holds or an audio-only cue. Check the entire player journey, including settings and recovery from mistakes.

## The principle

State what information the player needs and what action they must perform. Find an alternative wherever the sole method creates a barrier. [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/basic/) provides starting points for this review; select recommendations for the particular game.

Settings are usable only if players can reach them before the problematic scene. Changes should persist, and control hints should match remapped inputs. Developer checks find obvious errors but do not replace feedback from players with varied needs.

## Example: starting a pumping station

This original teaching scenario requires matching three symbols, holding a lever and noticing pump overheating. Examine barriers separately:

| Initial design                          | Alternative to test                                   |
| --------------------------------------- | ----------------------------------------------------- |
| Red and green indicators without labels | Distinct shapes, symbols and state labels             |
| Audio-only overheating alarm            | Text warning and visible icon                         |
| Lever requires a prolonged hold         | Configurable press-to-toggle behavior                 |
| Camera shake during startup             | Reduced-motion or disable option reachable beforehand |

Check that toggling the lever does not require an accidental extra press after leaving a menu. The overheating icon should remain distinguishable against the gameplay background. Reducing shake must not remove the only startup confirmation: retain the pump state and text.

If the task requires a quick reaction, consider a separate reaction-window option. It may affect difficulty, so describe its effect honestly. This review aims to preserve access to the action, not promise an identical experience for everyone.

## Common mistakes

- Hiding a setting in a scene the player cannot reach.
- Subtitling speech while omitting an important danger sound.
- Checking only the settings screen without replaying the task afterward.
- Calling a game fully accessible after a short internal checklist.

## Verify it

1. Complete the journey from launch to result with one selected input method.
2. Mute sound and check essential information; separately inspect cues without color distinctions.
3. Change controls, text size and camera motion, restart and check persistence.
4. Invite participants with relevant needs and record remaining barriers without blanket promises.

## Prompt for an AI agent

> Make a barrier table for the pumping station. For each barrier, propose a setting or alternative cue and a full-task acceptance scenario. List untested cases separately. Preserve essential feedback when effects are disabled.

Continue with [Rhythm Without Hurry](/game-dev-db/en/practice/#rhythm-without-hurry) and the [Physical Interface lens](/game-dev-db/en/lenses/#schell-060).
