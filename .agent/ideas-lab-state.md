# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: adsense-prep
last_closed_id: adsense-compliance-kit
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
- 2026-10-31 | adsense-prep | adsense-compliance-kit | Interactive AdSense readiness and compliance kit complete after 4 runs. 10 weighted discrete checks, live score 0-100 + progress bar + readiness badge, presets, per-item tips + suggestions, top missing panel, URL deep-link (?c=), branded PNG scorecard, copy image or download, copy link, reset. EN+ES routes (/growth/adsense-compliance-kit, /es/crecimiento/kit-cumplimiento-adsense), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-31 | share-hooks | quote-card-maker | Interactive quote card maker complete after 4 runs. ... (full list preserved in previous)
```

---

## ACTIVE PROJECT

```
status: active
idea: Classic memory match pairs game. Grid of face-down cards; flip two at a time to find matching pairs. Score based on moves and time. Levels with increasing pairs. Presets for themes (animals, numbers, symbols). URL deep-link for seed. Branded PNG of completed board or high score. EN+ES. Mobile-first 390px. No heavy canvas; CSS grid + state. IP-safe traditional mechanics.
id: memory-match-classic
path_en: /games/memory-match-classic
path_es: /es/juegos/memoria-pares
domain: games
runs_total: 4
runs_remaining: 1
acceptance: User starts game, flips cards, matches all pairs, sees score and can share PNG or link. Themes selectable. On clear, can advance to next larger grid size.
share: both
next_step_required: yes
notes: Rubric scores (value/share/search/distinct/feas/perf): A-MemoryMatch 4/3/5/4/5/5=26 (closest: hangman/minesweeper/tic-tac-toe; metaphor: flip-to-match grid puzzle; not particle-canvas); B-ConnectFour 4/3/4/4/5/5=25 (closest: similar grid games; metaphor: gravity-drop connect; IP: traditional connect-four style); C-SpatialPackingSim 4/4/3/4/4/4=23 (closest: debt snowball visual; metaphor: constraint spatial packing; not particle). Chosen A. Domain roll: CORE games (underused vs playgrounds; variety mandate). IP: traditional memory match pairs (generic UI; no branded assets). Why not particle: discrete card flip grid, no freehand trails/attractors. Run 1: added 4 theme presets (fruits/animals/numbers/symbols), URL param theme, per-theme best scores. Core playable already present from prior wiring. Run 2: added next-level advance on clear (4x3→4x4→6x4), win screen button + all-sizes message. EN+ES. Mobile 390px. No heavy deps. Run 3: added combined score (moves*10 + time), live score display, best score tracking + "new personal best" badge on win, score in PNG header. EN+ES.
adsense-prep_runs: 6
```

<!-- end:ideas-lab-state.md -->
