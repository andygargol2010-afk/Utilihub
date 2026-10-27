# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a fix ships (code + catalog/state). **No commit if nothing found.** No deploys. PRE-PUSH SELF-REVIEW a–d. Max 20% time on fixed-item regression smoke. Discovery: prod/runtime → recent risky commits → code sampling.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-27 run 27
last_fix: E040 calculadora-horas-a-decimal wired in index + registry (dedicated UI)
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: homes, registry, summary-es, no stubs)
new_findings: E040 tool definition + dedicated UI not wired in catalog index / registry (404 or generic UI)
deploy: latest READY cf5387db; newer commits including es.ts restore pending deploy; no current BUILDING/ERROR
notes: Known smoke green. Discovery found new tool calculadora-horas-a-decimal (hours-to-decimal) missing from GENERAL_TOOLS and pickComponent. Fixed by adding import/spread + lazy/if. E031 remains open for vigilance. 1 fix.
```

<!-- end:error-hunter-state.md -->