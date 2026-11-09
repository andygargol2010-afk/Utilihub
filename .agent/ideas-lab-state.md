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

adsense-prep_runs: 7
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-11-09 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4 easy, 6x4 medium, 6x6 hard), flips two cards to find matching pairs (emoji themes: fruits/animals/numbers/symbols), sees live timer/moves/score/stars/progress bar, optional sound, mismatch shake, keyboard arrows+Enter/Space + R restart, URL deep-link (?size=&theme=&seed=), branded PNG of board + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish: global R key restart + richer aria-live announcements. Acceptance met (select size/theme, match all pairs, see win stats/stars, share PNG or URL). IP: traditional public-domain pair-matching (concentration), generic emoji/icons; no branded assets.
- 2026-11-09 | simulators | predator-prey-simulator | Interactive predator-prey (Lotka-Volterra) population simulator complete after 4 runs. User sets initial prey/predator counts, growth rate of prey, predation rate, predator death rate, conversion efficiency. Discrete generations show live SVG dual-line or phase-space chart of both populations oscillating or stabilizing, phase label (oscillating/stable/extinct), peak values, current gen, averages, approx period. Presets (balanced, prey boom, predator crash), Animate/Stop with speed, Reset, URL deep-link (?params=), branded PNG of chart + stats, CSV export. EN+ES (+PT labels), mobile-first 390px, keyboard controls (Space/R), a11y labels + aria-live. Final polish restored after truncation incident. Acceptance met (set params/preset, animate, see live chart + phase/peaks/stats, share PNG or URL). IP: original educational Lotka-Volterra implementation with generic rates; no branded datasets or software.
- 2026-11-08 | games | connect-four-classic | Interactive classic Connect Four (Cuatro en línea) complete after 4 runs. User selects color, takes turns dropping pieces into a 7x6 grid (gravity), first to get 4 in a row (horiz/vert/diag) wins. Optional simple AI opponent (easy/med/hard with heuristic). Keyboard nav (arrows + Enter, 1-7 keys), win detection + highlight + animated line, undo, timer, URL deep-link for board state (?moves=), branded PNG of final board with winning line, EN+ES routes, mobile-first 390px with large touch cells (h-10/w-10 sm:h-12), a11y labels + aria-live for moves and win. Final polish: timer display, hard AI, drop animation, win pulse, dim non-win pieces. Acceptance met (select side, drop pieces, see gravity + win/lose detection with highlight, share PNG or URL). IP: traditional public-domain Connect Four gravity drops and 4-in-a-row; generic UI/naming; no Hasbro or branded assets.
- 2026-11-07 | kits | molecule-builder-kit | Interactive molecule builder kit complete after 4 runs. User places atoms (C, H, O, N) on 5x5 grid, connects with single/double/triple bonds using visual SVG lines, sees live molecular formula + molar mass, completes guided challenges (water H2O, CO2, methane CH4), free mode, atom legend with masses, keyboard navigation (arrows + Enter/Space), URL deep-link (?g= &b=), branded PNG of structure + formula, EN+ES routes, mobile-first 390px. Final polish: color-coded atoms (C gray, H light, O red, N blue), tighter mobile gaps/cell sizes, improved PNG diagram with colored circles, enhanced a11y labels. Acceptance met (place atoms, connect bonds, see live formula/structure, complete challenge, share PNG or URL). IP: original educational chemistry assembler with generic atoms; no branded kits or software.
- 2026-11-07 | games | minesweeper-classic | Interactive classic Minesweeper (Buscaminas) complete after 4 runs. User selects difficulty (Easy 9x9/10, Medium 16x16/40, Hard 16x30/99), reveals cells with cascade on empty, flags/questions, timer + mines left, win by all safe open or lose with full expose. Keyboard nav (arrows + Enter/Space/F), seeded URL deep-link, branded PNG, EN+ES, mobile-first 390px with 22px cells, legend, a11y grid roles + aria-live. Acceptance met (select, reveal/flag, win/lose feedback, share PNG/URL). IP: traditional public-domain Minesweeper rules (numbers, cascade, flags); generic UI/naming; no Microsoft or branded assets.
- 2026-11-06 | studio-composition | timeline-event-composer | Interactive timeline event composer complete after 4 runs. User adds 5-10 event cards (title, short description, optional date/tag), reorders by buttons, sees live vertical SVG timeline with connecting lines, generates branded summary card PNG with timeline visual + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y, max limit, Reset, Enter to add, aria-live. Acceptance met (add/reorder/live timeline/share PNG+URL). IP: original educational timeline assembler with generic events; no branded frameworks.
- 2026-11-06 | journeys | goal-progress-journey | Interactive multi-stage personal goal progress journey. User chooses a goal category (learn a skill, build a habit, save for a goal, improve fitness), sets parameters, then advances through 5-7 ordered stages with checklists, binary/multi choices that branch tips and outcomes, sees live progress bar and percentage, related tool recommendations, and on completion a branded summary card with stats and next steps. Generates canvas PNG of the journey card + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y. Acceptance met when user selects category, completes stages, sees final card, shares PNG or URL. IP: original educational goal-progress tracker with generic stages; no branded frameworks.
- 2026-11-06 | share-hooks | utili-type-quiz | Interactive multi-question preference quiz that reveals a personalized "Utili Type" archetype complete after 4 runs. User answers 8-10 binary/multi-choice questions about favorite activities/tools, sees progressive progress bar, ends with branded result card (type name, short description, matching tool/game recommendations), generates canvas PNG + deep-link URL for sharing. EN+ES routes, mobile-first 390px, a11y keyboard nav + ARIA. Acceptance met (answers quiz, sees type card with recs, shares PNG or URL). IP: original educational personality quiz, generic types.
- 2026-11-06 | games | battleship-classic | Interactive classic Battleship (Hundir la flota) complete after 4 runs. User places ships (manual/random) on 10x10 grid, shoots opponent grid (AI hunt), sees hit/miss/sink, wins by clearing fleet. Keyboard nav, ghost preview, win animation, canvas PNG of both boards, URL deep-link, EN+ES, mobile-first 390px. Acceptance met (place/random, shoot, hit/miss/sink, win, share PNG/URL). IP: traditional public-domain Battleship mechanics, generic naming/assets.
- 2026-11-05 | seo-locales | pt-product-parity | Full product-parity Portuguese (pt-BR) locale surface under /pt/... complete after 12 runs. Home, tools hub, games/sim indexes, playgrounds/kits/journeys, legal/privacy/contact/sobre, dedicated high-traffic experiences (circuit kit, population sim, paper airplane kit), dynamic /pt/jogos/$slug for all catalog games with locale=pt where supported, hreflang + sitemap. EN-parity structure met; not a thin shell. Acceptance met (user visits /pt/ sees full hubs/experiences in Portuguese). IP: n/a.
```

---

## ACTIVE PROJECT

```
status: done
idea: n/a
id: n/a
path_en: n/a
path_es: n/a
path_seo: n/a
domain: n/a
runs_total: 0
runs_remaining: 0
acceptance: n/a
share: n/a
next_step_required: no
notes: Closed memory-match-classic after 4 runs. Next run: IDEATE.
adsense-prep_runs: 7
```

<!-- end:ideas-lab-state.md -->
