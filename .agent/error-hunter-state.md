# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-31 run 62
last_mode: HUNT
last_fix: n/a (0 code fixes)
last_prevent: n/a
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean via code search and home index.tsx starts with import + createFileRoute; no $(cat/PLACEHOLDER in src)
new_findings: sampled /es home (200, Spanish), /games (200), /es/juegos/2048 (200), /es/studio/compositor-estela-prisma (200 functional), /es/herramientas/modelador-3d (200, proper 3D guide), /es/herramientas/calculadora-iva and calculadora-media-armonica and calculadora-moda still show English in guide about on live (E046 fix in tip not deployed); calculadora-rango-estadistico 404 on live (wired in tip, deploy lag). Production deploy READY on 684f2714; tip of branch 773fee83. No current ERROR deploys. utilihub.vercel.app 404 (expected; production is utilihub.net).
deploy: latest production READY on 684f2714 (feat adsense meta). Tip of fix/spanish-complete is 773fee83 (much later); E046 SEO fix, new tools (e.g. calculadora-moda, rango-estadistico) not live yet. No current ERROR. Deploy lag persists; no force deploy.
notes: Known smoke E031 green. Discovery confirms ongoing deploy lag (English leaks and some new tools 404 on live www.utilihub.net). No surgical code fix this run (fixes already in tip). Catalog E031 last_seen updated. State updated.
```

<!-- end:error-hunter-state.md -->
