# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 46
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin real content (split) no PLACEHOLDER; remains open for vigilance)
new_findings: sampled / (home OK), /es (OK), /tools/calculadora-iva (loads), /games/2048 (loads), /tools/3d-modeler and /es/herramientas/modelador-3d (proper 3D modeler descriptions, not HouseModeler). No "Tool not available" in live pages, no kind mismatch, no deploy ERROR. Production still on SHA 6ad2ca3; branch tip 8b7c72ac ahead with ideas-lab changes. Deploy lag persists for any post-6ad2ca3 tools (same as run 45); no code regression found.
deploy: latest READY production dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL on 6ad2ca3. No ERROR/BUILDING in recent. Branch tip ahead.
notes: Known smoke E031 green. Discovery: no new runtime/routing/SEO/tool bugs on branch tip or live pages sampled. Production lag noted but no promote (immutable). No fixes this run — checks OK.
```

<!-- end:error-hunter-state.md -->
