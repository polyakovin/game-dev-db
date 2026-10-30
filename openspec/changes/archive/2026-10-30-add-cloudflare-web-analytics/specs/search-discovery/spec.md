## RENAMED Requirements

- FROM: `### Requirement: Discovery without visitor tracking`
- TO: `### Requirement: Discovery independent of analytics`

## MODIFIED Requirements

### Requirement: Discovery independent of analytics
Discovery metadata, content and machine exports SHALL work without analytics. Production content pages and the standalone 404 SHALL include one deferred Cloudflare Web Analytics beacon for `polyakovin.github.io`. Development and the root redirect SHALL omit it. Other analytics and webmaster accounts SHALL remain outside scope. Public-URL audits SHALL be explicit and SHALL NOT collect visitor behavior.

#### Scenario: Read a focused page
- **WHEN** a reader opens a focused page in either language with JavaScript disabled or the Cloudflare script blocked
- **THEN** its content, discovery metadata, links under `/game-dev-db/` and machine formats remain usable

#### Scenario: Measure a published page
- **WHEN** a reader opens a production RU/EN page or the standalone 404 page
- **THEN** its HTML includes exactly one classic deferred script from `https://static.cloudflareinsights.com/beacon.min.js` with the configured public beacon token

#### Scenario: Develop locally
- **WHEN** a contributor opens the Astro development server
- **THEN** no Cloudflare analytics beacon is included

#### Scenario: Follow the root redirect
- **WHEN** a reader opens `/game-dev-db/`
- **THEN** the immediate language redirect has no beacon and its destination supplies the production beacon
