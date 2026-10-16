# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: adsense-prep
last_closed_id: terms-of-use
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
  growth-surfaces: 2
  share-hooks: 2
  retention-loops: 2
  conversion-paths: 2
  traffic-diagnosis: 2
  adsense-prep: 1
  seo-locales: 2   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 2
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
- 2026-10-16 | traffic-bets | traffic-events | Traffic Events Instrumentation
- 2026-10-15 | journeys | river-light | River of Light Journey
- 2026-10-15 | studio-composition | glow-trail | Glow Trail Composer
- 2026-10-15 | games | pulse-catch | Pulse Catch
- 2026-10-1x | playgrounds | gravity-particles | Gravity Particles (prior)
- 2026-10-1x | growth-surfaces | postcard | Particle Postcard (prior)
- 2026-10-1x | studio-composition | neon-sign | Neon Signature Studio (prior)
- 2026-10-1x | playgrounds | kaleidoscope-mandala | Kaleidoscope Mandala (prior)
```

---

## ACTIVE PROJECT

```
status: active
idea: Crear guía SEO profunda de interés compuesto (Compound Interest Guide) en EN (/guides/compound-interest) y ES (/es/guias/interes-compuesto): explicación clara con fórmulas, ejemplos prácticos, tabla de crecimiento, visual simple y enlace a la calculadora de interés compuesto del sitio. Contenido original orientado a capturar búsquedas informacionales (how compound interest works, interés compuesto ejemplos) complementando las herramientas financieras.
id: compound-interest-guide
path_en: /guides/compound-interest
path_es: /es/guias/interes-compuesto
domain: search-magnets
runs_total: 3
runs_remaining: 1
acceptance: pending
share: n/a
next_step_required: no
notes: DOMAIN ROLL U=0.362 → GROWTH. U_g=0.075 < 0.35 → FIXED urn (traffic-bets|search-magnets). Sampled search-magnets (equal weight 3). last_closed adsense-prep → no re-roll. FIXED: no weight updates. adsense-prep_runs stays 2. Idea fits finance tools + SEO depth, distinct from particle-physics-guide. EXECUTE 1/3: EN+ES guide pages shipped with formulas, examples, growth table, FAQ and links to calculator. EXECUTE 2/3: polished — added relative growth bar visual (CSS), fixed breadcrumbs (removed non-existent /guides link), added both guides to sitemap.xml with hreflang. Smoke blocked by Vercel preview SSO protection. Ready for final review/close next run.
adsense-prep_runs: 2
```

<!-- end:ideas-lab-state.md -->
