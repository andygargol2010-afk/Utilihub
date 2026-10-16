# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: traffic-bets
last_closed_id: traffic-events
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 1
  games: 3
  simulators: 5
  studio-composition: 2
  playgrounds: 4

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 1
  share-hooks: 1
  retention-loops: 1
  conversion-paths: 1
  traffic-diagnosis: 1
  adsense-prep: 2
  seo-locales: 1   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 1
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-16 | traffic-bets | traffic-events | Traffic Events Instrumentation
- 2026-10-15 | journeys | river-light | River of Light Journey
- 2026-10-15 | studio-composition | glow-trail | Glow Trail Composer
- 2026-10-15 | games | pulse-catch | Pulse Catch
- 2026-10-1x | playgrounds | gravity-particles | Gravity Particles (prior)
- 2026-10-1x | growth-surfaces | postcard | Particle Postcard (prior)
- 2026-10-1x | studio-composition | neon-sign | Neon Signature Studio (prior)
- 2026-10-1x | playgrounds | kaleidoscope-mandala | Kaleidoscope Mandala (prior)
- 2026-10-1x | playgrounds | constellation-studio | Constellation Share Studio (prior)
- 2026-10-1x | playgrounds | particle-signature | Particle Signature (prior)
```

---

## ACTIVE PROJECT

```
status: active
idea: Guía SEO original (EN+ES) sobre física de partículas en el navegador: cómo funcionan la gravedad, atracción y sistemas de partículas, con explicaciones, fórmulas, ejemplos visuales y CTAs a Gravity Particles Playground y River of Light. Contenido profundo para búsquedas como "particle simulation browser", "gravity particles online", "cómo funcionan las partículas".
id: particle-physics-guide
path_en: /guides/particle-physics
path_es: /es/guias/fisica-particulas
domain: search-magnets
runs_total: 4
runs_remaining: 4
acceptance: pending
share: n/a
next_step_required: no
notes: DOMAIN ROLL U=0.304 → GROWTH. U_g=0.233 < 0.35 → FIXED urn. Sampled search-magnets (weight 3). last_closed traffic-bets → no re-roll. No weight updates (FIXED). Idea targets existing playgrounds for depth without new calculators.
adsense-prep_runs: 1
```

<!-- end:ideas-lab-state.md -->
