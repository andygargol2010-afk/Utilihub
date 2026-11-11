# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: adsense-prep
last_closed_id: adsense-compliance-prep
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
- 2026-11-09 | adsense-prep | adsense-compliance-prep | Preparación de cumplimiento AdSense completa tras 4 runs. /ads.txt con entradas placeholder (google.com pub-0000000000000000), páginas About/Sobre con contenido sustantivo original (propósito, densidad, how-we-build, compliance note), privacy/cookies EN+ES actualizadas con secciones de publicidad de terceros, opt-outs, readiness y menciones a Adsterra intacto. Fechas 9 Nov 2026. EN+ES. Acceptance met (visita /ads.txt, revisa políticas con secciones de ads, About sustantivo). Adsterra intacto. IP: n/a.
- 2026-11-09 | games | hangman-classic | Interactive classic Hangman (Ahorcado) complete after 4 runs. User selects category (animals/countries/food/tech/random) and difficulty (easy 8/normal 6/hard 4 misses), guesses letters via keyboard or on-screen buttons to reveal the hidden word. On misses a live SVG hangman figure progresses (up to 7 parts + eyes). Shows lives remaining, guessed letters, score. Optional hint. Win when word complete or lose when figure full. Keyboard nav (letters + R new + H hint), URL deep-link (?cat=&word=&diff=), branded PNG of final hangman + word + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live for guesses and outcome. Final polish: progressive SVG, score, PNG branding, richer aria-live, keyboard shortcuts, focus-visible. Acceptance met (select category/difficulty, guess letters, see progressive SVG + revealed word, win/lose with stats, share PNG or URL). IP: traditional public-domain hangman letter-guess + penalty figure; generic words/categories; no branded.
- 2026-11-09 | kits | logic-circuit-kit | Interactive logic circuit kit complete after 4 runs. User places gates (AND/OR/NOT/XOR/NAND/NOR), inputs/outputs on 5x5 grid, connects with wires (port selector out/in1/in2), toggles inputs, sees live SVG wires, output indicators (colors), truth table (up to 3 inputs), guided challenges (half-adder, decoder) with completion feedback, wires list with delete, keyboard nav (arrows+Enter/Space), URL deep-link (?g= &w=), branded PNG of grid+wires+stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish completed truncated UI + visual connections. Acceptance met (place gates, connect wires, toggle inputs, see live outputs and truth table, complete challenge, share PNG or URL). IP: original educational boolean logic assembler with generic gates; no branded kits.
- 2026-11-09 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4 easy, 6x4 medium, 6x6 hard), flips two cards to find matching pairs (emoji themes: fruits/animals/numbers/symbols), sees live timer/moves/score/stars/progress bar, optional sound, mismatch shake, keyboard arrows+Enter/Space + R restart, URL deep-link (?size=&theme=&seed=), branded PNG of board + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish: global R key restart + richer aria-live announcements. Acceptance met (select size/theme, match all pairs, see win stats/stars, share PNG or URL). IP: traditional public-domain pair-matching (concentration), generic emoji/icons; no branded assets.
- 2026-11-09 | simulators | predator-prey-simulator | Interactive predator-prey (Lotka-Volterra) population simulator complete after 4 runs. User sets initial prey/predator counts, growth rate of prey, predation rate, predator death rate, conversion efficiency. Discrete generations show live SVG dual-line or phase-space chart of both populations oscillating or stabilizing, phase label (oscillating/stable/extinct), peak values, current gen, averages, approx period. Presets (balanced, prey boom, predator crash), Animate/Stop with speed, Reset, URL deep-link (?params=), branded PNG of chart + stats, CSV export. EN+ES (+PT labels), mobile-first 390px, keyboard controls (Space/R), a11y labels + aria-live. Final polish restored after truncation incident. Acceptance met (set params/preset, animate, see live chart + phase/peaks/stats, share PNG or URL). IP: original educational Lotka-Volterra implementation with generic rates; no branded datasets or software.
- 2026-11-08 | games | connect-four-classic | Interactive classic Connect Four (Cuatro en línea) complete after 4 runs. User selects color, takes turns dropping pieces into a 7x6 grid (gravity), first to get 4 in a row (horiz/vert/diag) wins. Optional simple AI opponent (easy/med/hard with heuristic). Keyboard nav (arrows + Enter, 1-7 keys), win detection + highlight + animated line, undo, timer, URL deep-link for board state (?moves=), branded PNG of final board with winning line, EN+ES routes, mobile-first 390px with large touch cells (h-10/w-10 sm:h-12), a11y labels + aria-live for moves and win. Final polish: timer display, hard AI, drop animation, win pulse, dim non-win pieces. Acceptance met (select side, drop pieces, see gravity + win/lose detection with highlight, share PNG or URL). IP: traditional public-domain Connect Four gravity drops and 4-in-a-row; generic UI/naming; no Hasbro or branded assets.
- 2026-11-07 | kits | molecule-builder-kit | Interactive molecule builder kit complete after 4 runs. User places atoms (C, H, O, N) on 5x5 grid, connects with single/double/triple bonds using visual SVG lines, sees live molecular formula + molar mass, completes guided challenges (water H2O, CO2, methane CH4), free mode, atom legend with masses, keyboard navigation (arrows + Enter/Space), URL deep-link (?g= &b=), branded PNG of structure + formula, EN+ES routes, mobile-first 390px. Final polish: color-coded atoms (C gray, H light, O red, N blue), tighter mobile gaps/cell sizes, improved PNG diagram with colored circles, enhanced a11y labels. Acceptance met (place atoms, connect bonds, see live formula/structure, complete challenge, share PNG or URL). IP: original educational chemistry assembler with generic atoms; no branded kits or software.
- 2026-11-07 | games | minesweeper-classic | Interactive classic Minesweeper (Buscaminas) complete after 4 runs. User selects difficulty (Easy 9x9/10, Medium 16x16/40, Hard 16x30/99), reveals cells with cascade on empty, flags/questions, timer + mines left, win by all safe open or lose with full expose. Keyboard nav (arrows + Enter/Space/F), seeded URL deep-link, branded PNG, EN+ES, mobile-first 390px with 22px cells, legend, a11y grid roles + aria-live. Acceptance met (select, reveal/flag, win/lose feedback, share PNG/URL). IP: traditional public-domain Minesweeper rules (numbers, cascade, flags); generic UI/naming; no Microsoft or branded assets.
- 2026-11-06 | studio-composition | timeline-event-composer | Interactive timeline event composer complete after 4 runs. User adds 5-10 event cards (title, short description, optional date/tag), reorders by buttons, sees live vertical SVG timeline with connecting lines, generates branded summary card PNG with timeline visual + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y, max limit, Reset, Enter to add, aria-live. Acceptance met (add/reorder/live timeline/share PNG+URL). IP: original educational timeline assembler with generic events; no branded frameworks.
- 2026-11-06 | journeys | goal-progress-journey | Interactive multi-stage personal goal progress journey. User chooses a goal category (learn a skill, build a habit, save for a goal, improve fitness), sets parameters, then advances through 5-7 ordered stages with checklists, binary/multi choices that branch tips and outcomes, sees live progress bar and percentage, related tool recommendations, and on completion a branded summary card with stats and next steps. Generates canvas PNG of the journey card + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y. Acceptance met when user selects category, completes stages, sees final card, shares PNG or URL. IP: original educational goal-progress tracker with generic stages; no branded frameworks.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive classic Sudoku player. User selects difficulty (easy/medium/hard), receives a 9x9 grid with pre-filled numbers, fills remaining cells via keyboard or on-screen number pad. Live validation highlights conflicts (row/column/box), timer runs, undo available, win condition when grid complete and valid. Share branded PNG of solved board + stats or URL deep-link (?diff=&board=). EN+ES routes, mobile-first 390px, keyboard navigation, a11y labels + aria-live for conflicts and completion.

