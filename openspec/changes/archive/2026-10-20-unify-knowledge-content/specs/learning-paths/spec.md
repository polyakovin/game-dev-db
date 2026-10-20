# Spec Delta

## MODIFIED Requirements

### Requirement: Four practical learning paths
The portal SHALL expose the four level design, balance, NPC behavior and game verification paths and a first-prototype path in RU and EN. Each SHALL contain ordered lessons, optional prerequisites, practice, lenses, an explicit deliverable and completion checks. A lesson SHALL be reusable across paths without copying its text.

#### Scenario: Start from the knowledge base
- **WHEN** a reader opens either language homepage
- **THEN** five path cards lead to static localized path pages with ordered lesson links and explicit completion outcomes

#### Scenario: Read without scripts
- **WHEN** a reader opens /game-dev-db/ru/learn/level-design/ without JavaScript
- **THEN** the description, prerequisites, complete lesson list and practice/lens links remain usable

## ADDED Requirements

### Requirement: Path context and rationale parity
Lessons SHALL show navigation for each containing path. Context explaining an indirect practice link SHALL be authored in the path data and retained in HTML and exported records.

#### Scenario: Reuse a lesson
- **WHEN** a lesson belongs to two paths
- **THEN** both containing paths and their independent adjacent lesson sequences are available
