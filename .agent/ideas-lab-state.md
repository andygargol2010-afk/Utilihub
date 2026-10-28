# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: playgrounds
last_closed_id: magnetic-field-sandbox
p_fixed: 0.35

weights_core:
  kits: 4
  journeys: 5
  games: 1
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
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-28 | playgrounds | magnetic-field-sandbox | Interactive magnetic field lines sandbox complete after 4 runs. Place/drag N/S poles, live curved field lines (monopole tracing), flowing particles (toggle), directional arrowheads N→S, presets (Dipole, Two North, Quadrupole), URL deep-link, branded PNG, EN+ES routes, mobile 390px with modest line/particle caps. CWV-safe. Adsterra intact.
- 2026-10-28 | retention-loops | retention-loops-streak-constellation | Daily streak constellation visualizer complete after 4 runs. Interactive canvas star placement, check-in streak (localStorage + URL deep-link), milestone colors/progress bar, optional name personalization, branded PNG export, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-27 | seo-locales | seo-locales-de-shell | German (de) SEO-first locale shell + 4 experiences (/de, /de/fluid-ink-flow-playground, /de/pulse-catch, /de/snake, /de/pong) complete after 4 runs. Full German titles, descriptions, UI strings via locale=de, hreflang alternates, minimal shell, no primary nav links from EN/ES. CWV-safe. Adsterra intact.
- 2026-10-27 | seo-locales | seo-locales-fr-shell | French (fr) SEO-first locale shell + 4 experiences (/fr, /fr/fluid-ink-flow-playground, /fr/pulse-catch, /fr/snake, /fr/pong) complete after 4 runs. Full French titles, descriptions, UI strings via locale=fr, hreflang alternates, minimal shell, no primary nav links from EN/ES. CWV-safe. Adsterra intact.
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
- 2026-10-27 | search-magnets | orbit-pulse-catcher-guide | Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game complete after 6 runs. Full EN+ES depth including scoring formula, drills, 15-min plan. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Classic Minesweeper interactive game. Grid of cells, click to reveal numbers or mines, right-click/flag, win by revealing all safe cells. Difficulties (easy/medium/hard), timer/score, EN+ES routes and UI, mobile 390px touch-friendly, URL deep-link for seed/difficulty, optional branded PNG of board. Rules-based with clear win/lose. Not a particle sandbox.
id: minesweeper-classic
path_en: /minesweeper
path_es: /es/buscaminas
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 2
acceptance: user clicks a cell, sees number or mine (boom), flags correctly, clears board to win; mobile works, EN/ES switch.
share: both
next_step_required: yes
notes: IDEATE 2026-10-28. Roll: variety mandate (last 2 CORE=playgrounds), preferred underused CORE; weighted toward games (low weight 1). Candidates:
1. minesweeper-classic (games): value5 share4 search5 distinct5 feas5 perf4 total28. Closest: snake (grid), pong (if), tic-tac-toe grid. Metaphor: risk-reveal grid puzzle with win/lose. Not particle-canvas (rules, discrete cells, fail states). IP: traditional minesweeper-style reveal (public-domain mechanics; generic UI/naming; no branded assets).
2. memory-match-pairs (games): value4 share4 search4 distinct4 feas5 perf5 total26. Closest: similar card UIs. Metaphor: pair-matching memory. IP: traditional memory match.
3. connect-four-drops (games): value4 share3 search4 distinct4 feas4 perf4 total23. Closest: grid games. Metaphor: gravity-drop connect. IP: generic connect-four style.
Chosen: minesweeper-classic (highest, strong search demand "play minesweeper online", classic IP-safe, distinct from sandboxes). No quality-lift. adsense-prep_runs unchanged.
Run 1 (2026-10-28): created dedicated routes /minesweeper and /es/buscaminas wrapping existing GamePlayer + GameShell; enhanced MinesweeperGame with URL deep-link (?diff= &seed=) using seeded RNG for reproducible boards. Playable core live (click to reveal, flag, win/lose, difficulties, timer, EN/ES). Next: mobile polish at 390px, optional branded PNG export, any UX fixes.
Run 2 (2026-10-28): mobile polish — cells now aspect-square with grid-controlled sizing (fits 390px even on hard 16×16 without overflow), tighter gaps/padding on small screens, PNG export button that draws branded board (header UtiliHub title + difficulty/time, footer utilihub.app) to canvas and downloads. UX: aria-labels on cells. Core remains solid. Next: final polish / close if acceptance met.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
