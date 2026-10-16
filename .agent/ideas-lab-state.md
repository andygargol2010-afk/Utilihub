# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: journeys
last_closed_id: river-light
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
idea: Traffic bet — instrument key interactions with Vercel Analytics custom events (tool open, share click, next-step click) so we can measure engagement and conversion on playgrounds/tools. Low-traffic site (~500 daily visits per external estimates); goal is baseline metrics for future bets. No UI change beyond optional debug log. EN+ES pages unaffected.
id: traffic-events
path_en: n/a
path_es: n/a
domain: traffic-bets
runs_total: 3
runs_remaining: 3
acceptance: pending
share: n/a
next_step_required: no
notes: GROWTH FIXED urn roll (U=0.47→GROWTH, U_g=0.31<p_fixed→FIXED; equal weight traffic-bets vs search-magnets). Prefer Analytics findings (site has Vercel Analytics). Baseline for measurable growth.
adsense-prep_runs: 1
```

<!-- end:ideas-lab-state.md -->
