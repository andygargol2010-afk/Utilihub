# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a fix ships (code + catalog/state). **No commit if nothing found.** No deploys. PRE-PUSH SELF-REVIEW a–d. Max 20% time on fixed-item regression smoke. Discovery: prod/runtime → recent risky commits → code sampling.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-28 run 34
last_fix: E042 calculadora-markup category → utilidades (routing 404)
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin no PLACEHOLDER)
new_findings: E042 calculadora-markup 404 on both /es/herramientas and /es/finanzas due to category finanzas exclusion (not in FINANCIAL_TOOLS). Same pattern as E041. Dedicated UI wired.
deploy: latest READY bdc1876f (older); HEAD after this commit pending; no current ERROR on recent
notes: Known smoke green (E031 open but files clean). Discovery: sampled recent markup tool (new from f7dc31d), found category finanzas causing 404. Fixed to utilidades. 1 fix.
```

<!-- end:error-hunter-state.md -->
