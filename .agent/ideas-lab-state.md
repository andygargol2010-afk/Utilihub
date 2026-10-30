# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: connect-four-classic
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 4
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
- 2026-10-30 | games | connect-four-classic | Classic Connect Four gravity-drop game complete after 4 runs. 7x6 grid, alternate drops, win highlight (horiz/vert/diag), PvP or vs CPU with Easy/Medium/Hard difficulty (random / heuristic / look-ahead), undo last move(s), new game, URL deep-link (?moves= + ?mode=), branded PNG of board with winner + utilihub.app, EN+ES routes (/games/connect-four-classic, /es/juegos/conecta-cuatro), mobile 390px touch columns. CWV-safe. Adsterra intact.
- 2026-10-30 | kits | furniture-assembly-kit | Interactive flatpack furniture assembly kit complete after 4 runs. User selects type (shelf/desk/chair) + difficulty, discrete part cards into ordered steps with drag-reorder and part move between steps, live exploded-to-assembled CSS diagram (offset by progress), parts checklist with placed counts, progress waypoints + next highlight, completion banner, URL deep-link (?a=), branded PNG (accent + silhouette + steps + utilihub.app), copy-link, reset. EN+ES routes (/kits/furniture-assembly-kit, /es/kits/ensamblaje-muebles), localized strings, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | games | simon-sequence-memory | Classic Simon-style color sequence memory game complete after 4 runs. 4 colored pads with tones (Web Audio sine), growing sequence from 3, user repeats to advance score/level, game-over on mistake with best (localStorage). Sound toggle, difficulty (Easy/Normal/Hard speed), keyboard 1-4, URL deep-link (?seed=) with mulberry32 for reproducible challenge, branded PNG (accent + pads + score/best/level/difficulty + utilihub.app), share-link, New sequence button for fresh challenge, EN+ES via catalog (/games/simon-sequence-memory, /es/juegos/memoria-secuencia-simon), mobile 390px 2x2 pads. CWV-safe. Adsterra intact.
- 2026-10-29 | simulators | logistic-chaos-lab | Interactive logistic map chaos lab complete after 4 runs. Live time series, cobweb plot, bifurcation diagram with period-doubling cascade (P2/P4/P8), Feigenbaum point, stability windows (P3/P5), zoom cascade toggle, attractor type readout, URL deep-link, branded PNG, EN+ES routes (/simulators/logistic-chaos-lab, /es/simuladores/laboratorio-caos-logistico), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
- 2026-10-29 | journeys | choice-story-journey | Interactive narrative choice journey complete after 4 runs. Branching decision cards, labeled progress waypoints, back/undo, current-step highlight, 3 endings with accent colors, URL deep-link path, branded PNG with accent bar, copy-link, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-28 | simulators | sir-epidemic-simulator | Interactive SIR epidemic compartmental model simulator complete after 4 runs. Live S/I/R curves, discrete interventions (lockdown, vaccination), Peak I + day tracking with marker, cumulative total cases, URL deep-link, branded PNG, EN+ES routes, mobile 390px, preset scenario buttons. CWV-safe. Adsterra intact.
- 2026-10-28 | ops | seo-locales-reset | Human-directed reset: deleted thin pt/fr/de shells; SEO_LOCALES_ACTIVE=[]; registry parity bar + min 11 runs policy. Domain restarts from zero (priority still pt → fr → de → …).
- 2026-10-28 | games | minesweeper-classic | Classic Minesweeper interactive game complete after 4 runs. Grid reveal (numbers/mines), flag (right-click/long-press), chord on open numbers, difficulties, timer/best, seeded URL deep-link, Same-board practice button, branded PNG, EN+ES dedicated routes (/minesweeper, /es/buscaminas), mobile 390px aspect-square cells. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive traffic signal intersection lab. User sets green/red phase durations for north-south and east-west directions on a simple 4-way crossing. Cars (discrete agents) spawn from random directions, move on a grid road network, stop or go according to signals, queue up. Live congestion metric (average wait time, queue lengths), throughput counter. Adjust timings to minimize jams. Presets for balanced / rush-hour. URL deep-link for phase values. Branded PNG of the intersection with current queues + utilihub.app. EN+ES routes.
path_en: /simulators/traffic-signal-lab
path_es: /es/simuladores/laboratorio-semaforos
path_seo: n/a
domain: simulators
runs_total: 4
runs_remaining: 3
acceptance: User adjusts NS/EW green times, sees cars move and queue on the grid, congestion number updates live; can share URL or PNG of the scene.
share: both
next_step_required: yes
notes: Rubric (1-5): C1 traffic-signal-lab (chosen): value 4, share 4, search 3 ("traffic light simulation online"), distinct 5, feas 4, perf 4. Closest-3: n-body gravity (physics agents), food-chain ecosystem (agent counts), logistic-chaos (parameter plots). Primary metaphor: discrete phase-controlled agent grid flow. Why not particle-canvas: agents on fixed road cells with rule-based stop/go, not freehand trails/attractors. C2 inventory-eoq-lab: value 4, share 3, search 3, distinct 4, feas 5, perf 5. Closest: none direct; metaphor: stock level time-series with reorder triggers. C3 chemical-reaction-lab: value 3, share 3, search 2, distinct 3, feas 4, perf 4 (rejected low search/distinct). Roll: FLEX (p=0.42 > 0.35), weighted CORE prefer simulators (w=6) for variety after recent games/kits (not playgrounds saturated). IP n/a. Chosen id: traffic-signal-lab. Run 1 done: core 11x11 grid intersection, discrete cars spawn/move/queue on green/red, phase cycle from NS/EW green sliders, live queue counts + throughput, URL ?ns=&ew=, EN+ES via catalog+registry. Next: presets, average wait, branded PNG.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
