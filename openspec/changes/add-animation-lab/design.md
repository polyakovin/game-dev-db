# Design

## Context

See proposal.md for motivation. The source application is Godot 4.4, with runtime import in scripts/lab.gd and camera fitting in scripts/model_framing.gd. It uses FFmpeg for MP4, MOV and GIF. Game Dev DB is an Astro static site with shared theme, locale navigation and root-relative URL helpers. The source checkout has unrelated dirty files and is not a write target.

## Goals / Non-Goals

Goals: preserve the inspection workflow, usable touch/keyboard controls, local-only model processing, stable scene replacement and truthful browser export behavior.

Non-goals: native feature parity for FFmpeg codecs, rig generation, retargeting, cloud uploads, or copying the research archive. Browser recording is real-time and depends on the visible tab and available encoder.

## Decisions

- Use a dedicated Three.js client module loaded only on the tool route. A native Godot Web export would bring its native filesystem/child-process assumptions and require a separate build toolchain. Bundle pinned loaders locally instead of using a CDN.
- Offer a small original procedural robot with three clips. Source model redistribution rights are not documented; users can import their own files. The demo is reproducible from MIT source and needs no external assets.
- Resolve all selected model resources through a local loading manager. Block network resource requests, cap selection size at 100 MiB, revoke object URLs, dispose replaced GPU resources, and commit scene replacement only after successful import and bounds validation.
- Clone animation clips for in-place horizontal root-track freezing. Preserve originals, vertical motion and hierarchy. Camera fitting samples animated vertex bounds and projects their corners into the current portrait camera, keeping tall models large enough to inspect. Readers can refit after a manual camera change.
- Use the model canvas for PNG and MediaRecorder video at 1080×1920. Detect available MIME types. Transparent export is PNG only; do not claim video alpha, MOV, GIF or native deterministic frame timing. Disable scene changes during recording and stop recording on hidden tab or context loss with an explicit interrupted status.
- Keep explanatory HTML and navigation available without JavaScript, and expose controls only after successful initialization. Add routes to the sitemap without changing v1 record schemas.

## Risks / Trade-offs

- Browser GPU/codec variation → localized failure states and capability detection; Chromium gets actual render/import/export checks, other browsers remain a documented verification limit.
- Large or malformed models → size limit, finite vertex bounds, asynchronous loading status, previous scene preservation. Arbitrary compressed/legacy formats are not guaranteed.
- Per-frame vertex fitting is expensive → sample on clip/settings changes and cache the result; render preview at a smaller internal size and export at full resolution.
- Real-time recording can drop frames → explain the visible-tab requirement and stop safely on interruption.

## Migration Plan

Additive routes and dependencies only. Verify and run browser tests before normal GitHub Pages publication. Roll back the scoped change to remove the tool and its navigation without touching knowledge exports.
