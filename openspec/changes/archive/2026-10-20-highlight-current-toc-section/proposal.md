## Why

Readers cannot tell which section they are reading from the table of contents.
Long mechanic references need a visible reading position that follows scrolling.

## What Changes

- Highlight one current table-of-contents link in mechanic references and lessons.
- Update the current location after scrolling, anchor navigation and content resizing.
- Use theme colors and a vertical marker, with `aria-current="location"` for assistive technology.
- Preserve native fragment links and complete reading without JavaScript.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `knowledge-portal`: track the current section in lesson and mechanic tables of contents.

## Impact

Shared browser behavior, lesson and mechanic templates, TOC styles and browser checks.
Both languages use the same behavior. Content and machine exports remain unchanged.
