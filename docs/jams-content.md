# Game-jam content

`src/data/jams.json` is the single bilingual source for `/ru/jams/`, `/en/jams/`
and `/api/v1/jams.json`, relative to `/game-dev-db/`.

## Editorial updates

Add a specific edition only after checking its official participation page.
Use a stable slug `id`, original `title`, `description` and `requirements` in
both `ru` and `en`, organizer, credential-free HTTPS `url`, `verifiedAt`
and exact `startsAt` / `endsAt` ISO timestamps with an explicit timezone.
`endsAt` is the **submission deadline**, not the voting or awards date.
Do not infer UTC times from dates without a published timezone.
The initial itch.io timestamps use the UTC submission window published in its
event metadata. Keep each event's official page as its source.

Keep important entry conditions in the short requirements text (engine,
platform, team size, public source requirements or explicit AI restrictions).
The linked full rules remain authoritative. Set `updatedAt` and `verifiedAt`
when verifying additions or changed information. Finished editions may stay
in the source for provenance; they do not appear as current opportunities.
Never advance dates automatically to invent another edition.

`calendars` contains permanent discovery resources separately from dated
events, with stable IDs, official URLs and translated titles/descriptions.
It remains useful when no curated event is current.

## Time and static publishing

`endsAt > now` is the only current-event rule. Start is inclusive; deadline
is exclusive. Open events sort by earliest deadline before upcoming events,
which sort by earliest start. All displayed dates explicitly use UTC.

Builds exclude expired events. The browser checks its current clock before
revealing cards, at starts and deadlines, at least once a minute, and after
focus, visibility or page restoration. This also removes events from pages
that were already open at their deadline. Counts and empty state update too.

Without JavaScript, readers see the dated build snapshot and an explanation
that deadlines refresh at publication. The Pages workflow rebuilds daily
(04:23 UTC); GitHub can delay scheduled runs. Newly discovered events and
organizer date changes still require an editorial update.

The JSON export is a build snapshot, with `generatedAt`, `updatedAt`,
`readTimeRule`, bilingual `events`, permanent `calendars`, attribution and
license. Consumers must reapply `endsAt > now` when reading a cached snapshot.
Manifest event counts describe the build snapshot, not a live API.

## Verification

`npm run check:content` validates source metadata. `npm run verify` also
checks JSON/HTML parity at the exported snapshot time. `npm run test:e2e`
covers time boundaries, stale pages, open-tab expiry and transitions,
empty state, translations, mobile themes, keyboard links and static reading.
