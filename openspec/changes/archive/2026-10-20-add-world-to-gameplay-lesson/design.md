# Design

## Context

See proposal.md for motivation. Existing lessons use short principle/example/mistakes/checks/agent-task sections. The collection already supplies catalog search, language switching and full exports. The reviewed source is the Russian Iconic IP Guide v3.2, especially PDF pages 32–39.

## Goals / Non-Goals

Teach one actionable decision in the Game Dev DB voice. Keep source influence explicit and distinguish the original exercise from the author's material. Do not reproduce its taxonomy, wording, visual style, psychological classifications or franchise-success claims.

## Decisions

- Author `world-to-gameplay.md` in both lesson directories, using matching metadata and a new sound-powered-door example. Reuse the current layout rather than creating a special page.
- Credit the author beside the relevant principle and in frontmatter. Link `https://worldfirstmethod.com/ipguide`; mention the reviewed version/pages in prose because the public page is an access page, not the PDF itself.
- Explain a causal chain and a small scenario. Avoid numeric feature-ranking scores; ask for the action, changed state and implementation cost directly. The example and validation procedure are original editorial material, not a translated source exercise.
- Reuse the scope lesson and existing World/Unification lenses. Keep existing learning paths and editorial ranking untouched; unranked new lessons are already supported.

## Risks / Trade-offs

- Source authority could be overstated: identify it as an influence on a design approach, with no promise of commercial success or scientific validation.
- A theme might be forced into every mechanic: state the applicability limit and allow decorative material to remain decorative.
- Attribution could disappear for agents: verify both generated Markdown and the complete lesson JSON.
