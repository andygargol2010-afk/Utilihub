# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: share-hooks
last_closed_id: aura-card-share
p_fixed: 0.35

weights_core:
  kits: 12
  journeys: 9
  games: 3
  simulators: 1
  studio-composition: 2
  playgrounds: 4
  quality-lift: 5

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 9
  share-hooks: 1
  retention-loops: 3
  conversion-paths: 9
  traffic-diagnosis: 2
  adsense-prep: 7
  seo-locales: 6   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-22 | share-hooks | aura-card-share | Interactive Shareable Aura Card Composer complete: color schemes (aurora/neon/sunset/cosmic/ocean/magma), density, bloom, bg gradient, custom quote/name, particle trails + swirl + pulsing halo, PNG share with baked title + URL deep-link (c/d/b/g/q/id), randomize, next-step before Adsterra. EN+ES. CWV-safe (particle cap, lazy). Production lags preview.
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
- 2026-10-21 | retention-loops | daily-progress-constellation | Interactive Daily Progress Constellation complete: canvas stars + lines + name baked in PNG + milestones + reset + hover tooltips + editable name (EN+ES)
- 2026-10-21 | search-magnets | solar-system-scale-explorer | Interactive Solar System Scale Explorer complete with light-travel times, live scale, focus ring, presets, moons, Pluto (EN+ES)
- 2026-10-20 | playgrounds | aurora-particle-playground | Interactive Aurora Particle Playground complete with bloom intensity + share (EN+ES)
- 2026-10-20 | retention-loops | return-streak-board | Interactive Return Streak Board complete with share (EN+ES)
- 2026-10-20 | seo-locales | pt | Portuguese (pt-BR) beachhead complete: /pt home + pulse-catch + orbit-defender + snake + pong (1/5 active)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive N-Body Gravity Simulator: users add celestial bodies with adjustable mass, initial velocity, color and size; watch live gravitational dynamics unfold with particle trails, soft collision handling, zoom/pan camera, time scale controls, pause/reset, and presets (binary stars, miniature solar system, chaotic cluster). Snapshot PNG share of current state + URL deep-link for initial conditions. Evolving physics system with visual payoff. EN+ES routes. CWV-safe (body cap ~20, lazy canvas route).
id: n-body-gravity-sim
path_en: /n-body-gravity
path_es: /es/n-body-gravity
domain: simulators
runs_total: 7
runs_remaining: 3
acceptance: pending
share: both
next_step_required: no
notes: U=0.596 >0.50 → CORE. Weighted sample → simulators (prior weight 7 → 1). Other CORE +1. No re-roll (last_closed was GROWTH share-hooks). IDEATE complete. EXECUTE1: core canvas + EN/ES routes. EXECUTE2: polish interactions (velocity arrow preview on drag-to-place, right-click remove nearest), camera reset button, deeper presets (solar 6 bodies, chaotic with central mass +10, new figure-8 seed), body glow, longer trails, help text. EXECUTE3: visual polish — fading alpha trails (per-segment), specular highlight on bodies, color picker for new bodies. CWV body cap 20. EXECUTE4: mobile feel + share UX depth — pinch-to-zoom (touch events), zoom +/- buttons, native Web Share API fallback, PNG download now bakes title overlay + utilihub.com + body count. Help text updated for pinch/long-press. Adsterra intact. Next: further mobile polish or close if solid.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
