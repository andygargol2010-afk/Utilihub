# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-30 run 57
last_mode: HUNT
last_fix: E044 — removed duplicate tool module imports/spreads from catalog-index/part-08.ts and part-09.ts (10 slugs: area-triangulo, interes-simple, tiempo-de-lectura, cambio-porcentual, regla-de-tres, imc, porcentaje-de-numero, iva, media-ponderada, perimetro-rectangulo). SHAs 35fec239, 5861ab84, docs fd7d240c.
last_prevent: n/a
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat/PLACEHOLDER in src via code search, homes index/es.index start with import + createFileRoute, registry.tsx full no PLACEHOLDER; remains open for vigilance)
new_findings: runtime logs (production) showed catalog integrity console.error on duplicate slugs from multi-part imports; sampled tools (IVA, word-counter, modelador-3d, png-a-jpg, unir-pdf, games/2048, prism-trail) load with proper SEO/kind; tip deploy READY before fix.
deploy: latest production READY dpl_AV3mRtraqdxQPWW9tvgwS1QskqvM on 684f2714 (pre-fix; post-push pending verification).
notes: Known smoke E031 green. Discovery found E044 (duplicate catalog slugs via repeated imports in parts). Fixed surgically; catalog+state updated. No other open/recurring. No build ERROR on tip.
```

<!-- end:error-hunter-state.md -->
