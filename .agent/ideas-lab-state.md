# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: traffic-bets
last_closed_id: shareable-experiences-boost
p_fixed: 0.35

weights_core:
  kits: 14
  journeys: 11
  games: 5
  simulators: 3
  studio-composition: 1
  playgrounds: 6
  quality-lift: 2

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 1
  share-hooks: 3
  retention-loops: 5
  conversion-paths: 11
  traffic-diagnosis: 4
  adsense-prep: 9
  seo-locales: 8   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-24 | traffic-bets | shareable-experiences-boost | Shareability boost complete: ExperienceShareButton (Web Share API + clipboard + data-event share_click) on top experiences headers EN+ES (aurora, neon-layer, n-body, color-cascade, prism-trail, aura-card) + cards in ExperienceDiscoveryRail. Home teaser "Shareable Experiences" / "Experiencias compartibles" with deep-links. EN+ES. CWV-safe (light events, no heavy assets). Adsterra intact. Closed after 4 runs. Bet on referral traffic from shares.
- 2026-10-24 | growth-surfaces | experience-discovery-rail | Horizontal discovery rail on home EN+ES complete: category chips, deterministic shuffle, horizontal snap cards with short desc + deep links, category gradient previews + icons, scroll chevrons + fade edges, keyboard (arrows/S), data-events. Surfaces 10 experiences. Lightweight CSS only, no heavy assets/deps. Improves discovery beyond Random Experience button. EN+ES. CWV-safe. Closed after 4 runs. Adsterra intact.
- 2026-10-23 | studio-composition | neon-layer-composer | Interactive Neon Layer Composer complete: freehand multi-layer neon canvas, bloom, symmetry (mirror/radial/kaleido), continuous + stroke particle emitters with gravity/wind, pointer force attract/repel, particle lifetime + size, bg modes (void/glow/grid), layer opacity/fade, title overlay, PNG share with branding, URL deep-link, pause + keyboard (Space/C/U/R), randomize. EN+ES. CWV-safe (cap 280, lazy). Closed after 6 runs. Adsterra intact. Distinct from prism-trail.
- 2026-10-23 | quality-lift | aurora-particle-playground | Elevated Aurora Particle Playground complete: multi-mode (ribbon/orb/vortex) bloom systems with adjustable persistent fading trails (trail length 4-24), attract/repel polarity + dynamic pointer force, additive lighter compositing, density/speed/bloom/gravity/wind, emitters (place/drag/remove, cap 8), palettes, randomize, pause, PNG share with baked title+utilihub.com+settings+trail, URL deep-link. Sets elevated standard above GravityParticlesPlayground (basic orbits) and ParticleMagnetLab (polarity/arrows) in layered multi-mode bloom delight + interactive emission + trail control. EN+ES. CWV-safe (cap 300, lazy). Closed after 7 runs. Adsterra intact. Bar moved permanently.
- 2026-10-23 | simulators | n-body-gravity-sim | Interactive N-Body Gravity Simulator complete: add celestial bodies (mass/velocity/color), live gravitational dynamics + soft collisions, fading alpha trails, body glow + specular highlight, presets (binary stars, mini solar 6 bodies, chaotic cluster, figure-8), zoom/pan/pinch-to-zoom, keyboard shortcuts (Space pause, R reset cam, C clear, +/- zoom), PNG share with baked title + utilihub.com + body count + URL deep-link for initial conditions. EN+ES routes. CWV-safe (body cap 20, lazy canvas). Closed after 7 runs. Adsterra intact.
- 2026-10-22 | share-hooks | aura-card-share | Interactive Shareable Aura Card Composer complete: color schemes (aurora/neon/sunset/cosmic/ocean/magma), density, bloom, bg gradient, custom quote/name, particle trails + swirl + pulsing halo, PNG share with baked title + URL deep-link (c/d/b/g/q/id), randomize, next-step before Adsterra. EN+ES. CWV-safe (particle cap, lazy). Production lags preview.
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Original long-form SEO guide (EN+ES) on interactive N-body and multi-attractor gravity simulations in the browser. Explains Newtonian force summation, soft collisions, fading trails, body glow, presets (binary, mini-solar, chaotic, figure-8), zoom/pan, performance caps, and how the live N-Body Gravity Simulator implements them. Includes formulas, intuition, FAQs, and deep links to the experience + related playgrounds. Original explanatory text for search depth (not thin affiliate or calculator content). EN+ES routes with proper meta, hreflang, breadcrumbs. CWV-safe (static content, no heavy assets).
id: n-body-gravity-guide
path_en: /guides/n-body-gravity
path_es: /es/guias/n-body-gravity
path_seo: n/a
domain: search-magnets
runs_total: 6
runs_remaining: 5
acceptance: pending
share: n/a
next_step_required: no
notes: U=0.1716 <0.50 GROWTH. U_g=0.146 <0.35 FIXED urn. Sampled traffic-bets (last_closed) → re-roll once → search-magnets. No weight updates (FIXED). Original text depth around existing N-Body experience for search magnets. Run 1: shipped full EN+ES long-form guides with formulas, presets, soft collisions, trails/glow, camera, CWV notes, FAQs and deep links. Adsterra intact.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
