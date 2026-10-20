# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: seo-locales
last_closed_id: pt
p_fixed: 0.35

weights_core:
  kits: 8
  journeys: 5
  games: 2
  simulators: 4
  studio-composition: 6
  playgrounds: 7
  quality-lift: 1

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 5
  share-hooks: 5
  retention-loops: 1
  conversion-paths: 5
  traffic-diagnosis: 5
  adsense-prep: 3
  seo-locales: 2   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-20 | seo-locales | pt | Portuguese (pt-BR) beachhead complete: /pt home + pulse-catch + orbit-defender + snake + pong (1/5 active)
- 2026-10-20 | quality-lift | pulse-catch-arena | Elevated Pulse Catch Arena with perfect-catch system + combo fire + fever (EN+ES)
- 2026-10-19 | games | orbit-defender-arcade | Interactive Orbit Defender Arcade (EN+ES)
- 2026-10-19 | simulators | reaction-diffusion-lab | Interactive Reaction-Diffusion Lab (EN+ES)
- 2026-10-19 | journeys | waypoint-river-composer | Interactive Waypoint River Composer (EN+ES)
- 2026-10-18 | studio-composition | neon-signature-composer | Interactive Neon Signature Composer (EN+ES)
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Return Streak Board — lightweight visual board (animated nodes + pulse rings) that tracks visit streaks and last-played playgrounds/games via localStorage only (no accounts). Shows “due to return” highlights, one-tap resume, and a suggested next experience. Visual payoff, EN+ES, route-isolated, Adsterra kept. Creates a return/retention loop without server state.
id: return-streak-board
path_en: /return-streak-board
path_es: /es/return-streak-board
path_seo: n/a
domain: retention-loops
runs_total: 6
runs_remaining: 4
acceptance: pending
share: n/a
next_step_required: no
notes: IDEATE 2026-10-20: U=0.32996 GROWTH; U_g=0.9855 FLEX; weighted FLEX → retention-loops (not last_closed). Weights: selected→1, other non-FIXED FLEX +1. FIXED untouched. seo-locales still 1/5 active.
EXECUTE 2026-10-20 (1/6): shipped MVP visual board with localStorage daily streak, animated due-nodes from popular playgrounds, one-tap links, EN+ES routes. Adsterra kept. Next runs deepen tracking/visuals.
EXECUTE 2026-10-20 (2/6): deepened visuals + tracking — longestStreak, visual pulse chain, sorted overdue nodes with dual-ring animations, days-ago labels, unique visits count. EN+ES. Adsterra kept. Lightweight CSS only.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
