# Mechanic demonstrations

The charge, sweep, ground slam, summon and gap volley cards include scenes with
the original Boss Fight Atlas boss and player. The registry uses canonical IDs
`boss-fight-atlas--boss-charge`, `boss-fight-atlas--boss-sweep`,
`boss-fight-atlas--boss-ground-slam`, `boss-fight-atlas--boss-summon` and
`boss-fight-atlas--boss-gap-volley`. Both languages use the same models.

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

These are illustrative encounters, not footage of a particular game. Charge
locks before release; sweep uses a held weapon and annular reach; the slam
wave starts at ground contact and has a finite outer limit; two helpers spawn
at different times and settle; two volleys move the open lane. Return movement
is visible, and helpers visibly dissolve before the next summon.

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

To add another mechanic, first define its warning, commitment, active threat,
ordinary player response and recovery. Add a model only when it proves that
specific rule, then add a paired RU/EN registry entry and rule tests. Do not
attach a generic animation to unrelated mechanics. Use full ground-plane
collision extents, keep the sprite upright, and derive warning and damaging
geometry from the same data. Copied artwork keeps its attribution.

## Checks

`npm run test:mechanic-demos` checks model geometry, safe responses, phase and
loop boundaries, fixed charge direction, held sweep geometry, wave contact,
helper arrivals and both volley layouts. It runs inside `npm run verify`.
`tests/mechanic-demonstrations.spec.ts` covers browser playback, repeatable
seeking, preferences, no-JS access, screenshots, localized exports and layouts.
Run the full `npm run test:e2e` before publication, then inspect representative
frames in both themes and at desktop/mobile sizes.
