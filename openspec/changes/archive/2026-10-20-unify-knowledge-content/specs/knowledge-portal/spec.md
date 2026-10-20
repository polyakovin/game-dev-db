# Spec Delta

## ADDED Requirements

### Requirement: Consistent lesson architecture
Every RU/EN lesson SHALL use the same six ordered sections: prerequisites, principle, practical example, common mistakes, verification and agent task. Examples SHALL contain internally consistent expected results. Source lists and typed knowledge links SHALL be available in HTML and machine representations.

#### Scenario: Read any lesson
- **WHEN** a reader opens a lesson in either language
- **THEN** the same localized section sequence is present and its translated source URLs match

#### Scenario: Verify the pathfinding example
- **WHEN** edge D–G is removed from the published example and then B–G is removed as well
- **THEN** the first step leaves a route of cost 5 and the second produces no route
