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
status: done
idea: Crear páginas de Términos de Uso (Terms of Use) en EN (/terms) y ES (/es/terminos) para cerrar el gap de confianza AdSense: uso aceptable, responsabilidad, anuncios (Adsterra), propiedad intelectual, limitación de garantía y contacto. Una página clara y profesional que complemente About, Privacy y Legal.
id: terms-of-use
path_en: /terms
path_es: /es/terminos
domain: adsense-prep
runs_total: 2
runs_remaining: 0
acceptance: shipped
share: n/a
next_step_required: no
notes: DOMAIN ROLL U=0.438 → GROWTH. U_g=0.521 > 0.35 → FLEX urn. Sampled adsense-prep (weight 2). last_closed search-magnets → no re-roll. Weight updates: selected adsense-prep→1; other FLEX +1. adsense-prep_runs 1→2. Priority About/Privacy already solid → Terms next. EXECUTE 2026-10-16: shipped /terms + /es/terminos (acceptable use, IP, Adsterra ads, warranties, liability, contact), footer links, sitemap. Adsterra kept. Final polish: added last-updated note (Oct 2026) EN+ES. Production deploy lag noted (previews READY, prod on prior commit); pages in branch ready for next prod promote.
adsense-prep_runs: 2
```

<!-- end:ideas-lab-state.md -->
