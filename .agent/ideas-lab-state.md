# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: studio-composition
last_closed_id: neon-layer-composer
p_fixed: 0.35

weights_core:
  kits: 14
  journeys: 11
  games: 5
  simulators: 3
  studio-composition: 1
  playgrounds: 6
  quality-lift: 2

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 1
  share-hooks: 2
  retention-loops: 4
  conversion-paths: 10
  traffic-diagnosis: 3
  adsense-prep: 8
  seo-locales: 7   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-23 | studio-composition | neon-layer-composer | Interactive Neon Layer Composer complete: freehand multi-layer neon canvas, bloom, symmetry (mirror/radial/kaleido), continuous + stroke particle emitters with gravity/wind, pointer force attract/repel, particle lifetime + size, bg modes (void/glow/grid), layer opacity/fade, title overlay, PNG share with branding, URL deep-link, pause + keyboard (Space/C/U/R), randomize. EN+ES. CWV-safe (cap 280, lazy). Closed after 6 runs. Adsterra intact. Distinct from prism-trail.
- 2026-10-23 | quality-lift | aurora-particle-playground | Elevated Aurora Particle Playground complete: multi-mode (ribbon/orb/vortex) bloom systems with adjustable persistent fading trails (trail length 4-24), attract/repel polarity + dynamic pointer force, additive lighter compositing, density/speed/bloom/gravity/wind, emitters (place/drag/remove, cap 8), palettes, randomize, pause, PNG share with baked title+utilihub.com+settings+trail, URL deep-link. Sets elevated standard above GravityParticlesPlayground (basic orbits) and ParticleMagnetLab (polarity/arrows) in layered multi-mode bloom delight + interactive emission + trail control. EN+ES. CWV-safe (cap 300, lazy). Closed after 7 runs. Adsterra intact. Bar moved permanently.
- 2026-10-23 | simulators | n-body-gravity-sim | Interactive N-Body Gravity Simulator complete: add celestial bodies (mass/velocity/color), live gravitational dynamics + soft collisions, fading alpha trails, body glow + specular highlight, presets (binary stars, mini solar 6 bodies, chaotic cluster, figure-8), zoom/pan/pinch-to-zoom, keyboard shortcuts (Space pause, R reset cam, C clear, +/- zoom), PNG share with baked title + utilihub.com + body count + URL deep-link for initial conditions. EN+ES routes. CWV-safe (body cap 20, lazy canvas). Closed after 7 runs. Adsterra intact.
- 2026-10-22 | share-hooks | aura-card-share | Interactive Shareable Aura Card Composer complete: color schemes (aurora/neon/sunset/cosmic/ocean/magma), density, bloom, bg gradient, custom quote/name, particle trails + swirl + pulsing halo, PNG share with baked title + URL deep-link (c/d/b/g/q/id), randomize, next-step before Adsterra. EN+ES. CWV-safe (particle cap, lazy). Production lags preview.
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
- 2026-10-21 | retention-loops | daily-progress-constellation | Interactive Daily Progress Constellation complete: canvas stars + lines + name baked in PNG + milestones + reset + hover tooltips + editable name (EN+ES)
- 2026-10-21 | search-magnets | solar-system-scale-explorer | Interactive Solar System Scale Explorer complete with light-travel times, live scale, focus ring, presets, moons, Pluto (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Horizontal discovery rail on home (EN+ES) surfacing interactive experiences (playgrounds, studios, games, simulators) with category chips, hover previews or short descriptions, randomize shuffle, and deep links. Improves discovery beyond the existing Random Experience button and Featured tools/games section without adding heavy assets or new pages. Keeps Adsterra spacing intact.
id: experience-discovery-rail
path_en: /
path_es: /es
path_seo: n/a
domain: growth-surfaces
runs_total: 4
runs_remaining: 1
acceptance: pending
share: n/a
next_step_required: no
notes: Roll: U=0.37 <0.50 → GROWTH. U_g=0.48 >0.35 → FLEX urn. Weighted sample selected growth-surfaces (weight 9 / total FLEX ~37). last_closed studio-composition (CORE) no re-roll. Idea is concrete shippable discovery UI on existing home. Weights: selected→1, other non-FIXED +1. seo-locales still active (1/5 pt). EXECUTE 1/4: ExperienceDiscoveryRail component + wired into home EN+ES after hero (before AdBanner EN). Categories chips + shuffle + horizontal cards with short desc + deep links. Lightweight CSS, no heavy assets. Adsterra spacing intact. CWV-safe. EXECUTE 2/4: Added category-colored gradient preview bars on cards (hover opacity), expanded to 10 experiences (added aura-card, return-streak-board). Still lightweight, no new deps/assets. EN+ES. Adsterra spacing intact. EXECUTE 3/4: Scroll-snap + left/right chevron controls (sm+) for horizontal rail; deterministic shuffle (seeded) to avoid re-randomize on render; data-events for scroll. Lucide already in stack. CWV-safe (no heavy work). EN+ES. Adsterra intact.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
