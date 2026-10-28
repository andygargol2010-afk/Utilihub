# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: minesweeper-classic
p_fixed: 0.35

weights_core:
  kits: 4
  journeys: 5
  games: 2
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
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5; RESET 2026-10-28 empty actives

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-28 | ops | seo-locales-reset | Human-directed reset: deleted thin pt/fr/de shells; SEO_LOCALES_ACTIVE=[]; registry parity bar + min 11 runs policy. Domain restarts from zero (priority still pt → fr → de → …).
- 2026-10-28 | games | minesweeper-classic | Classic Minesweeper interactive game complete after 4 runs. Grid reveal (numbers/mines), flag (right-click/long-press), chord on open numbers, difficulties, timer/best, seeded URL deep-link, Same-board practice button, branded PNG, EN+ES dedicated routes (/minesweeper, /es/buscaminas), mobile 390px aspect-square cells. CWV-safe. Adsterra intact.
- 2026-10-28 | playgrounds | magnetic-field-sandbox | Interactive magnetic field lines sandbox complete after 4 runs. Place/drag N/S poles, live curved field lines (monopole tracing), flowing particles (toggle), directional arrowheads N→S, presets (Dipole, Two North, Quadrupole), URL deep-link, branded PNG, EN+ES routes, mobile 390px with modest line/particle caps. CWV-safe. Adsterra intact.
- 2026-10-28 | retention-loops | retention-loops-streak-constellation | Daily streak constellation visualizer complete after 4 runs. Interactive canvas star placement, check-in streak (localStorage + URL deep-link), milestone colors/progress bar, optional name personalization, branded PNG export, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
- 2026-10-27 | search-magnets | orbit-pulse-catcher-guide | Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game complete after 6 runs. Full EN+ES depth including scoring formula, drills, 15-min plan. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive SIR epidemic compartmental model simulator. Users set transmission rate (β), recovery rate (γ), initial infected, population size; see live updating S/I/R curves over time. Discrete interventions (vaccination campaign, lockdown) as toggles that modify rates mid-run. Parameter URL deep-link for sharing specific scenarios. Branded PNG of the curve chart. EN+ES routes and UI. Mobile-friendly charts (390px). No freehand drawing — pure parameter → effect model with readouts.
id: sir-epidemic-simulator
path_en: /sir-epidemic-simulator
path_es: /es/simulador-epidemia-sir
path_seo: n/a
domain: simulators
runs_total: 4
runs_remaining: 2
acceptance: User adjusts R0 or rates, sees S/I/R curves update live; toggles an intervention and sees the peak/flatten change; can share URL with current params. Peak I is tracked and marked.
share: both
next_step_required: yes
notes: EXECUTE run 2/4 (2026-10-28): added live Peak I tracking + day of peak, amber marker on the infected curve when visible in window, Peak I in HUD (5-col grid), updated help text explaining that interventions can stop the peak from rising. Core remains playable. Previous: EXECUTE run 1/4 dedicated routes, URL deep-link, toggles, PNG. IDEATE 2026-10-28. Roll: after games close, variety mandate prefers simulators/kits/journeys over playgrounds (saturated particle/canvas). CORE weights simulators=8 high. p_fixed=0.35 → treated as CORE. Candidates: 1) SIR Epidemic Simulator (metaphor: parameter-driven compartmental dynamics + live curves + discrete interventions; closest-3: BudgetSurvivorGame decision-outcomes, FormulaMemory learning, OrbitPulse timing; why not particle-canvas: no freehand/attractors/trails, pure model+graphs; scores value5 share4 search4 distinct5 feas4 perf4 =26). 2) Double Pendulum (metaphor: chaotic mechanical params + trajectory; closest: magnetic-field, fluid-ink trails, orbit games; distinct3 because trails; scores 4/3/3/3/4/3=20). 3) Circuit Resistance Kit (metaphor: discrete component assembly → voltage/current readouts; closest none pure; scores 4/3/3/4/4/5=23). Picked 1. IP: n/a (original model). Core by run 2 required. Note: seo-locales domain was reset 2026-10-28 (thin shells removed; min 11 runs + parity bar).
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->