# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: search-magnets
last_closed_id: orbit-pulse-catcher-guide
p_fixed: 0.35

weights_core:
  kits: 4
  journeys: 5
  games: 1
  simulators: 8
  studio-composition: 3
  playgrounds: 11
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
- 2026-10-27 | search-magnets | orbit-pulse-catcher-guide | Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game complete after 6 runs. Full EN+ES depth including scoring formula, drills, 15-min plan. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Fluid Ink Flow playground. User draws freehand strokes that become viscous flowing ink with adjustable viscosity, color mixing on overlaps, particle density, gravity pull, and surface tension. Live preview, pause/randomize/clear, keyboard shortcuts, PNG share with baked title + utilihub.com + stroke count, localStorage persist, URL deep-link. EN+ES routes. Distinct from aurora-ribbon-weaver (ribbon streams), aurora-particle-playground (discrete particles), and color-cascade-fusion by viscous fluid ink composition + mixing aesthetic.
id: fluid-ink-flow-playground
path_en: /fluid-ink-flow-playground
path_es: /es/fluid-ink-flow-playground
path_seo: n/a
domain: playgrounds
runs_total: 4
runs_remaining: 2
acceptance: User draws a stroke on canvas, sees viscous multi-color ink flow along it with adjustable controls and mixing, and shares a branded PNG of the composition.
share: png
next_step_required: no
notes: Run 1/4 EXECUTE: shipped working core — freehand canvas drawing, particle-based viscous ink flow with viscosity/density/gravity/surface-tension controls, color variety, pause/randomize/clear, keyboard shortcuts, localStorage persist, branded PNG export (title + utilihub.com + stroke count). EN+ES routes + next-step catalog entry. Core playable. Next: refine mixing aesthetic, URL deep-link, more polish.
Run 2/4 EXECUTE: added URL deep-link (?ink= base64 restores full strokes on load, prefers over localStorage) + refined particle color mixing (nearby different colors lerp RGB). URL updates on save/clear/randomize. EN+ES help text updated. Mixing more visible. Next: final polish / mobile density tuning / close if solid.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
