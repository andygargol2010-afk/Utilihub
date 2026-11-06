# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: journeys
last_closed_id: goal-progress-journey
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
  share-hooks: 4
  retention-loops: 6
  conversion-paths: 2
  traffic-diagnosis: 1
  adsense-prep: 11
  seo-locales: 10   # retire → 0 when SEO_LOCALES_ACTIVE length ≥ 5; RESET 2026-10-28 empty actives

adsense-prep_runs: 7
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-11-06 | journeys | goal-progress-journey | Interactive multi-stage personal goal progress journey. User chooses a goal category (learn a skill, build a habit, save for a goal, improve fitness), sets parameters, then advances through 5-7 ordered stages with checklists, binary/multi choices that branch tips and outcomes, sees live progress bar and percentage, related tool recommendations, and on completion a branded summary card with stats and next steps. Generates canvas PNG of the journey card + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y. Acceptance met when user selects category, completes stages, sees final card, shares PNG or URL. IP: original educational goal-progress tracker with generic stages; no branded frameworks.
- 2026-11-06 | share-hooks | utili-type-quiz | Interactive multi-question preference quiz that reveals a personalized "Utili Type" archetype complete after 4 runs. User answers 8-10 binary/multi-choice questions about favorite activities/tools, sees progressive progress bar, ends with branded result card (type name, short description, matching tool/game recommendations), generates canvas PNG + deep-link URL for sharing. EN+ES routes, mobile-first 390px, a11y keyboard nav + ARIA. Acceptance met (answers quiz, sees type card with recs, shares PNG or URL). IP: original educational personality quiz, generic types.
- 2026-11-06 | games | battleship-classic | Interactive classic Battleship (Hundir la flota) complete after 4 runs. User places ships (manual/random) on 10x10 grid, shoots opponent grid (AI hunt), sees hit/miss/sink, wins by clearing fleet. Keyboard nav, ghost preview, win animation, canvas PNG of both boards, URL deep-link, EN+ES, mobile-first 390px. Acceptance met (place/random, shoot, hit/miss/sink, win, share PNG/URL). IP: traditional public-domain Battleship mechanics, generic naming/assets.
- 2026-11-05 | seo-locales | pt-product-parity | Full product-parity Portuguese (pt-BR) locale surface under /pt/... complete after 12 runs. Home, tools hub, games/sim indexes, playgrounds/kits/journeys, legal/privacy/contact/sobre, dedicated high-traffic experiences (circuit kit, population sim, paper airplane kit), dynamic /pt/jogos/$slug for all catalog games with locale=pt where supported, hreflang + sitemap. EN-parity structure met; not a thin shell. Acceptance met (user visits /pt/ sees full hubs/experiences in Portuguese). IP: n/a.
- 2026-11-05 | kits | simple-circuit-kit | Interactive simple circuit kit complete after 4 runs. User places battery/switch/resistor/LED on 4x4 grid, connects with wires (visual SVG lines), sees live LED light + brightness by ohms (cycle 50-1000), guided mode with auto-check steps + progress, free mode, materials checklist, challenges, reset, URL deep-link (?g=), branded PNG. EN+ES routes, mobile-first 390px. Final polish: legend with symbols, tighter mobile gaps/fonts, animated wires on complete, a11y labels. Acceptance met (place/connect/test lights, share PNG/URL). IP: original educational discrete parts assembler, generic components, no branded kits.
- 2026-11-05 | simulators | population-dynamics-simulator | Interactive population dynamics simulator complete after 4 runs. User sets initial population, birth/death rates, carrying capacity; discrete generations show live SVG logistic growth chart with phase (growth/decline/stable), peak, gens to capacity. Compare two scenarios, Animate/Stop step reveal, presets, net rate r, K line, grid, generation counter, branded PNG + URL deep-link. EN+ES routes, mobile-first 390px. Final polish: legend, Reset button, slightly tighter mobile padding. Acceptance met (set params, run/see curve+stats, share PNG/URL). IP: original educational logistic growth model, generic params, no branded datasets.
- 2026-11-04 | games | checkers-classic | Interactive classic Checkers (Damas / Draughts) complete after 4 runs. 8x8 board, diagonal moves, jump captures with multi-jump chains, promotion to king, optional AI preferring long captures, move counter, undo, URL deep-link (?b=), branded PNG with moves, keyboard nav + a11y, EN+ES, mobile-first 390px. Acceptance met (select side, make legal moves/captures/kings, win by no pieces or no moves, share PNG/URL). IP: traditional public-domain checkers/draughts rules, generic pieces/colors, no commercial branding.
- 2026-11-04 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4/6x4/6x6), theme (fruits/animals/numbers/symbols), flips two cards to match pairs with CSS 3D, timer, moves, efficiency stars (1-5), keyboard nav + a11y, URL deep-link seed, branded PNG, EN+ES, mobile-first 390px with tighter gaps/fonts on small screens. Acceptance met (select size, match all, see stats/stars, share PNG/URL). IP: traditional public-domain pair-matching, generic emoji, no commercial decks.
- 2026-11-03 | adsense-prep | adsense-policy-readiness | Privacy and Cookie Policy (EN+ES) enhanced for AdSense readiness after 4 runs. Expanded structured sections on third-party ad cookies (Adsterra kept intact + potential Google), rights, opt-outs with live links (NAI, aboutads, Ad Settings), data retention, legal bases, international transfers, children's privacy, key points summaries, and a dedicated readiness section. Mobile-friendly prose at 390px. Acceptance met (user sees comprehensive disclosures on /privacy /cookies and ES equivalents). IP: original policy content updates.
- 2026-11-03 | kits | paper-airplane-kit | Interactive paper airplane design kit complete after 4 runs. User selects preset design (classic dart, glider, stunt, delta wing), follows multi-step fold instructions with checkoffs and live CSS preview of the plane shape, sees progress, estimated folds/time, materials checklist, optional challenges (distance/stunt) with score, generates branded PNG or copies deep-link URL. EN+ES routes, mobile-first 390px. CSS illustrations + state + checklists. Acceptance met (select preset, checkoff steps, preview updates, PNG or share URL). IP: original educational paper craft assembler.
```

---

## ACTIVE PROJECT

```
status: active
idea: Interactive timeline event composer. User adds 5-10 event cards (title, short description, optional date/tag), reorders them by drag or buttons, sees a live vertical SVG timeline with connecting lines, and on finish generates a branded summary card PNG with the timeline visual + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y for add/reorder. Acceptance met when user adds events, reorders, sees live timeline, shares PNG or URL.
id: timeline-event-composer
path_en: /studio/timeline-composer
path_es: /es/estudio/compositor-linea-tiempo
path_seo: n/a
domain: studio-composition
runs_total: 4
runs_remaining: 3
acceptance: User adds and reorders event cards, sees live SVG timeline update, generates branded PNG or copies deep-link URL.
share: both
next_step_required: yes
notes: Domain roll: CORE studio-composition (weight 3; underused vs recent journeys/games/kits/simulators/share-hooks; last_closed journeys; variety prefer non-particle, non-recent domains). Rubric for 3 candidates:
A) timeline-event-composer (chosen): value 4, share 4, search 3, distinct 4, feas 5, perf 4 (total 24). Closest-3: goal-progress-journey (ordered stages/progress), WaypointRiverComposer (if exists, narrative waypoints), history-timeline-journey (from prior notes). Primary metaphor: ordered timeline placement and narrative linking. Why not particle-canvas: form/cards + SVG timeline lines, no freehand or particles.
B) mindmap-node-composer: value 4, share 4, search 3, distinct 4, feas 4, perf 4 (total 23). Closest: simple-circuit-kit (connect wires), ColorHarmonyJourney, population-dynamics-simulator (visual readout). Metaphor: declarative node linking → diagram. Why not: SVG nodes/edges, no particles.
C) palette-harmony-composer: value 3, share 3, search 3, distinct 3, feas 5, perf 5 (total 22). Closest: ColorHarmonyJourney, simple-circuit-kit, paper-airplane-kit. Metaphor: parameter selection → generated palette. Why not: color picker UI not canvas particles.
IP: original educational timeline assembler with generic events; no branded frameworks. Chosen id: timeline-event-composer. Roll: CORE underused studio-composition. Quality bar: core add/reorder/timeline by run 2, share by run 4.
adsense-prep_runs: 7
```

<!-- end:ideas-lab-state.md -->
