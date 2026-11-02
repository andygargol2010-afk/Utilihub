# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: seo-locales
last_closed_id: pt-product-parity
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
idea: Interactive classic Othello/Reversi board game. 8x8 grid, players alternate placing discs that flip opponent's discs in straight lines when bracketing them. Valid moves highlighted. Win when board full or no moves; higher disc count wins. Optional simple AI opponent. Levels or just free play. URL deep-link for starting position or seed. Branded PNG of final board. EN+ES routes. Mobile-first 390px. CSS grid + state, no canvas. Traditional public-domain mechanics, generic naming, no branded assets.
id: othello-classic
path_en: /games/othello
path_es: /es/juegos/othello
path_seo: n/a
domain: games
runs_total: 4
runs_remaining: 4
acceptance: User clicks a valid empty square, sees disc placed and opponent discs flipped, continues until game end, sees winner and score, optionally downloads PNG or copies share URL.
share: both
next_step_required: yes
notes: Rubric (1-5): C1 othello-classic value=5 share=4 search=5 distinct=5 feas=5 perf=5 total=29; C2 checkers-classic value=4 share=4 search=4 distinct=5 feas=5 perf=5 total=27; C3 original-maze-escape value=4 share=3 search=3 distinct=4 feas=4 perf=5 total=23. Closest-3: memory-match-classic (grid flip), connect-four (grid place), bin-packing-sim (grid placement). Primary metaphor: turn-based grid placement with directional flip capture. Why not particle-canvas: discrete rules-based board game, CSS grid clicks, no freehand or trails. IP: traditional Reversi/Othello mechanics (public-domain rules; generic UI and naming; no commercial branded assets or art). Roll math: rand=0.33 < p_fixed=0.35 → FIXED; weighted among growth but variety override to CORE games (underused classic not on site). Chosen id=othello-classic. Variety: breaks particle sandbox cluster, prefers classic high-demand game type.
adsense-prep_runs: 6
```

<!-- end:ideas-lab-state.md -->
