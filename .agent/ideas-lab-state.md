# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: orbit-defender-arcade
p_fixed: 0.35

weights_core:
  kits: 7
  journeys: 4
  games: 1
  simulators: 3
  studio-composition: 5
  playgrounds: 6
  quality-lift: 10

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
- 2026-10-19 | games | orbit-defender-arcade | Interactive Orbit Defender Arcade (EN+ES)
- 2026-10-19 | simulators | reaction-diffusion-lab | Interactive Reaction-Diffusion Lab (EN+ES)
- 2026-10-19 | journeys | waypoint-river-composer | Interactive Waypoint River Composer (EN+ES)
- 2026-10-18 | studio-composition | neon-signature-composer | Interactive Neon Signature Composer (EN+ES)
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
```

---

## ACTIVE PROJECT

```
status: closed
idea: Interactive Orbit Defender Arcade. Defend a central glowing planet from waves of incoming asteroids and debris. Aim and fire interceptors with mouse or touch, build score combos, unlock temporary power-ups (shield, rapid fire, slow-mo, spread), and survive escalating difficulty. Lightweight 2D canvas game with particle effects, EN+ES parity, shareable high-score screenshots.
id: orbit-defender-arcade
path_en: /games/orbit-defender-arcade
path_es: /es/juegos/arcade-defensor-orbita
domain: games
runs_total: 6
runs_remaining: 0
acceptance: shipped
share: both
next_step_required: yes
notes: EXECUTE 6/6 closed. Final juice: screen flash on power-up/high combo, wave announcement overlay, subtle orbit ring, enhanced particle bursts on collect and game over. Next-step registered in routes before Adsterra. EN+ES parity. Mobile aim remains snappy.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
