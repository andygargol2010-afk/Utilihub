# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: conversion-paths
last_closed_id: tool-matchmaker
p_fixed: 0.35

weights_core:
  kits: 4
  journeys: 5
  games: 6
  simulators: 5
  studio-composition: 3
  playgrounds: 8
  quality-lift: 2

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 3
  share-hooks: 4
  retention-loops: 6
  conversion-paths: 2
  traffic-diagnosis: 1
  adsense-prep: 11
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5; RESET 2026-10-28 empty actives

adsense-prep_runs: 8
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-11-13 | conversion-paths | tool-matchmaker | Tool Matchmaker complete after 4 runs. /find-your-tool + /es/encuentra-tu-herramienta: 3 tappable card steps (goal, time, output) -> ranked top-3 of 26 verified real routes with a 'why this fits' line each, Open deep-links, re-roll, restart, shareable ?g=&t=&o= URL, branded 1080x1080 PNG card, EN+ES, 390px, entry links from home hero EN+ES and EN command-palette empty state. Final polish: focus moves only on user action (no focus steal on load), copy-failure announced via aria-live, Back announced, motion-reduce on buttons. Palette is EN-only so no ES link added. Acceptance met. IP: n/a (own UI linking existing tools).
- 2026-11-13 | retention-loops | daily-challenge-hub | Daily Challenge hub complete after 4 runs. /daily-challenge + /es/reto-diario: UTC date-seeded pick of one of 12 existing games (never repeats yesterday) with a goal, Play deep-link, return-from-game prompt + manual Mark done/Undo, current/best streak, next-challenge countdown, 28-day calendar with per-day game emoji, branded 1080x1080 PNG + shareable URL snapshot, EN+ES, mobile-first 390px, aria-live. Final polish: singular/plural day, focus moves to the return prompt, empty-state copy, motion-reduce. No edits to existing games. Acceptance met. IP: n/a (own UI linking existing games).
- 2026-11-11 | games | sudoku-classic | Interactive classic Sudoku (9x9) complete after 4 runs. Difficulty easy/medium/hard, live row/column/box conflict highlighting, timer, undo, pencil notes + auto notes, hints, keyboard shortcuts, per-difficulty best time (localStorage), branded board PNG, URL deep-link, EN+ES, mobile 390px, a11y labels + aria-live. Final polish: aria-live now announces conflict count, motion-safe win pulse, GameSecondaryButton gained a real `disabled` prop (Undo/Hint/Pause were silently ignoring it), fixed TS errors. Acceptance met. IP: traditional public-domain Sudoku rules; generic UI.
- 2026-11-09 | adsense-prep | adsense-compliance-prep | Preparación de cumplimiento AdSense completa tras 4 runs. /ads.txt con entradas placeholder (google.com pub-0000000000000000), páginas About/Sobre con contenido sustantivo original (propósito, densidad, how-we-build, compliance note), privacy/cookies EN+ES actualizadas con secciones de publicidad de terceros, opt-outs, readiness y menciones a Adsterra intacto. Fechas 9 Nov 2026. EN+ES. Acceptance met (visita /ads.txt, revisa políticas con secciones de ads, About sustantivo). Adsterra intacto. IP: n/a.
- 2026-11-09 | games | hangman-classic | Interactive classic Hangman (Ahorcado) complete after 4 runs. User selects category (animals/countries/food/tech/random) and difficulty (easy 8/normal 6/hard 4 misses), guesses letters via keyboard or on-screen buttons to reveal the hidden word. On misses a live SVG hangman figure progresses (up to 7 parts + eyes). Shows lives remaining, guessed letters, score. Optional hint. Win when word complete or lose when figure full. Keyboard nav (letters + R new + H hint), URL deep-link (?cat=&word=&diff=), branded PNG of final hangman + word + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live for guesses and outcome. Final polish: progressive SVG, score, PNG branding, richer aria-live, keyboard shortcuts, focus-visible. Acceptance met (select category/difficulty, guess letters, see progressive SVG + revealed word, win/lose with stats, share PNG or URL). IP: traditional public-domain hangman letter-guess + penalty figure; generic words/categories; no branded.
- 2026-11-09 | kits | logic-circuit-kit | Interactive logic circuit kit complete after 4 runs. User places gates (AND/OR/NOT/XOR/NAND/NOR), inputs/outputs on 5x5 grid, connects with wires (port selector out/in1/in2), toggles inputs, sees live SVG wires, output indicators (colors), truth table (up to 3 inputs), guided challenges (half-adder, decoder) with completion feedback, wires list with delete, keyboard nav (arrows+Enter/Space), URL deep-link (?g= &w=), branded PNG of grid+wires+stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish completed truncated UI + visual connections. Acceptance met (place gates, connect wires, toggle inputs, see live outputs and truth table, complete challenge, share PNG or URL). IP: original educational boolean logic assembler with generic gates; no branded kits.
- 2026-11-09 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4 easy, 6x4 medium, 6x6 hard), flips two cards to find matching pairs (emoji themes: fruits/animals/numbers/symbols), sees live timer/moves/score/stars/progress bar, optional sound, mismatch shake, keyboard arrows+Enter/Space + R restart, URL deep-link (?size=&theme=&seed=), branded PNG of board + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish: global R key restart + richer aria-live announcements. Acceptance met (select size/theme, match all pairs, see win stats/stars, share PNG or URL). IP: traditional public-domain pair-matching (concentration), generic emoji/icons; no branded assets.
- 2026-11-09 | simulators | predator-prey-simulator | Interactive predator-prey (Lotka-Volterra) population simulator complete after 4 runs. User sets initial prey/predator counts, growth rate of prey, predation rate, predator death rate, conversion efficiency. Discrete generations show live SVG dual-line or phase-space chart of both populations oscillating or stabilizing, phase label (oscillating/stable/extinct), peak values, current gen, averages, approx period. Presets (balanced, prey boom, predator crash), Animate/Stop with speed, Reset, URL deep-link (?params=), branded PNG of chart + stats, CSV export. EN+ES (+PT labels), mobile-first 390px, keyboard controls (Space/R), a11y labels + aria-live. Final polish restored after truncation incident. Acceptance met (set params/preset, animate, see live chart + phase/peaks/stats, share PNG or URL). IP: original educational Lotka-Volterra implementation with generic rates; no branded datasets or software.
- 2026-11-08 | games | connect-four-classic | Interactive classic Connect Four (Cuatro en línea) complete after 4 runs. User selects color, takes turns dropping pieces into a 7x6 grid (gravity), first to get 4 in a row (horiz/vert/diag) wins. Optional simple AI opponent (easy/med/hard with heuristic). Keyboard nav (arrows + Enter, 1-7 keys), win detection + highlight + animated line, undo, timer, URL deep-link for board state (?moves=), branded PNG of final board with winning line, EN+ES routes, mobile-first 390px with large touch cells (h-10/w-10 sm:h-12), a11y labels + aria-live for moves and win. Final polish: timer display, hard AI, drop animation, win pulse, dim non-win pieces. Acceptance met (select side, drop pieces, see gravity + win/lose detection with highlight, share PNG or URL). IP: traditional public-domain Connect Four gravity drops and 4-in-a-row; generic UI/naming; no Hasbro or branded assets.
- 2026-11-07 | kits | molecule-builder-kit | Interactive molecule builder kit complete after 4 runs. User places atoms (C, H, O, N) on 5x5 grid, connects with single/double/triple bonds using visual SVG lines, sees live molecular formula + molar mass, completes guided challenges (water H2O, CO2, methane CH4), free mode, atom legend with masses, keyboard navigation (arrows + Enter/Space), URL deep-link (?g= &b=), branded PNG of structure + formula, EN+ES routes, mobile-first 390px. Final polish: color-coded atoms (C gray, H light, O red, N blue), tighter mobile gaps/cell sizes, improved PNG diagram with colored circles, enhanced a11y labels. Acceptance met (place atoms, connect bonds, see live formula/structure, complete challenge, share PNG or URL). IP: original educational chemistry assembler with generic atoms; no branded kits or software.
```

---

## ACTIVE PROJECT

```
status: active
idea: Cellular Automaton Lab — a discrete rule-grid simulator. Tab 1 Life-like 2D (Conway B3/S23 default, editable Birth/Survive checkboxes: HighLife, Seeds, Day&Night, Maze), click/tap-to-toggle cells on a fixed wrapping grid, pattern stamps (glider, blinker, pulsar, R-pentomino, gosper-style gun), step/play/speed, generation + population readout with a live population sparkline. Tab 2 elementary 1D (Wolfram rules 0-255, rule-number input + 8-cell clickable rule table, grows row by row; presets 30/90/110/184). Shareable via URL (?mode=&rule=&b=&s=&g=) and branded 1080x1080 PNG.
id: cellular-automaton-lab
path_en: /simulators/cellular-automaton-lab
path_es: /es/simuladores/laboratorio-automatas-celulares
path_seo: n/a
domain: simulators
runs_total: 4
runs_remaining: 2
acceptance: user picks a pattern or taps cells (or enters a Wolfram rule number / edits the B/S rule), presses Play, watches generations evolve with live population/generation readouts, and shares the result as PNG or URL.
share: both
next_step_required: yes
notes: RUN1 DONE 2026-11-14 (2D Life core: CellularAutomatonLab.tsx 48x48 wrapping canvas, B/S checkbox editor + 5 rule presets, tap/drag toggle + 5 stamps, play/pause/step/speed/random/clear, gen+population readout, keys Space/S/R/C, lazy in simulators/registry.tsx, catalog.part2 entry EN+ES; validate:catalog+registry OK; smoke EN/ES 390px OK). RUN2 DONE 2026-11-14 (new CellularAutomatonElementary.tsx: 81x81 scrolling 1D canvas, rule number input 0-255, 8-cell clickable rule table, presets 30/90/110/184, single/random seed, play/step/speed/restart, keys Space/S/R; 2D Life gained tab switcher + population sparkline SVG; EN+ES; validate:catalog+routing OK; smoke EN/ES 390px OK, no console errors). RUN3 next: URL deep-link (?mode=&rule=&b=&s=&g=) + branded 1080x1080 PNG + a11y/aria-live polish + 390px tuning. RUN4: polish + CWV check. IDEATE 2026-11-14. Roll: FLEX (r=0.69 >= p_fixed 0.35), weighted pick over core+growth -> simulators. Candidates (value/share/demand/distinct/feasible/perf = total): (A) cellular-automaton-lab 4/4/5/4/5/4 = 26 CHOSEN; (B) queue-checkout-simulator M/M/c wait-time 4/3/2/5/4/5 = 23; (C) monte-carlo-retirement-fan-chart 5/3/4/3/4/5 = 24 (rejected: overlaps catalog financial calculators, distinct=3 borderline). Closest-3 by mechanic for A: ReactionDiffusionLab (grid update rule, but continuous PDE + paint), BinPackingSim (discrete grid cells, but packing/optimizer), GaltonBoardSim (stochastic stepping with histogram readout). Primary metaphor: rule-table editor -> discrete generation stepper on a toggle-cell grid (NOT freehand/particle/attractor canvas; no trails, no particles). IP: Conway's Game of Life and Wolfram elementary rules are public mathematical rules (no branded art/name; neutral label 'Life-like rules'); ship generic UI only. Plan: run1 = 2D Life core (grid, toggle, step/play/speed, B/S editor, stamps, population readout) in lazy SimShell + registry wiring EN/ES; run2 = elementary 1D tab + rule table + sparkline (working useful core by run 2); run3 = URL deep-link + branded PNG + keyboard (Space/S/R/C) + a11y aria-live + 390px tuning; run4 = polish (one polish-only run max), CWV check (fixed canvas aspect, cap grid 64x64 on mobile, requestAnimationFrame throttled). Wire via simulators/registry.tsx smallest-file rules; never touch registry.tsx wholesale; validate:catalog must pass.
adsense-prep_runs: 8
```

<!-- end:ideas-lab-state.md -->
