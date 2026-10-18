# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: kits
last_closed_id: home-renovation-kit
p_fixed: 0.35

weights_core:
  kits: 3
  journeys: 9
  games: 6
  simulators: 5
  studio-composition: 1
  playgrounds: 2
  quality-lift: 6

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
- 2026-10-18 | kits | home-renovation-kit | Interactive Home Renovation Kit (EN+ES)
- 2026-10-17 | simulators | boids-flocking-lab | Boids Flocking Lab (EN+ES)
- 2026-10-17 | games | pulse-catch-arena | Pulse Catch Arena (EN+ES)
- 2026-10-17 | search-magnets | canvas-webgl-performance-guide | Canvas & WebGL Performance Guide (EN+ES)
- 2026-10-17 | adsense-prep | cookie-policy | Cookie Policy pages (EN+ES)
- 2026-10-17 | playgrounds | particle-magnet-lab | Particle Magnet Lab (EN+ES)
- 2026-10-16 | simulators | double-pendulum-chaos | Double Pendulum Chaos Lab (EN+ES)
- 2026-10-16 | search-magnets | compound-interest-guide | Compound Interest SEO Guide (EN+ES)
- 2026-10-16 | adsense-prep | terms-of-use | Terms of Use pages (EN+ES)
- 2026-10-16 | search-magnets | particle-physics-guide | Particle Physics SEO Guide (EN+ES)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive Neon Signature Composer. Users draw freehand multi-layer strokes that become persistent neon paths with flowing glow, adjustable intensity, color gradients along the stroke, and optional particle sparkles. Layers can be blended and rearranged. Controls for brush width, glow strength, layer opacity, color themes, undo, and clear. Touch-friendly drawing. Goal is visual composition of temporary light signatures with high visual payoff, not a calculator.
id: neon-signature-composer
path_en: /studio/neon-signature-composer
path_es: /es/studio/compositor-firma-neon
domain: studio-composition
runs_total: 6
runs_remaining: 2
acceptance: pending
share: url
next_step_required: yes
notes: IDEATE. Roll: U=0.609 → CORE; sample 20.81/34 → studio-composition (cumulative 19-28). last_closed kits ≠ studio-composition, no re-roll. Weights: selected→1, other CORE +1. Avoided recent particle/ribbon playgrounds. next-step required before Adsterra. Adsterra untouched. New composition-focused neon signature canvas.
EXECUTE run 1/6: shipped NeonSignatureComposer component (freehand multi-layer strokes, persistent neon glow paths, brush/glow/opacity controls, color themes, layers, undo/clear, optional sparkles, touch-friendly). EN+ES routes at /studio/neon-signature-composer and /es/studio/compositor-firma-neon. Registered in next-step.ts (journeys to neon-sign, glow-trail etc.). PlaygroundNextStep before AdsterraBanner. Core Web Vitals: lazy route, fixed aspect canvas, modest particles. Share URL for controls planned next.
EXECUTE run 2/6: added per-stroke linear color gradients (theme start→end colors, toggleable), layer reordering (up/down), synced gradient flag to layers. Visual payoff elevated with flowing color transitions along freehand neon paths. EN+ES labels updated. Adsterra untouched. CWV preserved (no new deps, modest canvas).
EXECUTE run 3/6: added share URL via location.hash (serialize/deserialize layers with rounded points, btoa). Share button copies full URL; clear resets hash. Load-from-hash on mount restores composition + controls. EN+ES labels. Adsterra untouched. CWV preserved (no new deps).
EXECUTE run 4/6: added PNG export button (canvas.toDataURL download as neon-signature.png). Share options now URL + image. EN+ES labels updated (download + hint). Adsterra untouched. CWV preserved (no new deps).
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
