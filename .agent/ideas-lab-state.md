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
status: done
idea: Interactive Aurora Particle Playground — open Canvas 2D playground where users place and drag magnetic attractors/emitters. Particles form glowing aurora-like flowing ribbons with persistent trails that respond to attractors in real time. Controls for density, speed, hue shift, and turbulence. Visual payoff with animated glowing particles, route-isolated, EN+ES, next-step before Adsterra. Lightweight (no new deps, modest particle count on mobile). Creates a shareable visual canvas experience.
id: aurora-particle-playground
path_en: /aurora-particle-playground
path_es: /es/aurora-particle-playground
path_seo: n/a
domain: playgrounds
runs_total: 7
runs_remaining: 0
acceptance: accepted
share: both
next_step_required: yes
notes: IDEATE 2026-10-20: U=0.8088 CORE; weighted sample 29.31/33 → playgrounds (not last_closed). Weights: selected→1, other CORE +1. FIXED untouched. Deploy READY. seo-locales still 1/5 active. EXECUTE 1/7 2026-10-20: core Canvas 2D shipped (attractors place/drag, aurora ribbons + persistent trails, density/speed/hue/turbulence, URL+PNG share, next-step registered, EN+ES routes, Adsterra kept). Lightweight mobile budget. EXECUTE 2/7 2026-10-20: added color presets (Aurora/Neon/Sunset/Ice), trail fade + particle size sliders, share URL extended. Visual control richer, still lightweight. EXECUTE 3/7 2026-10-20: global attractor strength slider + right-click/long-press to delete nearest attractor. Share URL includes strength. Deeper interaction, lightweight. FIX-BUILD 2026-10-20: removed duplicate src/lib/general/lorem-ipsum-tool.ts (same slug generador-lorem-ipsum as generator file) to fix catalog validator ERROR on Vercel. Adsterra kept. Awaiting new deploy READY. EXECUTE 4/7 2026-10-20: repeller mode (place attractors blue/pull or repellers orange/push). Polarity in force + share URL (a=x,y,±1). Help EN+ES updated. Color-coded wells. Lightweight, next-step+Adsterra kept. EXECUTE 5/7 2026-10-20: pause/resume, random fields button (3–5 mixed polarity), long-press delete implemented for mobile, help EN+ES updated. Lightweight, Adsterra+next-step kept. Deploy check next. EXECUTE 6/7 2026-10-20: directional wind (angle + strength) for flowing aurora curtains + Clear trails button. Wind in force + share URL (wa,ws). Help EN+ES updated. Lightweight, Adsterra+next-step kept. EXECUTE 7/7 2026-10-20: bloom intensity slider for richer soft glow on ribbons. Share URL extended (bl). Help EN+ES updated. Project closed. Lightweight, Adsterra+next-step kept.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
