# Animation Lab

The browser adaptation lives at `/ru/animation-lab/` and `/en/animation-lab/`.
It follows the local Animation Lab Godot viewer's model/clip inspection workflow,
portrait framing and display controls. It does not ship the original project's
downloaded models, recordings, research archive or private data.

## Use

Open the tool from the portal navigation. The original procedural demo robot has
walk, run and idle clips. Choose **Open model** or drop files on the portrait
preview. A self-contained GLB is preferred. For glTF, select the model, its BIN
and all textures together. Supported FBX files can also be opened. A selection
must contain exactly one model and at most 100 MiB of files.

Inspect clips with play/pause, timeline, 1/30-second steps, speed and loop controls.
In-place mode locks horizontal translation on the topmost animated position nodes
using cloned tracks; vertical motion and source tracks remain intact. Follow root
moves the camera with the first such node. These are inspection tools, not a
root-motion controller, rig generator or retargeting system. Models without clips
remain viewable and exportable as stills.

Mouse drag rotates, wheel zooms, Shift-drag pans. Touch uses one finger to rotate
and two to zoom/pan. **Fit model** samples the chosen clip's actual vertex bounds
and projects their corners into the portrait camera. Skeleton, wireframe, floor
grid, slow orbit and light/dark/green backgrounds are available. Transparent
background hides floor, grid and skeleton while preserving their selections.

Focus the canvas to use Space (play/pause), arrows (step), F (fit), B (skeleton),
W (wireframe), H (clean preview) and R (record). Escape leaves clean preview.
Clean preview keeps keyboard focus on the scene and its restore button.
Reduced-motion preference starts the demo paused.

## Export contract

- PNG: 1080×1920, with actual alpha on the transparent background. **Save PNG**
  prepares a download link. The file contains the scene, not the interface.
- Video: silent 1080×1920 canvas capture, requested at 30 fps, for 1–30 seconds.
  The browser selects a supported WebM/VP9, WebM/VP8, WebM or MP4 encoder; the
  button and file extension identify the selected format. Recording begins at
  the clip start and uses the selected speed, loop, camera and display settings.
  **Stop recording** finishes early. Scene controls are locked during capture.
- Video recording is real-time. Keep the tab visible; device performance can
  affect frame delivery. Hiding the tab or losing the GPU context interrupts the
  recording and does not offer it as a successful full recording.
- Alpha video, MOV ProRes and GIF are not implemented in the browser. The
  original native Godot + FFmpeg tool provides those exports. Browser video is
  disabled on the transparent background; PNG remains available.

## Implementation boundaries

`src/pages/[lang]/animation-lab/index.astro` supplies static RU/EN explanations,
requirements and semantic controls inside the normal site layout.
`src/lib/animation-lab-copy.ts` owns the matching interface strings.
`src/scripts/animation-lab.ts` initializes the Three.js scene only on the tool
route, manages playback/framing, controls and export lifecycle.
`src/lib/animation-lab-model.ts` owns the original MIT demo, root-track helpers,
vertex bounds and GPU disposal. `src/lib/animation-lab-import.ts` resolves selected
local resources through a loading manager.

No model upload, model persistence, CDN dependency or server component is used.
Model resource references cannot initiate remote requests; missing local resources
fail the import. A failed import retains the previous scene. Object URLs are
revoked and replaced geometry, materials, textures and skeleton resources disposed.
The existing production site analytics is independent of model processing.

Three.js and its typings are pinned in the lockfile. Loaders are bundled in the
site build. Their notices ship as `public/licenses/three.txt` and
`public/licenses/fflate.txt` (the compression helper bundled in FBXLoader).
Draco, Meshopt and KTX2 decoders are intentionally not configured;
re-export those models uncompressed. Legacy FBX versions, unusual extensions and
arbitrary large/complex models are not guaranteed to load. No-JavaScript pages
retain explanations and navigation. WebGL 2 initialization failure shows a
localized reload path. Video feature detection is independent of WebGL support.

Existing knowledge records and `/api/v1/` exports retain their schemas and content
types. The interactive tool is discoverable through normal navigation and the
sitemap rather than a fabricated lesson or new machine content record.

## Verification

Run `npm run verify` and `npm run test:e2e`. The dedicated browser tests in
`tests/animation-lab.spec.ts` use authored fixture geometry, inspect actual rendered
pixels, import local companion buffers, reject invalid/remote resource references,
exercise playback and keyboard controls, and decode actual PNG/video downloads.
They also cover RU/EN, narrow dark layouts, no JavaScript, unavailable WebGL and
missing video support. Chromium coverage does not establish Safari/Firefox codec
or FBX compatibility; verify those browsers with representative user files before
claiming support for their specific import/export combinations.

Primary API references: [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html),
[FBXLoader](https://threejs.org/docs/pages/FBXLoader.html),
[Box3](https://threejs.org/docs/pages/Box3.html),
[canvas captureStream](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream)
and [MediaRecorder format detection](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static).
