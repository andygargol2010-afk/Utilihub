# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: connect-four-classic
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

adsense-prep_runs: 6
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-11-03 | games | connect-four-classic | Interactive classic Connect Four game complete after 4 runs. 7x6 grid, drop discs by gravity, connect 4 win, optional AI, hover ghost preview, drop animation, win pulse, move counter, keyboard 1-7, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select column, see fall/response, detect win/draw, share PNG/URL). IP: traditional public-domain gravity drop connect-4 mechanics, generic naming, no Hasbro branding.
- 2026-11-03 | games | sudoku-classic | Interactive classic Sudoku puzzle complete after 4 runs. 9x9 grid with pre-filled cells, user fills remaining with 1-9 ensuring no duplicates in rows, columns, or 3x3 boxes. Live conflict highlighting, optional pencil notes (auto-fill possibles), undo, timer with pause/resume, difficulty presets (easy/medium/hard), URL deep-link for seed, branded PNG of completed grid, remaining-count badges on number pad (disabled at 0), progress indicator. EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select difficulty, fill cells, see conflicts/valid, complete or use undo/pencil/hints, share PNG/URL). IP: traditional public-domain rules, generic naming, no branded puzzle sets.
- 2026-11-03 | games | minesweeper-classic | Interactive classic Minesweeper-style grid game complete after 4 runs. Rectangular grid with hidden mines; click to reveal cells showing adjacent mine counts, flood-fill empty areas, flag suspected mines (question marks cycle). Win by revealing all safe or flagging all; lose on mine. Difficulties (easy 9x9/10, medium 16x16/40, hard 16x30/99), first-click safe, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (reveal/flag, complete or lose, share PNG/URL, face reset, auto-flag on win). IP: traditional public-domain mechanics, generic naming, no Microsoft branding.
- 2026-11-02 | games | othello-classic | Interactive classic Othello/Reversi board game complete after 4 runs. 8x8 grid, place discs that flip opponents in lines when bracketing, valid moves highlighted, optional simple AI (greedy max-flips), URL deep-link (?b=), branded PNG of board, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (place disc, see flips, AI respond, share PNG/URL). IP: traditional public-domain mechanics, generic naming.
- 2026-11-02 | seo-locales | pt-product-parity | Full Portuguese (pt-BR) product surface under /pt/ after 11 runs. Partial parity: home, tools/games/simulators indexes, several high-traffic experiences with PT chrome/meta/hreflang. Catalog tool-name translations and remaining experiences incomplete; not registered active. Closed at budget. Next IDEATE.
- 2026-11-02 | growth-surfaces | achievement-certificate-maker | Interactive achievement certificate maker complete after 4 runs. User selects template (classic diploma, modern badge, playful award), enters name/title/date/message/issued-by, sees live CSS preview with decorative seal, customizes colors, generates branded PNG or copies deep-link URL. Quick-fill presets. EN+ES routes. Mobile-first 390px. Pure form + declarative layout + canvas PNG. No particles. Acceptance met (fills form, sees live preview, downloads PNG or copies share URL).
- 2026-11-01 | retention-loops | progress-passport | Interactive digital progress passport complete after 4 runs. User earns discrete stamps by completing challenges across kits/games/simulators, pages fill with stamps + progress bar + collection stats. Generate branded PNG of passport/progress, share link with deep-link. EN+ES routes. Mobile-first 390px. CSS stamp book + localStorage. No heavy canvas or particles. Acceptance met (user marks stamp, sees update, shares PNG or link).
- 2026-11-01 | kits | science-experiment-kit | Interactive kids science experiment kit builder complete after 4 runs. User selects theme from presets (volcano, slime, simple circuit, plant growth), gets discrete materials list, follows multi-step guided assembly with checkoffs and safety tips, sees progress, estimated time, and can generate branded PNG of the completed setup or share link. Challenges for age groups. URL deep-link for theme. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state + checklists. IP-safe original educational assembler. Acceptance met.
- 2026-11-01 | simulators | bin-packing-sim | Interactive bin packing simulator complete after 4 runs. User selects item sizes from presets, places them into a fixed container via click (CSS grid placement with overlap check), sees live utilization percentage, waste, score. Challenges/goals with restricted sets. URL deep-link (?ch=). Branded PNG of packed result. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state. IP-safe original spatial packing. Acceptance: User selects item, places them, achieves high utilization or completes challenge, shares PNG or link. Run 4 polish: undo last placement, faint grid overlay for guidance, slightly larger bin max, updated instructions.
- 2026-11-01 | games | memory-match-classic | Classic memory match pairs game complete after 4 runs. Grid of face-down cards; flip two at a time to find matching pairs. Score based on moves and time. Levels with increasing pairs. Presets for themes (animals, numbers, symbols). URL deep-link for seed. Branded PNG of completed board or high score. EN+ES. Mobile-first 390px. No heavy canvas; CSS grid + state. IP-safe traditional mechanics. Acceptance met.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive paper airplane design kit. User selects a preset design (classic dart, glider, stunt), follows multi-step fold instructions with checkoffs and live CSS preview of the plane shape, sees progress, estimated folds, and can generate branded PNG of the finished design or share deep-link URL. Challenges for distance or stunts. EN+ES routes. Mobile-first 390px. CSS illustrations + state + checklists. No heavy canvas. IP-safe original educational paper craft assembler.
acceptance: User selects preset, follows steps with checkoffs, sees live preview update, generates branded PNG or copies share URL.
id: paper-airplane-kit
path_en: /kits/paper-airplane-kit
path_es: /es/kits/avion-papel-kit
domain: kits
runs_total: 4
runs_remaining: 0
share: both
next_step_required: no
notes: Domain roll CORE (kits weight 5; variety after recent games closes: sudoku/minesweeper/othello/connect-four). Candidates: 1. Paper airplane kit (value 4, share 4, search 3, distinct 4, feas 5, perf 5; total 25) closest: science-experiment-kit, achievement-certificate-maker, progress-passport; metaphor: step-by-step fold guide with live CSS preview; not particle-canvas. 2. Simple circuit light kit (value 5, share 3, search 4, distinct 4, feas 4, perf 4; total 24) closest: science-experiment-kit; metaphor: component assembly with on/off simulation. 3. Plant watering schedule kit (value 3, share 3, search 3, distinct 3, feas 5, perf 5; total 22) closest: science-experiment-kit. Chosen: paper-airplane-kit. Core by run 2: basic preset + step checkoffs + preview. Run 1 done: presets (dart/glider/stunt), checkoff steps, live CSS plane preview that scales/rotates with progress, progress bar, URL deep-link, branded PNG, EN+ES. Run 2 done: added optional challenge modes (distance/stunt) with score on full completion + URL param, safety tips list, polished CSS preview with simple tail fin, challenge score in PNG. Run 3 done: added 4th design (Delta Wing, beginner-friendly triangular), materials checklist, estimated time per design, reset steps button, mobile preview constrained to 280px max, slight wing/nose adjustments per design. Run 4 done: accessibility (aria-live on progress, role=img on preview, aria-pressed on challenges, better labels, min-h touch targets 44-48px), next-step highlight with ring, clearer step instructions and helper text, progressbar role. Acceptance met. Ready for CLOSE.
```

<!-- end:ideas-lab-state.md -->
