# UtiliHub autonomous worker system

This directory contains the supervised autonomous foundation for the Central Manager and four independently scheduled workers. GitHub Actions owns the recurring execution; every worker produces auditable reports and validation evidence.

## Components

| Component | Scope | Schedule | Current behavior |
| --- | --- | --- | --- |
| Central Manager | Coordination, lock, reports, proposal synthesis | Hourly schedule | Runs workers, audits state, and proposes next actions |
| Worker A / technical | Reproducible technical diagnostics and lint/build health | Approximately every 40 minutes | Audits technical health; mutation requires an isolated implementation cycle |
| Worker B / innovator | Product, UI, SEO, and catalog expansion | Hourly | Audits catalog and records an implementation gate |
| Worker C / retention | History, tabs, then streaks | Every two hours | Tracks ordered progress and validates the build |
| Worker D / curator | Education-bank audit and generation gate | Every two hours | Validates banks; content generation remains credential- and review-gated |

GitHub Actions cannot express an exact 40-minute interval with standard cron, so Worker A uses two hourly slots as an approximation. A persistent scheduler could provide exact elapsed-time cadence if that requirement becomes strict.

## Safe execution contract

Each run acquires an atomic repository lock, creates a cycle identifier, writes JSON reports, and releases the lock. Any future mutating worker must start from `main`, use a unique `agent/*` branch, run lint/tests/build and visual checks, and open a Pull Request. A Preview is generated only for a real code change. No workflow merges automatically or promotes production.

The runtime creates local state under `.agent/state`, reports under `.agent/reports`, an atomic lock under `.agent/locks/repository.lock`, and quarantine space under `.agent/quarantine`. Runtime files are ignored by Git so credentials and transient state are not committed.

## Manual commands

```bash
npm run agent:status
npm run agent:run
npm run agent:run -- technical
npm run agent:self-improve
```

The `worker-schedules.yml` workflow also supports manual dispatch for each worker and the manager. The general audit workflow remains available for Pull Requests and explicit manual validation.

## Delivery and approvals

Low-risk proposals may create a Pull Request only when a worker has produced a real code change. The PR receives a Vercel Preview for review. `low-risk` never means direct production deployment: a maintainer must review and merge manually. High-risk changes remain proposal-only until an explicit implementation policy is added.

## Intentionally gated capabilities

OpenRouter generation, SMTP notifications, Playwright/vision checks, dynamic worker mutation, and automatic code edits remain gated. They require configured credentials, an isolated implementation contract, and tests before activation. The current system therefore provides autonomous scheduling, auditing, validation, history, and supervised delivery without weakening production protection.
