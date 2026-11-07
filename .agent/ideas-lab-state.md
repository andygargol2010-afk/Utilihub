# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: kits
last_closed_id: molecule-builder-kit
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 6
  simulators: 4
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
- 2026-11-07 | kits | molecule-builder-kit | Interactive molecule builder kit complete after 4 runs. User places atoms (C, H, O, N) on 5x5 grid, connects with single/double/triple bonds using visual SVG lines, sees live molecular formula + molar mass, completes guided challenges (water H2O, CO2, methane CH4), free mode, atom legend with masses, keyboard navigation (arrows + Enter/Space), URL deep-link (?g= &b=), branded PNG of structure + formula, EN+ES routes, mobile-first 390px. Final polish: color-coded atoms (C gray, H light, O red, N blue), tighter mobile gaps/cell sizes, improved PNG diagram with colored circles, enhanced a11y labels. Acceptance met (place atoms, connect bonds, see live formula/structure, complete challenge, share PNG or URL). IP: original educational chemistry assembler with generic atoms; no branded kits or software.
- 2026-11-07 | games | minesweeper-classic | Interactive classic Minesweeper (Buscaminas) complete after 4 runs. User selects difficulty (Easy 9x9/10, Medium 16x16/40, Hard 16x30/99), reveals cells with cascade on empty, flags/questions, timer + mines left, win by all safe open or lose with full expose. Keyboard nav (arrows + Enter/Space/F), seeded URL deep-link, branded PNG, EN+ES, mobile-first 390px with 22px cells, legend, a11y grid roles + aria-live. Acceptance met (select, reveal/flag, win/lose feedback, share PNG/URL). IP: traditional public-domain Minesweeper rules (numbers, cascade, flags); generic UI/naming; no Microsoft or branded assets.
- 2026-11-06 | studio-composition | timeline-event-composer | Interactive timeline event composer complete after 4 runs. User adds 5-10 event cards (title, short description, optional date/tag), reorders by buttons, sees live vertical SVG timeline with connecting lines, generates branded summary card PNG with timeline visual + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y, max limit, Reset, Enter to add, aria-live. Acceptance met (add/reorder/live timeline/share PNG+URL). IP: original educational timeline assembler with generic events; no branded frameworks.
- 2026-11-06 | journeys | goal-progress-journey | Interactive multi-stage personal goal progress journey. User chooses a goal category (learn a skill, build a habit, save for a goal, improve fitness), sets parameters, then advances through 5-7 ordered stages with checklists, binary/multi choices that branch tips and outcomes, sees live progress bar and percentage, related tool recommendations, and on completion a branded summary card with stats and next steps. Generates canvas PNG of the journey card + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y. Acceptance met when user selects category, completes stages, sees final card, shares PNG or URL. IP: original educational goal-progress tracker with generic stages; no branded frameworks.
- 2026-11-06 | share-hooks | utili-type-quiz | Interactive multi-question preference quiz that reveals a personalized "Utili Type" archetype complete after 4 runs. User answers 8-10 binary/multi-choice questions about favorite activities/tools, sees progressive progress bar, ends with branded result card (type name, short description, matching tool/game recommendations), generates canvas PNG + deep-link URL for sharing. EN+ES routes, mobile-first 390px, a11y keyboard nav + ARIA. Acceptance met (answers quiz, sees type card with recs, shares PNG or URL). IP: original educational personality quiz, generic types.
- 2026-11-06 | games | battleship-classic | Interactive classic Battleship (Hundir la flota) complete after 4 runs. User places ships (manual/random) on 10x10 grid, shoots opponent grid (AI hunt), sees hit/miss/sink, wins by clearing fleet. Keyboard nav, ghost preview, win animation, canvas PNG of both boards, URL deep-link, EN+ES, mobile-first 390px. Acceptance met (place/random, shoot, hit/miss/sink, win, share PNG/URL). IP: traditional public-domain Battleship mechanics, generic naming/assets.
- 2026-11-05 | seo-locales | pt-product-parity | Full product-parity Portuguese (pt-BR) locale surface under /pt/... complete after 12 runs. Home, tools hub, games/sim indexes, playgrounds/kits/journeys, legal/privacy/contact/sobre, dedicated high-traffic experiences (circuit kit, population sim, paper airplane kit), dynamic /pt/jogos/$slug for all catalog games with locale=pt where supported, hreflang + sitemap. EN-parity structure met; not a thin shell. Acceptance met (user visits /pt/ sees full hubs/experiences in Portuguese). IP: n/a.
- 2026-11-05 | kits | simple-circuit-kit | Interactive simple circuit kit complete after 4 runs. User places battery/switch/resistor/LED on 4x4 grid, connects with wires (visual SVG lines), sees live LED light + brightness by ohms (cycle 50-1000), guided mode with auto-check steps + progress, free mode, materials checklist, challenges, reset, URL deep-link (?g=), branded PNG. EN+ES routes, mobile-first 390px. Final polish: legend with symbols, tighter mobile gaps/fonts, animated wires on complete, a11y labels. Acceptance met (place/connect/test lights, share PNG/URL). IP: original educational discrete parts assembler, generic components, no branded kits.
- 2026-11-05 | simulators | population-dynamics-simulator | Interactive population dynamics simulator complete after 4 runs. User sets initial population, birth/death rates, carrying capacity; discrete generations show live SVG logistic growth chart with phase (growth/decline/stable), peak, gens to capacity. Compare two scenarios, Animate/Stop step reveal, presets, net rate r, K line, grid, generation counter, branded PNG + URL deep-link. EN+ES routes, mobile-first 390px. Final polish: legend, Reset button, slightly tighter mobile padding. Acceptance met (set params, run/see curve+stats, share PNG/URL). IP: original educational logistic growth model, generic params, no branded datasets.
- 2026-11-04 | games | checkers-classic | Interactive classic Checkers (Damas / Draughts) complete after 4 runs. 8x8 board, diagonal moves, jump captures with multi-jump chains, promotion to king, optional AI preferring long captures, move counter, undo, URL deep-link (?b=), branded PNG with moves, keyboard nav + a11y, EN+ES, mobile-first 390px. Acceptance met (select side, make legal moves/captures/kings, win by no pieces or no moves, share PNG/URL). IP: traditional public-domain checkers/draughts rules, generic pieces/colors, no commercial branding.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive classic Connect Four (Cuatro en línea). User selects color, takes turns dropping pieces into a 7x6 grid (gravity), first to get 4 in a row (horiz/vert/diag) wins. Optional simple AI opponent. Keyboard nav, win detection + highlight, undo, URL deep-link for board state, branded PNG of final board, EN+ES routes, mobile-first 390px with large touch cells, a11y labels + aria-live for moves.
 id: connect-four-classic
