# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: search-magnets
last_closed_id: compound-interest-guide
p_fixed: 0.35

weights_core:
  kits: 6
  journeys: 2
  games: 4
  simulators: 1
  studio-composition: 3
  playgrounds: 5

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
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
- 2026-10-16 | traffic-bets | traffic-events | Traffic Events Instrumentation
- 2026-10-15 | journeys | river-light | River of Light Journey
- 2026-10-15 | studio-composition | glow-trail | Glow Trail Composer
- 2026-10-15 | games | pulse-catch | Pulse Catch
- 2026-10-1x | playgrounds | gravity-particles | Gravity Particles (prior)
- 2026-10-1x | growth-surfaces | postcard | Particle Postcard (prior)
- 2026-10-1x | studio-composition | neon-sign | Neon Signature Studio (prior)
```

---

## ACTIVE PROJECT

```
status: active
idea: Double Pendulum Chaos Lab — interactive canvas simulator of a classic double pendulum. Users adjust initial angles, rod lengths and masses; watch the second bob draw a fading trail while the system evolves. Optional damping and gravity slider. Pause / reset / slight-perturbation button to show sensitive dependence. Lightweight HTML canvas, no new heavy deps, EN+ES routes under simulators catalog.
id: double-pendulum-chaos
path_en: /simulators/double-pendulum
path_es: /es/simuladores/pendulo-doble
domain: simulators
runs_total: 6
runs_remaining: 2
acceptance: pending
share: both
next_step_required: no
notes: IDEATE roll U=0.63 → CORE; cumulative weight sample R≈11/20 → simulators. Set simulators=1, other CORE +1. last_closed=search-magnets (different catalog) no re-roll. Adsterra kept. CWV: lazy route + modest canvas. EXECUTE 1/6: DoublePendulumSim.tsx + catalog entry (slug double-pendulum / pendulo-doble) + registry lazy + SIM_JOURNEYS links. Physics RK-style step, trail on tip, drag-to-set, perturb button. EXECUTE 2/6: energy HUD (θ1/θ2/E), PNG share download, refined trail fade + glow, aspect-ratio for CLS. EXECUTE 3/6: speed scale (0.25–2×), presets (Classic/Butterfly/Low energy), ω HUD, tip-speed colored trail (HSL + width). EXECUTE 4/6: twin chaos overlay (violet ghost with Δθ₁≈0.0015) + toggle to visualize sensitive dependence live; trails for both. Deploy tip prior ERROR fixed; free deploy quota previously RATE_LIMITED.
adsense-prep_runs: 2
```

<!-- end:ideas-lab-state.md -->
