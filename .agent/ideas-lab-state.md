# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: memory-match-classic
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
- 2026-10-31 | games | memory-match-classic | Interactive classic memory match pairs card game complete after 4 runs. Grid of face-down cards with matching pairs (emojis/symbols), flip two, match stay + score, mismatch flip back, moves + optional timer, sizes 4x3/4x4/6x4, win celebration, URL deep-link (?size=&seed=) mulberry32, branded PNG (board + stats + utilihub.app), copy-link, best time/score localStorage, EN+ES routes (/games/memory-match-classic, /es/juegos/memoria-pares), mobile 390px CSS grid. CWV-safe. Adsterra intact.
- 2026-10-31 | share-hooks | social-hook-composer | Interactive social media hook template composer complete after 4 runs. 9 patterns (question/story/list/myth/howto/curiosity-gap/statistic/contrarian/before-after), fill blanks, live preview + hashtags + char count with platform limits (X/Twitter 280, LinkedIn 1300, Instagram 2200), copy text, "Post to X" intent button, branded PNG (accent bar + pattern header + platform label + text wrap + utilihub.app), URL deep-link (?p=&blanks=&plat=), EN+ES routes (/growth/social-hook-composer, /es/crecimiento/compositor-ganchos-sociales), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-30 | games | sudoku-classic | Classic Sudoku number-placement puzzle complete after 4 runs. 9x9 grid with uniqueness, difficulties (easy/medium/hard), pencil marks with toggle + auto-clear related on place, peer (row/col/box) + same-number highlights, live conflict highlights, win detection + celebration, undo stack, keyboard (1-9/0/arrows/WASD), 3 hints, URL deep-link (?seed=&diff=), branded PNG (board + notes + progress + utilihub.app), copy-link, EN+ES via catalog+registry (/games/sudoku-classic, /es/juegos/sudoku-clasico), mobile 390px touch cells. CWV-safe. Adsterra intact.
- 2026-10-30 | simulators | traffic-signal-lab | Interactive traffic signal intersection lab complete after 4 runs. 4-way grid, discrete cars spawn/move/queue on green/red phases, NS/EW green sliders + presets (balanced/rush), live queues/throughput/avg wait/peak queue, phase remaining, URL deep-link (?ns=&ew=), branded PNG (queues + peak + utilihub.app), copy-link, EN+ES via catalog+registry (/simulators/traffic-signal-lab, /es/simuladores/laboratorio-semaforos), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-30 | games | connect-four-classic | Classic Connect Four gravity-drop game complete after 4 runs. 7x6 grid, alternate drops, win highlight (horiz/vert/diag), PvP or vs CPU with Easy/Medium/Hard difficulty (random / heuristic / look-ahead), undo last move(s), new game, URL deep-link (?moves= + ?mode=), branded PNG of board with winner + utilihub.app, EN+ES routes (/games/connect-four-classic, /es/juegos/conecta-cuatro), mobile 390px touch columns. CWV-safe. Adsterra intact.
- 2026-10-30 | kits | furniture-assembly-kit | Interactive flatpack furniture assembly kit complete after 4 runs. User selects type (shelf/desk/chair) + difficulty, discrete part cards into ordered steps with drag-reorder and part move between steps, live exploded-to-assembled CSS diagram (offset by progress), parts checklist with placed counts, progress waypoints + next highlight, completion banner, URL deep-link (?a=), branded PNG (accent + silhouette + steps + utilihub.app), copy-link, reset. EN+ES routes (/kits/furniture-assembly-kit, /es/kits/ensamblaje-muebles), localized strings, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | games | simon-sequence-memory | Classic Simon-style color sequence memory game complete after 4 runs. 4 colored pads with tones (Web Audio sine), growing sequence from 3, user repeats to advance score/level, game-over on mistake with best (localStorage). Sound toggle, difficulty (Easy/Normal/Hard speed), keyboard 1-4, URL deep-link (?seed=) with mulberry32 for reproducible challenge, branded PNG (accent + pads + score/best/level/difficulty + utilihub.app), share-link, New sequence button for fresh challenge, EN+ES via catalog (/games/simon-sequence-memory, /es/juegos/memoria-secuencia-simon), mobile 390px 2x2 pads. CWV-safe. Adsterra intact.
- 2026-10-29 | simulators | logistic-chaos-lab | Interactive logistic map chaos lab complete after 4 runs. Live time series, cobweb plot, bifurcation diagram with period-doubling cascade (P2/P4/P8), Feigenbaum point, stability windows (P3/P5), zoom cascade toggle, attractor type readout, URL deep-link, branded PNG, EN+ES routes (/simulators/logistic-chaos-lab, /es/simuladores/laboratorio-caos-logistico), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Classic Minesweeper style grid reveal game. Selectable difficulties (easy 9x9/10 mines, medium 16x16/40, hard 16x30/99), left-click reveal with flood-fill for zeros, right-click or long-press flag, live mine counter and timer, win on all safe cells revealed or correct flags, lose on mine hit with reveal all, first-click safe guarantee, URL deep-link (?diff=&seed=) for reproducible board via mulberry32, branded PNG of final board + time/mines + utilihub.app, copy-link, EN+ES routes and strings. Mobile 390px touch-friendly cells with chord support. CWV-safe.
id: minesweeper-classic
path_en: /games/minesweeper-classic
path_es: /es/juegos/buscaminas-clasico
domain: games
runs_total: 4
runs_remaining: 3
acceptance: User selects difficulty, clicks cells to reveal safe numbers or flood zeros, flags suspects, sees remaining mines and timer, wins when all non-mines cleared or loses on mine with full reveal. Shareable via ?diff=&seed=. Download branded PNG.
share: both
next_step_required: yes
notes: Rubric (1-5): Cand1 Minesweeper Classic (games, classic reveal): value=5 fun/search, share=4 screenshot board, search=5 "minesweeper online"/"buscaminas", distinct=4 (closest: sudoku grid-logic, memory-match flip-pairs, hangman guess-letters), feas=5, perf=5 (CSS grid cells, no canvas). Total 28. Metaphor: turn-based grid reveal with flood-fill and flag logic. Why not particle-canvas: discrete cell state rules with win/lose condition, no freehand trails/attractors. IP: traditional minesweeper (generic rules and UI; public-domain mechanics; no branded assets or commercial IP).
Cand2 Packing Planner Kit (kits): value=4, share=4 PNG layout, search=3 "bin packing planner", distinct=4 (closest: furniture-assembly parts, recipe steps, traffic queues), feas=4, perf=5. Metaphor: spatial packing constraint solver. Why not: form+diagram packing, not canvas particles. Total 24.
Cand3 Plant Care Journey (journeys): value=3, share=3, search=2, distinct=3 (closest: choice-story, recipe kit, furniture), feas=4, perf=5. Metaphor: ordered stages with progress waypoints. Total 20. Rejected low value/search.
Chosen: minesweeper-classic (highest total, strong search demand, classic IP-safe, distinct from recent grid puzzles by reveal/flood-fill mechanic). Roll: CORE games (weight 5; balance after recent GROWTH and multiple games but high demand classic not yet shipped; variety avoids playground particle cluster and recent memory/sudoku/connect). No quality-lift.
Run 1 (2026-10-31): Core playable shipped. New MinesweeperClassicGame.tsx with standard sizes (easy 9x9/10, medium 16x16/40, hard 16x30/99), flood-fill zeros, flags (right/long-press), chord on open numbers, live mines/timer, win on all safe open / lose reveal all, first-click safe, URL ?diff=&seed= mulberry32, branded PNG (board+stats+utilihub.app), best time localStorage, EN+ES via catalog+registry (/games/minesweeper-classic, /es/juegos/buscaminas-clasico). Mobile 390px CSS grid + overflow-x for hard. Distinct from existing Minesweeper (non-standard sizes). CWV-safe. Adsterra intact.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
