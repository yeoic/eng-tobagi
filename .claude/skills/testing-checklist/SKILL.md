# SKILL: testing-checklist
Goal: Add meaningful, stable tests for NestJS + Postgres changes.

## Always cover
- [ ] Validation errors (DTO)
- [ ] Authn/Authz (if endpoint requires)
- [ ] Happy path
- [ ] Key edge cases (duplicates, not-found, forbidden, invalid state)
- [ ] DB constraints behavior (unique/FK) when relevant

## Test level guidance
- Unit: domain/service logic edge cases
- Integration: repository/DB behaviors (constraints, transactions)
- E2E: HTTP contract + serialization + guards + DB write/read

## Anti-flake rules
- [ ] No real network calls
- [ ] No dependence on execution order
- [ ] Cleanup strategy is deterministic (truncate/transaction)
- [ ] Avoid wall-clock time (mock timers if needed)

## Output Required
- Tests added (files + what each asserts)
- How to run locally
- Flake risks and mitigation
