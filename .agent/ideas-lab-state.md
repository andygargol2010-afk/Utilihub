# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: playgrounds
last_closed_id: fluid-ink-flow-playground
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
  retention-loops: 7
  conversion-paths: 2
  traffic-diagnosis: 1
  adsense-prep: 11
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
- 2026-10-27 | search-magnets | orbit-pulse-catcher-guide | Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game complete after 6 runs. Full EN+ES depth including scoring formula, drills, 15-min plan. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Add French (fr) SEO-first locale with minimal shell and full localization of key interactive experiences (playgrounds/games) for search discovery via hreflang, no primary nav links from EN/ES.
id: seo-locales-fr-shell
path_en: n/a
path_es: n/a
path_seo: /fr
domain: seo-locales
runs_total: 4
runs_remaining: 4
acceptance: User opens /fr and at least one experience route (e.g. /fr/fluid-ink-flow or equivalent), sees complete French titles, descriptions, and UI strings; hreflang present; no EN/ES navigation links to it.
share: n/a
next_step_required: yes
notes: Rubric scores (1-5): Candidate A (new fr shell + 3 pages): value=4, share=3, search=5, distinct=5, feas=4, perf=5, total=26. Candidate B (expand pt +4 pages): 3,3,4,3,5,5 total=23. Candidate C (new ar RTL +2 pages): 4,3,4,5,3,5 total=24. Chose A (highest, all >=3 on value/distinct). Domain roll: two-urn GROWTH, FLEX (simulated u=0.42 > p_fixed=0.35), weights favored seo-locales (10) among FLEX. adsense-prep_runs: 3 unchanged.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
