# UtiliHub autonomous agent foundation

This directory contains the **safe foundation** for the Central Manager and four logically separated workers. It deliberately starts in `foundation_diagnostic` mode: a run records auditable state and reports, but does not edit application code, merge branches, promote production, or invent content.

## Components

| Component | Scope | Initial behavior |
| --- | --- | --- |
| Central Manager | Coordination, lock, reports, mutation gates | Runs workers serially and records the result |
| Worker A / technical | Reproducible technical diagnostics and small fixes | Diagnostic-only until an explicit fix cycle is approved |
| Worker B / innovator | One product, UI, or SEO unit per cycle | Skipped in foundation mode |
| Worker C / retention | History, tabs, then streaks in strict order | Progress is reported from `.done` markers |
| Worker D / curator | Education-bank audit before generation | Audit-only; no OpenRouter call is made |

## Manual commands

```bash
npm run agent:status
npm run agent:run
npm run agent:run -- technical
```

The runtime creates local state under `.agent/state`, reports under `.agent/reports`, and an atomic repository lock under `.agent/locks/repository.lock`. The lock includes the process, cycle, acquisition time, and expiry. Active locks are never deleted by another process; only an expired lock may be recovered through an atomic rename race.

## Safety contract

Every future write cycle must start from an updated `main`, use a unique `manus/*` branch, validate after modifications, commit with a worker and cycle ID, and open a pull request for human review. There is no automatic merge or production promotion. Tokens and credentials are not written to state or reports. A blocked or failed cycle must preserve its evidence and stop dependent work.

## Scheduler limitation

No persistent scheduler is configured in this repository or sandbox. The cadence in `.agent/config.json` is declarative only. To run continuously, install a host-level timer (for example systemd timer or cron) on an always-on machine and invoke the manual command there after testing. Do not claim 24/7 operation until that host is verified.

## Current known integration gaps

- GitHub `main` branch protection was not enabled during inspection; enabling repository settings requires an explicit administrator-level operation outside this code change.
- Vercel CLI was unavailable in the sandbox, so no Preview URL is claimed.
- OpenRouter is intentionally unused because the initial phase is audit/foundation-only and no content deficit was established.
