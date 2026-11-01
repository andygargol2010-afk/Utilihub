# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: memory-match-classic
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
- 2026-11-01 | games | memory-match-classic | Classic memory match pairs game complete after 4 runs. Grid of face-down cards; flip two at a time to find matching pairs. Score based on moves and time. Levels with increasing pairs. Presets for themes (animals, numbers, symbols). URL deep-link for seed. Branded PNG of completed board or high score. EN+ES. Mobile-first 390px. No heavy canvas; CSS grid + state. IP-safe traditional mechanics. Acceptance met.
- 2026-10-31 | adsense-prep | adsense-compliance-kit | Interactive AdSense readiness and compliance kit complete after 4 runs. 10 weighted discrete checks, live score 0-100 + progress bar + readiness badge, presets, per-item tips + suggestions, top missing panel, URL deep-link (?c=), branded PNG scorecard, copy image or download, copy link, reset. EN+ES routes (/growth/adsense-compliance-kit, /es/crecimiento/kit-cumplimiento-adsense), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-31 | share-hooks | quote-card-maker | Interactive quote card maker complete after 4 runs. ... (full list preserved in previous)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive bin packing simulator. User selects item sizes from presets (or custom), places them into a fixed container via click or simple controls (CSS), sees live utilization percentage, waste, score. Challenges or goals. URL deep-link for seed config. Branded PNG of packed result. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state. IP-safe.
id: bin-packing-sim
path_en: /simulators/bin-packing
path_es: /es/simuladores/empaque-cajas
domain: simulators
runs_total: 4
runs_remaining: 1
acceptance: User selects items, places them in the container, achieves high utilization score or completes a challenge, and can share PNG or link.
share: both
next_step_required: yes
notes: Rubric scores (value/share/search/distinct/feas/perf): A-BinPack 4/4/4/5/5/5=27 (closest: none particle or freehand; metaphor: spatial packing constraint solver; why not particle: discrete item placement in bin, no trails/attractors); B-QueueFlow 4/3/3/4/5/5=24 (closest: simple process visuals; metaphor: sequential resource flow); C-TrajectoryPlot 3/3/4/3/4/3=20 (closest: physics demos; metaphor: parametric trajectory; may risk canvas). Chosen A. Domain roll: CORE simulators (balance underused domain, variety mandate vs recent games/playgrounds). IP: n/a (original sim). Run plan: 1 core packing UI + utilization, 2 presets/challenges, 3 score/PNG/share, 4 polish/mobile. Run 1 done: core CSS grid-like placement, item select, click-to-place with overlap check, live util %. Run 2 done: 4 challenges (free, 80% util, small-items 90%, mixed 70% with ≥3 types) with restricted item sets, live goal indicator, success badge. EN+ES. Mobile considered. Run 3 done: score=util%, best score localStorage per challenge, moves counter, branded PNG download of packed board (title, util, score, grid, utilihub.app), URL deep-link (?ch=challenge), share link button + PNG button. EN+ES. Mobile 390px ok.
adsense-prep_runs: 6
```

<!-- end:ideas-lab-state.md -->
