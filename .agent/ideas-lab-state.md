# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: retention-loops
last_closed_id: progress-passport
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
- 2026-11-01 | retention-loops | progress-passport | Interactive digital progress passport complete after 4 runs. User earns discrete stamps by completing challenges across kits/games/simulators, pages fill with stamps + progress bar + collection stats. Generate branded PNG of passport/progress, share link with deep-link. EN+ES routes. Mobile-first 390px. CSS stamp book + localStorage. No heavy canvas or particles. Acceptance met (user marks stamp, sees update, shares PNG or link).
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
idea: Interactive achievement certificate maker. User selects a template (classic diploma, modern badge, playful award), enters name, achievement title, date and optional message. Sees live CSS/SVG preview of the branded certificate. Customizes from color presets. Generates downloadable PNG or copies a shareable URL with encoded parameters that reconstructs the certificate. EN+ES routes. Mobile-first 390px. No canvas or particles; pure form + declarative layout. Growth surface for shareable personal wins.
id: achievement-certificate-maker
path_en: /growth/achievement-certificate-maker
path_es: /es/crecimiento/creador-certificado-logro
path_seo: n/a
domain: growth-surfaces
runs_total: 4
runs_remaining: 2
acceptance: User fills the form, sees live certificate preview, then downloads the PNG or copies the deep-link share URL.
share: both
next_step_required: yes
notes: Rubric (1-5): C1 achievement-certificate-maker value=4 share=5 search=3 distinct=4 feas=5 perf=5 total=26; C2 social-invite-composer value=3 share=4 search=2 distinct=3 feas=5 perf=5 total=22; C3 challenge-badge-wall value=4 share=5 search=3 distinct=3 feas=5 perf=5 total=25. Closest-3 for C1: quote-card-maker (text\to card PNG), progress-passport (collection\to PNG), adsense-compliance-kit (form\to score PNG). Primary metaphor: declarative form \to visual certificate layout. Why not particle-canvas: zero freehand/particles/trails/attractors; discrete fields generate static branded document. IP: n/a (original). Roll math: rand=0.286 < p_fixed=0.35 \to FIXED; weighted random among growth excl seo-locales (total 34) \to growth-surfaces (w=3). Chosen id=achievement-certificate-maker. Variety: underused form-to-visual, not saturated playground pattern. Run 1: shipped core form + 3 templates + color presets + live CSS preview + URL deep-link + PNG download + copy image/link. EN+ES routes. Mobile 390px. Adsterra intact. Run 2: added Issued-by field (URL ib=), reset button, fixed preview relative positioning + better text wrapping, updated canvas layout for issuer line. Acceptance core met; polish continues.
adsense-prep_runs: 6
```

<!-- end:ideas-lab-state.md -->
