# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: conversion-paths
last_closed_id: home-value-path-boost
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
  growth-surfaces: 2
  share-hooks: 4
  retention-loops: 6
  conversion-paths: 1
  traffic-diagnosis: 5
  adsense-prep: 10
  seo-locales: 9   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-24 | conversion-paths | home-value-path-boost | Sección Ruta de valor / Value Path en home EN+ES completa: 3 experiencias aleatorias de pool de 6 (aurora, n-body, neon, prism, color-cascade, aura), progreso localStorage (1 de 3), botón Nueva/New, CTAs claros, data-events (value-path-click + value-path-refresh), barra de progreso y mensaje de completado. Lazy load en home. CWV-safe (sin assets pesados ni deps nuevas). Adsterra intacto. Closed after 4 runs. Mejora rutas de conversión desde home hacia experiencias interactivas de alto valor.
- 2026-10-24 | journeys | waypoint-river-journey | Interactive Waypoint River Journey complete: place/drag waypoints to define flowing particle river, fading trails (4-24), speed/width/bloom/density/gravity controls, attractors, pause/randomize/clear, keyboard (Space/R/C), PNG share with baked title + utilihub.com + waypoint count, URL deep-link (?wp=). EN+ES routes. CWV-safe (density cap 80, lazy canvas). Next-step before Adsterra. Adsterra intact. Closed after 6 runs. Distinct path/progression experience.
- 2026-10-24 | search-magnets | n-body-gravity-guide | Original long-form SEO guide (EN+ES) on interactive N-body and multi-attractor gravity simulations complete. Explains Newtonian force summation, soft collisions, fading trails, body glow, presets, numerical integration (Euler vs semi-implicit), energy/virial, circular binary worked example, practical tuning (G/softening/timestep/scale), mutual vs fixed-attractor contrast, camera, CWV caps, FAQs and deep links to the live simulator + related playgrounds. Original explanatory text for search depth. EN+ES routes with meta, hreflang, breadcrumbs. CWV-safe (static). Adsterra intact. Closed after 6 runs.
- 2026-10-24 | traffic-bets | shareable-experiences-boost | Shareability boost complete: ExperienceShareButton (Web Share API + clipboard + data-event share_click) on top experiences headers EN+ES (aurora, neon-layer, n-body, color-cascade, prism-trail, aura-card) + cards in ExperienceDiscoveryRail. Home teaser "Shareable Experiences" / "Experiencias compartibles" with deep-links. EN+ES. CWV-safe (light events, no heavy assets). Adsterra intact. Closed after 4 runs. Bet on referral traffic from shares.
- 2026-10-24 | growth-surfaces | experience-discovery-rail | Horizontal discovery rail on home EN+ES complete: category chips, deterministic shuffle, horizontal snap cards with short desc + deep links, category gradient previews + icons, scroll chevrons + fade edges, keyboard (arrows/S), data-events. Surfaces 10 experiences. Lightweight CSS only, no heavy assets/deps. Improves discovery beyond Random Experience button. EN+ES. CWV-safe. Closed after 4 runs. Adsterra intact.
- 2026-10-23 | studio-composition | neon-layer-composer | Interactive Neon Layer Composer complete: freehand multi-layer neon canvas, bloom, symmetry (mirror/radial/kaleido), continuous + stroke particle emitters with gravity/wind, pointer force attract/repel, particle lifetime + size, bg modes (void/glow/grid), layer opacity/fade, title overlay, PNG share with branding, URL deep-link, pause + keyboard (Space/C/U/R), randomize. EN+ES. CWV-safe (cap 280, lazy). Closed after 6 runs. Adsterra intact. Distinct from prism-trail.
- 2026-10-23 | quality-lift | aurora-particle-playground | Elevated Aurora Particle Playground complete: multi-mode (ribbon/orb/vortex) bloom systems with adjustable persistent fading trails (trail length 4-24), attract/repel polarity + dynamic pointer force, additive lighter compositing, density/speed/bloom/gravity/wind, emitters (place/drag/remove, cap 8), palettes, randomize, pause, PNG share with baked title+utilihub.com+settings+trail, URL deep-link. Sets elevated standard above GravityParticlesPlayground (basic orbits) and ParticleMagnetLab (polarity/arrows) in layered multi-mode bloom delight + interactive emission + trail control. EN+ES. CWV-safe (cap 300, lazy). Closed after 7 runs. Adsterra intact. Bar moved permanently.
- 2026-10-23 | simulators | n-body-gravity-sim | Interactive N-Body Gravity Simulator complete: add celestial bodies (mass/velocity/color), live gravitational dynamics + soft collisions, fading alpha trails, body glow + specular highlight, presets (binary stars, mini solar 6 bodies, chaotic cluster, figure-8), zoom/pan/pinch-to-zoom, keyboard shortcuts (Space pause, R reset cam, C clear, +/- zoom), PNG share with baked title + utilihub.com + body count + URL deep-link for initial conditions. EN+ES routes. CWV-safe (body cap 20, lazy canvas). Closed after 7 runs. Adsterra intact.
- 2026-10-22 | share-hooks | aura-card-share | Interactive Shareable Aura Card Composer complete: color schemes (aurora/neon/sunset/cosmic/ocean/magma), density, bloom, bg gradient, custom quote/name, particle trails + swirl + pulsing halo, PNG share with baked title + URL deep-link (c/d/b/g/q/id), randomize, next-step before Adsterra. EN+ES. CWV-safe (particle cap, lazy). Production lags preview.
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
```

---

## ACTIVE PROJECT

```
status: active
idea: Bet on recovering the recent visitor drop (-32% in last traffic-diagnosis) via a Daily Experience Spotlight on home EN+ES. Rotates daily one high-value interactive experience from the pool (aurora, n-body, neon-layer, prism-trail, color-cascade, aura-card), with short teaser, direct deep-link CTA, integrated ExperienceShareButton, localStorage last-shown, and data-events (spotlight-view, spotlight-click, spotlight-share). Lightweight only, no new deps or heavy assets. CWV-safe. Measurable bet on higher home engagement, shares and referral traffic. Adsterra intact.
id: daily-experience-spotlight
path_en: /
path_es: /es
path_seo: n/a
domain: traffic-bets
runs_total: 4
runs_remaining: 2
acceptance: pending
share: both
next_step_required: no
notes: Roll: U=0.2987 <0.50 → GROWTH; U_g=0.270 <0.35 → FIXED urn (traffic-bets|search-magnets equal weight 3); selected traffic-bets. last_closed=conversion-paths ≠, no re-roll. FIXED weights unchanged. Prefers analytics (visitor drop). EXECUTE 1/4: DailyExperienceSpotlight component + lazy integration on home EN+ES after hero. Daily rotation by day-of-year + last-shown localStorage avoid, share button, data-events (view/click). CWV-safe (lazy, light). Adsterra intact. EXECUTE 2/4: polish with D{day} badge, rotation note, spotlight-share track on share click (wrapper), enhanced border/gradient. Paths already corrected. CWV-safe. Adsterra intact.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
