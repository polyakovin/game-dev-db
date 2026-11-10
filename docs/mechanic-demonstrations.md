# Mechanic demonstrations

Five cards outside the boss catalog use the original Boss Fight Atlas
characters. Both languages use the same models:

| Card | What the scene shows |
| --- | --- |
| `movement-platforming--t003` | Take off from the edge, cross a gap and land with full footing. |
| `melee-combat--t016` | Intercept a sparring thrust during a short parry window. |
| `stealth-infiltration--t031` | Break a guard's line of sight with a wall. |
| `shooting-projectiles--t029` | Fire right while retreating left, then stop without changing aim. |
| `social-cooperation--t204` | Hold a pressure plate so a partner can cross a bridge. |

Boss Fight Atlas cards retain their annotated screenshot layout.

## Reading and playback

Open a matching card at `/{lang}/knowledge/mechanic/{id}/`. Its demonstration
starts automatically when visible unless reduced motion is requested. Pause,
seek with the timeline, select a teaching phase, restart or change speed.
Seeking and phase selection pause the scene. Arrow keys operate the native
timeline; arrow keys, Home and End switch the demonstration/example tabs.
The original annotated screenshot remains available under **Game example**.

Hidden documents and the screenshot tab suspend playback. An explicit pause
survives tab switching. Reduced motion starts and restarts at a still frame;
the reader can explicitly play. All poses and effects share the same clock.
Without JavaScript, both the initial scene and screenshot remain visible,
phase explanations are available in the expandable reading section, and
playback controls stay hidden. Narrow pages scroll to keep the controls and
attribution reachable.

These are original teaching scenes. The armored character can be a guard,
opponent or partner. The credit links to the artwork source; the screenshot
tab shows the existing example from a particular game.

## Implementation and reuse

- `src/lib/mechanic-demonstrations.mjs` owns localized descriptions, three
  phase explanations, canonical ID mapping and attribution.
- `src/lib/mechanic-demo-model.mjs` is the pure time-to-frame model. Each scene
  emits stable actor/shape IDs, ground coordinates, articulated motion weights
  and the geometry needed to test its rule. The SVG arena is 640×480.
- `src/lib/atlas/` contains the shared SVG artwork, articulated rig and stone
  arena adapted from Boss Fight Atlas revision
  `08a279e424d5dd287725e5b3d044187b62267306`. Artwork is CC BY 4.0; code is MIT.
  Full provenance and notices ship in `public/licenses/boss-fight-atlas.txt`.
- `MechanicDemonstration.astro` renders the initial frame. Its controller
  updates existing SVG nodes and only loads on cards with a demonstration.
  Shared preview enrichment adds the descriptor to common JSON and Markdown;
  existing taxonomy and screenshot exports are preserved.

To add a demonstration, identify the card's rule, the action that triggers it
and the visible result. Use the same positions and timing for the rule and
its geometry. Add a paired RU/EN explanation, assign the actors' roles and
test the rule and loop boundaries. Copied artwork keeps its attribution.

## Checks

`npm run test:mechanic-demos` checks phase and loop boundaries, platform
support, parry timing, occlusion, projectile origins and bridge support.
It runs inside `npm run verify`.
`tests/mechanic-demonstrations.spec.ts` covers browser playback, repeatable
seeking, preferences, no-JS access, screenshots, localized exports and layouts.
Run the full `npm run test:e2e` before publication, then inspect representative
frames in both themes and at desktop/mobile sizes.
