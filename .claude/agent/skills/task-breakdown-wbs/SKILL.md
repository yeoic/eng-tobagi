# SKILL: task-breakdown-wbs
Goal: Produce a Work Breakdown Structure (WBS) that maps tasks to FE/BE/QA/DevOps with dependencies and acceptance criteria.

## Rules
- Each task must produce a concrete deliverable (file, endpoint, workflow, test suite, doc)
- Each task must have acceptance criteria
- Dependencies must be explicit
- Prefer parallelizable tasks but avoid integration deadlocks

## Task format (mandatory)
- ID: FE-1 / BE-1 / QA-1 / DO-1
- Description:
- Deliverable:
- Acceptance Criteria:
- Dependencies:
- Risk:

## Dependency hygiene
- FE depends on API contract + mock data early
- QA depends on stable endpoints and a seeded DB strategy
- DevOps depends on Dockerfile and env var contract
- DB migrations must be ordered before deploy

## Output must include
- Task list by owner
- Sequencing plan (phases)
- Parallelizable tasks
- Top 5 risks + mitigations