id: sudoku-classic
path_en: /games/sudoku-classic
path_es: /es/juegos/sudoku-clasico
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 2
acceptance: Usuario selecciona dificultad, rellena el grid 9x9, ve validación live de conflictos y gana al completar correctamente, comparte PNG o URL.
share: both
next_step_required: yes
notes: Rubric scores (1-5): Cand1 (sudoku-classic): value=5, share=4, search=5, distinct=4, feas=4, perf=4, total=26. Cand2 (original word-association challenge game): value=4, share=3, search=3, distinct=5, feas=4, perf=5, total=24. Cand3 (interactive bin-packing kit): value=4, share=3, search=3, distinct=5, feas=3, perf=4, total=22. Chosen: Cand1. Closest-3: minesweeper-classic (grid reveal), hangman-classic (word), memory-match (pairs). Primary metaphor: constraint-solving grid puzzle. Why not particle-canvas: discrete grid with strict rules and win condition, no freehand or particles. IP: traditional public-domain Sudoku rules (9x9 unique rows/cols/boxes); generic UI/naming; no branded puzzles. Roll: FLEX (rand=0.62>0.35), weighted pick games from core. adsense-prep_runs: 8. Run 1/4: verified existing full implementation matches acceptance (difficulty, grid, live conflicts, timer, undo, hints, notes, PNG, URL, EN+ES, mobile, a11y); added focus-visible ring on cells for better keyboard a11y. Core playable since before this run. Run 2/4: added keyboard shortcuts (U/Ctrl+Z undo, P/N pencil toggle, H hint) and per-difficulty best time persisted in localStorage (try/catch), shown in status line; EN+ES help text updated.
adsense-prep_runs: 8
```

<!-- end:ideas-lab-state.md -->