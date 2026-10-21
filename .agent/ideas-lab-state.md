# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: playgrounds
last_closed_id: aurora-particle-playground
p_fixed: 0.35

weights_core:
  kits: 9
  journeys: 6
  games: 3
  simulators: 5
  studio-composition: 7
  playgrounds: 1
  quality-lift: 2

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
- 2026-10-20 | playgrounds | aurora-particle-playground | Interactive Aurora Particle Playground complete with bloom intensity + share (EN+ES)
- 2026-10-20 | retention-loops | return-streak-board | Interactive Return Streak Board complete with share (EN+ES)
- 2026-10-20 | seo-locales | pt | Portuguese (pt-BR) beachhead complete: /pt home + pulse-catch + orbit-defender + snake + pong (1/5 active)
- 2026-10-20 | quality-lift | pulse-catch-arena | Elevated Pulse Catch Arena with perfect-catch system + combo fire + fever (EN+ES)
- 2026-10-19 | games | orbit-defender-arcade | Interactive Orbit Defender Arcade (EN+ES)
- 2026-10-19 | simulators | reaction-diffusion-lab | Interactive Reaction-Diffusion Lab (EN+ES)
- 2026-10-19 | journeys | waypoint-river-composer | Interactive Waypoint River Composer (EN+ES)
- 2026-10-18 | studio-composition | neon-signature-composer | Interactive Neon Signature Composer (EN+ES)
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Solar System Scale Explorer — open Canvas 2D experience where users zoom, pan, and drag planets (and moons) to feel the true relative sizes and distances of the solar system. Planets rendered with accurate scale modes (size-only vs distance-only vs both), orbital trails, and toggleable labels. Original educational copy targeting search intent around "solar system scale", "planet size comparison", "how far is Neptune". Controls for zoom level, focus planet, trail fade, and animation speed. Visual payoff with glowing scale visualization, route-isolated, EN+ES, next-step before Adsterra. Lightweight (no new deps, modest elements on mobile). Creates a shareable educational canvas.
id: solar-system-scale-explorer
path_en: /solar-system-scale-explorer
path_es: /es/solar-system-scale-explorer
path_seo: n/a
domain: search-magnets
runs_total: 7
runs_remaining: 4
acceptance: pending
share: both
next_step_required: yes
notes: IDEATE 2026-10-20 search-magnets. EXECUTE 2026-10-21: elevated SolarSystemScaleExplorer — Kepler-ish orbital anim, drag planets + pan bg, focus auto-pan, trail fade + speed, Earth moon, Saturn ring, glow, share URL/PNG, reset. next-step registered. EN+ES routes + educational copy. Adsterra kept. Commit bf567b3. EXECUTE 2026-10-21 run 2/7: added dynamic educational info panel (diameter vs Earth, AU, orbital period, bilingual fact) on focus + subtle asteroid belt hint between Mars/Jupiter. Adsterra kept. EXECUTE 2026-10-21 run 3/7: Galilean moons (Io/Europa/Ganymede/Callisto) + Titan/Rhea, subtle starfield, scattered asteroid belt points, diameter visual bar + mass ratio in focus panel. Commit 70935aa. Adsterra kept.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
