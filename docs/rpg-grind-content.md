# RPG grind coverage and compatibility

`src/data/mechanics/rpg-grind.json` is the source for both languages, static HTML, local search and v1 JSON/Markdown. The expanded reference has 110 families, 110 branch lists and 330 variants in eighteen sections.

## Design-space coverage

| Layer | Groups | Families | Design question |
| --- | --- | --- | --- |
| Activities | Combat/hunting; repeatable challenges; gathering/production; exploration; trade/economy; delegation/automation | 41 | What repeated action or management decision produces progress? |
| Goals | Character; equipment acquisition; upgrades; companions; reputation/access/knowledge; world/community/account; collections/metaprogression | 41 | What accumulates, improves or becomes available? |
| Reward rules | Delivery/distribution; outcome/investment protection; scaling/focusing | 15 | How is the outcome selected, allocated or preserved? |
| Constraints | Schedule/pacing; cost/risk | 13 | What limits entry, reward eligibility, rate or persistence? |

The groups are a coverage model, not a claim that every possible combination has been listed. Related actions and goals can coexist in one family; notes explain the dominant-purpose placement. Do not count a renamed example as a new mechanic. A new family should add a distinct repeated decision, progression variable or reward/constraint rule.

The public notes include a four-layer map, recipes for ARPG, MMORPG, economic, exploration, party, extraction and offline-management loops, distinctions between adjacent systems, and a system audit. All scenarios are hypothetical unless the text identifies a specific sourced game observation.

## Existing-link preservation

Retain the original catalog URL, all six section IDs, thirty family IDs, thirty branch IDs and thirty original variant IDs and text. Families can move between sections without changing their anchors. Keep original note and entry IDs as well. Every original family now has two additional concrete variants. Source and browser checks cover the original fragments and matching translated pages.

Do not hard-code counts in renderer code or generated exports. Update authored summary copy and this document when intentionally expanding coverage. No new v1 field or runtime dependency is needed for the four layers: translated section labels carry the layer and notes explain the model.

## Primary-source review

Sources were checked on 2026-10-20. Warframe supports equipment-breadth mastery; Final Fantasy XIV supports token exchange and, through explicitly historical 2.2 notes, retainer dispatch. Black Desert supports connected nodes/workers and an explicitly historical Ancient Anvil guarantee. Last Epoch supports donor-item property transfer. The Elder Scrolls Online supports companion effectiveness and rapport. Guild Wars 2 supports scheduled objectives, shared currency and reward choice. None validates this original taxonomy as a whole, current numerical balance, educational effects or completed playtests.

The Capcom search result was not used as an additional cited observation because its full manual could not be opened during this review. Capture and part-break variants are hypothetical designs.

## Validation

Run `npm run verify` and `npm run test:e2e`. The existing mechanics matrix derives counts from the expanded source. `tests/rpg-grind.spec.ts` adds coverage-layer and legacy-identity checks, representative search across all four layers, old/new fragment reading, mobile expansion, no-JavaScript access and export checks. Review both rendered languages and verify live content, exports and original fragments after Pages deployment.
