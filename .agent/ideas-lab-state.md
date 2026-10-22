# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: traffic-diagnosis
last_closed_id: weekly-analytics-review-2026-10-22
p_fixed: 0.35

weights_core:
  kits: 11
  journeys: 8
  games: 2
  simulators: 7
  studio-composition: 1
  playgrounds: 3
  quality-lift: 4

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 9
  share-hooks: 1
  retention-loops: 3
  conversion-paths: 9
  traffic-diagnosis: 2
  adsense-prep: 7
  seo-locales: 6   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-22 | traffic-diagnosis | weekly-analytics-review-2026-10-22 | Diagnóstico 7d (15-22 Oct) vs prior (8-15 Oct): pageviews 161 vs 166 (-3%, no -15%), visitors 41 vs 60 (-32%). Home / : 28 pageviews. Sin umbral de sitio en pageviews ni errores 2x detectados (eventos custom requieren plan superior). Tráfico bajo pero estable en views; caída de visitantes a investigar. Adsterra intacto. A: monitorear; B: no acción inmediata; C: profundizar en futuras runs si caída persiste.
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
- 2026-10-21 | retention-loops | daily-progress-constellation | Interactive Daily Progress Constellation complete: canvas stars + lines + name baked in PNG + milestones + reset + hover tooltips + editable name (EN+ES)
- 2026-10-21 | search-magnets | solar-system-scale-explorer | Interactive Solar System Scale Explorer complete with light-travel times, live scale, focus ring, presets, moons, Pluto (EN+ES)
- 2026-10-20 | playgrounds | aurora-particle-playground | Interactive Aurora Particle Playground complete with bloom intensity + share (EN+ES)
- 2026-10-20 | retention-loops | return-streak-board | Interactive Return Streak Board complete with share (EN+ES)
- 2026-10-20 | seo-locales | pt | Portuguese (pt-BR) beachhead complete: /pt home + pulse-catch + orbit-defender + snake + pong (1/5 active)
- 2026-10-20 | quality-lift | pulse-catch-arena | Elevated Pulse Catch Arena with perfect-catch system + combo fire + fever (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Shareable Aura Card Composer: users design a personal aura card with selectable color schemes, particle density, bloom, background gradients, and custom quote or name. Generates a high-quality PNG with baked title and a short unique share ID for optional URL deep-link. Visual delight + shareability. EN+ES routes. next-step before Adsterra. CWV-safe lazy route.
id: aura-card-share
path_en: /aura-card
path_es: /es/aura-card
domain: share-hooks
runs_total: 6
runs_remaining: 2
acceptance: pending
share: both
next_step_required: yes
notes: U=0.472 <0.50 → GROWTH. U_g=0.974 >0.35 → FLEX. Weighted sample → share-hooks. EXECUTE 1/6: core + EN/ES routes + next-step + PNG. EXECUTE polish: URL deep-link (c/d/b/g/q/id), particle cap CWV, aura halo. EXECUTE: Randomize button (schemes/density/bloom/bg/quote) + swirl/halo polish. EXECUTE: visual polish — added ocean+magma schemes, pulsing multi-stop halo, stronger tangential swirl, scheme-colored text glow, extra quotes. EXECUTE smoke: routes live in code, next-step registered in PLAYGROUNDS + JOURNEYS, Adsterra before next-step, CWV particle cap + lazy. Production utilihub.net lags (preview protected); code complete. Próximos: close if no further visual needed.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
