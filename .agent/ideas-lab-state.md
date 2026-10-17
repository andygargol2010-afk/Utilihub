# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: search-magnets
last_closed_id: canvas-webgl-performance-guide
p_fixed: 0.35

weights_core:
  kits: 8
  journeys: 4
  games: 1
  simulators: 3
  studio-composition: 5
  playgrounds: 2

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
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
- 2026-10-16 | traffic-bets | traffic-events | Traffic Events Instrumentation
- 2026-10-15 | journeys | river-light | River of Light Journey
- 2026-10-15 | studio-composition | glow-trail | Glow Trail Composer
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive canvas game Pulse Catch Arena: falling neon pulses of varying colors and speeds that the player must catch with a movable bar (mouse or keyboard). Scoring with combos for consecutive catches, lives for misses, increasing difficulty. Visual particle effects on catch. Pure game loop with rules and score — not a calculator. EN+ES routes with lazy-loaded canvas. Visual payoff and shareable score.
id: pulse-catch-arena
path_en: /games/pulse-catch-arena
path_es: /es/juegos/pulse-catch-arena
domain: games
runs_total: 6
runs_remaining: 5
acceptance: pending
share: url
next_step_required: yes
notes: DOMAIN ROLL U=0.858 → CORE. Weighted r=12.17/22 → games. last_closed search-magnets (GROWTH) — no re-roll. Weights: games→1, other CORE +1. Idea selected for rules/score visual game. EXECUTE 1/6: game shipped under existing games catalog + lazy GamePlayer. Paths corrected to /es/juegos/.... Next-step via relatedGames + GameShell. Adsterra kept. CWV: lazy route, fixed canvas, modest particles.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
