# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: adsense-prep
last_closed_id: cookie-policy
p_fixed: 0.35

weights_core:
  kits: 7
  journeys: 3
  games: 5
  simulators: 2
  studio-composition: 4
  playgrounds: 1

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 3
  share-hooks: 3
  retention-loops: 3
  conversion-paths: 3
  traffic-diagnosis: 3
  adsense-prep: 1
  seo-locales: 3   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
- 2026-10-16 | traffic-bets | traffic-events | Traffic Events Instrumentation
- 2026-10-15 | journeys | river-light | River of Light Journey
- 2026-10-15 | studio-composition | glow-trail | Glow Trail Composer
- 2026-10-15 | games | pulse-catch | Pulse Catch
```

---

## ACTIVE PROJECT

```
status: done
idea: Cookie Policy pages (EN+ES) for Adsense trust: detail cookies used (analytics via Vercel, advertising via Adsterra and partners), local storage preferences, opt-out methods, third-party processors. Link from privacy page and site footer. No removal of Adsterra. Lightweight static pages only.
id: cookie-policy
path_en: /cookies
path_es: /es/cookies
domain: adsense-prep
runs_total: 1
runs_remaining: 0
acceptance: done
share: n/a
next_step_required: no
notes: EXECUTE shipped static Cookie Policy EN+ES, linked from privacy pages and footers. Adsterra untouched. adsense-prep_runs → 3. Ready for next IDEATE.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
