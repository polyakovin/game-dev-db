# Spec Delta

## MODIFIED Requirements

### Requirement: Four practical learning paths
The portal SHALL expose the four level design, balance, NPC behavior and game verification paths and a first-prototype path in RU and EN. Each SHALL contain ordered lessons, optional prerequisites, practice, lenses, an explicit deliverable and completion checks. A lesson SHALL be reusable across paths without copying its text.

#### Scenario: Start from the knowledge base
- **WHEN** a reader opens either language homepage
- **THEN** five path cards lead to static localized path pages with ordered lesson links and explicit completion outcomes

#### Scenario: Read without scripts
- **WHEN** a reader opens /ru/learn/level-design/ without JavaScript
- **THEN** the description, prerequisites, complete lesson list and practice/lens links remain usable

### Requirement: Lesson sequence navigation
New lessons SHALL link to their containing path and adjacent lessons in its authored sequence. Language switching SHALL preserve the lesson or path identity. Links SHALL retain `/` and trailing slashes.

#### Scenario: Continue a path
- **WHEN** a reader finishes the second lesson of a path
- **THEN** localized previous, next and containing-path links are available by keyboard

#### Scenario: Change path language
- **WHEN** a reader changes language on an NPC path page
- **THEN** the same path opens in the other language with equivalent lesson order
