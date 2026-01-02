# SKILL: aws-deploy-checklist
Goal: Deploy NestJS reliably on AWS with GitHub Actions + Docker, with safe secrets handling and rollback.

## Minimum pipeline
- [ ] lint/typecheck
- [ ] tests
- [ ] docker build
- [ ] push to ECR (tag with git SHA)
- [ ] deploy to ECS (or chosen target) and wait for stable

## Secrets & IAM
- [ ] Use OIDC to assume role (preferred) or GH secrets for AWS keys (only if required)
- [ ] Least-privilege IAM policies for:
    - [ ] ECR push
    - [ ] ECS update service/task definition
    - [ ] reading secrets from Secrets Manager/SSM

## Runtime readiness
- [ ] Health endpoint exists (`/health`)
- [ ] Proper timeouts and graceful shutdown
- [ ] Logs shipped to CloudWatch
- [ ] DB connectivity uses RDS + SG rules (no public DB unless explicitly required)

## Migration strategy (choose one, be explicit)
- [ ] Pre-deploy migration job (recommended)
- [ ] Run-on-startup (only if safe and idempotent)
- [ ] Manual migration step (least preferred)

## Rollback
- [ ] Rollback procedure is documented:
    - [ ] deploy previous task definition / image tag
    - [ ] verify health + logs

## Output Required
- Workflow file changes
- Required AWS resources (assumed)
- Deploy + rollback commands
- Verification steps (health/logs)
