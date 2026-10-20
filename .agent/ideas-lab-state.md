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
  growth-surfaces: 4
  share-hooks: 4
  retention-loops: 4
  conversion-paths: 4
  traffic-diagnosis: 4
  adsense-prep: 2
  seo-locales: 1   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-20 | quality-lift | pulse-catch-arena | Elevated Pulse Catch Arena with perfect-catch system + combo fire + fever (EN+ES)
- 2026-10-19 | games | orbit-defender-arcade | Interactive Orbit Defender Arcade (EN+ES)
- 2026-10-19 | simulators | reaction-diffusion-lab | Interactive Reaction-Diffusion Lab (EN+ES)
- 2026-10-19 | journeys | waypoint-river-composer | Interactive Waypoint River Composer (EN+ES)
- 2026-10-18 | studio-composition | neon-signature-composer | Interactive Neon Signature Composer (EN+ES)
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Activate Portuguese (pt-BR bias) as first SEO locale. Ship a complete /pt home page with real translated copy (title, description, intro, links to available experiences where possible) plus one high-value experience page (prefer a lightweight playground equivalent or simplified interactive if feasible; otherwise a high-traffic tool page with full translation). Wire hreflang/alternates to EN+ES counterparts, update registry + seo-locales.ts, keep no primary-nav links from EN or ES. Guard CWV, keep Adsterra. EN+ES remain untouched.
id: pt
path_en: n/a
path_es: n/a
path_seo: /pt
domain: seo-locales
runs_total: 4
runs_remaining: 1
acceptance: pending
share: n/a
next_step_required: no
notes: EXECUTE 2026-10-20: added /pt/snake (SnakeGame locale=pt full string support + complete PT page + hreflang). Updated /pt home with third link + list item. Registry pages_done now includes the new path (1/5 active). Adsterra kept. EN+ES untouched. Next: deepen further or close.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
