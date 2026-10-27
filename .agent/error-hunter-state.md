# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a fix ships (code + catalog/state). **No commit if nothing found.** No deploys. PRE-PUSH SELF-REVIEW a–d. Max 20% time on fixed-item regression smoke. Discovery: prod/runtime → recent risky commits → code sampling.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-27 run 15
last_fix: restore src/routes/es.guias.orbit-pulse-catcher.tsx (was $(cat stub) → full ES guide from 90a2dff; SHA 789317d)
last_known_focus: E031 recurring (homes/registry/summary clean; found + fixed guide stub)
new_findings: E039 ES orbit-pulse-catcher guide $(cat stub (fixed)
deploy: previous READY on 291bb58; tip after fix 789317d (await deploy; no ERROR observed)
notes: Known smoke green on critical files. Discovery found 24-byte stub in es.guias.orbit-pulse-catcher.tsx. Restored real content. Catalog + state updated. No open code bugs remaining in sampled paths.
```

<!-- end:error-hunter-state.md -->
