# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: studio-composition
last_closed_id: neon-signature-composer
p_fixed: 0.35

weights_core:
  kits: 4
  journeys: 1
  games: 7
  simulators: 6
  studio-composition: 2
  playgrounds: 3
  quality-lift: 7

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
- 2026-10-18 | studio-composition | neon-signature-composer | Interactive Neon Signature Composer (EN+ES)
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Waypoint River Composer. Users place sequential waypoints on a canvas that connect into a flowing river path with animated light particles traveling along the progression, color gradients by journey stage, optional branching side paths, and waypoint markers with glow. Controls for flow speed, particle density, color themes, path smoothing, undo, and clear. Touch-friendly placement and drag. Goal is visual composition of a progressive light-river journey with high visual payoff and sense of forward motion, not a calculator.
id: waypoint-river-composer
path_en: /journeys/waypoint-river-composer
path_es: /es/viajes/compositor-rio-waypoints
domain: journeys
runs_total: 6
runs_remaining: 1
acceptance: pending
share: both
next_step_required: yes
notes: IDEATE. Roll: U=0.7999 → CORE; weighted sample r=10.22/32 → journeys (cumul. kits 0-3, journeys 3-12). last_closed_domain studio-composition ≠ journeys, no re-roll. Weights: selected→1, other CORE +1. Avoided recent closed (neon studio, kits, boids, pulse, particle). New progression-focused waypoint river canvas. next-step required before Adsterra. Adsterra untouched. EXECUTE 1/6: core canvas + sequential waypoint placement + stage-gradient particle flow + themes/speed/density/undo/demo shipped. EN+ES routes, index cards, next-step registered. Adsterra kept. EXECUTE 2/6: path smoothing (Catmull-Rom blend + control) + drag-to-reposition waypoints for organic river composition. Particles follow smooth path. Touch-friendly. Adsterra kept. EXECUTE 3/6: optional branching side paths — start branch from current end, place side waypoints, particles split (~35% divert) across main + branches, side rivers drawn with lower alpha/thinner glow. Demo includes branch. Touch-friendly. Adsterra kept. EXECUTE 4/6: particle trails (short fading history per particle, reset on wrap) for continuous flowing-river visual payoff; EN+ES hints updated. Adsterra kept. EXECUTE 5/6: PNG share button (toDataURL download, EN/ES filenames) + longer glowing trails (TRAIL_LEN 12, stronger bloom) for shareability and continuous river payoff. Adsterra kept.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
