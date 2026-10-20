# Game-design reference selection

Updated 2026-10-09. The single editorial source is `src/data/resources.json`.
This addition contains six maintainer-requested references and fourteen further
recommendations. It preserves all fourteen pre-existing resources.

## Requested references

| Reference | Primary destination | Editorial purpose |
| --- | --- | --- |
| Jesse Schell, The Art of Game Design, Russian edition | https://alpinabook.ru/catalog/book-geymdizayn/ | Lenses for questioning design decisions |
| Brenda Brathwaite and Ian Schreiber, Challenges for Game Designers | https://designgames.wordpress.com/ | Practice without a full software project; authors and title corrected from the request |
| Natalya Andrianova and Svetlana Yakovleva, How to Create Stories | https://bombora.ru/book/86200/ | An introduction to narrative design and writing |
| Maria Vazhenich, Artemy Kozlov and Ieronim K., Architecture of Video Game Worlds | https://ast.ru/book/arkhitektura-videoigrovykh-mirov-uroven-proyden-864235/ | Space and environmental storytelling |
| Platformer Toolkit | https://gmtk.itch.io/platformer-toolkit | Immediate experiments with movement parameters |
| Curious Archive | https://www.youtube.com/@CuriousArchive/videos | Worldbuilding and narrative inspiration; not a comprehensive design curriculum |

## Why these additions

