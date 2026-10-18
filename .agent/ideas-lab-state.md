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
  kits: 1
  journeys: 7
  games: 4
  simulators: 3
  studio-composition: 8
  playgrounds: 5
  quality-lift: 4

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
status: done
idea: Interactive Home Renovation Kit closed after 6/6 runs. Full local board with dimensions, materials+waste, costs, budget bar, shopping list, colors, notes, timeline, focus timer, completion celebration + reset.
id: home-renovation-kit
path_en: /kits/home-renovation-kit
path_es: /es/kits/kit-renovacion-hogar
domain: kits
runs_total: 6
runs_remaining: 0
acceptance: shipped
share: url
next_step_required: yes
notes: EXECUTE 6/6: added completion celebration banner + reset plan button. Adsterra untouched. Project closed. Weights updated as selected→1 others+1.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->