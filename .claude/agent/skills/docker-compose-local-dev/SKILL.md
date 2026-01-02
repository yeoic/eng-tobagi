# SKILL: docker-compose-local-dev
Goal: Provide a reliable, repeatable local dev environment for NestJS + Postgres using docker-compose.

## When to use
- Project bootstrap
- Adding Postgres dependency
- Making tests run against a real DB locally/CI

## Checklist
### Compose
- [ ] `docker-compose.yml` (or `compose.yaml`) defines:
    - [ ] postgres service with volume for persistence (dev)
    - [ ] healthcheck for postgres readiness
    - [ ] ports mapped (e.g., 5432:5432) if needed
    - [ ] env vars: POSTGRES_DB/USER/PASSWORD
- [ ] Optional: separate compose override for tests to use ephemeral DB

### App config
- [ ] `.env.example` exists with DB connection variables
- [ ] App reads env via config module and validates (no silent fallbacks)

### Developer commands
- [ ] Document:
    - [ ] `docker compose up -d`
    - [ ] `docker compose down -v` (reset)
    - [ ] migrations commands (if applicable)
    - [ ] how to run tests with compose DB

## Output Required
- Exact compose file changes
- Exact commands to boot/reset
- Expected success signal (DB healthy, app connects)
