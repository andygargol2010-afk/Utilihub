# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: growth-surfaces
last_closed_id: embed-studio
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
- 2026-11-14 | growth-surfaces | embed-studio | Embed Studio complete after 4 runs. /growth/embed-studio + /es/crecimiento/embed-studio: pick one of 12 whitelisted games, size presets or custom 280-1200 px, light/dark, EN/ES, fixed or responsive snippet, text-link or button attribution (always kept), live same-origin iframe preview, copy iframe code and plain link, ?g=&s=&t=&l=&w=&h=&m=&b= deep-link, chrome-less /embed/{slug} route (noindex, canonical to game page, visible Powered by UtiliHub link, frame-ancestors scoped to /embed/* only in vercel.json), home hero entry links EN+ES. Final polish: custom size clamped live in snippet (no 0/NaN while typing), aria-live announcement when a size is adjusted, motion-reduce on buttons. Acceptance met. IP: n/a (own UI embedding existing games).
- 2026-11-14 | simulators | cellular-automaton-lab | Cellular Automaton Lab complete after 4 runs. /simulators/cellular-automaton-lab + /es/simuladores/laboratorio-automatas-celulares: tab 2D Life-like (48x48 wrapping grid, editable Birth/Survive, 5 rule presets, tap/drag toggle, 5 stamps, play/step/speed, generation + population readout + sparkline) and tab 1D Wolfram (rules 0-255, number input, 8-cell clickable rule table, presets 30/90/110/184, single/random seed), shareable URL (?mode=&rule=&b=&s=&g=) + branded 1080x1080 PNG, EN+ES, 390px, keys Space/S/R/C. Final polish: auto-pause when tab hidden, aria-live play/pause announcements, seed button state correct when restored from URL. Acceptance met. IP: public mathematical rules (Life-like / Wolfram), generic UI.
- 2026-11-13 | conversion-paths | tool-matchmaker | Tool Matchmaker complete after 4 runs. /find-your-tool + /es/encuentra-tu-herramienta: 3 tappable card steps (goal, time, output) -> ranked top-3 of 26 verified real routes with a 'why this fits' line each, Open deep-links, re-roll, restart, shareable ?g=&t=&o= URL, branded 1080x1080 PNG card, EN+ES, 390px, entry links from home hero EN+ES and EN command-palette empty state. Final polish: focus moves only on user action (no focus steal on load), copy-failure announced via aria-live, Back announced, motion-reduce on buttons. Palette is EN-only so no ES link added. Acceptance met. IP: n/a (own UI linking existing tools).
- 2026-11-13 | retention-loops | daily-challenge-hub | Daily Challenge hub complete after 4 runs. /daily-challenge + /es/reto-diario: UTC date-seeded pick of one of 12 existing games (never repeats yesterday) with a goal, Play deep-link, return-from-game prompt + manual Mark done/Undo, current/best streak, next-challenge countdown, 28-day calendar with per-day game emoji, branded 1080x1080 PNG + shareable URL snapshot, EN+ES, mobile-first 390px, aria-live. Final polish: singular/plural day, focus moves to the return prompt, empty-state copy, motion-reduce. No edits to existing games. Acceptance met. IP: n/a (own UI linking existing games).
- 2026-11-11 | games | sudoku-classic | Interactive classic Sudoku (9x9) complete after 4 runs. Difficulty easy/medium/hard, live row/column/box conflict highlighting, timer, undo, pencil notes + auto notes, hints, keyboard shortcuts, per-difficulty best time (localStorage), branded board PNG, URL deep-link, EN+ES, mobile 390px, a11y labels + aria-live. Final polish: aria-live now announces conflict count, motion-safe win pulse, GameSecondaryButton gained a real `disabled` prop (Undo/Hint/Pause were silently ignoring it), fixed TS errors. Acceptance met. IP: traditional public-domain Sudoku rules; generic UI.
- 2026-11-09 | adsense-prep | adsense-compliance-prep | Preparación de cumplimiento AdSense completa tras 4 runs. /ads.txt con entradas placeholder (google.com pub-0000000000000000), páginas About/Sobre con contenido sustantivo original (propósito, densidad, how-we-build, compliance note), privacy/cookies EN+ES actualizadas con secciones de publicidad de terceros, opt-outs, readiness y menciones a Adsterra intacto. Fechas 9 Nov 2026. EN+ES. Acceptance met (visita /ads.txt, revisa políticas con secciones de ads, About sustantivo). Adsterra intacto. IP: n/a.
- 2026-11-09 | games | hangman-classic | Interactive classic Hangman (Ahorcado) complete after 4 runs. User selects category (animals/countries/food/tech/random) and difficulty (easy 8/normal 6/hard 4 misses), guesses letters via keyboard or on-screen buttons to reveal the hidden word. On misses a live SVG hangman figure progresses (up to 7 parts + eyes). Shows lives remaining, guessed letters, score. Optional hint. Win when word complete or lose when figure full. Keyboard nav (letters + R new + H hint), URL deep-link (?cat=&word=&diff=), branded PNG of final hangman + word + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live for guesses and outcome. Final polish: progressive SVG, score, PNG branding, richer aria-live, keyboard shortcuts, focus-visible. Acceptance met (select category/difficulty, guess letters, see progressive SVG + revealed word, win/lose with stats, share PNG or URL). IP: traditional public-domain hangman letter-guess + penalty figure; generic words/categories; no branded.
- 2026-11-09 | kits | logic-circuit-kit | Interactive logic circuit kit complete after 4 runs. User places gates (AND/OR/NOT/XOR/NAND/NOR), inputs/outputs on 5x5 grid, connects with wires (port selector out/in1/in2), toggles inputs, sees live SVG wires, output indicators (colors), truth table (up to 3 inputs), guided challenges (half-adder, decoder) with completion feedback, wires list with delete, keyboard nav (arrows+Enter/Space), URL deep-link (?g= &w=), branded PNG of grid+wires+stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish completed truncated UI + visual connections. Acceptance met (place gates, connect wires, toggle inputs, see live outputs and truth table, complete challenge, share PNG or URL). IP: original educational boolean logic assembler with generic gates; no branded kits.
- 2026-11-09 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4 easy, 6x4 medium, 6x6 hard), flips two cards to find matching pairs (emoji themes: fruits/animals/numbers/symbols), sees live timer/moves/score/stars/progress bar, optional sound, mismatch shake, keyboard arrows+Enter/Space + R restart, URL deep-link (?size=&theme=&seed=), branded PNG of board + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish: global R key restart + richer aria-live announcements. Acceptance met (select size/theme, match all pairs, see win stats/stars, share PNG or URL). IP: traditional public-domain pair-matching (concentration), generic emoji/icons; no branded assets.
- 2026-11-09 | simulators | predator-prey-simulator | Interactive predator-prey (Lotka-Volterra) population simulator complete after 4 runs. User sets initial prey/predator counts, growth rate of prey, predation rate, predator death rate, conversion efficiency. Discrete generations show live SVG dual-line or phase-space chart of both populations oscillating or stabilizing, phase label (oscillating/stable/extinct), peak values, current gen, averages, approx period. Presets (balanced, prey boom, predator crash), Animate/Stop with speed, Reset, URL deep-link (?params=), branded PNG of chart + stats, CSV export. EN+ES (+PT labels), mobile-first 390px, keyboard controls (Space/R), a11y labels + aria-live. Final polish restored after truncation incident. Acceptance met (set params/preset, animate, see live chart + phase/peaks/stats, share PNG or URL). IP: original educational Lotka-Volterra implementation with generic rates; no branded datasets or software.
```

---

## ACTIVE PROJECT

```
status: active
idea: Tool Playlists — curated ordered "workflows" of 2-5 real UtiliHub tools/games for a concrete goal (e.g. "Plan a move budget", "Prep for a freelance invoice", "Study session reset"). Each playlist is a step list with a one-line "why this step", Open deep-links to the real tool, per-step Done checkboxes with progress bar (localStorage), and a shareable ?p= URL + branded 1080x1080 PNG of the playlist. Pushes visitors from one tool into several (conversion path), unlike the single-answer Tool Matchmaker.
id: tool-playlists
path_en: /tool-playlists
path_es: /es/listas-de-herramientas
path_seo: n/a
domain: conversion-paths
runs_total: 4
runs_remaining: 3
acceptance: user opens a playlist, sees ordered steps each linking to a real working tool, ticks steps off and sees progress persist on reload, then shares the playlist via URL or branded PNG; EN+ES, 390px.
share: both
next_step_required: no
notes: IDEATE 2026-11-14. Roll: p_fixed roll 15<35 -> FIXED growth urn (seo-locales excluded); weighted roll landed adsense-prep (already CLOSED 2026-11-09, acceptance met, no further procedure defined) -> re-rolled among remaining fixed weights (22) = 20 -> conversion-paths. Candidates: A Tool Playlists (ordered multi-tool workflows + progress) 4/4/3/4/4/5=24 CHOSEN; B Personal Toolbelt (pin favorites + shareable home) 3/3/2/3/4/5=20; C Next-Up strip injected on every tool page 4/2/2/3/1/4=16 (touches many files, violates scope lock). Closest-3 to A by mechanic: /find-your-tool (card steps -> deep links), /growth/progress-passport (localStorage progress tracking), /daily-challenge (return loop + checklist state). Primary metaphor: curated checklist/playlist of deep-links with progress. Not particle/canvas cluster: no canvas except final PNG share card. Plan: run1 data model src/lib/playlists (8 playlists, verified real slugs only, EN+ES copy) + route skeleton; run2 UI (list, detail steps, Open links, checkbox progress persisted); run3 share URL ?p= + PNG + entry links home hero EN+ES; run4 polish/a11y/390px/aria-live/motion-reduce then CLOSE. Risk: every step slug must exist (validate against catalog); drop any that does not. IP: n/a (own UI linking existing tools). RUN1 2026-11-14 DONE: src/lib/tool-playlists/{playlists,logic}.ts (8 playlists, steps reference tool-matchmaker TARGETS ids, unresolved steps dropped), ToolPlaylists.tsx (list + detail via ?p=, Open links), routes /tool-playlists + /es/listas-de-herramientas. routeTree.gen.ts left to build regeneration (>40KB). OUT-OF-SCOPE BREAKAGE: src/lib/tool-seo-index/part-01.part2.ts line 70 stray comma breaks vite build since commit 87d6e12b. Run2: per-step Done checkboxes + progress bar persisted in localStorage.
adsense-prep_runs: 8
```

<!-- end:ideas-lab-state.md -->
