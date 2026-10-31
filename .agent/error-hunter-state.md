# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-31 run 65
last_mode: HUNT
last_fix: n/a (0 code fixes)
last_prevent: n/a
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean via code search and home index.tsx/es.index.tsx start with import + createFileRoute; no $(cat/PLACEHOLDER in src; registry thin and proper)
new_findings: sampled /es home (200, Spanish), /es/juegos (200, list ok with 23 games), /es/herramientas/modelador-3d (200, proper 3D guide not HouseModeler), /es/herramientas/calculadora-iva and modelador-casas-3d still show English in guide about on live (E046 fix in tip not deployed); production deploy READY on 684f2714; tip of branch 61688643. No current ERROR deploys on tip. utilihub.vercel.app 404 (expected; production is utilihub.net).
deploy: latest production READY on 684f2714 (feat adsense meta). Tip of fix/spanish-complete is 61688643 (later); E046 SEO fix, new tools not live yet. No current ERROR on tip. Deploy lag persists; no force deploy.
notes: Known smoke E031 green. Discovery confirms ongoing deploy lag (English leaks on live www.utilihub.net for tools with/without summaryEs). Games and studios routing ok. No surgical code fix this run (fixes already in tip). Catalog E031/E046 last_seen updated. State updated.
```

<!-- end:error-hunter-state.md -->
