# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: othello-classic
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
- 2026-11-02 | games | othello-classic | Interactive classic Othello/Reversi board game complete after 4 runs. 8x8 grid, place discs that flip opponents in lines when bracketing, valid moves highlighted, optional simple AI (greedy max-flips), URL deep-link (?b=), branded PNG of board, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (place disc, see flips, AI respond, share PNG/URL). IP: traditional public-domain mechanics, generic naming.
- 2026-11-02 | seo-locales | pt-product-parity | Full Portuguese (pt-BR) product surface under /pt/ after 11 runs. Partial parity: home, tools/games/simulators indexes, several high-traffic experiences with PT chrome/meta/hreflang. Catalog tool-name translations and remaining experiences incomplete; not registered active. Closed at budget. Next IDEATE.
- 2026-11-02 | growth-surfaces | achievement-certificate-maker | Interactive achievement certificate maker complete after 4 runs. User selects template (classic diploma, modern badge, playful award), enters name/title/date/message/issued-by, sees live CSS preview with decorative seal, customizes colors, generates branded PNG or copies deep-link URL. Quick-fill presets. EN+ES routes. Mobile-first 390px. Pure form + declarative layout + canvas PNG. No particles. Acceptance met (fills form, sees live preview, downloads PNG or copies share URL).
- 2026-11-01 | retention-loops | progress-passport | Interactive digital progress passport complete after 4 runs. User earns discrete stamps by completing challenges across kits/games/simulators, pages fill with stamps + progress bar + collection stats. Generate branded PNG of passport/progress, share link with deep-link. EN+ES routes. Mobile-first 390px. CSS stamp book + localStorage. No heavy canvas or particles. Acceptance met (user marks stamp, sees update, shares PNG or link).
- 2026-11-01 | kits | science-experiment-kit | Interactive kids science experiment kit builder complete after 4 runs. User selects theme from presets (volcano, slime, simple circuit, plant growth), gets discrete materials list, follows multi-step guided assembly with checkoffs and safety tips, sees progress, estimated time, and can generate branded PNG of the completed setup or share link. Challenges for age groups. URL deep-link for theme. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state + checklists. IP-safe original educational assembler. Acceptance met.
- 2026-11-01 | simulators | bin-packing-sim | Interactive bin packing simulator complete after 4 runs. User selects item sizes from presets, places them into a fixed container via click (CSS grid placement with overlap check), sees live utilization percentage, waste, score. Challenges/goals with restricted sets. URL deep-link (?ch=). Branded PNG of packed result. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state. IP-safe original spatial packing. Acceptance: User selects item, places them, achieves high utilization or completes challenge, shares PNG or link. Run 4 polish: undo last placement, faint grid overlay for guidance, slightly larger bin max, updated instructions.
- 2026-11-01 | games | memory-match-classic | Classic memory match pairs game complete after 4 runs. Grid of face-down cards; flip two at a time to find matching pairs. Score based on moves and time. Levels with increasing pairs. Presets for themes (animals, numbers, symbols). URL deep-link for seed. Branded PNG of completed board or high score. EN+ES. Mobile-first 390px. No heavy canvas; CSS grid + state. IP-safe traditional mechanics. Acceptance met.
- 2026-10-31 | adsense-prep | adsense-compliance-kit | Interactive AdSense readiness and compliance kit complete after 4 runs. 10 weighted discrete checks, live score 0-100 + progress bar + readiness badge, presets, per-item tips + suggestions, top missing panel, URL deep-link (?c=), branded PNG scorecard, copy image or download, copy link, reset. EN+ES routes (/growth/adsense-compliance-kit, /es/crecimiento/kit-cumplimiento-adsense), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-31 | share-hooks | quote-card-maker | Interactive quote card maker complete after 4 runs. ... (full list preserved in previous)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive classic Minesweeper-style grid game. Rectangular grid with hidden mines; click to reveal cells showing adjacent mine counts (numbers), flood-fill empty areas, right-click or button to flag suspected mines. Win by revealing all safe cells or correctly flagging all mines; lose on revealing a mine. Difficulty levels (easy 9x9/10, medium 16x16/40, hard). First click safe. URL deep-link for seed/difficulty. Branded PNG of final board. EN+ES routes. Mobile-first 390px. CSS grid + state, no canvas. Traditional public-domain mechanics, generic naming, no Microsoft branding or assets.
id: minesweeper-classic
path_en: /games/minesweeper-classic
path_es: /es/juegos/buscaminas-clasico
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 1
acceptance: User clicks a cell, sees number or flood-reveal, flags mines (or question marks), completes board without hitting mine or sees explosion, optionally downloads PNG or copies share URL. Face button resets.
share: both
next_step_required: yes
notes: IDEATE: domain roll games (weight 5). 3 candidates scored: 1) minesweeper-classic (value 5, share 4, search 5 "play minesweeper online", distinct 4, feas 5, perf 4) total ~27; 2) connect-four-classic (value 4, share 4, search 4, distinct 3 vs othello/memory, feas 5, perf 5) ~25; 3) original grid-path puzzle (value 3, share 3, search 2, distinct 5, feas 4, perf 4) ~21. Picked minesweeper. Closest-3: memory-match-classic (grid flip/reveal), othello-classic (grid place), bin-packing-sim (grid placement). Primary metaphor: grid reveal with flood-fill and flagging for mine avoidance. Why not particle-canvas: discrete rules-based board game, CSS grid clicks and state, no freehand or trails. IP: traditional minesweeper-style reveal (adjacent counts, flood fill empty, flag mines; generic UI and naming; no Microsoft Minesweeper branded assets or exact clone of protected expression). Roll math: p_fixed 0.35 not triggered for FIXED; FLEX/CORE weighted toward games after recent closes. adsense-prep_runs: 6. EXECUTE run 1: core already present and playable (difficulties, flood, flags, first-safe, seed URL, PNG, EN+ES, mobile). Added Flag Mode toggle for easier mobile flagging (tap places flag when ON). Acceptance core met. EXECUTE run 2: replaced stub MinesweeperClassicGame.tsx with full implementation. Standard classic sizes (easy 9×9/10, medium 16×16/40, hard 16×30/99). Flag Mode toggle (tap flags when ON). First-click always safe, flood-fill, chord on numbers, long-press flag, seed URL deep-link, branded PNG, EN+ES strings, mobile-first with horizontal scroll for hard. Acceptance: user can select difficulty, reveal/flag cells, complete or lose, share PNG/URL. EXECUTE run 3: added question-mark cycle (flag → ❓ → empty) on right-click / long-press / Flag Mode tap; status face button (😀/🙂/😎/😵) that resets; improved PNG with status emoji and mines-left; updated instructions EN+ES; path_es corrected to buscaminas-clasico. Acceptance enhanced.
```

<!-- end:ideas-lab-state.md -->
