# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-30 run 50
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import + createFileRoute, no PLACEHOLDER stubs in critical paths; remains open for vigilance)
new_findings: sampled www.utilihub.net / (home OK 200), /es (OK), /es/herramientas/calculadora-iva (loads, SEO names tool, dedicated summary OK), /es/herramientas/calculadora-perimetro-rectangulo (loads, SEO names tool; summary mixed ES/EN "Calculá perimeter de rectangle..." mild, not crash), /es/juegos/2048 (OK), /tools/modelador-3d → proper 3D modeler (not House). No recent deploy ERROR/BUILDING for branch tip. No "Tool not available" crash, no kind mismatch, no $(cat/PLACEHOLDER in critical. Production on 6ad2ca3 READY; branch tip ahead (c387eeb...), no promote.
deploy: latest READY production dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL on 6ad2ca3. No recent ERROR on tip. Branch tip ahead (no promote).
notes: Known smoke E031 green. Discovery: no new runtime/routing/registry/critical SEO/tool bugs. Mild mixed-language summary on one tool noted but not broken. No fixes this run — checks OK.
```

<!-- end:error-hunter-state.md -->
