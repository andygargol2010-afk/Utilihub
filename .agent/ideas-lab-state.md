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
status: active
idea: Elevate Pulse Catch Arena (existing game) to a higher quality bar than peers. Add temporary power-ups (magnet, slow-mo, score multiplier), enhanced particle bursts and screen juice on catches/combos, mobile-optimized touch controls, wave/combo announcements, and a polished shareable high-score card. Keep lightweight 2D canvas, EN+ES parity.
id: pulse-catch-arena
path_en: /games/pulse-catch-arena
path_es: /es/juegos/pulse-catch-arena
domain: quality-lift
runs_total: 7
runs_remaining: 1
acceptance: pending
share: both
next_step_required: yes
notes: Roll U=0.68 → CORE. Weighted sample selected quality-lift (set to 1, other CORE +1). U_f=0.45 → games family. Compared: pulse-catch-arena, orbit-defender-arcade, snake. Target pulse-catch-arena for headroom. Elevated standard: power-up system + stronger visual juice and mobile feel that the two peers still lack. EXECUTE 1/7: added temporary power-ups (magnet pull, slow-mo, x2 multi) with timers, HUD indicators, special spawn/catch particles and floaters. Peers still lack this system. EXECUTE 2/7: enhanced particle bursts (multi-layer sparks, color-coded by kind) + screen shake and flash juice on catches/combos; improved pointer tracking for mobile. Still elevating above orbit-defender and snake. EXECUTE 3/7: full elevated implementation with wave/combo announcements (big centered text), polished shareable high-score PNG card, refined particle juice, magnet attraction, and mobile-optimized pointer bar control. Bar moved further above peers. EXECUTE 4/7: added glowing pulse trails (position history stroke) and combo meter glow bar on HUD. Visual distinction and feedback depth increased beyond peers. EXECUTE 5/7: floating score/power popups (+pts, +life, Magnet!), reactive starfield that twinkles faster and tints pink at high combo, residual edge auras while power-ups active, bar color/glow shifts with magnet/multi and inner highlight. Peers still lack this layered feedback stack. EXECUTE 6/7: added shield power-up (absorbs one miss, green aura + HUD), expanding shockwave rings on catches and blocks, residual fading bar trail on movement, and polished share card with decorative rings. Distinctive interaction and juice still above orbit-defender and snake.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
