# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: search-magnets
last_closed_id: n-body-gravity-guide
p_fixed: 0.35

weights_core:
  kits: 15
  journeys: 1
  games: 6
  simulators: 4
  studio-composition: 2
  playgrounds: 7
  quality-lift: 3

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 1
  share-hooks: 3
  retention-loops: 5
  conversion-paths: 11
  traffic-diagnosis: 4
  adsense-prep: 9
  seo-locales: 8   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-24 | search-magnets | n-body-gravity-guide | Original long-form SEO guide (EN+ES) on interactive N-body and multi-attractor gravity simulations complete. Explains Newtonian force summation, soft collisions, fading trails, body glow, presets, numerical integration (Euler vs semi-implicit), energy/virial, circular binary worked example, practical tuning (G/softening/timestep/scale), mutual vs fixed-attractor contrast, camera, CWV caps, FAQs and deep links to the live simulator + related playgrounds. Original explanatory text for search depth. EN+ES routes with meta, hreflang, breadcrumbs. CWV-safe (static). Adsterra intact. Closed after 6 runs.
- 2026-10-24 | traffic-bets | shareable-experiences-boost | Shareability boost complete: ExperienceShareButton (Web Share API + clipboard + data-event share_click) on top experiences headers EN+ES (aurora, neon-layer, n-body, color-cascade, prism-trail, aura-card) + cards in ExperienceDiscoveryRail. Home teaser "Shareable Experiences" / "Experiencias compartibles" with deep-links. EN+ES. CWV-safe (light events, no heavy assets). Adsterra intact. Closed after 4 runs. Bet on referral traffic from shares.
- 2026-10-24 | growth-surfaces | experience-discovery-rail | Horizontal discovery rail on home EN+ES complete: category chips, deterministic shuffle, horizontal snap cards with short desc + deep links, category gradient previews + icons, scroll chevrons + fade edges, keyboard (arrows/S), data-events. Surfaces 10 experiences. Lightweight CSS only, no heavy assets/deps. Improves discovery beyond Random Experience button. EN+ES. CWV-safe. Closed after 4 runs. Adsterra intact.
- 2026-10-23 | studio-composition | neon-layer-composer | Interactive Neon Layer Composer complete: freehand multi-layer neon canvas, bloom, symmetry (mirror/radial/kaleido), continuous + stroke particle emitters with gravity/wind, pointer force attract/repel, particle lifetime + size, bg modes (void/glow/grid), layer opacity/fade, title overlay, PNG share with branding, URL deep-link, pause + keyboard (Space/C/U/R), randomize. EN+ES. CWV-safe (cap 280, lazy). Closed after 6 runs. Adsterra intact. Distinct from prism-trail.
- 2026-10-23 | quality-lift | aurora-particle-playground | Elevated Aurora Particle Playground complete: multi-mode (ribbon/orb/vortex) bloom systems with adjustable persistent fading trails (trail length 4-24), attract/repel polarity + dynamic pointer force, additive lighter compositing, density/speed/bloom/gravity/wind, emitters (place/drag/remove, cap 8), palettes, randomize, pause, PNG share with baked title+utilihub.com+settings+trail, URL deep-link. Sets elevated standard above GravityParticlesPlayground (basic orbits) and ParticleMagnetLab (polarity/arrows) in layered multi-mode bloom delight + interactive emission + trail control. EN+ES. CWV-safe (cap 300, lazy). Closed after 7 runs. Adsterra intact. Bar moved permanently.
- 2026-10-23 | simulators | n-body-gravity-sim | Interactive N-Body Gravity Simulator complete: add celestial bodies (mass/velocity/color), live gravitational dynamics + soft collisions, fading alpha trails, body glow + specular highlight, presets (binary stars, mini solar 6 bodies, chaotic cluster, figure-8), zoom/pan/pinch-to-zoom, keyboard shortcuts (Space pause, R reset cam, C clear, +/- zoom), PNG share with baked title + utilihub.com + body count + URL deep-link for initial conditions. EN+ES routes. CWV-safe (body cap 20, lazy canvas). Closed after 7 runs. Adsterra intact.
- 2026-10-22 | share-hooks | aura-card-share | Interactive Shareable Aura Card Composer complete: color schemes (aurora/neon/sunset/cosmic/ocean/magma), density, bloom, bg gradient, custom quote/name, particle trails + swirl + pulsing halo, PNG share with baked title + URL deep-link (c/d/b/g/q/id), randomize, next-step before Adsterra. EN+ES. CWV-safe (particle cap, lazy). Production lags preview.
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Waypoint River Journey (EN+ES): place and drag waypoints on a canvas to define a flowing river path of glowing particles or light. Adjust speed, width, bloom, particle density, gravity/wind influence, and optional attractors/repellers. Multiple layers or segments, fade trails, background modes. Pause, randomize path, keyboard shortcuts. PNG share with baked title + utilihub.com + waypoint count + URL deep-link for initial waypoints. Visual progression experience distinct from freehand composers or static sims. CWV-safe (particle cap, lazy route). Next-step before Adsterra. Adsterra spacing intact.
id: waypoint-river-journey
path_en: /waypoint-river-journey
path_es: /es/waypoint-river-journey
path_seo: n/a
domain: journeys
runs_total: 6
runs_remaining: 6
acceptance: pending
share: both
next_step_required: yes
notes: Roll: U=0.62 ≥0.50 → CORE. Weighted sample total=42, selection in journeys range. last_closed search-magnets (GROWTH) no re-roll. Selected journeys→1, other CORE +1. Idea is concrete interactive path/progression with visual payoff, not catalog calculator. EN+ES routes planned.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
