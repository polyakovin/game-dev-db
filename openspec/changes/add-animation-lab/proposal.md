# Proposal

## Why

Animation Lab currently needs a local Godot installation. A dedicated browser section lets Game Dev DB readers inspect their models and animation clips and create vertical previews without installing the native application.

## What Changes

- Add matching RU/EN Animation Lab routes, navigation and sitemap entries.
- Adapt local GLB/glTF/FBX import, playback, timeline, root-motion inspection, camera fitting, skeleton, wireframe, backgrounds and clean preview to the browser.
- Provide an original animated demo, PNG export and browser-supported video recording with explicit format and transparency limits.
- Keep model files on the device, retain a working scene after failed imports, and explain unavailable JavaScript/WebGL/recording features.
- Document the relationship with the native application. Existing knowledge and v1 exports remain compatible; this tool does not introduce a new knowledge record type.

## Capabilities

### New Capabilities

- `animation-lab`: localized, private browser model inspection and vertical media export.

### Modified Capabilities

None.

## Impact

Astro routes, shared navigation labels, sitemap, a dedicated client module and stylesheet, pinned Three.js dependencies, browser tests and documentation. GitHub Pages remains entirely static. The source Animation Lab checkout is read-only; no historical research, private recordings or third-party model files are republished.
