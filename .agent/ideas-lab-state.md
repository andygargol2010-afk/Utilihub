# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: adsense-prep
last_closed_id: adsense-policy-readiness
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
- 2026-11-03 | adsense-prep | adsense-policy-readiness | Privacy and Cookie Policy (EN+ES) enhanced for AdSense readiness after 4 runs. Expanded structured sections on third-party ad cookies (Adsterra kept intact + potential Google), rights, opt-outs with live links (NAI, aboutads, Ad Settings), data retention, legal bases, international transfers, children's privacy, key points summaries, and a dedicated readiness section. Mobile-friendly prose at 390px. Acceptance met (user sees comprehensive disclosures on /privacy /cookies and ES equivalents). IP: original policy content updates.
- 2026-11-03 | kits | paper-airplane-kit | Interactive paper airplane design kit complete after 4 runs. User selects preset design (classic dart, glider, stunt, delta wing), follows multi-step fold instructions with checkoffs and live CSS preview of the plane shape, sees progress, estimated folds/time, materials checklist, optional challenges (distance/stunt) with score, generates branded PNG or copies deep-link URL. EN+ES routes, mobile-first 390px. CSS illustrations + state + checklists. Acceptance met (select preset, checkoff steps, preview updates, PNG or share URL). IP: original educational paper craft assembler.
- 2026-11-03 | games | connect-four-classic | Interactive classic Connect Four game complete after 4 runs. 7x6 grid, drop discs by gravity, connect 4 win, optional AI, hover ghost preview, drop animation, win pulse, move counter, keyboard 1-7, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select column, see fall/response, detect win/draw, share PNG/URL). IP: traditional public-domain gravity drop connect-4 mechanics, generic naming, no Hasbro branding.
- 2026-11-03 | games | sudoku-classic | Interactive classic Sudoku puzzle complete after 4 runs. 9x9 grid with pre-filled cells, user fills remaining with 1-9 ensuring no duplicates in rows, columns, or 3x3 boxes. Live conflict highlighting, optional pencil notes (auto-fill possibles), undo, timer with pause/resume, difficulty presets (easy/medium/hard), URL deep-link for seed, branded PNG of completed grid, remaining-count badges on number pad (disabled at 0), progress indicator. EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select difficulty, fill cells, see conflicts/valid, complete or use undo/pencil/hints, share PNG/URL). IP: traditional public-domain rules, generic naming, no branded puzzle sets.
- 2026-11-03 | games | minesweeper-classic | Interactive classic Minesweeper-style grid game complete after 4 runs. Rectangular grid with hidden mines; click to reveal cells showing adjacent mine counts, flood-fill empty areas, flag suspected mines (question marks cycle). Win by revealing all safe or flagging all; lose on mine. Difficulties (easy 9x9/10, medium 16x16/40, hard 16x30/99), first-click safe, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (reveal/flag, complete or lose, share PNG/URL, face reset, auto-flag on win). IP: traditional public-domain mechanics, generic naming, no Microsoft branding.
- 2026-11-02 | games | othello-classic | Interactive classic Othello/Reversi board game complete after 4 runs. 8x8 grid, place discs that flip opponents in lines when bracketing, valid moves highlighted, optional simple AI (greedy max-flips), URL deep-link (?b=), branded PNG of board, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (place disc, see flips, AI respond, share PNG/URL). IP: traditional public-domain mechanics, generic naming.
- 2026-11-02 | seo-locales | pt-product-parity | Full Portuguese (pt-BR) product surface under /pt/ after 11 runs. Partial parity: home, tools/games/simulators indexes, several high-traffic experiences with PT chrome/meta/hreflang. Catalog tool-name translations and remaining experiences incomplete; not registered active. Closed at budget. Next IDEATE.
- 2026-11-02 | growth-surfaces | achievement-certificate-maker | Interactive achievement certificate maker complete after 4 runs. User selects template (classic diploma, modern badge, playful award), enters name/title/date/message/issued-by, sees live CSS preview with decorative seal, customizes colors, generates branded PNG or copies deep-link URL. Quick-fill presets. EN+ES routes. Mobile-first 390px. Pure form + declarative layout + canvas PNG. No particles. Acceptance met (fills form, sees live preview, downloads PNG or copies share URL).
- 2026-11-01 | retention-loops | progress-passport | Interactive digital progress passport complete after 4 runs. User earns discrete stamps by completing challenges across kits/games/simulators, pages fill with stamps + progress bar + collection stats. Generate branded PNG of passport/progress, share link with deep-link. EN+ES routes. Mobile-first 390px. CSS stamp book + localStorage. No heavy canvas or particles. Acceptance met (user marks stamp, sees update, shares PNG or link).
- 2026-11-01 | kits | science-experiment-kit | Interactive kids science experiment kit builder complete after 4 runs. User selects theme from presets (volcano, slime, simple circuit, plant growth), gets discrete materials list, follows multi-step guided assembly with checkoffs and safety tips, sees progress, estimated time, and can generate branded PNG of the completed setup or share link. Challenges for age groups. URL deep-link for theme. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state + checklists. IP-safe original educational assembler. Acceptance met.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive classic Memory Match (Concentration) card game. User flips two cards at a time on a grid to find matching pairs (emoji or simple geometric icons). Difficulties (4x4 easy, 6x4 medium, 6x6 hard), timer, move counter, efficiency star rating, optional simple themes, URL deep-link for seed/layout, branded PNG of completed board or score card. EN+ES routes, mobile-first 390px. CSS 3D flip + state. Acceptance met when user selects size, matches all pairs, sees win stats, shares PNG or URL. IP: traditional public-domain pair-matching rules, generic naming, no branded card decks or commercial themes.
id: memory-match-classic
path_en: /games/memory-match-classic
path_es: /es/juegos/memoria-pares
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 2
acceptance: User selects difficulty, flips cards to match pairs (mismatches flip back, matches stay), completes board or resets, sees timer/moves/stars, shares PNG or deep-link URL.
share: both
next_step_required: yes
notes: Rubric (1-5): Cand1 Memory Match value=4 share=4 search=5 (queries: memory game online, matching cards, concentration game) distinct=4 (closest-3: hangman letter-by-letter, sudoku grid fill, minesweeper cell reveal; primary metaphor: flip-two-to-match pairs on grid; why not particle-canvas: discrete card flip state machine, no freehand or trails) feasibility=5 perf=5. Cand2 Battleship grid-hunt value=4 share=3 search=4 distinct=3 (closest connect-four, minesweeper) metaphor: hidden ship placement. Cand3 Lights Out toggle value=3 share=3 search=3 distinct=4. Chosen memory-match-classic total ~27. Roll math: FLEX (p_fixed 0.35 not hit), growth weights rolled share-hooks in sim but VARIETY MANDATE + last_closed=adsense-prep (GROWTH) + underused classic games prefer games domain. IP check: traditional Concentration/Memory/Pelmanism mechanics, generic emoji/icons, no commercial IP. Run 1: updated SIZES to 4x4 Easy / 6x4 Medium / 6x6 Hard to match idea. Core flip/match/timer/moves/share/PNG already present. Run 2: added efficiency star rating (1-5 stars based on move efficiency vs ideal pairs + light time bonus; displayed in stats bar, win banner, and branded PNG). Next: optional simple themes polish or a11y/keyboard. adsense-prep_runs: 7
adsense-prep_runs: 7
```

<!-- end:ideas-lab-state.md -->
