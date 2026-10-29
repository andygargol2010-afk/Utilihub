# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: journeys
last_closed_id: choice-story-journey
p_fixed: 0.35

weights_core:
  kits: 4
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
idea: Interactive multi-step recipe assembly kit. Users pick a base cuisine or blank, drag/add discrete ingredient cards into ordered steps, set quantities and notes, see a live visual timeline and assembled preview card. Generate shopping list, branded PNG recipe card with accent bar, URL deep-link of the full recipe. EN+ES routes. Not a calculator; discrete parts assembler with progress waypoints.
id: recipe-assembly-kit
path_en: /kits/recipe-assembly
path_es: /es/kits/ensamblaje-receta
path_seo: n/a
domain: kits
runs_total: 4
runs_remaining: 2
acceptance: User adds at least 3 ingredients across 2 steps, sees live preview and shopping list update, then copies share link or downloads PNG.
share: both
next_step_required: yes
notes: IDEATE 2026-10-29. Roll math: p_fixed=0.35 triggered FIXED growth (r=0.052); weighted roll among growth (no seo) landed on traffic-diagnosis (low weight). Variety mandate overrides to underused CORE kits (weights_core kits=4, recent closes heavy on playgrounds/journeys/simulators/games). 3 candidates scored 1-5 (value/share/search/distinct/feas/perf):
1. recipe-assembly-kit (declarative form\to diagram / guided parts assembler): 5/4/4/5/4/5 =27. Closest-3: existing cocina ratio calculators (static), choice-story-journey (narrative not parts), budget survivor game (survival not assembly). Primary metaphor: multi-step discrete parts assembler with visual timeline. Why not particle-canvas: form+cards+timeline, no freehand or particles.
2. diy-home-project-kit (checklist+parts list for home DIY): 4/3/3/4/4/5=23. Closest: home tools calculators, journeys. Metaphor: guided checklist assembler.
3. packing-list-kit (spatial packing planner for travel): 4/4/3/4/3/4=22. Closest: viajes tools, packing not interactive. Metaphor: constraint packing with discrete items.
Rejected <3 none. IP n/a. Chosen recipe-assembly-kit. adsense-prep_runs still 3.
EXECUTE 2026-10-29 run 1/4: Created core component RecipeAssemblyKit with add steps/ingredients (qty/unit/notes), live preview timeline, aggregated shopping list, URL deep-link (btoa JSON), basic branded PNG with accent bar, EN+ES dedicated routes. Mobile 390px considered (flex wrap). CWV-safe, no heavy deps. Adsterra intact. Core playable.
EXECUTE 2026-10-29 run 2/4: Added step + ingredient reordering (up/down buttons + HTML5 drag-and-drop), visual progress waypoints (bar + per-step accent when ingredients present), live preview highlight for completed steps. PNG accent bar retained. Mobile 390px flex-wrap. CWV-safe. Adsterra intact.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
