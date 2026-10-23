# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: simulators
last_closed_id: n-body-gravity-sim
p_fixed: 0.35

weights_core:
  kits: 13
  journeys: 10
  games: 4
  simulators: 2
  studio-composition: 3
  playgrounds: 5
  quality-lift: 1

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
- 2026-10-23 | simulators | n-body-gravity-sim | Interactive N-Body Gravity Simulator complete: add celestial bodies (mass/velocity/color), live gravitational dynamics + soft collisions, fading alpha trails, body glow + specular highlight, presets (binary stars, mini solar 6 bodies, chaotic cluster, figure-8), zoom/pan/pinch-to-zoom, keyboard shortcuts (Space pause, R reset cam, C clear, +/- zoom), PNG share with baked title + utilihub.com + body count + URL deep-link for initial conditions. EN+ES routes. CWV-safe (body cap 20, lazy canvas). Closed after 7 runs. Adsterra intact.
- 2026-10-22 | share-hooks | aura-card-share | Interactive Shareable Aura Card Composer complete: color schemes (aurora/neon/sunset/cosmic/ocean/magma), density, bloom, bg gradient, custom quote/name, particle trails + swirl + pulsing halo, PNG share with baked title + URL deep-link (c/d/b/g/q/id), randomize, next-step before Adsterra. EN+ES. CWV-safe (particle cap, lazy). Production lags preview.
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
- 2026-10-21 | retention-loops | daily-progress-constellation | Interactive Daily Progress Constellation complete: canvas stars + lines + name baked in PNG + milestones + reset + hover tooltips + editable name (EN+ES)
- 2026-10-21 | search-magnets | solar-system-scale-explorer | Interactive Solar System Scale Explorer complete with light-travel times, live scale, focus ring, presets, moons, Pluto (EN+ES)
- 2026-10-20 | playgrounds | aurora-particle-playground | Interactive Aurora Particle Playground complete with bloom intensity + share (EN+ES)
- 2026-10-20 | retention-loops | return-streak-board | Interactive Return Streak Board complete with share (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Elevate Aurora Particle Playground from broken stub to an advanced interactive aurora canvas with multi-mode particle systems (flowing ribbons, blooming orbs, swirling vortices), bloom intensity, color palettes (aurora greens/blues/purples), density/speed/gravity/wind modifiers, interactive mouse/touch emitters or attractors, PNG share with baked title + utilihub.com + settings summary + URL deep-link, randomize and pause. Sets elevated standard above GravityParticlesPlayground (basic attractor orbits) and ParticleMagnetLab (polarity + field arrows) in visual bloom delight, layered particle behaviors and interactive emission. EN+ES routes. CWV-safe (particle cap ~300, lazy canvas).
id: aurora-particle-playground
path_en: /aurora-particle-playground
path_es: /es/aurora-particle-playground
domain: quality-lift
runs_total: 7
runs_remaining: 2
acceptance: pending
share: both
next_step_required: yes
notes: U=0.717 >0.50 → CORE. Weighted sample → quality-lift (prior 5 → 1). Other CORE +1. No re-roll. U_f=0.105 <1/3 → playgrounds. Compared: AuroraParticlePlayground (broken stub, notably weaker), GravityParticlesPlayground (solid attractor orbits + trails + URL share), ParticleMagnetLab (advanced polarity, field arrows, pause, PNG+URL). Target Aurora to elevate far past peers with bloom multi-mode systems. Adsterra intact. EXECUTE 1/7: restored full multi-mode (ribbon/orb/vortex) bloom canvas, emitters (place/drag/double-remove, cap 8), palettes (aurora/neon/sunset/cosmic/ocean), density/speed/bloom/gravity/wind, pause, randomize, PNG share with baked title+utilihub.com+settings, URL deep-link. CWV-safe (cap 300, dpr<=2, lazy). Next-step present. Peers still lack multi-mode layered bloom + wind. EXECUTE 2/7: added persistent fading alpha trails (TRAIL_LEN=10) especially strong for ribbon mode — continuous flowing aurora ribbons with decreasing opacity segments, slightly slower clear for trail visibility. Elevates visual delight past peers' point particles or simple trails. Help text + PNG footer updated. Adsterra intact. CWV-safe. EXECUTE 3/7: added attract/repel polarity toggle (global, URL param, randomize, emitter glow color shift green/red), additive 'lighter' compositing for stronger multi-layer bloom delight on all modes, lighter trails on orb/vortex. Elevates interaction (repel vs pure attract) and visual bloom past ParticleMagnetLab's polarity and Gravity's basic. Help + PNG updated. Adsterra intact. CWV-safe. EXECUTE 4/7: re-implemented and confirmed global attract/repel polarity toggle with visual emitter glow (green/red), URL param pol=a/r, randomize support, help text and PNG footer update. Ensures elevation of interaction depth (repel capability peers lack or match) while keeping CWV-safe. Adsterra intact. Next-step present before banner. EXECUTE 5/7: added dynamic pointer attractor/repeller — mouse/touch hover/move creates temporary stronger emitter (strength 1.4) following current polarity, particles respond live without placing permanent emitter. Elevates interactive emission depth beyond placed-only peers. Help text + PNG footer updated. Adsterra intact. CWV-safe (no extra particles). Next-step present.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
