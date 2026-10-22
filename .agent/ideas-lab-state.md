# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: traffic-diagnosis
last_closed_id: weekly-analytics-review-2026-10-22
p_fixed: 0.35

weights_core:
  kits: 11
  journeys: 8
  games: 2
  simulators: 7
  studio-composition: 1
  playgrounds: 3
  quality-lift: 4

weights_growth:
  traffic-bets: 3
  search-magnets: 1
  growth-surfaces: 8
  share-hooks: 8
  retention-loops: 2
  conversion-paths: 8
  traffic-diagnosis: 1
  adsense-prep: 6
  seo-locales: 5   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
- 2026-10-21 | retention-loops | daily-progress-constellation | Interactive Daily Progress Constellation complete: canvas stars + lines + name baked in PNG + milestones + reset + hover tooltips + editable name (EN+ES)
- 2026-10-21 | search-magnets | solar-system-scale-explorer | Interactive Solar System Scale Explorer complete with light-travel times, live scale, focus ring, presets, moons, Pluto (EN+ES)
- 2026-10-20 | playgrounds | aurora-particle-playground | Interactive Aurora Particle Playground complete with bloom intensity + share (EN+ES)
- 2026-10-20 | retention-loops | return-streak-board | Interactive Return Streak Board complete with share (EN+ES)
- 2026-10-20 | seo-locales | pt | Portuguese (pt-BR) beachhead complete: /pt home + pulse-catch + orbit-defender + snake + pong (1/5 active)
- 2026-10-20 | quality-lift | pulse-catch-arena | Elevated Pulse Catch Arena with perfect-catch system + combo fire + fever (EN+ES)
```

---

## ACTIVE PROJECT

```
status: done
idea: Diagnóstico de tráfico semanal: comparar pageviews y visitors de los últimos 7 días vs los 7 anteriores en Vercel Web Analytics. Aplicar umbrales -15% sitio / -25% ruta / 2× errores. Reportar A/B/C en español. Nunca tocar Adsterra.
id: weekly-analytics-review-2026-10-22
path_en: n/a
path_es: n/a
domain: traffic-diagnosis
runs_total: 1
runs_remaining: 0
acceptance: done
share: n/a
next_step_required: no
notes: U=0.221 <0.50 → GROWTH. U_g=0.819 >0.35 → FLEX. Weighted sample → traffic-diagnosis (no match last_closed). Pesos FLEX actualizados: selected→1, otros +1. Medición: pageviews 161 (15-22) vs 166 (8-15) = -3%. Visitors 41 vs 60 = -32%. Home / : 28 pv. Eventos custom no disponibles (plan). No umbral de sitio alcanzado en pageviews. Posible causa: menos visitantes únicos, mismas o más vistas por usuario. Recomendación A: continuar monitoreo; B: no cambio de producto ahora; C: si persiste, correlacionar con cambios recientes (botón random, etc.). Cerrado en este run.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
