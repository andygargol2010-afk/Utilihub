# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: hangman-classic
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 2
  simulators: 8
  studio-composition: 3
  playgrounds: 8
  quality-lift: 2

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 3
  share-hooks: 5
  retention-loops: 6
  conversion-paths: 2
  traffic-diagnosis: 1
  adsense-prep: 11
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5; RESET 2026-10-28 empty actives

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
- 2026-10-29 | journeys | choice-story-journey | Interactive narrative choice journey complete after 4 runs. Branching decision cards, labeled progress waypoints, back/undo, current-step highlight, 3 endings with accent colors, URL deep-link path, branded PNG with accent bar, copy-link, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-28 | simulators | sir-epidemic-simulator | Interactive SIR epidemic compartmental model simulator complete after 4 runs. Live S/I/R curves, discrete interventions (lockdown, vaccination), Peak I + day tracking with marker, cumulative total cases, URL deep-link, branded PNG, EN+ES routes, mobile 390px, preset scenario buttons. CWV-safe. Adsterra intact.
- 2026-10-28 | ops | seo-locales-reset | Human-directed reset: deleted thin pt/fr/de shells; SEO_LOCALES_ACTIVE=[]; registry parity bar + min 11 runs policy. Domain restarts from zero (priority still pt → fr → de → …).
- 2026-10-28 | games | minesweeper-classic | Classic Minesweeper interactive game complete after 4 runs. Grid reveal (numbers/mines), flag (right-click/long-press), chord on open numbers, difficulties, timer/best, seeded URL deep-link, Same-board practice button, branded PNG, EN+ES dedicated routes (/minesweeper, /es/buscaminas), mobile 390px aspect-square cells. CWV-safe. Adsterra intact.
- 2026-10-28 | playgrounds | magnetic-field-sandbox | Interactive magnetic field lines sandbox complete after 4 runs. Place/drag N/S poles, live curved field lines (monopole tracing), flowing particles (toggle), directional arrowheads N→S, presets (Dipole, Two North, Quadrupole), URL deep-link, branded PNG, EN+ES routes, mobile 390px with modest line/particle caps. CWV-safe. Adsterra intact.
- 2026-10-28 | retention-loops | retention-loops-streak-constellation | Daily streak constellation visualizer complete after 4 runs. Interactive canvas star placement, check-in streak (localStorage + URL deep-link), milestone colors/progress bar, optional name personalization, branded PNG export, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive logistic map chaos lab: explore the classic population model x→r*x*(1-x) with live time series, cobweb plot, and bifurcation diagram. Sliders for r (0-4), initial x, iterations; highlight period-doubling cascade, Feigenbaum point, windows of stability; educational readouts for attractor type; URL deep-link params; branded PNG of bifurcation + cobweb; EN+ES routes. Distinct from particle sandboxes — pure iterative math visualization with plots.
id: logistic-chaos-lab
path_en: /simulators/logistic-chaos-lab
path_es: /es/simuladores/laboratorio-caos-logistico
path_seo: n/a
domain: simulators
runs_total: 4
runs_remaining: 4
acceptance: User opens the simulator, adjusts r past 3.57, sees period-doubling then chaos in the bifurcation diagram and cobweb, shares URL or PNG with the diagram.
share: both
next_step_required: yes
notes: C1 spring-mass-lab (4/3/3/4/4/4=22) closest: pendulum, n-body, double-pendulum; metaphor: discrete spring-mass constraint assembly; why not particle: connected components + energy readout. C2 heat-diffusion-grid (4/5/3/5/4/4=25) closest: states-of-matter, boids, sir; metaphor: grid cellular diffusion; why not: color-mapped temp cells, no freehand. C3 logistic-chaos-lab (3/4/4/5/5/5=26) closest: double-pendulum, sir-epidemic, predator-prey; metaphor: iterative parameter sweep + bifurcation diagram; why not particle-canvas: mathematical iteration plots (time series/cobweb/bifurcation), no freehand or particles. Chosen id: logistic-chaos-lab. Roll: CORE simulators (high weight 8, variety after recent games/kits/journeys; underused math chaos vs physics particles). IP: n/a (classic math model, public domain). adsense-prep_runs: 3. Run 1: core iteration engine + time series + cobweb + basic r slider + EN+ES routes + URL
```

<!-- end:ideas-lab-state.md -->