- **A Theory of Fun:** the [author's book site](https://theoryoffun.com/) includes endorsements from game designers including Brenda Romero and Ernest Adams. The card describes Koster's perspective without turning endorsements into a universal consensus.
- **Rules of Play:** [MIT Press](https://mitpress.mit.edu/9780262240451/rules-of-play/) supplies the bibliographic data and subject description; [MIT's game-design readings](https://ocw.mit.edu/courses/cms-608-game-design-spring-2014/pages/readings/) include work by Salen and Zimmerman.
- **Game Feel:** the [publisher's indexed listing](https://www.routledge.com/Game-Feel-A-Game-Designers-Guide-to-Virtual-Sensation/Swink/p/book/9780429178566) describes virtual sensation and control. This selection pairs the theoretical book with the hands-on Platformer Toolkit.
- **Game Design Workshop:** the [publisher's indexed listing](https://www.routledge.com/Game-Design-Workshop-A-Playcentric-Approach-to-Creating-Innovative-Games/Fullerton/p/book/9781032607009) and [MIT's Creating Video Games readings](https://ocw.mit.edu/courses/cms-611j-creating-video-games-fall-2014/pages/lecture-slides-and-readings/) support the playcentric prototyping and testing focus.
- **Game Maker's Toolkit:** [Mark Brown's official site](https://gamemakerstoolkit.com/) identifies the channel and its design/development focus. Link to the channel separately from its interactive essay.
- **GDC:** the [conference's own channel announcement](https://gdconf.com/article/watch-gdc-2019-speakers-try-to-pitch-their-talks-to-you-in-60-seconds-or-less/) identifies its official YouTube channel. Talks are primary accounts with context-specific lessons.
- **Masahiro Sakurai on Creating Games:** link to [Sakurai's English channel](https://www.youtube.com/@sora_sakurai_en/videos) as an archive of short explanations, without promising future uploads.
- **Super Mario Maker 2 and Game Builder Garage:** Nintendo's [Mario Maker page](https://www.nintendo.com/us/store/products/super-mario-maker-2-switch/) and [Garage page](https://www.nintendo.com/au/games/nintendo-switch/game-builder-garage/) describe level creation and guided game-making. Label these paid Switch games and include original practice suggestions. Online Mario features require Nintendo Switch Online; local exercises do not rely on them.
- **Baba Is You:** [Hempuli's own page](https://hempuli.itch.io/baba) describes changing rules and lists positive player ratings. Recommend analyzing its puzzles rather than presenting it as a formal teaching game.
- **PuzzleScript and Twine:** their [official engine site](https://www.puzzlescript.net/) and [story tool site](https://twinery.org/) support free, small experiments with rules and narrative. These are tools rather than comprehensive courses.
- **MDA and MIT Game Design:** link to the [authors' paper](https://users.cs.northwestern.edu/~hunicke/MDA.pdf) and [open course materials](https://ocw.mit.edu/courses/cms-608-game-design-spring-2014/). MDA is one analytical model; course materials are free but some assigned books are paid.

## Verification limits

Bibliography and descriptions were checked against author, publisher, developer
and course pages, with indexed official listings where full retrieval was blocked.
Routledge returned HTTP 403 to the research browser; its indexed publisher pages
and MIT bibliography provided the available evidence. YouTube channel pages expose
limited text to automated readers. No claim is made that every video, book chapter
or practice environment was reviewed, purchased or played. The page says updated,
not that all destinations passed an automated availability check.

Descriptions and practice prompts are original. No book exercises, transcripts,
cover art, screenshots or external copyrighted content were copied. No popularity
ranking or numeric review score is maintained in the public dataset.

## Local validation

`npm run verify` passed with Node 24 and the bundled Python runtime. Formatting passed. All 29 Playwright tests passed against an isolated server on port 4324, including both resource languages, every source URL, language switching, keyboard jump navigation, narrow layouts and non-JavaScript use. Desktop, mobile and practice-section screenshots were visually reviewed from the production preview build.

## 2026-10-20: open-resource expansion

The maintainer requested publication of the researched selection of 32 additional
resources. The catalog now contains 66 records. All additions use the existing
localized title, description, authors, access and practice fields. Resource IDs,
the five static groups, the kind enum and the v1 export contract are unchanged.
The page introduction now covers game development beyond game design.

The additions cover level design and balance, game math, algorithms and NPC AI,
procedural generation, networking, rendering, art, audio, asset libraries,
narrative tools, accessibility and release preparation. Recommendations and
practice prompts are original editorial material; source contents are linked,
not copied or hosted.

Access notes distinguish public reading from reuse rights and paid companion
products. Important primary evidence includes:

- [The Level Design Book](https://book.leveldesignbook.com/) promises free reading,
  identifies unfinished sections and specifies CC BY-NC-SA 4.0; its
  [author page](https://book.leveldesignbook.com/appendix/about) identifies Robert
  Yang and contributors.
- [Game Design Concepts](https://gamedesignconcepts.wordpress.com/2009/04/21/syllabus-and-schedule/)
  has open lectures but requires a paid textbook; the archived class is not
  presented as a currently running course.
- [Game AI Pro](https://www.gameaipro.com/) makes chapters available to download
  while prohibiting rehosting. Its game AI material is distinct from LLM coding.
- [LearnOpenGL About](https://learnopengl.com/About) identifies Joey de Vries and
  lists CC BY-NC 4.0 for code examples. The card does not equate free reading with
  unrestricted commercial code reuse.
- [The Nature of Code credits](https://natureofcode.com/credits/) identify Daniel
  Shiffman and CC BY-NC-SA 4.0 for the book.
- [Kenney support](https://kenney.nl/support) and
  [Poly Haven licensing](https://polyhaven.com/license) describe CC0 assets;
  paid convenience products and game performance requirements remain separate.
- [Freesound FAQ](https://freesound.org/help/faq/) requires registration for
  downloads and explains varying licenses. [OpenGameArt FAQ](https://opengameart.org/content/faq)
  likewise requires checking each asset's terms.
- [GDQuest's repository](https://github.com/GDQuest/learn-gdscript) confirms the
  specific free interactive course; other GDQuest courses are not labeled free.
- [ink](https://www.inklestudios.com/ink/) identifies MIT-licensed tools and integration.
- [Game Audio Learning's author page](https://www.gameaudiolearning.com/about)
  identifies Greg Lester and Jonny Sands; its public roadmap includes some paid
  external recommendations.

The research checked public author, project and access pages on 2026-10-20.
It did not complete every course, run all sample code or download every asset.
Blender's manual returned HTTP 200 to a direct request after the search reader
failed to retrieve it. Version-sensitive tutorials retain caveats.
The Russian links for The Book of Shaders and Godot are labeled RU in both page
languages; translated card copy does not imply translated source content.

Game UI Database and Pattern Language for Game Design remain outside this
addition because current access/content could not be fully verified. The parked
gamedesignpatterns.com domain is excluded. The research's twelve priority labels
are editorial recommendations and are not added as public rankings.
