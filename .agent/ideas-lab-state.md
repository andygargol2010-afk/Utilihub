# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: kits
last_closed_id: recipe-assembly-kit
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 2
  simulators: 8
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
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
- 2026-10-29 | journeys | choice-story-journey | Interactive narrative choice journey complete after 4 runs. Branching decision cards, labeled progress waypoints, back/undo, current-step highlight, 3 endings with accent colors, URL deep-link path, branded PNG with accent bar, copy-link, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-28 | simulators | sir-epidemic-simulator | Interactive SIR epidemic compartmental model simulator complete after 4 runs. Live S/I/R curves, discrete interventions (lockdown, vaccination), Peak I + day tracking with marker, cumulative total cases, URL deep-link, branded PNG, EN+ES routes, mobile 390px, preset scenario buttons. CWV-safe. Adsterra intact.
- 2026-10-28 | ops | seo-locales-reset | Human-directed reset: deleted thin pt/fr/de shells; SEO_LOCALES_ACTIVE=[]; registry parity bar + min 11 runs policy. Domain restarts from zero (priority still pt → fr → de → …).
- 2026-10-28 | games | minesweeper-classic | Classic Minesweeper interactive game complete after 4 runs. Grid reveal (numbers/mines), flag (right-click/long-press), chord on open numbers, difficulties, timer/best, seeded URL deep-link, Same-board practice button, branded PNG, EN+ES dedicated routes (/minesweeper, /es/buscaminas), mobile 390px aspect-square cells. CWV-safe. Adsterra intact.
- 2026-10-28 | playgrounds | magnetic-field-sandbox | Interactive magnetic field lines sandbox complete after 4 runs. Place/drag N/S poles, live curved field lines (monopole tracing), flowing particles (toggle), directional arrowheads N→S, presets (Dipole, Two North, Quadrupole), URL deep-link, branded PNG, EN+ES routes, mobile 390px with modest line/particle caps. CWV-safe. Adsterra intact.
- 2026-10-28 | retention-loops | retention-loops-streak-constellation | Daily streak constellation visualizer complete after 4 runs. Interactive canvas star placement, check-in streak (localStorage + URL deep-link), milestone colors/progress bar, optional name personalization, branded PNG export, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Classic Hangman word-guess game. User selects letter buttons or types to reveal hidden word with limited misses (6-8). Progress shows word slots and miss counter / simple stick figure. Win on full reveal, lose on max misses. Categories or random words. URL deep-link for seed word. Branded PNG of progress. EN+ES routes.
id: hangman-classic
path_en: /hangman
path_es: /es/ahorcado
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 3
acceptance: User clicks letter buttons to guess a hidden word, sees revealed letters and remaining misses, wins by completing the word or loses after max misses.
share: both
next_step_required: yes
notes: Rubric C1 HangmanClassic (4/3/5/4/5/5=26) closest-3: MemoryGame (pairs), FormulaMemoryGame (recall), text word tools; metaphor: limited-miss letter reveal for hidden word; why not particle-canvas: discrete buttons + slot display, no freehand or particles. C2 BattleshipGrid (4/4/4/3/4/5=24) closest: Minesweeper (reveal), ConnectFour (grid), Pathfinder; metaphor: ship place then alternate hunt hit/miss; why not: grid placement/shots. C3 SlidingPuzzle15 (3/3/3/4/5/5=23) closest: Game2048 (slide), LightsOut, TicTacToe; metaphor: tile slide to ordered goal. Why not particle-canvas for all. IP check C1: traditional hangman (public-domain mechanics, generic UI, no branded assets). Chosen id: hangman-classic (highest score, strong search "play hangman online", distinct from recent grid games). Roll: CORE games (variety mandate after recent kits/journeys + saturated playgrounds; underused weight 2; p_fixed 0.35 not selecting growth this cycle). adsense-prep_runs: 3. Run 1 done: core letter buttons A-Z, word slots reveal, miss counter + progressive SVG stick figure, win/lose states, EN+ES strings, dedicated routes /hangman + /es/ahorcado, catalog + registry entry so also under /games/hangman. Next run 2: categories or word lists expansion, URL deep-link seed, keyboard input, polish mobile 390px, reset button.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
