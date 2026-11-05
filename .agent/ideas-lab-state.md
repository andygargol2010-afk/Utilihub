# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: kits
last_closed_id: simple-circuit-kit
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
- 2026-11-05 | kits | simple-circuit-kit | Interactive simple circuit kit complete after 4 runs. User places battery/switch/resistor/LED on 4x4 grid, connects with wires (visual SVG lines), sees live LED light + brightness by ohms (cycle 50-1000), guided mode with auto-check steps + progress, free mode, materials checklist, challenges, reset, URL deep-link (?g=), branded PNG. EN+ES routes, mobile-first 390px. Final polish: legend with symbols, tighter mobile gaps/fonts, animated wires on complete, a11y labels. Acceptance met (place/connect/test lights, share PNG/URL). IP: original educational discrete parts assembler, generic components, no branded kits.
- 2026-11-05 | simulators | population-dynamics-simulator | Interactive population dynamics simulator complete after 4 runs. User sets initial population, birth/death rates, carrying capacity; discrete generations show live SVG logistic growth chart with phase (growth/decline/stable), peak, gens to capacity. Compare two scenarios, Animate/Stop step reveal, presets, net rate r, K line, grid, generation counter, branded PNG + URL deep-link. EN+ES routes, mobile-first 390px. Final polish: legend, Reset button, slightly tighter mobile padding. Acceptance met (set params, run/see curve+stats, share PNG/URL). IP: original educational logistic growth model, generic params, no branded datasets.
- 2026-11-04 | games | checkers-classic | Interactive classic Checkers (Damas / Draughts) complete after 4 runs. 8x8 board, diagonal moves, jump captures with multi-jump chains, promotion to king, optional AI preferring long captures, move counter, undo, URL deep-link (?b=), branded PNG with moves, keyboard nav + a11y, EN+ES, mobile-first 390px. Acceptance met (select side, make legal moves/captures/kings, win by no pieces or no moves, share PNG/URL). IP: traditional public-domain checkers/draughts rules, generic pieces/colors, no commercial branding.
- 2026-11-04 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4/6x4/6x6), theme (fruits/animals/numbers/symbols), flips two cards to match pairs with CSS 3D, timer, moves, efficiency stars (1-5), keyboard nav + a11y, URL deep-link seed, branded PNG, EN+ES, mobile-first 390px with tighter gaps/fonts on small screens. Acceptance met (select size, match all, see stats/stars, share PNG/URL). IP: traditional public-domain pair-matching, generic emoji, no commercial decks.
- 2026-11-03 | adsense-prep | adsense-policy-readiness | Privacy and Cookie Policy (EN+ES) enhanced for AdSense readiness after 4 runs. Expanded structured sections on third-party ad cookies (Adsterra kept intact + potential Google), rights, opt-outs with live links (NAI, aboutads, Ad Settings), data retention, legal bases, international transfers, children's privacy, key points summaries, and a dedicated readiness section. Mobile-friendly prose at 390px. Acceptance met (user sees comprehensive disclosures on /privacy /cookies and ES equivalents). IP: original policy content updates.
- 2026-11-03 | kits | paper-airplane-kit | Interactive paper airplane design kit complete after 4 runs. User selects preset design (classic dart, glider, stunt, delta wing), follows multi-step fold instructions with checkoffs and live CSS preview of the plane shape, sees progress, estimated folds/time, materials checklist, optional challenges (distance/stunt) with score, generates branded PNG or copies deep-link URL. EN+ES routes, mobile-first 390px. CSS illustrations + state + checklists. Acceptance met (select preset, checkoff steps, preview updates, PNG or share URL). IP: original educational paper craft assembler.
- 2026-11-03 | games | connect-four-classic | Interactive classic Connect Four game complete after 4 runs. 7x6 grid, drop discs by gravity, connect 4 win, optional AI, hover ghost preview, drop animation, win pulse, move counter, keyboard 1-7, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select column, see fall/response, detect win/draw, share PNG/URL). IP: traditional public-domain gravity drop connect-4 mechanics, generic naming, no Hasbro branding.
- 2026-11-03 | games | sudoku-classic | Interactive classic Sudoku puzzle complete after 4 runs. 9x9 grid with pre-filled cells, user fills remaining with 1-9 ensuring no duplicates in rows, columns, or 3x3 boxes. Live conflict highlighting, optional pencil notes (auto-fill possibles), undo, timer with pause/resume, difficulty presets (easy/medium/hard), URL deep-link for seed, branded PNG of completed grid, remaining-count badges on number pad (disabled at 0), progress indicator. EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select difficulty, fill cells, see conflicts/valid, complete or use undo/pencil/hints, share PNG/URL). IP: traditional public-domain rules, generic naming, no branded puzzle sets.
- 2026-11-03 | games | minesweeper-classic | Interactive classic Minesweeper-style grid game complete after 4 runs. Rectangular grid with hidden mines; click to reveal cells showing adjacent mine counts, flood-fill empty areas, flag suspected mines (question marks cycle). Win by revealing all safe or flagging all; lose on mine. Difficulties (easy 9x9/10, medium 16x16/40, hard 16x30/99), first-click safe, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (reveal/flag, complete or lose, share PNG/URL, face reset, auto-flag on win). IP: traditional public-domain mechanics, generic naming, no Microsoft branding.
- 2026-11-02 | games | othello-classic | Interactive classic Othello/Reversi board game complete after 4 runs. 8x8 grid, place discs that flip opponents in lines when bracketing, valid moves highlighted, optional simple AI (greedy max-flips), URL deep-link (?b=), branded PNG of board, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (place disc, see flips, AI respond, share PNG/URL). IP: traditional public-domain mechanics, generic naming.
```

---

## ACTIVE PROJECT

```
status: active
idea: Full product-parity Portuguese (pt-BR bias) locale surface under /pt/... matching current EN home structure, tools hubs, games/simulators indexes, high-traffic experiences, legal/privacy/contact, hreflang + sitemap. No thin shell. Register active only when parity bar met. Load registry + seo-locales.ts each run.
id: pt-product-parity
path_en: n/a
path_es: n/a
path_seo: /pt/...
domain: seo-locales
runs_total: 12
runs_remaining: 7
acceptance: User visits /pt/ and sees full EN-parity home + key hubs/experiences in Portuguese; hreflang/sitemap present; pages_done tracked; not a minimal shell.
share: n/a
next_step_required: yes
notes: Rubric A(pt)=25 B(fr)=23 C(de)=22. Closest-3: EN home/tools/games, ES equivalents, deleted 2026-10-28 thin shells. Primary metaphor: full locale product tree. Why not particle-canvas: not a playground. IP: n/a. Chosen pt (priority #1, highest score). Roll: FLEX weighted (seo-locales 10). Parity plan: home + tools hub + games/sim indexes + high-traffic experiences + legal pages; update registry + seo-locales.ts on activation. Min 11 runs. pages_done: /pt/, /pt/ferramentas, /pt/jogos, /pt/simuladores, /pt/privacidade, /pt/cookies, /pt/contato, /pt/sobre, /pt/playgrounds, /pt/kits, /pt/jornadas (jornadas hub added this run with PT strings linking to key journeys; hreflang updated on EN/ES journeys + sitemap).
adsense-prep_runs: 7
```

<!-- end:ideas-lab-state.md -->