# Curate game-design references

## Why
Readers need one navigable selection of game-design books, video channels and practical tools, including the six references requested by the maintainer. A flat documentation list does not make this selection easy to explore.

## What Changes
- Turn the existing bilingual resources page into a References section with static, linked groups for books, channels, practice, research/courses and development documentation.
- Add the requested references and a focused selection of further resources, with original descriptions, author attribution, access notes and small practice suggestions.
- Extend resource records with optional localized author, access and practice metadata and an optional format. Preserve existing `kind` values, identifiers, URLs and the `/api/v1/resources.json` envelope.
- Document source selection and verification limits; validate the metadata and check rendered groups, navigation, language switching and narrow layouts.

## Capabilities
### New Capabilities
- `design-references`: grouped, attributed learning references in static HTML and the resource export.

### Modified Capabilities
None.

## Impact
Resource data, the resources page, a shared resource card, navigation labels, localized resource styles and validation. Existing public routes and API fields remain available.
