# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: simon-sequence-memory
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 3
  simulators: 6
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
- 2026-10-29 | games | simon-sequence-memory | Classic Simon-style color sequence memory game complete after 4 runs. 4 colored pads with tones (Web Audio sine), growing sequence from 3, user repeats to advance score/level, game-over on mistake with best (localStorage). Sound toggle, difficulty (Easy/Normal/Hard speed), keyboard 1-4, URL deep-link (?seed=) with mulberry32 for reproducible challenge, branded PNG (accent + pads + score/best/level/difficulty + utilihub.app), share-link, New sequence button for fresh challenge, EN+ES via catalog (/games/simon-sequence-memory, /es/juegos/memoria-secuencia-simon), mobile 390px 2x2 pads. CWV-safe. Adsterra intact.
- 2026-10-29 | simulators | logistic-chaos-lab | Interactive logistic map chaos lab complete after 4 runs. Live time series, cobweb plot, bifurcation diagram with period-doubling cascade (P2/P4/P8), Feigenbaum point, stability windows (P3/P5), zoom cascade toggle, attractor type readout, URL deep-link, branded PNG, EN+ES routes (/simulators/logistic-chaos-lab, /es/simuladores/laboratorio-caos-logistico), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
- 2026-10-29 | journeys | choice-story-journey | Interactive narrative choice journey complete after 4 runs. Branching decision cards, labeled progress waypoints, back/undo, current-step highlight, 3 endings with accent colors, URL deep-link path, branded PNG with accent bar, copy-link, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-28 | simulators | sir-epidemic-simulator | Interactive SIR epidemic compartmental model simulator complete after 4 runs. Live S/I/R curves, discrete interventions (lockdown, vaccination), Peak I + day tracking with marker, cumulative total cases, URL deep-link, branded PNG, EN+ES routes, mobile 390px, preset scenario buttons. CWV-safe. Adsterra intact.
- 2026-10-28 | ops | seo-locales-reset | Human-directed reset: deleted thin pt/fr/de shells; SEO_LOCALES_ACTIVE=[]; registry parity bar + min 11 runs policy. Domain restarts from zero (priority still pt → fr → de → …).
- 2026-10-28 | games | minesweeper-classic | Classic Minesweeper interactive game complete after 4 runs. Grid reveal (numbers/mines), flag (right-click/long-press), chord on open numbers, difficulties, timer/best, seeded URL deep-link, Same-board practice button, branded PNG, EN+ES dedicated routes (/minesweeper, /es/buscaminas), mobile 390px aspect-square cells. CWV-safe. Adsterra intact.
- 2026-10-28 | playgrounds | magnetic-field-sandbox | Interactive magnetic field lines sandbox complete after 4 runs. Place/drag N/S poles, live curved field lines (monopole tracing), flowing particles (toggle), directional arrowheads N→S, presets (Dipole, Two North, Quadrupole), URL deep-link, branded PNG, EN+ES routes, mobile 390px with modest line/particle caps. CWV-safe. Adsterra intact.
- 2026-10-28 | retention-loops | retention-loops-streak-constellation | Daily streak constellation visualizer complete after 4 runs. Interactive canvas star placement, check-in streak (localStorage + URL deep-link), milestone colors/progress bar, optional name personalization, branded PNG export, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive flatpack furniture assembly kit. User selects a furniture type (simple shelf, desk, chair), gets discrete part cards (boards, screws, dowels), assembles them in ordered steps with reordering/drag, sees live exploded-to-assembled diagram preview, progress waypoints, part checklist, difficulty (Easy/Normal), URL deep-link for design seed, branded PNG of finished piece with accent + utilihub.app, EN+ES routes. Distinct from recipe-assembly-kit by physical product assembly metaphor.
id: furniture-assembly-kit
path_en: /kits/furniture-assembly-kit
path_es: /es/kits/ensamblaje-muebles
path_seo: n/a
domain: kits
runs_total: 4
runs_remaining: 3
acceptance: User selects furniture type, drags/reorders discrete parts into sequential assembly steps, sees live diagram update and progress, completes assembly to see finished PNG share option.
share: both
next_step_required: yes
notes: Domain roll: FLEX (p_fixed 0.35 rolled False), chose kits (weight 5, variety after recent games/simulators; avoids saturated playgrounds and just-closed games). Candidates: 1. furniture-assembly-kit (value5 share4 demand5 dist4 feas5 perf5 total28; closest: recipe-assembly-kit ordered steps+preview, choice-story-journey waypoints, perhaps packing if any; metaphor: ordered discrete part assembly with visual progress; not particle-canvas; IP: generic flatpack no brand). 2. suitcase-packing-optimizer (value5 share4 demand5 dist5 feas4 perf5 total28; closest: recipe, shopping lists; metaphor: spatial packing with discrete items and steps; not particle). 3. capsule-wardrobe-mixer (value4 share5 demand4 dist4 feas5 perf5 total27; closest: mix-match tools if any; metaphor: combinatorial mix-and-match assembly). Chose furniture for strong search demand (assemble furniture online/guide) + feasibility + distinct physical assembly. RUN1 (2026-10-30): Core shipped — type/difficulty select (shelf/desk/chair, easy/normal), preset parts into ordered steps with drag-reorder, toggle complete, live CSS diagram (opacity by progress), progress waypoints, URL deep-link (?a= + type/diff), branded PNG (accent + steps + utilihub.app), copy-link, reset, EN+ES dedicated routes, mobile 390px flex-wrap. Lazy-loaded. CWV-safe. Adsterra intact. Next: refine diagram to exploded view, part checklist drag, more polish.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
