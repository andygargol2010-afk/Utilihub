# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: seo-locales
last_closed_id: seo-locales-fr-shell
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
- 2026-10-27 | seo-locales | seo-locales-fr-shell | French (fr) SEO-first locale shell + 4 experiences (/fr, /fr/fluid-ink-flow-playground, /fr/pulse-catch, /fr/snake, /fr/pong) complete after 4 runs. Full French titles, descriptions, UI strings via locale=fr, hreflang alternates, minimal shell, no primary nav links from EN/ES. CWV-safe. Adsterra intact.
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
- 2026-10-27 | search-magnets | orbit-pulse-catcher-guide | Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game complete after 6 runs. Full EN+ES depth including scoring formula, drills, 15-min plan. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Add German (de) SEO-first locale with minimal shell and full localization of key interactive experiences (playgrounds/games) for search discovery via hreflang, no primary nav links from EN/ES. Mirror the successful fr shell pattern for next priority locale.
id: seo-locales-de-shell
path_en: n/a
path_es: n/a
path_seo: /de
domain: seo-locales
runs_total: 4
runs_remaining: 1
acceptance: User opens /de and at least one experience route (e.g. /de/fluid-ink-flow-playground or equivalent), sees complete German titles, descriptions, and UI strings; hreflang present; no EN/ES navigation links to it.
share: n/a
next_step_required: yes
notes: IDEATE roll: p_fixed=0.35, random~0.52 > p_fixed → FLEX urn. Weighted selection favored seo-locales (w=10). Candidates scored 1-5 (value/share/search/distinct/feas/perf):
1. seo-locales-de-shell: 4/2/5/4/5/4 =24 (chosen) Closest: /fr, /pt, EN/ES shells.
2. retention-loops-streak-constellation: 5/4/3/3/4/4 =23 Closest: existing Daily Progress Constellation, progress trackers.
3. search-magnets-fluid-ink-guide: 4/3/4/3/5/5 =24 Closest: orbit-pulse-catcher-guide, other long-form guides.
Chosen highest/tied with search demand priority and domain weight. Project size 4 runs. Must deliver playable/useful core by run 2.
EXECUTE 1/4: added /de shell (German home with titles/descriptions/UI) + /de/fluid-ink-flow-playground with full German localization (locale=de support added to FluidInkFlowPlayground for labels/buttons/tips/PNG watermark). hreflang alternates present. Minimal shell, no primary nav from EN/ES. Registered de as active in seo-locales.ts + registry. Core playable experience delivered. Adsterra intact. CWV-safe.
EXECUTE 2/4: added /de/pulse-catch with full German localization (locale=de support added to PulseCatch for labels/buttons/tips/share text). Updated /de home with link and list entry. hreflang present. Minimal shell. Adsterra intact. CWV-safe. Second experience delivered.
EXECUTE 3/4: added /de/snake with full German localization (locale=de support added to SnakeGame for canvas labels, buttons, hints, dpad, best/play/pause/resume strings). Updated /de home with link and list entry. hreflang present. Minimal shell. Adsterra intact. CWV-safe. Third experience delivered.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
