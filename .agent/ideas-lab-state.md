# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: kits
last_closed_id: home-renovation-kit
p_fixed: 0.35

weights_core:
  kits: 2
  journeys: 8
  games: 5
  simulators: 4
  studio-composition: 9
  playgrounds: 1
  quality-lift: 5

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
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Gravity Ribbon Canvas playground. Users sketch freeform paths that become flowing gravity ribbons. Particles are emitted and follow the ribbons with tunable attraction strength, leaving persistent glowing trails that form temporary signatures. Multiple ribbons can intersect and influence particles. Controls for particle count (modest on mobile), trail length, flow speed, color themes, and clear. Touch-friendly drawing. Goal is visual payoff and open canvas play, not a calculator.
id: gravity-ribbon-canvas
path_en: /playgrounds/gravity-ribbon-canvas
path_es: /es/playgrounds/lienzo-cintas-gravedad
domain: playgrounds
runs_total: 6
runs_remaining: 4
acceptance: pending
share: url
next_step_required: yes
notes: IDEATE. Roll: U=0.538 → CORE; sample 24.85/32 → playgrounds (cumulative 23-28). last_closed kits ≠ playgrounds, no re-roll. Weights: selected→1, other CORE +1. Avoided recent particle-magnet, constellation, firma-particulas. next-step required before Adsterra. Adsterra untouched. EXECUTE 1/6: core canvas (draw ribbons as attractors, particles + persistent trails, controls, mobile cap), EN+ES routes, next-step registration, hub cards. EXECUTE 2/6: theme-aware ribbon/particle colors, stronger glow trails with fading alpha, undo last ribbon, refined physics. Adsterra kept after next-step.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->