path_en: /games/connect-four-classic
path_es: /es/juegos/connect-four-classic
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 2
acceptance: User selects side, drops pieces (click/tap or keyboard), sees gravity + win/lose detection with highlight, can share PNG or URL deep-link.
share: both
next_step_required: yes
notes: Rubric (1-5): C1 connect-four-classic: value=4 share=3 search=5 distinct=5 feas=5 perf=5 total=27. Closest-3: minesweeper (reveal cascade), checkers (grid moves), battleship (grid shots). Primary metaphor: turn-based gravity-drop grid puzzle with 4-in-a-row win condition. Why not particle-canvas: discrete grid placement + rules + win/lose, no freehand trails/attractors. IP: traditional public-domain Connect Four gravity drops and 4-in-a-row; generic UI/naming; no Hasbro or branded assets. C2 memory-match-cards: 4/4/4/4/5/5=26. Metaphor: flip-match pairs on card grid. C3 original sliding-puzzle: 3/3/3/4/5/5=23. Picked C1 (highest, strong demand "play connect 4 online", distinct from recent grid games). Roll: CORE games (weight 6, variety prefer underused vs playgrounds; last closed kits). adsense-prep_runs: 7. Run 1/4: core fully implemented (drop, gravity, win highlight, AI easy/med/hard, undo, URL ?moves=, branded PNG, EN+ES, mobile 390px, 1-7 keys). Added arrow-key column select + Enter drop for better a11y. Acceptance core met early. Run 2/4 polish: larger touch cells (h-10/w-10 sm:h-12), prominent "Four in a row!" banner with assertive aria-live, winning line drawn on PNG export connecting the 4 discs, stronger win-pulse on discs. adsense-prep_runs: 7
adsense-prep_runs: 7
```

<!-- end:ideas-lab-state.md -->
