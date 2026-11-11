# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: sudoku-classic
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
- 2026-11-11 | games | sudoku-classic | Interactive classic Sudoku (9x9) complete after 4 runs. Difficulty easy/medium/hard, live row/column/box conflict highlighting, timer, undo, pencil notes + auto notes, hints, keyboard shortcuts, per-difficulty best time (localStorage), branded board PNG, URL deep-link, EN+ES, mobile 390px, a11y labels + aria-live. Final polish: aria-live now announces conflict count, motion-safe win pulse, GameSecondaryButton gained a real `disabled` prop (Undo/Hint/Pause were silently ignoring it), fixed TS errors. Acceptance met. IP: traditional public-domain Sudoku rules; generic UI.
- 2026-11-09 | adsense-prep | adsense-compliance-prep | Preparación de cumplimiento AdSense completa tras 4 runs. /ads.txt con entradas placeholder (google.com pub-0000000000000000), páginas About/Sobre con contenido sustantivo original (propósito, densidad, how-we-build, compliance note), privacy/cookies EN+ES actualizadas con secciones de publicidad de terceros, opt-outs, readiness y menciones a Adsterra intacto. Fechas 9 Nov 2026. EN+ES. Acceptance met (visita /ads.txt, revisa políticas con secciones de ads, About sustantivo). Adsterra intacto. IP: n/a.
- 2026-11-09 | games | hangman-classic | Interactive classic Hangman (Ahorcado) complete after 4 runs. User selects category (animals/countries/food/tech/random) and difficulty (easy 8/normal 6/hard 4 misses), guesses letters via keyboard or on-screen buttons to reveal the hidden word. On misses a live SVG hangman figure progresses (up to 7 parts + eyes). Shows lives remaining, guessed letters, score. Optional hint. Win when word complete or lose when figure full. Keyboard nav (letters + R new + H hint), URL deep-link (?cat=&word=&diff=), branded PNG of final hangman + word + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live for guesses and outcome. Final polish: progressive SVG, score, PNG branding, richer aria-live, keyboard shortcuts, focus-visible. Acceptance met (select category/difficulty, guess letters, see progressive SVG + revealed word, win/lose with stats, share PNG or URL). IP: traditional public-domain hangman letter-guess + penalty figure; generic words/categories; no branded.
- 2026-11-09 | kits | logic-circuit-kit | Interactive logic circuit kit complete after 4 runs. User places gates (AND/OR/NOT/XOR/NAND/NOR), inputs/outputs on 5x5 grid, connects with wires (port selector out/in1/in2), toggles inputs, sees live SVG wires, output indicators (colors), truth table (up to 3 inputs), guided challenges (half-adder, decoder) with completion feedback, wires list with delete, keyboard nav (arrows+Enter/Space), URL deep-link (?g= &w=), branded PNG of grid+wires+stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish completed truncated UI + visual connections. Acceptance met (place gates, connect wires, toggle inputs, see live outputs and truth table, complete challenge, share PNG or URL). IP: original educational boolean logic assembler with generic gates; no branded kits.
- 2026-11-09 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4 easy, 6x4 medium, 6x6 hard), flips two cards to find matching pairs (emoji themes: fruits/animals/numbers/symbols), sees live timer/moves/score/stars/progress bar, optional sound, mismatch shake, keyboard arrows+Enter/Space + R restart, URL deep-link (?size=&theme=&seed=), branded PNG of board + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish: global R key restart + richer aria-live announcements. Acceptance met (select size/theme, match all pairs, see win stats/stars, share PNG or URL). IP: traditional public-domain pair-matching (concentration), generic emoji/icons; no branded assets.
- 2026-11-09 | simulators | predator-prey-simulator | Interactive predator-prey (Lotka-Volterra) population simulator complete after 4 runs. User sets initial prey/predator counts, growth rate of prey, predation rate, predator death rate, conversion efficiency. Discrete generations show live SVG dual-line or phase-space chart of both populations oscillating or stabilizing, phase label (oscillating/stable/extinct), peak values, current gen, averages, approx period. Presets (balanced, prey boom, predator crash), Animate/Stop with speed, Reset, URL deep-link (?params=), branded PNG of chart + stats, CSV export. EN+ES (+PT labels), mobile-first 390px, keyboard controls (Space/R), a11y labels + aria-live. Final polish restored after truncation incident. Acceptance met (set params/preset, animate, see live chart + phase/peaks/stats, share PNG or URL). IP: original educational Lotka-Volterra implementation with generic rates; no branded datasets or software.
- 2026-11-08 | games | connect-four-classic | Interactive classic Connect Four (Cuatro en línea) complete after 4 runs. User selects color, takes turns dropping pieces into a 7x6 grid (gravity), first to get 4 in a row (horiz/vert/diag) wins. Optional simple AI opponent (easy/med/hard with heuristic). Keyboard nav (arrows + Enter, 1-7 keys), win detection + highlight + animated line, undo, timer, URL deep-link for board state (?moves=), branded PNG of final board with winning line, EN+ES routes, mobile-first 390px with large touch cells (h-10/w-10 sm:h-12), a11y labels + aria-live for moves and win. Final polish: timer display, hard AI, drop animation, win pulse, dim non-win pieces. Acceptance met (select side, drop pieces, see gravity + win/lose detection with highlight, share PNG or URL). IP: traditional public-domain Connect Four gravity drops and 4-in-a-row; generic UI/naming; no Hasbro or branded assets.
- 2026-11-07 | kits | molecule-builder-kit | Interactive molecule builder kit complete after 4 runs. User places atoms (C, H, O, N) on 5x5 grid, connects with single/double/triple bonds using visual SVG lines, sees live molecular formula + molar mass, completes guided challenges (water H2O, CO2, methane CH4), free mode, atom legend with masses, keyboard navigation (arrows + Enter/Space), URL deep-link (?g= &b=), branded PNG of structure + formula, EN+ES routes, mobile-first 390px. Final polish: color-coded atoms (C gray, H light, O red, N blue), tighter mobile gaps/cell sizes, improved PNG diagram with colored circles, enhanced a11y labels. Acceptance met (place atoms, connect bonds, see live formula/structure, complete challenge, share PNG or URL). IP: original educational chemistry assembler with generic atoms; no branded kits or software.
- 2026-11-07 | games | minesweeper-classic | Interactive classic Minesweeper (Buscaminas) complete after 4 runs. User selects difficulty (Easy 9x9/10, Medium 16x16/40, Hard 16x30/99), reveals cells with cascade on empty, flags/questions, timer + mines left, win by all safe open or lose with full expose. Keyboard nav (arrows + Enter/Space/F), seeded URL deep-link, branded PNG, EN+ES, mobile-first 390px with 22px cells, legend, a11y grid roles + aria-live. Acceptance met (select, reveal/flag, win/lose feedback, share PNG/URL). IP: traditional public-domain Minesweeper rules (numbers, cascade, flags); generic UI/naming; no Microsoft or branded assets.
- 2026-11-06 | studio-composition | timeline-event-composer | Interactive timeline event composer complete after 4 runs. User adds 5-10 event cards (title, short description, optional date/tag), reorders by buttons, sees live vertical SVG timeline with connecting lines, generates branded summary card PNG with timeline visual + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y, max limit, Reset, Enter to add, aria-live. Acceptance met (add/reorder/live timeline/share PNG+URL). IP: original educational timeline assembler with generic events; no branded frameworks.
```

---

## ACTIVE PROJECT

```
status: active
idea: Daily Challenge hub (retention loop). One page where each UTC day deterministically picks ONE existing UtiliHub game (date-seeded rotation across the games catalog) plus a goal ("win Minesweeper Easy", "solve Sudoku Easy"). Games report completion to the hub through a tiny localStorage helper; the hub shows today's challenge card with a Play button (deep-link into the game), a 28-day calendar heat strip, current/best streak (reuses the daily-streak approach), and a next-challenge countdown. Share branded PNG of streak + calendar, or URL. EN+ES routes, mobile-first 390px, keyboard + a11y labels + aria-live on completion.

