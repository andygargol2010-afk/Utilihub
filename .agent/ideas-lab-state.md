# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: retention-loops
last_closed_id: daily-challenge-hub
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
- 2026-11-13 | retention-loops | daily-challenge-hub | Daily Challenge hub complete after 4 runs. /daily-challenge + /es/reto-diario: UTC date-seeded pick of one of 12 existing games (never repeats yesterday) with a goal, Play deep-link, return-from-game prompt + manual Mark done/Undo, current/best streak, next-challenge countdown, 28-day calendar with per-day game emoji, branded 1080x1080 PNG + shareable URL snapshot, EN+ES, mobile-first 390px, aria-live. Final polish: singular/plural day, focus moves to the return prompt, empty-state copy, motion-reduce. No edits to existing games. Acceptance met. IP: n/a (own UI linking existing games).
- 2026-11-11 | games | sudoku-classic | Interactive classic Sudoku (9x9) complete after 4 runs. Difficulty easy/medium/hard, live row/column/box conflict highlighting, timer, undo, pencil notes + auto notes, hints, keyboard shortcuts, per-difficulty best time (localStorage), branded board PNG, URL deep-link, EN+ES, mobile 390px, a11y labels + aria-live. Final polish: aria-live now announces conflict count, motion-safe win pulse, GameSecondaryButton gained a real `disabled` prop (Undo/Hint/Pause were silently ignoring it), fixed TS errors. Acceptance met. IP: traditional public-domain Sudoku rules; generic UI.
- 2026-11-09 | adsense-prep | adsense-compliance-prep | Preparación de cumplimiento AdSense completa tras 4 runs. /ads.txt con entradas placeholder (google.com pub-0000000000000000), páginas About/Sobre con contenido sustantivo original (propósito, densidad, how-we-build, compliance note), privacy/cookies EN+ES actualizadas con secciones de publicidad de terceros, opt-outs, readiness y menciones a Adsterra intacto. Fechas 9 Nov 2026. EN+ES. Acceptance met (visita /ads.txt, revisa políticas con secciones de ads, About sustantivo). Adsterra intacto. IP: n/a.
- 2026-11-09 | games | hangman-classic | Interactive classic Hangman (Ahorcado) complete after 4 runs. User selects category (animals/countries/food/tech/random) and difficulty (easy 8/normal 6/hard 4 misses), guesses letters via keyboard or on-screen buttons to reveal the hidden word. On misses a live SVG hangman figure progresses (up to 7 parts + eyes). Shows lives remaining, guessed letters, score. Optional hint. Win when word complete or lose when figure full. Keyboard nav (letters + R new + H hint), URL deep-link (?cat=&word=&diff=), branded PNG of final hangman + word + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live for guesses and outcome. Final polish: progressive SVG, score, PNG branding, richer aria-live, keyboard shortcuts, focus-visible. Acceptance met (select category/difficulty, guess letters, see progressive SVG + revealed word, win/lose with stats, share PNG or URL). IP: traditional public-domain hangman letter-guess + penalty figure; generic words/categories; no branded.
- 2026-11-09 | kits | logic-circuit-kit | Interactive logic circuit kit complete after 4 runs. User places gates (AND/OR/NOT/XOR/NAND/NOR), inputs/outputs on 5x5 grid, connects with wires (port selector out/in1/in2), toggles inputs, sees live SVG wires, output indicators (colors), truth table (up to 3 inputs), guided challenges (half-adder, decoder) with completion feedback, wires list with delete, keyboard nav (arrows+Enter/Space), URL deep-link (?g= &w=), branded PNG of grid+wires+stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish completed truncated UI + visual connections. Acceptance met (place gates, connect wires, toggle inputs, see live outputs and truth table, complete challenge, share PNG or URL). IP: original educational boolean logic assembler with generic gates; no branded kits.
- 2026-11-09 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4 easy, 6x4 medium, 6x6 hard), flips two cards to find matching pairs (emoji themes: fruits/animals/numbers/symbols), sees live timer/moves/score/stars/progress bar, optional sound, mismatch shake, keyboard arrows+Enter/Space + R restart, URL deep-link (?size=&theme=&seed=), branded PNG of board + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish: global R key restart + richer aria-live announcements. Acceptance met (select size/theme, match all pairs, see win stats/stars, share PNG or URL). IP: traditional public-domain pair-matching (concentration), generic emoji/icons; no branded assets.
- 2026-11-09 | simulators | predator-prey-simulator | Interactive predator-prey (Lotka-Volterra) population simulator complete after 4 runs. User sets initial prey/predator counts, growth rate of prey, predation rate, predator death rate, conversion efficiency. Discrete generations show live SVG dual-line or phase-space chart of both populations oscillating or stabilizing, phase label (oscillating/stable/extinct), peak values, current gen, averages, approx period. Presets (balanced, prey boom, predator crash), Animate/Stop with speed, Reset, URL deep-link (?params=), branded PNG of chart + stats, CSV export. EN+ES (+PT labels), mobile-first 390px, keyboard controls (Space/R), a11y labels + aria-live. Final polish restored after truncation incident. Acceptance met (set params/preset, animate, see live chart + phase/peaks/stats, share PNG or URL). IP: original educational Lotka-Volterra implementation with generic rates; no branded datasets or software.
- 2026-11-08 | games | connect-four-classic | Interactive classic Connect Four (Cuatro en línea) complete after 4 runs. User selects color, takes turns dropping pieces into a 7x6 grid (gravity), first to get 4 in a row (horiz/vert/diag) wins. Optional simple AI opponent (easy/med/hard with heuristic). Keyboard nav (arrows + Enter, 1-7 keys), win detection + highlight + animated line, undo, timer, URL deep-link for board state (?moves=), branded PNG of final board with winning line, EN+ES routes, mobile-first 390px with large touch cells (h-10/w-10 sm:h-12), a11y labels + aria-live for moves and win. Final polish: timer display, hard AI, drop animation, win pulse, dim non-win pieces. Acceptance met (select side, drop pieces, see gravity + win/lose detection with highlight, share PNG or URL). IP: traditional public-domain Connect Four gravity drops and 4-in-a-row; generic UI/naming; no Hasbro or branded assets.
- 2026-11-07 | kits | molecule-builder-kit | Interactive molecule builder kit complete after 4 runs. User places atoms (C, H, O, N) on 5x5 grid, connects with single/double/triple bonds using visual SVG lines, sees live molecular formula + molar mass, completes guided challenges (water H2O, CO2, methane CH4), free mode, atom legend with masses, keyboard navigation (arrows + Enter/Space), URL deep-link (?g= &b=), branded PNG of structure + formula, EN+ES routes, mobile-first 390px. Final polish: color-coded atoms (C gray, H light, O red, N blue), tighter mobile gaps/cell sizes, improved PNG diagram with colored circles, enhanced a11y labels. Acceptance met (place atoms, connect bonds, see live formula/structure, complete challenge, share PNG or URL). IP: original educational chemistry assembler with generic atoms; no branded kits or software.
- 2026-11-07 | games | minesweeper-classic | Interactive classic Minesweeper (Buscaminas) complete after 4 runs. User selects difficulty (Easy 9x9/10, Medium 16x16/40, Hard 16x30/99), reveals cells with cascade on empty, flags/questions, timer + mines left, win by all safe open or lose with full expose. Keyboard nav (arrows + Enter/Space/F), seeded URL deep-link, branded PNG, EN+ES, mobile-first 390px with 22px cells, legend, a11y grid roles + aria-live. Acceptance met (select, reveal/flag, win/lose feedback, share PNG/URL). IP: traditional public-domain Minesweeper rules (numbers, cascade, flags); generic UI/naming; no Microsoft or branded assets.
```

---

## ACTIVE PROJECT

```
status: active
idea: Tool Matchmaker — a 3-step guided wizard (goal -> time/context -> output type) that routes a first-time visitor to the best-fit UtiliHub tool/game/simulator/kit instead of making them browse. Each step is a large tappable card choice; after step 3 it shows a ranked top-3 result with a one-line reason each ('why this fits'), a primary Open button deep-linking to the real route, and a 'Try something different' re-roll. Result is shareable as a URL (?g=&t=&o=) and a branded 1080x1080 PNG recommendation card. Lives as a standalone route linked from home hero, 404/empty-search states and tool pages ('Not what you need?'). Pure client-side scoring table (no new deps, no catalog/registry edits).
id: tool-matchmaker
path_en: /find-your-tool
path_es: /es/encuentra-tu-herramienta
path_seo: n/a
domain: conversion-paths
runs_total: 4
runs_remaining: 3
acceptance: user answers 3 card questions, sees a ranked top-3 with reasons, taps Open and lands on a real existing tool/game route; can re-roll and share the URL or PNG.
share: both
next_step_required: yes
notes: ROLL 2026-11-13: r=0.31 < p_fixed 0.35 -> FIXED urn; weighted pick -> conversion-paths (w2). Rubric (value/share/demand/distinct/feasible/perf, 1-5): (A) tool-matchmaker 4/4/3/4/5/5 = 25 CHOSEN; (B) first-visit-checklist (onboarding checklist that unlocks badges for visiting 5 surfaces) 3/3/2/3/4/5 = 20 (overlaps progress-passport + streak-constellation); (C) compare-two-tools split view 3/2/3/2/3/4 = 17 (rejected: distinctiveness 2). Closest-3 by mechanic for A: ToolSearch/CommandPalette (keyword search, not guided), share.utili-type-quiz (personality quiz; outcome is a type, not a tool route), growth.progress-passport (progress stamps; no routing). Primary metaphor: decision-tree wizard -> ranked recommendation. Not the particle/canvas cluster: DOM-only cards + a static PNG card, no animation field. Run plan: 1) data model (goal/time/output taxonomy + scoring table over ~25 verified real routes, reason strings EN+ES) + wizard UI skeleton EN route; 2) result screen + Open deep-links + re-roll, ES route (core playable by run 2); 3) share URL + PNG card + entry-point links (home hero / empty-search / tool footer) as surgical single-line inserts; 4) polish (a11y focus management, aria-live, 390px, motion-reduce). RUN 1/4 DONE 2026-11-13: src/lib/tool-matchmaker/{taxonomy,targets,logic}.ts (4 goals x 3 times x 4 outputs, 26 verified targets: 8 games, 6 sims, 12 static routes; EN+ES names/reasons; deterministic scoring; ?g=&t=&o= parse/build) + src/components/tool-matchmaker/ToolMatchmaker.tsx (locale prop en|es, wizard + ranked top-3 + Open + re-roll + restart, aria-live, focus mgmt) + EN route /find-your-tool (lazy). Smoke at 390px: 3 answers -> top-3 hrefs real, re-roll rotates, no overflow. NEXT run 2: ES route /es/encuentra-tu-herramienta + hreflang alternates both ways (EN route has none yet), then share. Constraints: verify each target route exists on branch before listing it; no registry.tsx edits; no catalog slug additions; lazy route.
adsense-prep_runs: 8
```

<!-- end:ideas-lab-state.md -->
