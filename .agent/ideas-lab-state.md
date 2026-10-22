# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: traffic-bets
last_closed_id: random-experience-entry
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
  search-magnets: 1
  growth-surfaces: 7
  share-hooks: 7
  retention-loops: 1
  conversion-paths: 7
  traffic-diagnosis: 7
  adsense-prep: 5
  seo-locales: 4   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-22 | traffic-bets | random-experience-entry | Prominent Random Experience / Experiencia aleatoria button on home EN+ES: redirects to random curated interactive (aurora, pulse-catch, prism-trail, color-cascade, solar-system, daily-progress, return-streak). data-event for analytics. Increases session depth without new content. Adsterra intact, CWV-safe (light onClick).
- 2026-10-22 | studio-composition | prism-trail-composer | Interactive Prism Trail Composer complete: freehand multi-layer rainbow prism trails, bloom, schemes, mirrors, gravity, fade, backgrounds, smooth, title overlay baked in PNG + randomize controls, PNG share (EN+ES)
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
- 2026-10-21 | retention-loops | daily-progress-constellation | Interactive Daily Progress Constellation complete: canvas stars + lines + name baked in PNG + milestones + reset + hover tooltips + editable name (EN+ES)
- 2026-10-21 | search-magnets | solar-system-scale-explorer | Interactive Solar System Scale Explorer complete with light-travel times, live scale, focus ring, presets, moons, Pluto (EN+ES)
- 2026-10-20 | playgrounds | aurora-particle-playground | Interactive Aurora Particle Playground complete with bloom intensity + share (EN+ES)
- 2026-10-20 | retention-loops | return-streak-board | Interactive Return Streak Board complete with share (EN+ES)
- 2026-10-20 | seo-locales | pt | Portuguese (pt-BR) beachhead complete: /pt home + pulse-catch + orbit-defender + snake + pong (1/5 active)
- 2026-10-20 | quality-lift | pulse-catch-arena | Elevated Pulse Catch Arena with perfect-catch system + combo fire + fever (EN+ES)
- 2026-10-19 | games | orbit-defender-arcade | Interactive Orbit Defender Arcade (EN+ES)
```

---

## ACTIVE PROJECT

```
status: done
idea: Apuesta de crecimiento medible: añadir un botón prominente "Experiencia aleatoria" en la home (EN+ES) que redirige a un playground/juego/simulador/studio aleatorio de la lista existente. Aumenta profundidad de sesión y descubrimiento sin nuevo contenido pesado. Medible via analytics de clicks y bounce en futuro.
id: random-experience-entry
path_en: /
path_es: /es/
domain: traffic-bets
runs_total: 3
runs_remaining: 0
acceptance: done
share: n/a
next_step_required: no
notes: U=0.096 <0.50 → GROWTH. U_g=0.096 <0.35 → FIXED urn (traffic-bets/search-magnets). Seleccionado traffic-bets. No weight updates (FIXED). No match last_closed. Idea concreta de entrada aleatoria para bet de tráfico/exploración. EXECUTE 1/3, 2/3, 3/3 completados: botón prominente Random Experience / Experiencia aleatoria shipped en home EN+ES (lista curada de 7 experiencias interactivas, data-event="random-experience-click" para futura medición). Adsterra intacto. CWV: onClick ligero, sin bloat en critical path. Cerrado.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
