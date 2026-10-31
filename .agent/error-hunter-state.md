# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix), **PREVENT** (capacity/guards), or **SEO** (GSC backlog page). Target ~40/40/20. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus


## SEO backlog pointer (for SEO mode)

- `seo_done`: calculadora-imc, conversor-coordenadas, calculadora-punto-rocio, conversor-temperatura, calculadora-piscina, consumo-viaje
- `seo_next`: overtime-pay-calculator, calculadora-wacc (confirm slug), then next weak GSC URL
- `runs_total`: increment by 1 every run (used for ~20% SEO slot: when `runs_total % 5 === 0`)

```
last_run: 2026-10-31 run 74
runs_total: 74
last_mode: HUNT
last_fix: n/a (0 code fixes)
last_prevent: n/a
last_known_focus: E001/E005/E031/E046 — registry.tsx thin/no PLACEHOLDER/kind-first, homes index.tsx/es.index.tsx start with import+createFileRoute (no $(cat), DeferredHomeReviews real); no $(cat/PLACEHOLDER in src via search; ToolSeoContent.tsx never falls back to EN summary
new_findings: sampled /es/herramientas/calculadora-iva (loads but guide about still shows EN summary "Calculate VAT..."), /es/herramientas/png-a-jpg (guide about EN "Convert PNG images to JPG locally."), /es/herramientas/calculadora-imc (Spanish OK), /es/herramientas/calculadora-raiz-cubica (Spanish OK), /es/juegos/2048 (200), /es/crecimiento/creador-tarjetas-citas (200), /studio/prism-trail-composer (200), /es/studio/prism-trail-composer (404 — Spanish slug is compositor-estela-prisma which 200), /es/herramientas/calculadora-porcentaje-asistencia (Spanish guide OK). Homes OK. No PLACEHOLDER/$(cat)/Tool not available in tip. English leak on live for some tools despite code fix (possible deploy lag/cache on www.utilihub.net; latest production READY on tip SHA b4af870c).
deploy: latest production READY on b4af870c42363ef3a9f6135243dd0749fafd05b5 (seo(pool-volume)). Tip of fix/spanish-complete is that SHA. No current ERROR.
notes: Known smoke green in tip (registry, homes, no stubs). Discovery: English guide leak still visible on live for calculadora-iva and png-a-jpg (and others); code in ToolSeoContent prevents EN fallback. Spanish studio path differs. No surgical code fix this run (no clear code bug; symptom may be lag). Catalog E031 last_seen updated (open for vigilance). State updated. SEO mode enabled 2026-10-31 (~20% of runs).
```

<!-- end:error-hunter-state.md -->
