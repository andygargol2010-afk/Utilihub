# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: color-cascade-fusion
p_fixed: 0.35

weights_core:
  kits: 10
  journeys: 7
  games: 1
  simulators: 6
  studio-composition: 8
  playgrounds: 2
  quality-lift: 3

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
- 2026-10-21 | games | color-cascade-fusion | Interactive Color Cascade Fusion complete: adjacent fusion, power-orbs, combo streaks, progressive difficulty, Web Audio sounds, game-over overlay with new-best celebration + PNG share (EN+ES)
- 2026-10-21 | retention-loops | daily-progress-constellation | Interactive Daily Progress Constellation complete: canvas stars + lines + name baked in PNG + milestones + reset + hover tooltips + editable name (EN+ES)
- 2026-10-21 | search-magnets | solar-system-scale-explorer | Interactive Solar System Scale Explorer complete with light-travel times, live scale, focus ring, presets, moons, Pluto (EN+ES)
- 2026-10-20 | playgrounds | aurora-particle-playground | Interactive Aurora Particle Playground complete with bloom intensity + share (EN+ES)
- 2026-10-20 | retention-loops | return-streak-board | Interactive Return Streak Board complete with share (EN+ES)
- 2026-10-20 | seo-locales | pt | Portuguese (pt-BR) beachhead complete: /pt home + pulse-catch + orbit-defender + snake + pong (1/5 active)
- 2026-10-20 | quality-lift | pulse-catch-arena | Elevated Pulse Catch Arena with perfect-catch system + combo fire + fever (EN+ES)
- 2026-10-19 | games | orbit-defender-arcade | Interactive Orbit Defender Arcade (EN+ES)
- 2026-10-19 | simulators | reaction-diffusion-lab | Interactive Reaction-Diffusion Lab (EN+ES)
- 2026-10-19 | journeys | waypoint-river-composer | Interactive Waypoint River Composer (EN+ES)
```

---

## ACTIVE PROJECT

```
status: done
idea: Interactive Color Cascade Fusion — a rules-based arcade game where colored orbs fall under gravity. Click adjacent matching colors to fuse them into larger orbs, triggering chain reactions and combo multipliers. Score climbs with fusion size and chains; levels increase speed and introduce special power-orbs (bomb, freeze, multiplier). Visual particle bursts on fusion, progressive difficulty, high-score share via PNG. EN+ES full routes with next-step.
id: color-cascade-fusion
path_en: /color-cascade-fusion
path_es: /es/color-cascade-fusion
path_seo: n/a
domain: games
runs_total: 6
runs_remaining: 0
acceptance: accepted
share: png
next_step_required: yes
notes: IDEATE roll: U=0.7475 (>0.50 → CORE). Weighted sample from weights_core selected games (prev weight 3). last_closed_domain=retention-loops ≠ games, no re-roll. Weights updated: games=1, all other CORE +1. New game distinct from orbit-defender and pulse-catch. EXECUTE run 1/6: core fusion loop (adjacent same-color click, fuse to larger orb, particles, levels, score/best) + EN/ES routes + next-step registration. Adsterra kept. Deploy check READY on previous commit; new commits pending deploy. EXECUTE run 2/6: power-orbs (bomb clears nearby same-color, freeze slows gravity, multi ×2 score) spawn from level 2 with visual rings/labels + PNG share of score overlay. Adsterra kept. EXECUTE run 3/6: combo streak system — successive fusions within 2.8s raise combo (x1.5…x5 cap), floating score popups on canvas (+pts / +pts xN), combo badge, bigger particle burst on high combo, UI combo indicator, help text updated EN+ES. Adsterra kept. EXECUTE run 4/6: progressive difficulty refined — higher power-orb chance with level, faster spawn/gravity, level-up cyan flash overlay + brief slowdown reward + center particle burst, MEGA fusion (4+ orbs) gives 1.6× score bonus + cyan particles/popup. Help text updated EN+ES. Adsterra kept. EXECUTE run 5/6: Web Audio sound effects — fusion beep, higher for combo≥3, dual tones for MEGA, ascending arpeggio on level-up, descending on game-over; Sound ON/OFF toggle (default on, resumes AudioContext). Help text updated EN+ES. Adsterra kept. EXECUTE run 6/6: game-over canvas overlay (semi-transparent, score/best, gold "New Best!" / "¡Nuevo récord!" with particle burst) + refined PNG share including new-best badge and taller footer. Help text updated EN+ES. Adsterra kept. Project complete.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
