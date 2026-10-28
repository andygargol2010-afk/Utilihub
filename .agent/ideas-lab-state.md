# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: retention-loops
last_closed_id: retention-loops-streak-constellation
p_fixed: 0.35

weights_core:
  kits: 4
  journeys: 5
  games: 1
  simulators: 8
  studio-composition: 3
  playgrounds: 9
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
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-28 | retention-loops | retention-loops-streak-constellation | Daily streak constellation visualizer complete after 4 runs. Interactive canvas star placement, check-in streak (localStorage + URL deep-link), milestone colors/progress bar, optional name personalization, branded PNG export, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-27 | seo-locales | seo-locales-de-shell | German (de) SEO-first locale shell + 4 experiences (/de, /de/fluid-ink-flow-playground, /de/pulse-catch, /de/snake, /de/pong) complete after 4 runs. Full German titles, descriptions, UI strings via locale=de, hreflang alternates, minimal shell, no primary nav links from EN/ES. CWV-safe. Adsterra intact.
- 2026-10-27 | seo-locales | seo-locales-fr-shell | French (fr) SEO-first locale shell + 4 experiences (/fr, /fr/fluid-ink-flow-playground, /fr/pulse-catch, /fr/snake, /fr/pong) complete after 4 runs. Full French titles, descriptions, UI strings via locale=fr, hreflang alternates, minimal shell, no primary nav links from EN/ES. CWV-safe. Adsterra intact.
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
- 2026-10-27 | search-magnets | orbit-pulse-catcher-guide | Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game complete after 6 runs. Full EN+ES depth including scoring formula, drills, 15-min plan. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive magnetic field lines sandbox where users place and drag north/south magnetic poles on a canvas; live animated field lines update in real time based on pole positions and strengths. Supports URL deep-link for setups, branded PNG export, EN+ES routes and UI. Mobile-friendly at 390px with modest line counts for CWV.
id: magnetic-field-sandbox
path_en: /magnetic-field-sandbox
path_es: /es/sandbox-campo-magnetico
path_seo: n/a
domain: playgrounds
runs_total: 4
runs_remaining: 4
acceptance: User places a north and a south pole on the canvas, sees curved field lines animate between them, can drag the poles to update the lines live, and exports a branded PNG.
share: both
next_step_required: yes
notes: Rubric scores (value/share/search/distinct/feas/perf): C1 magnetic-field-sandbox 5/4/4/4/5/4 total 26; C2 fractal-zoom-explorer 4/5/4/5/4/3 total 25; C3 sound-reactive-particles 4/3/3/3/4/3 total 20. Chosen magnetic-field-sandbox (highest total, strong feasibility). Roll: p_fixed=0.35 → FLEX core (playgrounds weight 9 highest). Closest existing surfaces: gravity-sandbox (n-body), aurora-particle-playground, fluid-ink-flow-playground. adsense-prep_runs: 3
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
