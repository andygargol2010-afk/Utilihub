# UtiliHub Ideas Lab \u2014 State (3/3)

**Part 3 of 3 \u2014 runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: seo-locales
last_closed_id: seo-locales-de-shell
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
  seo-locales: 10   # retire \u2192 0 when SEO_LOCALES_ACTIVE length \u2265 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-27 | seo-locales | seo-locales-de-shell | German (de) SEO-first locale shell + 4 experiences (/de, /de/fluid-ink-flow-playground, /de/pulse-catch, /de/snake, /de/pong) complete after 4 runs. Full German titles, descriptions, UI strings via locale=de, hreflang alternates, minimal shell, no primary nav links from EN/ES. CWV-safe. Adsterra intact.
- 2026-10-27 | seo-locales | seo-locales-fr-shell | French (fr) SEO-first locale shell + 4 experiences (/fr, /fr/fluid-ink-flow-playground, /fr/pulse-catch, /fr/snake, /fr/pong) complete after 4 runs. Full French titles, descriptions, UI strings via locale=fr, hreflang alternates, minimal shell, no primary nav links from EN/ES. CWV-safe. Adsterra intact.
- 2026-10-27 | playgrounds | fluid-ink-flow-playground | Interactive Fluid Ink Flow playground complete after 4 runs. Freehand viscous multi-color ink with mixing, controls (viscosity/density/gravity/tension), URL deep-link, mobile density tuning, branded PNG, EN+ES. CWV-safe particle caps. Adsterra intact.
- 2026-10-27 | search-magnets | orbit-pulse-catcher-guide | Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game complete after 6 runs. Full EN+ES depth including scoring formula, drills, 15-min plan. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Build a daily streak constellation visualizer that rewards consecutive visits to interactive experiences (playgrounds/games) with a growing, shareable star map. Users check in daily, complete a light challenge or just visit, and see their constellation expand with stars, lines, and colors. Includes EN+ES, URL deep-link for progress (localStorage + query param), branded PNG export, mobile-friendly at 390px. Distinct from existing daily-progress-constellation by adding interactive star placement, growth animation, and share hooks.
id: retention-loops-streak-constellation
path_en: /streak-constellation
path_es: /es/constelacion-racha
path_seo: n/a
domain: retention-loops
runs_total: 4
runs_remaining: 2
acceptance: User visits the page, sees current streak and constellation canvas; after simulated or real check-in sees a new star appear; can export branded PNG and share via URL that restores progress.
share: both
next_step_required: yes
notes: IDEATE roll: p_fixed=0.35, random~0.61 > p_fixed \u2192 FLEX urn. Weighted selection favored retention-loops (w=7) after recent seo-locales. Candidates scored 1-5 (value/share/search/distinct/feas/perf):
1. retention-loops-streak-constellation: 5/5/3/4/4/4 =25 (chosen) Closest: daily-progress-constellation, constellation.tsx, aura-card.
2. retention-loops-progress-garden: 4/4/2/3/5/5 =23 Closest: daily-progress-constellation, playgrounds index, growth-surfaces.
3. share-hooks-particle-signature: 4/5/3/3/4/4 =23 Closest: aura-card, firma-visual, neon-sign.
Chosen for highest total, strong shareability and retention value, feasible in 4 runs (core playable by run 2). Must deliver interactive canvas + basic streak by run 2.
Run 1 (this): Shipped interactive canvas component with click/touch star placement, daily check-in streak logic (localStorage + query deep-link restore), growth animation, branded PNG export, lazy-loaded EN route /streak-constellation and ES /es/constelacion-racha, mobile 390px layout, Adsterra intact. Core playable achieved early.
Run 2: Milestone visual rewards (cyan <7, gold >=7, purple >=14, rainbow >=30), stronger lines/glow, copy share link button, streak number overlay on branded PNG export, immediate save on check-in. EN+ES. CWV-safe. Adsterra intact.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
