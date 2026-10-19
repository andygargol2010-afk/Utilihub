# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: simulators
last_closed_id: reaction-diffusion-lab
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 2
  games: 8
  simulators: 1
  studio-composition: 3
  playgrounds: 4
  quality-lift: 8

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 3
  share-hooks: 3
  retention-loops: 3
  conversion-paths: 3
  traffic-diagnosis: 3
  adsense-prep: 1
  seo-locales: 3   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-19 | simulators | reaction-diffusion-lab | Interactive Reaction-Diffusion Lab (EN+ES)
- 2026-10-19 | journeys | waypoint-river-composer | Interactive Waypoint River Composer (EN+ES)
- 2026-10-18 | studio-composition | neon-signature-composer | Interactive Neon Signature Composer (EN+ES)
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
```

---

## ACTIVE PROJECT

```
status: done
idea: Interactive Reaction-Diffusion Lab (Gray-Scott style Turing patterns). Adjust feed and kill rates, diffusion coefficients, and color maps. Presets for spots, stripes, mazes, and labyrinths. Live evolving canvas with seed brush to paint activator, pause/reset, and visual organic patterns that emerge over time. Lightweight 2D grid simulation for browser, EN+ES parity.
id: reaction-diffusion-lab
path_en: /simulators/reaction-diffusion-lab
path_es: /es/simuladores/lab-reaccion-difusion
domain: simulators
runs_total: 6
runs_remaining: 0
acceptance: done
share: png
next_step_required: no
notes: IDEATE CORE. U=0.5345 ≥0.50 → CORE. Weighted sample r=15.25/30 selected simulators. Updated weights_core (selected→1, others +1). Distinct from RECENT_CLOSED (boids, double-pendulum) and existing GravitySandbox. Visual evolving chemical system with high organic delight. EXECUTE 1/6: shipped core Gray-Scott 2D grid (160x160), presets (spots/stripes/maze/worms/coral/mitosis), seed brush, F/k/Du/Dv sliders, color maps, pause/reset. Catalog + registry wired. EN+ES paths live. Adsterra kept. EXECUTE 2/6: PNG export button, adjustable brush radius (2-12), speed control (1-8 steps/frame), plasma color map, Clear V button. Shareable patterns ready. EXECUTE 3/6: multi-mode brush (seed/clear/noise), viridis+magma color maps, Step button for single-step, compact parameter legend EN+ES, touch-none canvas. Deeper interaction and education. EXECUTE 4/6: random params button (explores F/k/Du/Dv space), random seed button, shareable URL hash with current params (copy link), hash parsed on load. Better exploration and shareability. EXECUTE 5/6: visualization toggle (V activator / U substrate inverted / |U-V| difference), live stats panel (avg V, max V, avg U) updated sparingly. Deeper insight into the chemical fields. EXECUTE 6/6: PNG export now embeds current F/k/Du/Dv + viz/color caption; added Solitons and Labyrinth+ presets. Project closed. Patterns ready for share and exploration.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
