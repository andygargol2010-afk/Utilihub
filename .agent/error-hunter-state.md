# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 45
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin real content (split) no PLACEHOLDER; remains open for vigilance)
new_findings: new tools (calculadora-caudal, conversor-celsius-kelvin) 404 on production utilihub.net because production deploy is pinned to older SHA 6ad2ca3 (READY); code on branch tip 1ee46ca is correctly wired (in catalog-index/part-09, registry-entries, dedicated UI components exist). No code bug. Sampled /es/juegos (loads), /es/juegos/tetris (loads), /es/herramientas/calculadora-iva (dedicated UI OK). No "Tool not available", no kind mismatch, no deploy ERROR.
deploy: latest READY production dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL on 6ad2ca3. No ERROR/BUILDING in recent. Branch tip ahead.
notes: Known smoke E031 green. Discovery: deploy lag causes live 404 for tools added after last prod deploy; not a code regression. No fixes this run — checks OK on branch. Production lag noted but no promote (immutable).
```

<!-- end:error-hunter-state.md -->
