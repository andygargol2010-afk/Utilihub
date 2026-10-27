# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a fix ships (code + catalog/state). **No commit if nothing found.** No deploys. PRE-PUSH SELF-REVIEW a–d. Max 20% time on fixed-item regression smoke. Discovery: prod/runtime → recent risky commits → code sampling.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-26 run 13
last_fix: E038 wire CubeRootCalculatorTool (registry.tsx)
last_known_focus: E031 recurring smoke (tip clean after restore: no PLACEHOLDER/$(cat in registry.tsx, summary-es.ts, index.tsx, es.index.tsx)
new_findings: E038 dedicated UI calculadora-raiz-cubica not wired (component + catalog present, missing pickComponent if)
notes: Known smoke green on homes and critical files. Discovery found unwired CubeRoot (similar to prior dedicated UI pattern). Fixed in 478da3b. Latest prior Vercel READY on older SHA; tip deploy pending. No open errors requiring immediate further code fix.
```

<!-- end:error-hunter-state.md -->
