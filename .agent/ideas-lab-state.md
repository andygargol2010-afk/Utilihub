# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: kits
last_closed_id: science-experiment-kit
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 5
  games: 5
  simulators: 4
  studio-composition: 3
  playgrounds: 8
  quality-lift: 2

weights_growth:
  traffic-bets: 3
  search-magnets: 3
  growth-surfaces: 3
  share-hooks: 5
  retention-loops: 6
  conversion-paths: 2
  traffic-diagnosis: 1
  adsense-prep: 11
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5; RESET 2026-10-28 empty actives

adsense-prep_runs: 6
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-11-01 | kits | science-experiment-kit | Interactive kids science experiment kit builder complete after 4 runs. User selects theme from presets (volcano, slime, simple circuit, plant growth), gets discrete materials list, follows multi-step guided assembly with checkoffs and safety tips, sees progress, estimated time, and can generate branded PNG of the completed setup or share link. Challenges for age groups. URL deep-link for theme. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state + checklists. IP-safe original educational assembler. Acceptance met.
- 2026-11-01 | simulators | bin-packing-sim | Interactive bin packing simulator complete after 4 runs. User selects item sizes from presets, places them into a fixed container via click (CSS grid placement with overlap check), sees live utilization percentage, waste, score. Challenges/goals with restricted sets. URL deep-link (?ch=). Branded PNG of packed result. EN+ES. Mobile-first 390px. No heavy canvas; CSS + state. IP-safe original spatial packing. Acceptance: User selects items, places them, achieves high utilization or completes challenge, shares PNG or link. Run 4 polish: undo last placement, faint grid overlay for guidance, slightly larger bin max, updated instructions.
- 2026-11-01 | games | memory-match-classic | Classic memory match pairs game complete after 4 runs. Grid of face-down cards; flip two at a time to find matching pairs. Score based on moves and time. Levels with increasing pairs. Presets for themes (animals, numbers, symbols). URL deep-link for seed. Branded PNG of completed board or high score. EN+ES. Mobile-first 390px. No heavy canvas; CSS grid + state. IP-safe traditional mechanics. Acceptance met.
- 2026-10-31 | adsense-prep | adsense-compliance-kit | Interactive AdSense readiness and compliance kit complete after 4 runs. 10 weighted discrete checks, live score 0-100 + progress bar + readiness badge, presets, per-item tips + suggestions, top missing panel, URL deep-link (?c=), branded PNG scorecard, copy image or download, copy link, reset. EN+ES routes (/growth/adsense-compliance-kit, /es/crecimiento/kit-cumplimiento-adsense), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-31 | share-hooks | quote-card-maker | Interactive quote card maker complete after 4 runs. ... (full list preserved in previous)
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive digital progress passport for UtiliHub experiences. User earns discrete stamps by completing specific challenges or actions across existing kits, games, and simulators (e.g. finish a science kit theme, reach a memory-match level, achieve bin-packing utilization). Pages fill with stamps, progress bar, collection stats. Generate branded PNG of the passport page or current progress, share link with deep-link to current state. EN+ES. Mobile-first 390px. CSS-based stamp book UI + local state. No heavy canvas or particles.
id: progress-passport
path_en: /growth/progress-passport
path_es: /es/crecimiento/pasaporte-progreso
path_seo: n/a
domain: retention-loops
runs_total: 4
runs_remaining: 1
acceptance: User views passport, marks/completes a stamp action (or simulated for demo), sees stamp added and progress update, generates and shares PNG or link of the passport.
share: both
next_step_required: yes
notes: Rubric (1-5): Cand1 progress-passport value=5 share=5 search=3 distinct=5 feas=4 perf=5 total=27; Cand2 weekly-challenge-hub value=4 share=4 search=4 distinct=4 feas=5 perf=5 total=26; Cand3 utility-journal value=3 share=3 search=2 distinct=3 feas=5 perf=5 total=21. Chosen: progress-passport (highest). Closest-3: Return Streak Board (progress tracking), science-experiment-kit (guided completion stamps), quote-card-maker (shareable visual card). Primary metaphor: sequential stamp book / digital passport with discrete earned stamps and page progress. Why not particle-canvas: form-based stamp pages with CSS checkmarks and generated PNG, no freehand drawing or particle systems. IP: n/a. Roll: FLEX (random 0.41 > p_fixed 0.35), weighted across core+growth picked retention-loops. Quality over novelty; distinct from existing streak/constellation playgrounds. Run 1 (2026-11-01): Core UI shipped — 6 discrete stamps (science-volcano, memory-level-3, binpack-high, adsense-score-80, quote-share, streak-7), localStorage + URL deep-link (?stamps=), progress bar, html2canvas PNG download, copy link. EN+ES routes live. Mobile-first CSS stamp book. No heavy canvas. Run 2 (2026-11-01): Visual polish — circular stamp seals on earned items, improved progress display, reset button, tighter mobile grid. Acceptance strengthened with clearer earned state and share. Run 3 (2026-11-01): Live URL deep-link sync via history.replaceState on every toggle/reset; completion banner at 100%; non-alert copy feedback (Copied! / ¡Copiado!); updated helper text. Acceptance: user marks stamp, URL updates live, progress/celebration visible, share PNG or link works.
adsense-prep_runs: 6
```

<!-- end:ideas-lab-state.md -->
