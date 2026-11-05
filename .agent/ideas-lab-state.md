# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: simulators
last_closed_id: population-dynamics-simulator
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 5
  simulators: 4
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

adsense-prep_runs: 7
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-11-05 | simulators | population-dynamics-simulator | Interactive population dynamics simulator complete after 4 runs. User sets initial population, birth/death rates, carrying capacity; discrete generations show live SVG logistic growth chart with phase (growth/decline/stable), peak, gens to capacity. Compare two scenarios, Animate/Stop step reveal, presets, net rate r, K line, grid, generation counter, branded PNG + URL deep-link. EN+ES routes, mobile-first 390px. Final polish: legend, Reset button, slightly tighter mobile padding. Acceptance met (set params, run/see curve+stats, share PNG/URL). IP: original educational logistic growth model, generic params, no branded datasets.
- 2026-11-04 | games | checkers-classic | Interactive classic Checkers (Damas / Draughts) complete after 4 runs. 8x8 board, diagonal moves, jump captures with multi-jump chains, promotion to king, optional AI preferring long captures, move counter, undo, URL deep-link (?b=), branded PNG with moves, keyboard nav + a11y, EN+ES, mobile-first 390px. Acceptance met (select side, make legal moves/captures/kings, win by no pieces or no moves, share PNG/URL). IP: traditional public-domain checkers/draughts rules, generic pieces/colors, no commercial branding.
- 2026-11-04 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4/6x4/6x6), theme (fruits/animals/numbers/symbols), flips two cards to match pairs with CSS 3D, timer, moves, efficiency stars (1-5), keyboard nav + a11y, URL deep-link seed, branded PNG, EN+ES, mobile-first 390px with tighter gaps/fonts on small screens. Acceptance met (select size, match all, see stats/stars, share PNG/URL). IP: traditional public-domain pair-matching, generic emoji, no commercial decks.
- 2026-11-03 | adsense-prep | adsense-policy-readiness | Privacy and Cookie Policy (EN+ES) enhanced for AdSense readiness after 4 runs. Expanded structured sections on third-party ad cookies (Adsterra kept intact + potential Google), rights, opt-outs with live links (NAI, aboutads, Ad Settings), data retention, legal bases, international transfers, children's privacy, key points summaries, and a dedicated readiness section. Mobile-friendly prose at 390px. Acceptance met (user sees comprehensive disclosures on /privacy /cookies and ES equivalents). IP: original policy content updates.
- 2026-11-03 | kits | paper-airplane-kit | Interactive paper airplane design kit complete after 4 runs. User selects preset design (classic dart, glider, stunt, delta wing), follows multi-step fold instructions with checkoffs and live CSS preview of the plane shape, sees progress, estimated folds/time, materials checklist, optional challenges (distance/stunt) with score, generates branded PNG or copies deep-link URL. EN+ES routes, mobile-first 390px. CSS illustrations + state + checklists. Acceptance met (select preset, checkoff steps, preview updates, PNG or share URL). IP: original educational paper craft assembler.
- 2026-11-03 | games | connect-four-classic | Interactive classic Connect Four game complete after 4 runs. 7x6 grid, drop discs by gravity, connect 4 win, optional AI, hover ghost preview, drop animation, win pulse, move counter, keyboard 1-7, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select column, see fall/response, detect win/draw, share PNG/URL). IP: traditional public-domain gravity drop connect-4 mechanics, generic naming, no Hasbro branding.
- 2026-11-03 | games | sudoku-classic | Interactive classic Sudoku puzzle complete after 4 runs. 9x9 grid with pre-filled cells, user fills remaining with 1-9 ensuring no duplicates in rows, columns, or 3x3 boxes. Live conflict highlighting, optional pencil notes (auto-fill possibles), undo, timer with pause/resume, difficulty presets (easy/medium/hard), URL deep-link for seed, branded PNG of completed grid, remaining-count badges on number pad (disabled at 0), progress indicator. EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select difficulty, fill cells, see conflicts/valid, complete or use undo/pencil/hints, share PNG/URL). IP: traditional public-domain rules, generic naming, no branded puzzle sets.
- 2026-11-03 | games | minesweeper-classic | Interactive classic Minesweeper-style grid game complete after 4 runs. Rectangular grid with hidden mines; click to reveal cells showing adjacent mine counts, flood-fill empty areas, flag suspected mines (question marks cycle). Win by revealing all safe or flagging all; lose on mine. Difficulties (easy 9x9/10, medium 16x16/40, hard 16x30/99), first-click safe, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (reveal/flag, complete or lose, share PNG/URL, face reset, auto-flag on win). IP: traditional public-domain mechanics, generic naming, no Microsoft branding.
- 2026-11-02 | games | othello-classic | Interactive classic Othello/Reversi board game complete after 4 runs. 8x8 grid, place discs that flip opponents in lines when bracketing, valid moves highlighted, optional simple AI (greedy max-flips), URL deep-link (?b=), branded PNG of board, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (place disc, see flips, AI respond, share PNG/URL). IP: traditional public-domain mechanics, generic naming.
- 2026-11-02 | seo-locales | pt-product-parity | Full Portuguese (pt-BR) product surface under /pt/ after 11 runs. Partial parity: home, tools/games/simulators indexes, several high-traffic experiences with PT chrome/meta/hreflang. Catalog tool-name translations and remaining experiences incomplete; not registered active. Closed at budget. Next IDEATE.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive simple circuit kit. User places basic components (battery, switch, resistor, LED) on a grid or free canvas, connects them with wires, sees live feedback if the circuit is closed and the LED lights (with brightness based on resistance). Guided mode with step checkoffs for simple series circuit, free mode for experimentation. Materials checklist, progress, optional challenges. Branded PNG of the assembled circuit + URL deep-link with component positions. EN+ES, mobile-first 390px. CSS + state, no heavy deps.
id: simple-circuit-kit
path_en: /simple-circuit-kit
path_es: /es/kit-circuito-simple
path_seo: n/a
domain: kits
runs_total: 4
runs_remaining: 3
acceptance: user places and connects components, sees circuit complete and LED light (or error), shares PNG/URL
share: both
next_step_required: yes
notes: IDEATE: 3 candidates scored (value/share/search/distinct/feas/perf). 1) simple-circuit-kit (kits) 5/4/4/5/4/4 total 26. Closest: paper-airplane-kit (multi-step discrete checkoff+preview), any existing visualizers none for circuits. Metaphor: discrete parts + connection assembler. Why not particle-canvas: guided discrete components with cause-effect readout (lights), not freehand trails. 2) battleship-classic (games) 5/4/5/4/4/4 total 26. Closest: minesweeper (grid reveal), checkers (board). Metaphor: turn-based grid hunt. IP: traditional public-domain grid hunt mechanics, generic naming, no commercial branding. 3) choice-story-journey quality-lift or new (journeys) 4/3/3/4/4/5 total 23. Closest: existing ChoiceStoryJourney. Metaphor: ordered narrative stages. Chosen simple-circuit-kit for underused kits domain (only paper-airplane recent), educational value, distinct from saturated games and particle playgrounds. Roll: CORE kits for balance after recent games/simulators. IP: original educational assembler, generic components. EXECUTE run 1: core grid place/wire/test + guided steps + PNG/URL + EN/ES routes. Core playable (place comps, connect, test lights).
adsense-prep_runs: 7
```

<!-- end:ideas-lab-state.md -->
