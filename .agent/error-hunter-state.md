# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 36
last_mode: HUNT
last_fix: none this run (previous E043)
last_prevent: none yet (PREVENT mode added 2026-10-29)
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin no PLACEHOLDER, games.index OK)
new_findings: none. Sampled new tool calculadora-tasa-de-ahorro (category utilidades, kind calculator, in part-09 and index), home, games; no PLACEHOLDER/$(cat; no finanzas category left in GENERAL; runtime logs no errors (30m).
deploy: latest READY bdc1876f (older SHA); current HEAD aae32bdf pending deploy; no current ERROR on recent deploys
notes: Known smoke green (E031 open but files clean). Discovery: sampled recent tool + routes + patterns. 0 fixes. Checks OK. Next run: prefer PREVENT (split/pre-create capacity if parts near soft limits).
```

<!-- end:error-hunter-state.md -->
