# Spec Delta

## ADDED Requirements

### Requirement: Explicit mechanic section groups
The portal SHALL display authored section groups as localized subtitles with concise child section names in the contents, article and section selector. Ungrouped catalogs SHALL retain their flat presentation. Group labels SHALL be available without JavaScript, appear in Markdown and additive v1 JSON metadata, and preserve existing identities and URLs.

#### Scenario: Read grouped RPG grind sections
- **WHEN** a reader opens `/game-dev-db/{lang}/mechanics/rpg-grind/` in either language, including without JavaScript or at a narrow width
- **THEN** activities, goals, rewards and constraints each appear once as a group subtitle in the contents, and their child links use section names without repeating that subtitle
- **AND** those links resolve to the existing section anchors with the same hierarchy in the article

#### Scenario: Filter grouped sections
- **WHEN** a reader selects a section within a group or searches for a mechanic
- **THEN** the selector retains group context, empty article groups are hidden, reset restores every group, and current-section highlighting still follows the visible sections

#### Scenario: Retrieve grouped exports
- **WHEN** an agent fetches the mechanics v1 JSON or RPG grind Markdown
- **THEN** section IDs and all mechanic identities remain stable, JSON sections retain their localized group labels, and Markdown presents group headings above shorter section headings

#### Scenario: Reject an incomplete group translation
- **WHEN** an authored section group lacks either language
- **THEN** content validation rejects it
