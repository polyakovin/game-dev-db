## Context

MechanicPreview renders all active cards in a compact responsive shell. The common knowledge builder already enriches those records with localized preview data. Boss Fight Atlas provides original articulated SVG characters under CC BY 4.0 and code under MIT. Its checkout has unrelated staged changes; reuse only committed shared files from revision 08a279e424d5dd287725e5b3d044187b62267306.

## Decisions

- Add an explicit registry keyed by canonical mechanic ID. Each entry has a model kind, localized explanation and three teaching phases, source attribution and updated date. Expose the same localized descriptor as additive `attributes.demonstration` and in Markdown.
- Render the initial scene on the server with reusable character art. Use a pure time-to-frame model, stable SVG nodes, a shared articulated rig and one requestAnimationFrame clock. Manual seeking is absolute and repeatable.
- Display demonstration and screenshot as progressive-enhancement tabs. Without JavaScript, the scene, text and screenshot remain readable. The animated card may scroll vertically on small screens so playback and explanations never disappear under the screenshot layout's minimal-window rules.
- Keep the surrounding portal design and dark stone arena. Use dashed outlines for warning regions and solid geometry for active threats. Label the boss and player in the selected language.
- Autoplay only when visible and reduced motion is not requested. Pause, replay, native range input, phase selection and playback speed remain keyboard accessible. Explicitly pausing must survive visibility changes.

## Scene contracts

- Charge: aim tracks before commitment, then freezes; the player clears the full corridor sideways before passage. Fast committed movement ends in recovery. Both actors visibly return before wrapping.
- Sweep: a visible held weapon travels around a fixed pivot. An annular sector describes its reach; the player moves beyond the outer edge with full-body clearance. The weapon and threat share angle/radius data.
- Ground slam: the ground contact starts an expanding ring; the player leaves the finite outer reach before impact. The impact point and wave center agree, and propagation never precedes contact.
- Summon: separate portals introduce staggered helpers; each helper moves from its own origin and stops stepping on arrival. The player repositions away from their convergence. Dissolution is visible before the return.
- Gap volley: repeated rows use explicit occupied lanes and an actual empty lane; the warning and safe route share that layout. The player moves into the gap before each row reaches them, and returns only after the last row passes.

## Verification

Test each contract at transition times and throughout active intervals, including actor extent, deterministic seeking and loop continuity. Browser checks cover RU/EN, themes, desktop and mobile, controls, hidden-tab pause, reduced motion, no-JS readability and unchanged screenshots. Run the full canonical verification, format check and browser suite before handoff.
