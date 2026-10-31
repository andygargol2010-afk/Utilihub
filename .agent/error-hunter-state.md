# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-31 run 69
last_mode: HUNT
last_fix: n/a (0 code fixes)
last_prevent: n/a
last_known_focus: E001/E005/E031/E046 — registry.tsx thin/proper (no PLACEHOLDER, kind-first), index.tsx/es.index.tsx start with import + createFileRoute (no $(cat), DeferredHomeReviews real); no $(cat/PLACEHOLDER in src; ToolSeoContent.tsx never falls back to EN summary
new_findings: sampled /es/juegos (200, 23 games), /es (home 200), /es/herramientas/png-a-jpg (200, media steps ok but EN summary leak on live), /es/herramientas/calculadora-iva (EN leak on live), new tool calculadora-ratio-cintura-altura wired in tip (part-09 + slugs-03 + dedicated UI) but not live (deploy lag). No PLACEHOLDER/$(cat)/Tool not available in tip code. No current ERROR deploys on tip.
deploy: latest production READY on 684f2714 (feat adsense meta). Tip of fix/spanish-complete is eb536f26 (later, ideas-lab restores + waist-to-height tool); E046 SEO fix and new tools not live yet. No current ERROR on tip. Deploy lag persists; no force deploy.
notes: Known smoke green in tip (registry, home routes, no stubs, E046 fixed). Discovery: games/home/image/IMC ok; SEO EN leaks and new converter/tool 404/not indexed expected due to production lag. No surgical code fix this run (fixes already in tip). Catalog E031/E046 last_seen updated. State updated.
```

<!-- end:error-hunter-state.md -->
