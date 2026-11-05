# animation-lab Specification

## Purpose
Let readers inspect local animated models and export vertical previews directly from the bilingual static portal, without uploading their model files.

## Requirements

### Requirement: Localized tool access
The portal SHALL expose Animation Lab at `/ru/animation-lab/` and `/en/animation-lab/`, link both from shared navigation and sitemap, preserve the route when switching language, and explain browser requirements in static HTML. Tool assets SHALL resolve through the site's root path helpers.

#### Scenario: Open either language without scripts
- **WHEN** a reader opens either tool route with JavaScript disabled
- **THEN** the description, limitations and portal navigation remain readable and interactive controls are not presented as working

### Requirement: Local model import
The tool SHALL open GLB, glTF with selected companion files, and supported FBX models through file selection or drop. Files SHALL stay on the device and model resource references SHALL NOT cause remote requests. Invalid, missing-resource, over-100-MiB or empty-model imports SHALL report an error and retain the previous working scene.

#### Scenario: Import an animated or static model
- **WHEN** a reader selects a valid model and its resources
- **THEN** the visible model is fitted to the frame, available clips are listed, and static models remain inspectable with playback disabled

#### Scenario: Recover from an invalid import
- **WHEN** an import fails or refers to an unselected resource
- **THEN** the error explains how to retry and the previous model remains usable

### Requirement: Animation and scene inspection
The tool SHALL provide an original demo, clip selection, playback, scrubbing, frame stepping, speed and loop controls, reversible in-place horizontal root motion, root-follow camera, orbit/pan/zoom, animated-bounds fitting, skeleton, wireframe, grid, background and clean preview. Vertical root motion SHALL be preserved by in-place mode. Controls SHALL support localized labels, keyboard operation and narrow screens.

#### Scenario: Inspect a clip and restore its movement
- **WHEN** a reader pauses, scrubs, changes speed or toggles in-place mode
- **THEN** the displayed pose/time follows the chosen setting and disabling in-place mode restores the original horizontal motion

#### Scenario: Fit and inspect on a phone
- **WHEN** a reader fits the model, changes the clip or uses a narrow viewport
- **THEN** the model fits the portrait preview and controls remain reachable without horizontal page overflow

### Requirement: Honest browser media export
The tool SHALL export a 1080×1920 PNG with optional alpha and record opaque 1080×1920 video using a detected supported browser format for 1–30 seconds. The UI SHALL identify the actual video format, explain real-time recording and native-only formats, and disable unsupported video recording. Export SHALL include the scene without interface panels.

#### Scenario: Export a transparent still
- **WHEN** a reader selects the transparent background and saves a PNG
- **THEN** the file has transparent empty pixels, retains the model, omits floor/grid/skeleton and video recording is unavailable with an explanation

#### Scenario: Record or interrupt video
- **WHEN** a reader records a supported video or hides the tab during capture
- **THEN** recording starts at the clip beginning, completes with a nonempty video file of the advertised format or reports interruption, and restores usable preview controls

### Requirement: Browser failure recovery
The tool SHALL explain unavailable WebGL and recording capabilities without breaking the surrounding portal. Failed initialization SHALL leave a visible status instead of inactive tool controls. GPU context loss SHALL stop active recording and offer a reload path.

#### Scenario: Open without WebGL
- **WHEN** a reader's browser cannot create a WebGL renderer
- **THEN** a localized error and retry path are shown while language and site navigation still work
