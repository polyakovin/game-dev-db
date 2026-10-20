# game-design-practice Specification

## Purpose
Help readers practise game-design decisions through small original exercises and
observable prototype checks. Provide equivalent Russian and English content,
accessible static reading and complete attributed exports for human and agent use.

## Requirements

### Requirement: Complete bilingual original exercises
The portal SHALL provide the twelve original exercises and two integration exercises for NPC behavior and progression pacing, with shared stable identities, topics, levels and durations, and equivalent RU/EN goals, briefs, constraints, steps, deliverables, checks and reflection questions. It SHALL distinguish original scenarios from source material.

#### Scenario: Reject missing translation content
- **WHEN** an exercise lacks a translated field or has unequal translated list lengths
- **THEN** content verification fails before publication

### Requirement: Accessible practice discovery

The portal SHALL expose practice in navigation and on both home pages. The practice page SHALL combine full-content text search, topic and maximum-duration filters, result counts, empty state and reset, and provide keyboard-operable disclosures and stable anchors under /game-dev-db/.

#### Scenario: Combine filters and recover
- **WHEN** a reader combines query, topic and duration and then resets a query with no results
- **THEN** only matching exercises appear first and all fourteen return after reset

#### Scenario: Read without JavaScript
- **WHEN** a reader opens either practice page with JavaScript disabled
- **THEN** all exercises and sources remain available through native disclosures

#### Scenario: Open an exercise in another language
- **WHEN** a reader opens an exercise anchor and switches languages
- **THEN** the corresponding language page retains and opens that exercise

#### Scenario: Use a narrow viewport
- **WHEN** a reader opens either language at 375 pixels wide
- **THEN** exercises and navigation fit without horizontal page overflow

### Requirement: Equivalent practice exports

The build SHALL derive full bilingual practice JSON and Markdown from the same
source as HTML, retaining source context, canonical URLs and CC BY 4.0 attribution.
The manifest, agent indexes, full corpus and sitemap SHALL discover practice
additively without changing existing endpoint meanings.

#### Scenario: Retrieve the exercise collection

- **WHEN** an agent follows practice links in the manifest or discovery index
- **THEN** it receives the full localized exercises, checks, provenance and sources

### Requirement: Observable integration outcomes
The NPC exercise SHALL connect observation, memory, action selection and route following, including lost sight and blocked routes. The progression exercise SHALL produce an explicit action-cost and reward schedule with checks for useful alternatives and pacing. Both SHALL have original bilingual content and links to relevant lessons.

#### Scenario: Complete the NPC path
- **WHEN** a reader follows its integration exercise
- **THEN** the deliverable includes a reproducible scenario and a trace explaining decisions and navigation failures rather than only a drawn route
