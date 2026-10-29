# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 43
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin real content no PLACEHOLDER)
new_findings: no new user-facing breaks. Sampled /es (home loads, 956 tools), /es/juegos (20 games), /es/juegos/tetris (page + loading), /es/herramientas/regla-de-tres (SEO names tool + formula), /es/herramientas/contador-de-palabras (SEO + local), /es/herramientas/conversor-temperatura (SEO names), /es/herramientas/calculadora-de-porcentajes + /porcentaje (live), /es/herramientas/generador-de-contrasenas (SEO + crypto). Non-existent slugs calculadora-porcentaje/porcentajes 404 as expected. No "Tool not available" in live pages, no kind mismatch, no deploy ERROR. Runtime logs not retained on hobby (recent window empty/unavailable).
deploy: latest READY 6ad2ca3 (production, dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL). No ERROR/BUILDING in recent list. Newer preview READY but not production.
notes: Known smoke E031 green (critical files real). Discovery: home, games list + tetris, percentage tools, word counter, temp converter, password gen all load correctly on prod (utilihub.net). No fixes this run — checks OK.
```

<!-- end:error-hunter-state.md -->
