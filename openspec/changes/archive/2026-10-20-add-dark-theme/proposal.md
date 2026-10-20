# Proposal

## Why

Readers need a comfortable dark appearance for the knowledge portal and a way to keep their preferred appearance across pages and languages.

## What Changes

- Add light, dark and system appearance choices in the shared RU/EN header.
- Follow the system appearance initially and remember an explicit choice locally.
- Apply a coherent palette to every page, including forms, callouts, diagrams and the error page; retain system-aware reading without JavaScript.
- Verify keyboard operation, narrow screens, persistence and blocked local storage.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `knowledge-portal`: add accessible theme selection and consistent appearance across the static portal.

## Impact

Shared layout, theme components, presentation styles, the inline catalog diagram, standalone pages, browser coverage and architecture documentation. Localized controls are added in both languages. Content, routes, the `/game-dev-db/` base path and machine exports retain their contracts. No new dependency or server is required.
