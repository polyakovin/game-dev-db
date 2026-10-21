# Proposal

## Why

The pilot only fits four selected viewport sizes. User screenshots show scrolling in short/narrow windows and large unused margins in fullscreen because image height follows width and the content has a fixed maximum width.

## What Changes

- Give the pilot the available viewport height and width, with a flexible illustration area.
- Place the heading in the text column on landscape screens and stack content in portrait windows.
- Frame the meaningful screenshot region while retaining the scene, clue and target strip; keep the original PNG unchanged.
- Show optional advice and extra examples only when there is space, as requested in the original brief.
- Preserve readable flow with enlarged text, static no-JS access, shared canonical identity and bilingual exports.
- Test short windows, intermediate widths, tall narrow windows and fullscreen rather than only four device presets.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `search-discovery`: clarify viewport fitting, space-dependent optional content and meaningful fullscreen use for the compact pilot.

## Impact

Pilot component and compact layout styles, additive screenshot crop metadata, documentation and browser coverage. No change to canonical routes, the source image or other mechanics.
