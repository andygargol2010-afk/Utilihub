# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: simulators
last_closed_id: boids-flocking-lab
p_fixed: 0.35

weights_core:
  kits: 1
  journeys: 6
  games: 3
  simulators: 2
  studio-composition: 7
  playgrounds: 4
  quality-lift: 3

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
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
- 2026-10-16 | traffic-bets | traffic-events | Traffic Events Instrumentation
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Home Renovation Kit: a multi-step local workspace for planning a room renovation. Shared board (browser-only) with ordered steps — measure dimensions, calculate materials (flooring/paint), estimate costs, set timeline. Live progress checklist, visual summary of pasted results, focus timer, copy-slip for progress URL. Links to relevant existing tools but the kit page itself is the cohesive interactive experience with next-step guidance. Visual payoff of a living renovation plan. EN+ES routes. Not a single calculator.
id: home-renovation-kit
path_en: /kits/home-renovation-kit
path_es: /es/kits/kit-renovacion-hogar
domain: kits
runs_total: 6
runs_remaining: 5
acceptance: pending
share: url
next_step_required: yes
notes: DOMAIN ROLL U=0.839 → CORE. Weighted r=7.40/26 → kits. last_closed simulators — no re-roll. Weights: kits→1, other CORE +1. Idea selected for coherent multi-tool renovation planning path with interactive board UX. quality-lift domain added to CORE with weight 3 (meta, not this project). EXECUTE 1/6: shipped HomeRenovationBoard with live dimensions/materials/costs, checklist, focus timer, copy summary; registered in WORK_KITS; EN+ES routes wired. Adsterra untouched.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
