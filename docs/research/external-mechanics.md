# External mechanic reference indexes

Checked on 2026-10-20 against the public HTML at [Boss Fight Atlas](https://polyakovin.github.io/boss-fight-atlas/en/) and [Game Mechanics](https://gamemechanics.org/).

## Coverage and extraction

- Boss Fight Atlas: 124 mechanic links across 14 sections. All 124 English and 124 Russian lesson pages returned successfully and had matching mechanic identities. Every checked page had an overview and game examples; no unfinished status was displayed. The local index preserves both lesson URLs and each family's unique game-example and `Learn more` destinations, including YouTube timestamps. This produces 786 mechanic/reference associations. Game/boss names and source reference labels are retained; explanatory source paragraphs, animations and images are not copied.
- Game Mechanics: 199 pattern links. All 199 pattern pages returned successfully. The index's first category determines each local section (45 in total), while descriptions preserve all source-index category memberships in RU/EN. The 685 gallery figures link to 664 distinct game-specific gallery pages when repeated examples for the same mechanic/game pair are grouped. One additional figure in Bullet time is an analogy from The Matrix (1999), not a game; it links back to the source's Bullet time page with an explicit film label. The local index therefore has 665 reference links.
- Definitions are concise original editorial descriptions in paired RU/EN values. Existing taxonomy counts retain their meanings; each imported pattern has one definition variant. This index does not reproduce a complete upstream lesson or claim that one variant captures every possible implementation.

## Source boundaries

The association between a mechanic, game, boss, video or article is the upstream catalog's attribution. Retrieving the source pages verifies that those associations were listed there, not that every external video is available or every game realizes the mechanic exactly as suggested. Users should inspect the linked example before relying on it.

Public builds read only the committed JSON snapshots. They do not scrape either website and do not require remote media. Source HTML used for the editorial check was temporary local research input and is not committed. Later upstream changes require a deliberate source review and editorial date update.

Game Dev DB's original definitions and translations are CC BY 4.0. Source articles, screenshots and videos keep their own rights. Each catalog's provenance and visible notes preserve this distinction in both HTML and machine exports.

## Validation

Node 24 checks passed: scoped Prettier validation, `npm run verify` and all 86 Playwright tests. Source-index identities and every recorded game/further-reading destination were compared with the retrieved pages. Built-output checks compare reference labels and URLs with the committed source and full Markdown/JSON records. Production-preview screenshots were reviewed at 1440px and 375px across both catalogs and languages; the browser suite also covers reading without JavaScript, keyboard disclosure, reference search and entries beyond number 99.

The distribution validator accepts exact attributed source/reference URLs for other projects on the same GitHub Pages origin. It continues to reject unlisted links that escape `/game-dev-db/`; Boss Fight Atlas is an external project despite sharing `polyakovin.github.io`.
