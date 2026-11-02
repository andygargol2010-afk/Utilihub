# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: growth-surfaces
last_closed_id: achievement-certificate-maker
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
- 2026-11-02 | growth-surfaces | achievement-certificate-maker | Interactive achievement certificate maker complete after 4 runs. User selects template (classic diploma, modern badge, playful award), enters name/title/date/message/issued-by, sees live CSS preview with decorative seal, customizes colors, generates branded PNG or copies deep-link URL. Quick-fill presets. EN+ES routes. Mobile-first 390px. Pure form + declarative layout + canvas PNG. No particles. Acceptance met (fills form, sees live preview, downloads PNG or copies share URL).
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
idea: Full Portuguese (pt-BR) product surface under /pt/ for SEO growth. Build locale home matching current EN/ES structure (hero, value props, experience rail/featured), tools hub entry points, games + simulators index, and high-traffic experiences with full UI strings in Portuguese. No thin shell. Register in seo-locales.ts + registry only when parity bar met. Priority first locale after reset. hreflang + sitemap. Design parity with EN shell. Mobile 390px. Adsterra intact.
id: pt-product-parity
path_en: n/a
path_es: n/a
path_seo: /pt/...
domain: seo-locales
runs_total: 11
runs_remaining: 8
acceptance: User visits /pt/ and sees full home structure in Portuguese matching EN parity bar (hero + featured experiences + hubs), not a stub; subsequent runs extend pages_done until active status.
share: n/a
next_step_required: yes
notes: Rubric (1-5): C1 pt-product-parity value=5 share=3 search=5 distinct=5 feas=4 perf=5 total=27; C2 fr-product-parity value=5 share=3 search=4 distinct=5 feas=4 perf=5 total=26; C3 de-product-parity value=5 share=3 search=4 distinct=5 feas=4 perf=5 total=26. Closest-3: previous removed thin pt/fr/de shells (2026-10-28 reset), EN home structure, ES home structure. Primary metaphor: multi-locale routing + full UI translation parity for product surfaces. Why not particle-canvas: growth/seo domain, no interactive canvas; discrete page/route parity. IP: n/a. Roll math: rand=0.892 > p_fixed=0.35 → FLEX; weighted among growth (total 44) → seo-locales (w=10). Chosen id=pt-product-parity (priority queue first). Variety: underused SEO full-parity, not saturated playground. Plan: run 1+ build /pt/ home + core indexes; track pages_done; activate only on full bar. pages_done: /pt/ (home complete with hero, quick access, spotlight, discovery rail, value path, shareables, catalog rest, reviews in PT), /pt/ferramentas (tools hub index with PT chrome + ToolSearch), /pt/jogos (games index with PT chrome + GamesCatalog locale=pt), /pt/simuladores (simulators index with PT chrome, cards using EN names for now), /pt/aurora-particle-playground (full PT UI strings for controls, help, share, meta). Next: add more high-traffic experience routes under /pt/ with full PT UI strings, or start PT tool name translations for catalog parity.
adsense-prep_runs: 6
```

<!-- end:ideas-lab-state.md -->
