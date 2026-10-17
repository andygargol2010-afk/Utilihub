# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: pulse-catch-arena
p_fixed: 0.35

weights_core:
  kits: 9
  journeys: 5
  games: 2
  simulators: 1
  studio-composition: 6
  playgrounds: 3

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
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
- 2026-10-16 | traffic-bets | traffic-events | Traffic Events Instrumentation
- 2026-10-15 | journeys | river-light | River of Light Journey
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive canvas Boids Flocking Lab: a live flock of colored particles (boids) that follow classic separation, alignment, and cohesion rules. User-adjustable sliders for each rule strength, speed, and perception radius. Visual trails, color by velocity or neighbor count, mild attraction to mouse cursor. Pure evolving system visualization with parameters — not a calculator. EN+ES routes with lazy-loaded canvas. Visual payoff of emergent flocking behavior.
id: boids-flocking-lab
path_en: /simulators/boids-flocking-lab
path_es: /es/simuladores/boids-flocking-lab
domain: simulators
runs_total: 6
runs_remaining: 4
acceptance: pending
share: url
next_step_required: no
notes: DOMAIN ROLL U=0.543 → CORE. Weighted r=14.01/23 → simulators. last_closed games (CORE) — no re-roll. Weights: simulators→1, other CORE +1. Idea selected for evolving physics visualization. IDEATE: set ACTIVE. EXECUTE 1/6: shipped canvas component + registry + catalog (EN+ES routes). EXECUTE 2/6: polish — presets (school/scatter/tight/free), boundary wrap/bounce, optional neighbor links, mobile lower initial count, mouse attractor ring. Adsterra kept. Next: further polish or smoke.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
