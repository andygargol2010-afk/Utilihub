# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: simulators
last_closed_id: traffic-signal-lab
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 5
  simulators: 4
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
- 2026-10-30 | simulators | traffic-signal-lab | Interactive traffic signal intersection lab complete after 4 runs. 4-way grid, discrete cars spawn/move/queue on green/red phases, NS/EW green sliders + presets (balanced/rush), live queues/throughput/avg wait/peak queue, phase remaining, URL deep-link (?ns=&ew=), branded PNG (queues + peak + utilihub.app), copy-link, EN+ES via catalog+registry (/simulators/traffic-signal-lab, /es/simuladores/laboratorio-semaforos), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-30 | games | connect-four-classic | Classic Connect Four gravity-drop game complete after 4 runs. 7x6 grid, alternate drops, win highlight (horiz/vert/diag), PvP or vs CPU with Easy/Medium/Hard difficulty (random / heuristic / look-ahead), undo last move(s), new game, URL deep-link (?moves= + ?mode=), branded PNG of board with winner + utilihub.app, EN+ES routes (/games/connect-four-classic, /es/juegos/conecta-cuatro), mobile 390px touch columns. CWV-safe. Adsterra intact.
- 2026-10-30 | kits | furniture-assembly-kit | Interactive flatpack furniture assembly kit complete after 4 runs. User selects type (shelf/desk/chair) + difficulty, discrete part cards into ordered steps with drag-reorder and part move between steps, live exploded-to-assembled CSS diagram (offset by progress), parts checklist with placed counts, progress waypoints + next highlight, completion banner, URL deep-link (?a=), branded PNG (accent + silhouette + steps + utilihub.app), copy-link, reset. EN+ES routes (/kits/furniture-assembly-kit, /es/kits/ensamblaje-muebles), localized strings, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | games | simon-sequence-memory | Classic Simon-style color sequence memory game complete after 4 runs. 4 colored pads with tones (Web Audio sine), growing sequence from 3, user repeats to advance score/level, game-over on mistake with best (localStorage). Sound toggle, difficulty (Easy/Normal/Hard speed), keyboard 1-4, URL deep-link (?seed=) with mulberry32 for reproducible challenge, branded PNG (accent + pads + score/best/level/difficulty + utilihub.app), share-link, New sequence button for fresh challenge, EN+ES via catalog (/games/simon-sequence-memory, /es/juegos/memoria-secuencia-simon), mobile 390px 2x2 pads. CWV-safe. Adsterra intact.
- 2026-10-29 | simulators | logistic-chaos-lab | Interactive logistic map chaos lab complete after 4 runs. Live time series, cobweb plot, bifurcation diagram with period-doubling cascade (P2/P4/P8), Feigenbaum point, stability windows (P3/P5), zoom cascade toggle, attractor type readout, URL deep-link, branded PNG, EN+ES routes (/simulators/logistic-chaos-lab, /es/simuladores/laboratorio-caos-logistico), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
- 2026-10-29 | journeys | choice-story-journey | Interactive narrative choice journey complete after 4 runs. Branching decision cards, labeled progress waypoints, back/undo, current-step highlight, 3 endings with accent colors, URL deep-link path, branded PNG with accent bar, copy-link, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-28 | simulators | sir-epidemic-simulator | Interactive SIR epidemic compartmental model simulator complete after 4 runs. Live S/I/R curves, discrete interventions (lockdown, vaccination), Peak I + day tracking with marker, cumulative total cases, URL deep-link, branded PNG, EN+ES routes, mobile 390px, preset scenario buttons. CWV-safe. Adsterra intact.
- 2026-10-28 | ops | seo-locales-reset | Human-directed reset: deleted thin pt/fr/de shells; SEO_LOCALES_ACTIVE=[]; registry parity bar + min 11 runs policy. Domain restarts from zero (priority still pt → fr → de → …).
```

---

## ACTIVE PROJECT

```
status: active
idea: Classic Sudoku number-placement puzzle. 9x9 grid with row/column/3x3 box uniqueness. User fills cells (given clues remain fixed), pencil marks optional, difficulty levels (easy/medium/hard with more clues removed), live validity highlights on conflict, win detection when board is complete and valid, new game, URL deep-link for seed/difficulty, branded PNG of board + progress + utilihub.app. EN+ES routes and strings. Mobile 390px touch-friendly cells.
id: sudoku-classic
path_en: /games/sudoku-classic
path_es: /es/juegos/sudoku-clasico
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 1
acceptance: User selects difficulty, places numbers on the 9x9 grid respecting uniqueness, and sees a win state with celebration when the board is fully and validly completed.
share: both
next_step_required: yes
notes: Rubric (1-5): Sudoku (value5 share3 demand5 distinct5 feas4 perf5 total27); MemoryMatch (value4 share4 demand4 distinct4 feas5 perf5 total26); Battleship (value4 share3 demand4 distinct4 feas4 perf5 total24). Closest-3 for Sudoku: minesweeper (grid logic), hangman (guessing), connect-four (grid strategy). Primary metaphor: constraint-satisfaction number grid with uniqueness rules and progressive fill. Why not particle-canvas: pure DOM/CSS grid puzzle with discrete cell inputs and rule validation, no freehand drawing or attractors. IP check: traditional public-domain Sudoku rules (generic number grid, no branded assets or commercial IP). Chosen: sudoku-classic. Roll: CORE games (weight 5; variety preferred over saturated playgrounds; last closed simulators). Quality core by run 2: basic playable 9x9 with one difficulty + win check. Run 1 done: seeded generator (mulberry32), difficulties, conflict highlights, win detection, URL ?seed=&diff=, branded PNG, EN+ES via catalog+registry, mobile grid. Pencil marks deferred to later runs. Run 2: pencil mode toggle, per-cell candidate marks (toggle on empty cells), notes cleared on new game and clear, shown in grid + PNG export, improved win check (compute conflicts post-set). Run 3: undo stack for number placements (history of grid+notes), keyboard support (1-9/0/Backspace + arrows/WASD to move selection), 3 limited hints that reveal correct number for selected or first empty cell and decrement counter. EN+ES button labels. Mobile 390px unchanged.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
