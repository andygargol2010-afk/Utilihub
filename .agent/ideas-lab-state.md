# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: traffic-diagnosis
last_closed_id: weekly-diagnosis-2026-10-25
p_fixed: 0.35

weights_core:
  kits: 2
  journeys: 3
  games: 8
  simulators: 6
  studio-composition: 1
  playgrounds: 9
  quality-lift: 5

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
- 2026-10-25 | traffic-diagnosis | weekly-diagnosis-2026-10-25 | Diagnóstico de tráfico 7d (18-25 oct) vs prior (11-18 oct): site pageviews 159 vs 179 (-11.2%, por encima de umbral -15%). Home /: 27 vs 47 pv (-42.5%, bajo umbral -25% de ruta). Otras rutas de bajo volumen estables o variables. Sin acceso a custom events (plan). No evidencia de 2× errores. Adsterra intacto. Recomendación A: monitorear home engagement (spotlight/value-path recientes); B: no cambios urgentes en ads; C: posible estacionalidad o efecto de nuevas superficies. Closed after 1 run.
- 2026-10-25 | studio-composition | modular-pattern-composer | Interactive Modular Pattern Composer complete: place modular tiles on grid with live procedural animations (flow/pulse/morph/spin), multi-layers with blend/opacity, symmetry (mirror/radial), tile library (geometric/organic/particle + hex/blob), color palettes + gradients, playback controls, brush size for multi-cell place/erase, PNG share with baked title + utilihub.com + tile count, URL deep-link for settings, localStorage auto-persist of composition. EN+ES routes. CWV-safe (grid 12, layer cap 6, no heavy deps). Adsterra intact. Closed after 6 runs. Distinct from freehand neon-layer by modular/repeatable systems + animation playback.
- 2026-10-25 | kits | kitchen-prep-board | Interactive Kitchen Prep Board complete: multi-recipe selector (chicken bowl / veggie stir-fry / overnight oats), visual servings scaler, ingredient checklist with live scale, step reorder ↑↓, circular SVG timer ring, live summary strip, richer PNG share (recipe/servings/progress/checked/current step + utilihub.com) + ExperienceShareButton URL share, localStorage persist. EN+ES routes. CWV-safe (no heavy assets/deps). Adsterra intact. Closed after 4 runs. Coherent multi-step kit elevating kits beyond static tool lists.
- 2026-10-25 | traffic-bets | daily-experience-spotlight | Daily Experience Spotlight on home EN+ES complete: daily rotation (day-of-year + localStorage avoid) of high-value experiences (aurora, n-body, neon-layer, prism-trail, color-cascade, aura-card), short teaser, direct deep-link CTA, ExperienceShareButton + data-events (spotlight-view/click/share), TODAY badge, rotation countdown, experience-specific accents. Lazy load after hero. CWV-safe (no heavy assets/deps). Adsterra intact. Closed after 4 runs. Measurable bet on recovering visitor drop via higher home engagement and shares.
- 2026-10-24 | conversion-paths | home-value-path-boost | Sección Ruta de valor / Value Path en home EN+ES completa: 3 experiencias aleatorias de pool de 6 (aurora, n-body, neon, prism, color-cascade, aura), progreso localStorage (1 de 3), botón Nueva/New, CTAs claros, data-events (value-path-click + value-path-refresh), barra de progreso y mensaje de completado. Lazy load en home. CWV-safe (sin assets pesados ni deps nuevas). Adsterra intacto. Closed after 4 runs. Mejora rutas de conversión desde home hacia experiencias interactivas de alto valor.
- 2026-10-24 | journeys | waypoint-river-journey | Interactive Waypoint River Journey complete: place/drag waypoints to define flowing particle river, fading trails (4-24), speed/width/bloom/density/gravity controls, attractors, pause/randomize/clear, keyboard (Space/R/C), PNG share with baked title + utilihub.com + waypoint count, URL deep-link (?wp=). EN+ES routes. CWV-safe (density cap 80, lazy canvas). Next-step before Adsterra. Adsterra intact. Closed after 6 runs. Distinct path/progression experience.
- 2026-10-24 | search-magnets | n-body-gravity-guide | Original long-form SEO guide (EN+ES) on interactive N-body and multi-attractor gravity simulations complete. Explains Newtonian force summation, soft collisions, fading trails, body glow, presets, numerical integration (Euler vs semi-implicit), energy/virial, circular binary worked example, practical tuning (G/softening/timestep/scale), mutual vs fixed-attractor contrast, camera, CWV caps, FAQs and deep links to the live simulator + related playgrounds. Original explanatory text for search depth. EN+ES routes with meta, hreflang, breadcrumbs. CWV-safe (static). Adsterra intact. Closed after 6 runs.
- 2026-10-24 | traffic-bets | shareable-experiences-boost | Shareability boost complete: ExperienceShareButton (Web Share API + clipboard + data-event share_click) on top experiences headers EN+ES (aurora, neon-layer, n-body, color-cascade, prism-trail, aura-card) + cards in ExperienceDiscoveryRail. Home teaser "Shareable Experiences" / "Experiencias compartibles" with deep-links. EN+ES. CWV-safe (light events, no heavy assets). Adsterra intact. Closed after 4 runs. Bet on referral traffic from shares.
- 2026-10-24 | growth-surfaces | experience-discovery-rail | Horizontal discovery rail on home EN+ES complete: category chips, deterministic shuffle, horizontal snap cards with short desc + deep links, category gradient previews + icons, scroll chevrons + fade edges, keyboard (arrows/S), data-events. Surfaces 10 experiences. Lightweight CSS only, no heavy assets/deps. Improves discovery beyond Random Experience button. EN+ES. CWV-safe. Closed after 4 runs. Adsterra intact.
- 2026-10-23 | studio-composition | neon-layer-composer | Interactive Neon Layer Composer complete: freehand multi-layer neon canvas, bloom, symmetry (mirror/radial/kaleido), continuous + stroke particle emitters with gravity/wind, pointer force attract/repel, particle lifetime + size, bg modes (void/glow/grid), layer opacity/fade, title overlay, PNG share with branding, URL deep-link, pause + keyboard (Space/C/U/R), randomize. EN+ES. CWV-safe (cap 280, lazy). Closed after 6 runs. Adsterra intact. Distinct from prism-trail.
```

---

## ACTIVE PROJECT

```
status: active
idea: Original long-form SEO guide (EN+ES) on the Modular Pattern Composer. Explains modular tile systems on a grid, live procedural animations (flow/pulse/morph/spin), multi-layer blend/opacity, symmetry (mirror/radial), tile library (geometric/organic/particle + hex/blob), color palettes + gradients, playback controls, brush size for multi-cell place/erase, PNG share with branding, URL deep-link, localStorage auto-persist. Practical composition tips, distinction from freehand neon-layer, FAQs, and deep links to the live experience + related playgrounds. Original explanatory text for search depth. Static pages, CWV-safe.
id: modular-pattern-composer-guide
path_en: /guides/modular-pattern-composer
path_es: /es/guias/modular-pattern-composer
domain: search-magnets
runs_total: 6
runs_remaining: 5
acceptance: pending
share: n/a
next_step_required: no
notes: DOMAIN ROLL IDEATE: U=0.37 < 0.50 → GROWTH. U_g=0.28 < 0.35 → FIXED urn (traffic-bets | search-magnets, equal weights 3). Selected search-magnets. FIXED: no weight updates. last_closed_domain=traffic-diagnosis ≠ match (no re-roll). Idea leverages recently closed modular-pattern-composer for SEO depth (distinct from n-body-gravity-guide). EXECUTE 1/6: shipped full original long-form EN+ES guide pages with meta, hreflang, breadcrumbs, deep links to live composer, FAQs, practical tips, distinction from neon-layer. CWV-safe static. Adsterra intact. Next: polish / expand sections or internal links if needed.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
