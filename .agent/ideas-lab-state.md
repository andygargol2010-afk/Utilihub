# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: kits
last_closed_id: paper-airplane-kit
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
- 2026-11-03 | kits | paper-airplane-kit | Interactive paper airplane design kit complete after 4 runs. User selects preset design (classic dart, glider, stunt, delta wing), follows multi-step fold instructions with checkoffs and live CSS preview of the plane shape, sees progress, estimated folds/time, materials checklist, optional challenges (distance/stunt) with score, generates branded PNG or copies deep-link URL. EN+ES routes, mobile-first 390px. CSS illustrations + state + checklists. Acceptance met (select preset, checkoff steps, preview updates, PNG or share URL). IP: original educational paper craft assembler.
- 2026-11-03 | games | connect-four-classic | Interactive classic Connect Four game complete after 4 runs. 7x6 grid, drop discs by gravity, connect 4 win, optional AI, hover ghost preview, drop animation, win pulse, move counter, keyboard 1-7, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select column, see fall/response, detect win/draw, share PNG/URL). IP: traditional public-domain gravity drop connect-4 mechanics, generic naming, no Hasbro branding.
- 2026-11-03 | games | sudoku-classic | Interactive classic Sudoku puzzle complete after 4 runs. 9x9 grid with pre-filled cells, user fills remaining with 1-9 ensuring no duplicates in rows, columns, or 3x3 boxes. Live conflict highlighting, optional pencil notes (auto-fill possibles), undo, timer with pause/resume, difficulty presets (easy/medium/hard), URL deep-link for seed, branded PNG of completed grid, remaining-count badges on number pad (disabled at 0), progress indicator. EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (select difficulty, fill cells, see conflicts/valid, complete or use undo/pencil/hints, share PNG/URL). IP: traditional public-domain rules, generic naming, no branded puzzle sets.
- 2026-11-03 | games | minesweeper-classic | Interactive classic Minesweeper-style grid game complete after 4 runs. Rectangular grid with hidden mines; click to reveal cells showing adjacent mine counts, flood-fill empty areas, flag suspected mines (question marks cycle). Win by revealing all safe or flagging all; lose on mine. Difficulties (easy 9x9/10, medium 16x16/40, hard 16x30/99), first-click safe, URL deep-link, branded PNG, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (reveal/flag, complete or lose, share PNG/URL, face reset, auto-flag on win). IP: traditional public-domain mechanics, generic naming, no Microsoft branding.
- 2026-11-02 | games | othello-classic | Interactive classic Othello/Reversi board game complete after 4 runs. 8x8 grid, place discs that flip opponents in lines when bracketing, valid moves highlighted, optional simple AI (greedy max-flips), URL deep-link (?b=), branded PNG of board, EN+ES routes, mobile-first 390px. CSS grid + state. Acceptance met (place disc, see flips, AI respond, share PNG/URL). IP: traditional public-domain mechanics, generic naming.
- 2026-11-02 | seo-locales | pt-product-parity | Full Portuguese (pt-BR) product surface under /pt/ after 11 runs. Partial parity: home, tools/games/simulators indexes, several high-traffic experiences with PT chrome/meta/hreflang. Catalog tool-name translations and remaining experiences incomplete; not registered active. Closed at budget. Next IDEATE.
- 2026-11-02 | growth-surfaces | achievement-certificate-maker | Interactive achievement certificate maker complete after 4 runs. User selects template (classic diploma, modern badge, playful award), enters name/title/date/message/issued-by, sees live CSS preview with decorative seal, customizes colors, generates branded PNG or copies deep-link URL. Quick-fill presets. EN+ES routes. Mobile-first 390px. Pure form + declarative layout + canvas PNG. No particles. Acceptance met (fills form, sees live preview, downloads PNG or copies share URL).
- 2026-11-01 | retention-loops | progress-passport | Interactive digital progress passport complete after 4 runs. User earns discrete stamps by completing challenges across kits/games/simulators, pages fill with stamps + progress bar + collection stats. Generate branded PNG of passport/progress, share link with deep-link. EN+ES routes. Mobile-first 390px. CSS stamp book + localStorage. No heavy canvas or particles. Acceptance met (user marks stamp, sees update, shares PNG or link).
- 2026-11-01 | kits | science-experiment-kit | Interactive kids science experiment kit builder complete after 4 runs. User selects theme from presets (volcano, slime, simple circuit, plant growth), gets discrete materials list, follows multi-step guided assembly with checkoffs and safety tips, sees progress, estimated time, and can generate branded PNG of the completed setup or share link. Challenges for age groups. URL deep-link for theme. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state + checklists. IP-safe original educational assembler. Acceptance met.
- 2026-11-01 | simulators | bin-packing-sim | Interactive bin packing simulator complete after 4 runs. User selects item sizes from presets, places them into a fixed container via click (CSS grid placement with overlap check), sees live utilization percentage, waste, score. Challenges/goals with restricted sets. URL deep-link (?ch=). Branded PNG of packed result. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state. IP-safe original spatial packing. Acceptance: User selects item, places them, achieves high utilization or completes challenge, shares PNG or link. Run 4 polish: undo last placement, faint grid overlay for guidance, slightly larger bin max, updated instructions.
```

---

## ACTIVE PROJECT

```
status: active
idea: Enhance the existing Privacy Policy and Cookie Policy (EN + ES) with more comprehensive, structured disclosures covering third-party advertising cookies, data processing practices, user rights, opt-out methods, and language aligned with common AdSense/Google publisher policy expectations. Keep all current Adsterra mentions intact. Improve readability, add clear sections, update last-modified dates, and ensure mobile-friendly layout. This prepares the trust pages for higher readiness without implementing or modifying any ad code.
id: adsense-policy-readiness
path_en: /privacy /cookies
path_es: /es/privacidad /es/cookies
path_seo: n/a
domain: adsense-prep
runs_total: 4
runs_remaining: 2
acceptance: User visits /privacy or /cookies (EN or ES), sees expanded structured sections on advertising cookies, third parties, rights and opt-outs; pages remain readable at 390px with no broken layout.
share: n/a
next_step_required: yes
notes: Rubric (1-5): CandA (policy enhance): value=5 share=2 search=3 distinct=4 feas=5 perf=5 total=24. CandB (About/Contact E-E-A-T): value=4 share=2 search=3 distinct=3 feas=5 perf=5 total=22. CandC (expand compliance kit items): value=4 share=3 search=3 distinct=3 feas=4 perf=5 total=22. Closest-3 for A: existing privacy.tsx/cookies.tsx, adsense-compliance-kit, about.tsx. Primary metaphor: declarative content → trust/legal pages. Why not particle-canvas: pure text/policy update, no interactive canvas. Chosen: adsense-policy-readiness. Roll: two-urn FIXED (p=0.148), weights_growth excl seo-locales, selected adsense-prep (11/34). adsense-prep_runs remains 6 until CLOSE. Run 1: expanded EN+ES privacy/cookies with third-party ad disclosures (Adsterra kept + potential Google), rights, opt-outs, updated dates. Core readable sections added; further polish possible in remaining runs. Run 2: added structured sections (data retention, legal bases, international transfers, children's privacy), improved readability, consistent hreflang on ES privacy, date updates to 3 Nov 2026. Adsterra intact. Ready for further polish or close.
adsense-prep_runs: 6
```

<!-- end:ideas-lab-state.md -->
