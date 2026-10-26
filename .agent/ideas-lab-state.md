# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: orbit-pulse-catcher
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
- 2026-10-26 | games | orbit-pulse-catcher | Interactive Orbit Pulse Catcher complete after 6 runs. Radial orbit timing + matching zones (grow to 8), combo multipliers, power-up pulses (+life + boost), particle bursts on catch/level-up/combo milestones (5/10), haptic, wide touch zones + ripples, keyboard 1-N/QWERTY, PNG share with branding + best/level/combo, localStorage high score. EN+ES. CWV-safe (lazy canvas, modest particles). Adsterra intact. Next-step registered. Distinct from Pulse Catch Arena / Refraction Challenge.
- 2026-10-26 | quality-lift | refraction-challenge | Elevated standard on Refraction Challenge (games family) complete after 6 runs. Live full-path dashed ray preview (green hit / amber miss) + solid aim indicator while adjusting angle; particle spark effects on lens refraction entry (cyan) and target hit (emerald + gold bursts, cap 48, short life, gravity drift); PNG share of successful path with branding (title + utilihub.com + level/shots baked on offscreen canvas); localStorage progress persistence (maxCleared + shots under utilihub_game_progress_refraction-challenge) with resume at next uncleared level + progress banner + Restart clears; +2 advanced levels (now 7 total: four/five lenses + tight/dense blockers, smaller targets). Distinctive capabilities peers (Minesweeper, Pong) still lack. EN+ES routes. CWV-safe (lazy canvas, modest particles, static level data). Adsterra intact. Bar moved for future quality-lift comparisons.
- 2026-10-26 | search-magnets | modular-pattern-composer-guide | Original long-form SEO guide (EN+ES) on the Modular Pattern Composer complete. Explains modular tile systems on a grid, live procedural animations (flow/pulse/morph/spin), multi-layer blend/opacity, symmetry (mirror/radial), tile library (geometric/organic/particle + hex/blob), color palettes + gradients, playback controls, brush size for multi-cell place/erase, PNG share with branding, URL deep-link, localStorage auto-persist. Practical composition tips, distinction from freehand neon-layer, worked example (flowing radial mandala), related experiences, FAQs (including share PNG vs deep-link and single-layer export). Original explanatory text for search depth. EN+ES static routes with meta, hreflang, breadcrumbs, deep links to live composer. CWV-safe. Adsterra intact. Closed after 6 runs. Distinct from n-body-gravity-guide.
- 2026-10-25 | traffic-diagnosis | weekly-diagnosis-2026-10-25 | Diagnóstico de tráfico 7d (18-25 oct) vs prior (11-18 oct): site pageviews 159 vs 179 (-11.2%, por encima de umbral -15%). Home /: 27 vs 47 pv (-42.5%, bajo umbral -25% de ruta). Otras rutas de bajo volumen estables o variables. Sin acceso a custom events (plan). No evidencia de 2× errores. Adsterra intacto. Recomendación A: monitorear home engagement (spotlight/value-path recientes); B: no cambios urgentes en ads; C: posible estacionalidad o efecto de nuevas superficies. Closed after 1 run.
- 2026-10-25 | studio-composition | modular-pattern-composer | Interactive Modular Pattern Composer complete: place modular tiles on grid with live procedural animations (flow/pulse/morph/spin), multi-layers with blend/opacity, symmetry (mirror/radial), tile library (geometric/organic/particle + hex/blob), color palettes + gradients, playback controls, brush size for multi-cell place/erase, PNG share with baked title + utilihub.com + tile count, URL deep-link for settings, localStorage auto-persist of composition. EN+ES routes. CWV-safe (grid 12, layer cap 6, no heavy deps). Adsterra intact. Closed after 6 runs. Distinct from freehand neon-layer by modular/repeatable systems + animation playback.
- 2026-10-25 | kits | kitchen-prep-board | Interactive Kitchen Prep Board complete: multi-recipe selector (chicken bowl / veggie stir-fry / overnight oats), visual servings scaler, ingredient checklist with live scale, step reorder ↑↓, circular SVG timer ring, live summary strip, richer PNG share (recipe/servings/progress/checked/current step + utilihub.com) + ExperienceShareButton URL share, localStorage persist. EN+ES routes. CWV-safe (no heavy assets/deps). Adsterra intact. Closed after 4 runs. Coherent multi-step kit elevating kits beyond static tool lists.
- 2026-10-25 | traffic-bets | daily-experience-spotlight | Daily Experience Spotlight on home EN+ES complete: daily rotation (day-of-year + localStorage avoid) of high-value experiences (aurora, n-body, neon-layer, prism-trail, color-cascade, aura-card), short teaser, direct deep-link CTA, ExperienceShareButton + data-events (spotlight-view/click/share), TODAY badge, rotation countdown, experience-specific accents. Lazy load after hero. CWV-safe (no heavy assets/deps). Adsterra intact. Closed after 4 runs. Measurable bet on recovering visitor drop via higher home engagement and shares.
- 2026-10-24 | conversion-paths | home-value-path-boost | Sección Ruta de valor / Value Path en home EN+ES completa: 3 experiencias aleatorias de pool de 6 (aurora, n-body, neon, prism, color-cascade, aura), progreso localStorage (1 de 3), botón Nueva/New, CTAs claros, data-events (value-path-click + value-path-refresh), barra de progreso y mensaje de completado. Lazy load en home. CWV-safe (sin assets pesados ni deps nuevas). Adsterra intacto. Closed after 4 runs. Mejora rutas de conversión desde home hacia experiencias interactivas de alto valor.
- 2026-10-24 | journeys | waypoint-river-journey | Interactive Waypoint River Journey complete: place/drag waypoints to define flowing particle river, fading trails (4-24), speed/width/bloom/density/gravity controls, attractors, pause/randomize/clear, keyboard (Space/R/C), PNG share with baked title + utilihub.com + waypoint count, URL deep-link (?wp=). EN+ES routes. CWV-safe (density cap 80, lazy canvas). Next-step before Adsterra. Adsterra intact. Closed after 6 runs. Distinct path/progression experience.
- 2026-10-24 | search-magnets | n-body-gravity-guide | Original long-form SEO guide (EN+ES) on interactive N-body and multi-attractor gravity simulations complete. Explains Newtonian force summation, soft collisions, fading trails, body glow, presets, numerical integration (Euler vs semi-implicit), energy/virial, circular binary worked example, practical tuning (G/softening/timestep/scale), mutual vs fixed-attractor contrast, camera, CWV caps, FAQs and deep links to the live simulator + related playgrounds. Original explanatory text for search depth. EN+ES routes with meta, hreflang, breadcrumbs. CWV-safe (static). Adsterra intact. Closed after 6 runs.
```

---

## ACTIVE PROJECT

```
status: active
idea: Original long-form SEO guide (EN+ES) on the Orbit Pulse Catcher interactive timing game. Explains radial orbit mechanics, zone matching that grows to 8 zones, combo multipliers, power-up pulses (+life +boost), particle bursts on catch/level-up/combo milestones, haptic feedback, wide touch zones with ripples, keyboard 1-N/QWERTY controls, PNG share with branding + best/level/combo stats, localStorage high scores. Practical high-score strategies, worked examples, distinction from other pulse/arcade games (Pulse Catch Arena, Refraction Challenge), deep links to the live game, FAQs. Static routes with meta, hreflang, breadcrumbs. CWV-safe. Adsterra intact.
id: orbit-pulse-catcher-guide
path_en: /guides/orbit-pulse-catcher
path_es: /es/guias/orbit-pulse-catcher
domain: search-magnets
runs_total: 6
runs_remaining: 4
acceptance: pending
share: n/a
next_step_required: no
notes: Roll: U=0.00317 < 0.50 → GROWTH; U_g=0.0873 < 0.35 → FIXED urn (traffic-bets:3 + search-magnets:3); selected search-magnets (no weight updates). Distinct from modular-pattern-composer-guide and n-body-gravity-guide. Targets recently closed orbit-pulse-catcher for search depth on timing/orbit games. EXECUTE 1/6: shipped initial long-form EN+ES static routes with core sections (radial mechanics, zones, combos, power-ups, particles/haptics, controls, PNG/localStorage, distinctions, strategies, FAQs, deep links). Adsterra intact. CWV-safe (static). EXECUTE 2/6: deepened with worked mid-run high-score example, zone growth pattern (4 + ~1/2 levels to 8), scoring scale details (combo/level/boost), denser particle/haptic notes, +2 FAQs, extra strategy bullet. EN+ES in sync. Adsterra intact. CWV-safe (static).
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