id: daily-challenge-hub
path_en: /daily-challenge
path_es: /es/reto-diario
path_seo: n/a
domain: retention-loops
runs_total: 4
runs_remaining: 2
acceptance: User opens the hub, sees today's game challenge, plays it via the deep-link, returns and sees the day marked done, streak incremented and calendar updated, shares PNG or URL.
share: both
next_step_required: yes
notes: Roll: rand=0.318<0.35 -> FIXED growth urn; second rand 0.573*33=18.9 -> retention-loops (cum: tb3, sm6, gs9, sh13, rl19). Rubric (value/share/search/distinct/feas/perf): Cand1 daily-challenge-hub 5/4/3/4/4/5=25. Cand2 progress-badges-wall (achievements across tools) 4/4/2/3/4/5=22. Cand3 weekly-goal-checkin journey 4/3/2/3/4/5=21. Chosen Cand1. Closest-3 by mechanic: ReturnStreakBoard (streak counter), StreakConstellation/daily-progress-constellation (daily-activity visual), ProgressPassport (cross-surface progress). Primary metaphor: daily rotating challenge + completion calendar (habit tracker). Why not particle-canvas: cards + SVG/CSS calendar grid, no freehand or attractors. Reuse src/hooks/use-daily-streak.ts pattern; do NOT edit existing games beyond a one-line completion hook if needed (NO-BREAK scope lock; prefer hub-side tracking via deep-link return + manual "mark done" fallback in run 1-2). Add to games/hubs via non-catalog route, no registry.tsx rewrite. Plan: run1 route+deterministic daily pick+EN/ES shell+streak; run2 completion tracking + calendar (working core); run3 share PNG/URL + a11y; run4 polish+close. IP: n/a (own UI; links to existing games).
RUN1 DONE 2026-11-11: /daily-challenge + /es/reto-diario shell; src/lib/daily-challenge/logic.ts (UTC date-hash pick over 12 curated games, never repeats yesterday, streak/best, countdown, localStorage utilihub:daily-challenge); src/components/daily-challenge/DailyChallengeHub.tsx (today card, Play deep-link, manual Mark done/Undo, streak/best/countdown, 28-day strip, aria-live). Smoke 390px EN+ES OK. NEXT run2: auto-detect completion on return (visibilitychange + per-game win signal read-only) and richer calendar; run3 share PNG/URL + a11y; run4 polish+close. routeTree.gen.ts NOT committed (stale in repo; build regenerates).
RUN2 DONE 2026-11-11: return detection (Play click stores sessionStorage marker; on visibilitychange/pageshow the hub shows 'Welcome back, did you reach the goal?' Yes/Not yet, role=alert); no edits to existing games (they expose no win signal). Richer calendar: weekday header, per-day game emoji, N/28 summary. Smoke 390px EN+ES OK (marker->prompt->Yes->Done), validate:catalog + routing guard OK. NEXT run3: share branded PNG (streak+calendar) + URL, a11y pass; run4 polish+close.
adsense-prep_runs: 8
```

<!-- end:ideas-lab-state.md -->
