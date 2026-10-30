# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: simulators
last_closed_id: logistic-chaos-lab
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 2
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
- 2026-10-29 | simulators | logistic-chaos-lab | Interactive logistic map chaos lab complete after 4 runs. Live time series, cobweb plot, bifurcation diagram with period-doubling cascade (P2/P4/P8), Feigenbaum point, stability windows (P3/P5), zoom cascade toggle, attractor type readout, URL deep-link, branded PNG, EN+ES routes (/simulators/logistic-chaos-lab, /es/simuladores/laboratorio-caos-logistico), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
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
idea: Interactive classic Simon-style color sequence memory game. User watches a growing sequence of colored buttons light up with tones, then repeats the sequence by clicking. Increases length on success; ends on mistake. Includes levels, best score, sound toggle, URL deep-link for sequence seed, branded PNG share of high score, EN+ES routes. Distinct from existing pair-matching MemoryGame.
id: simon-sequence-memory
path_en: /games/simon-sequence-memory
path_es: /es/juegos/memoria-secuencia-simon
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 1
acceptance: User clicks Start, watches sequence of 3+ colors/sounds, repeats it correctly to advance length, sees score increase; on error sees game-over with best score and share PNG.
share: both
next_step_required: yes
notes: Domain roll: FLEX (p_fixed 0.35 rolled False), chose games (underweighted 2, variety after recent simulators/kits/journeys; avoids saturated playgrounds). Candidates: 1. simon-sequence-memory (value5 share4 demand5 dist4 feas5 perf5 total28; closest: MemoryGame pairs, FormulaMemory, Hangman; metaphor: sequence recall timing; not particle-canvas; IP: traditional Simon-like generic colors/sounds no brand). 2. sliding-puzzle-15 (value4 share3 demand4 dist4 feas5 perf5 total25; closest: 2048 grid, LightsOut; metaphor: tile slide spatial packing; IP: traditional). 3. battleship-grid-hunt (value5 share4 demand5 dist5 feas4 perf4 total27; closest: Minesweeper grid, ConnectFour; metaphor: hidden grid hunt; IP: traditional generic). Chose simon for strong search + feasibility + not existing.
Run 1 (2026-10-29): Core playable shipped. 4 pads, start with 3-color sequence + sine tones (Web Audio), user repeat advances length/score, fail shows game-over + best (localStorage). Sound toggle. EN+ES via catalog routes /games/simon-sequence-memory + /es/juegos/memoria-secuencia-simon. Lazy. Mobile 2x2 ~96-112px pads. CWV-safe (no heavy deps). Next: URL deep-link seed, branded PNG high-score, polish levels/aria.
Run 2 (2026-10-29): URL deep-link seed (?seed=) with mulberry32 PRNG for reproducible sequence, branded score PNG (accent bar + pads + score/best/level + utilihub.app), level readout, improved aria-live announcements, share-link copies seeded URL, PNG/share buttons. Mobile 390px. CWV-safe. Next: polish edge cases, keyboard support or difficulty, final QA.
Run 3 (2026-10-29): Keyboard support (keys 1-4 map to pads during input phase, with key labels on pads), difficulty selector (Easy/Normal/Hard adjusting playback speed and tone duration), statusRef for reliable input gating, updated status texts. Mobile 390px. CWV-safe. Next: final QA / edge polish / close.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
