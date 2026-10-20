# Editorial content order

All sections use a prototype-first editorial order: the decisions and techniques
needed to understand, build and test a small playable game come first. Broadly
applicable concepts precede specialized variations. This is an editorial judgment,
not a claim about popularity or a universal ranking for every genre.

`src/data/content-order.json` lists stable identities from highest to lowest
importance. `src/lib/content-order.mjs` applies those lists to copies of source
arrays before localization. HTML, jump links, filters, JSON and Markdown therefore
share the same order in Russian and English. Display positions can change;
identities, fragment links, source numbers and attribution must stay stable.

- Lessons begin with scope and a prototype, then the loop, input and collisions,
  state, feel, performance and agent workflow. Categories retain foundations,
  design, engineering and workflow order.
- Mechanics start with the general reference, then boss design and specialized
  catalogs. Each catalog ranks sections and the families within every section.
  Boss readability precedes attacks; educational design starts with learning and
  feedback. Branches and variants use explicit refinements where needed, otherwise
  their authored basic-to-specialized order. Notes and their entries use the same
  mechanism.
- Lenses start with experience, player, concept and rules. Each theme ranks its
  central questions first. Schell's original numbers identify the source, not
  importance. Production and playtesting precede specialized narrative themes.
- Practice starts with a paper prototype, meaningful choices, the intended player
  and iteration, then focused systems and multiplayer. Steps within an exercise
  retain execution order.
- References start with broad books, hands-on practice, courses and analysis,
  technical documentation, then channels. Within each group, fundamentals and
  usable starter material precede specialized or platform-dependent material.
- Jams keep their existing actionability order: open events by submission deadline,
  then upcoming events by start. General discovery calendars precede single-event
  calendars.

Already coherent explanatory sections, dependent questions and procedural steps
retain their authored learning/execution sequence. Do not sort prose, source
citations or code examples by a text heuristic.

For a new entry, select its position using the same criteria and add its stable ID
to the relevant scope. Lists use paths such as
`mechanics/boss-fight-atlas/catalog-part-9/families` and
`mechanics/voice-audio/family-01-branch-3/variants`. A missing override preserves
the authored sequence. New unranked siblings follow ranked entries in source
order, so independent additions remain available. `npm run check:content` rejects
unknown scopes, unknown IDs and duplicate IDs in priority lists.

Run `npm run verify` and `npm run test:e2e` after changing order. Browser checks
compare bilingual HTML with JSON and Markdown, including filtered/reset views and
static reading on narrow screens.
