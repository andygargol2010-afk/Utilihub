# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: studio-composition
last_closed_id: timeline-event-composer
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
- 2026-11-06 | studio-composition | timeline-event-composer | Interactive timeline event composer complete after 4 runs. User adds 5-10 event cards (title, short description, optional date/tag), reorders by buttons, sees live vertical SVG timeline with connecting lines, generates branded summary card PNG with timeline visual + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y, max limit, Reset, Enter to add, aria-live. Acceptance met (add/reorder/live timeline/share PNG+URL). IP: original educational timeline assembler with generic events; no branded frameworks.
- 2026-11-06 | journeys | goal-progress-journey | Interactive multi-stage personal goal progress journey. User chooses a goal category (learn a skill, build a habit, save for a goal, improve fitness), sets parameters, then advances through 5-7 ordered stages with checklists, binary/multi choices that branch tips and outcomes, sees live progress bar and percentage, related tool recommendations, and on completion a branded summary card with stats and next steps. Generates canvas PNG of the journey card + deep-link URL. EN+ES routes, mobile-first 390px, keyboard a11y. Acceptance met when user selects category, completes stages, sees final card, shares PNG or URL. IP: original educational goal-progress tracker with generic stages; no branded frameworks.
- 2026-11-06 | share-hooks | utili-type-quiz | Interactive multi-question preference quiz that reveals a personalized "Utili Type" archetype complete after 4 runs. User answers 8-10 binary/multi-choice questions about favorite activities/tools, sees progressive progress bar, ends with branded result card (type name, short description, matching tool/game recommendations), generates canvas PNG + deep-link URL for sharing. EN+ES routes, mobile-first 390px, a11y keyboard nav + ARIA. Acceptance met (answers quiz, sees type card with recs, shares PNG or URL). IP: original educational personality quiz, generic types.
- 2026-11-06 | games | battleship-classic | Interactive classic Battleship (Hundir la flota) complete after 4 runs. User places ships (manual/random) on 10x10 grid, shoots opponent grid (AI hunt), sees hit/miss/sink, wins by clearing fleet. Keyboard nav, ghost preview, win animation, canvas PNG of both boards, URL deep-link, EN+ES, mobile-first 390px. Acceptance met (place/random, shoot, hit/miss/sink, win, share PNG/URL). IP: traditional public-domain Battleship mechanics, generic naming/assets.
- 2026-11-05 | seo-locales | pt-product-parity | Full product-parity Portuguese (pt-BR) locale surface under /pt/... complete after 12 runs. Home, tools hub, games/sim indexes, playgrounds/kits/journeys, legal/privacy/contact/sobre, dedicated high-traffic experiences (circuit kit, population sim, paper airplane kit), dynamic /pt/jogos/$slug for all catalog games with locale=pt where supported, hreflang + sitemap. EN-parity structure met; not a thin shell. Acceptance met (user visits /pt/ sees full hubs/experiences in Portuguese). IP: n/a.
- 2026-11-05 | kits | simple-circuit-kit | Interactive simple circuit kit complete after 4 runs. User places battery/switch/resistor/LED on 4x4 grid, connects with wires (visual SVG lines), sees live LED light + brightness by ohms (cycle 50-1000), guided mode with auto-check steps + progress, free mode, materials checklist, challenges, reset, URL deep-link (?g=), branded PNG. EN+ES routes, mobile-first 390px. Final polish: legend with symbols, tighter mobile gaps/fonts, animated wires on complete, a11y labels. Acceptance met (place/connect/test lights, share PNG/URL). IP: original educational discrete parts assembler, generic components, no branded kits.
- 2026-11-05 | simulators | population-dynamics-simulator | Interactive population dynamics simulator complete after 4 runs. User sets initial population, birth/death rates, carrying capacity; discrete generations show live SVG logistic growth chart with phase (growth/decline/stable), peak, gens to capacity. Compare two scenarios, Animate/Stop step reveal, presets, net rate r, K line, grid, generation counter, branded PNG + URL deep-link. EN+ES routes, mobile-first 390px. Final polish: legend, Reset button, slightly tighter mobile padding. Acceptance met (set params, run/see curve+stats, share PNG/URL). IP: original educational logistic growth model, generic params, no branded datasets.
- 2026-11-04 | games | checkers-classic | Interactive classic Checkers (Damas / Draughts) complete after 4 runs. 8x8 board, diagonal moves, jump captures with multi-jump chains, promotion to king, optional AI preferring long captures, move counter, undo, URL deep-link (?b=), branded PNG with moves, keyboard nav + a11y, EN+ES, mobile-first 390px. Acceptance met (select side, make legal moves/captures/kings, win by no pieces or no moves, share PNG/URL). IP: traditional public-domain checkers/draughts rules, generic pieces/colors, no commercial branding.
- 2026-11-04 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4/6x4/6x6), theme (fruits/animals/numbers/symbols), flips two cards to match pairs with CSS 3D, timer, moves, efficiency stars (1-5), keyboard nav + a11y, URL deep-link seed, branded PNG, EN+ES, mobile-first 390px with tighter gaps/fonts on small screens. Acceptance met (select size, match all, see stats/stars, share PNG/URL). IP: traditional public-domain pair-matching, generic emoji, no commercial decks.
- 2026-11-03 | adsense-prep | adsense-policy-readiness | Privacy and Cookie Policy (EN+ES) enhanced for AdSense readiness after 4 runs. Expanded structured sections on third-party ad cookies (Adsterra kept intact + potential Google), rights, opt-outs with live links (NAI, aboutads, Ad Settings), data retention, legal bases, international transfers, children's privacy, key points summaries, and a dedicated readiness section. Mobile-friendly prose at 390px. Acceptance met (user sees comprehensive disclosures on /privacy /cookies and ES equivalents). IP: original policy content updates.
```

---

## ACTIVE PROJECT

```
status: none
idea: n/a
id: n/a
path_en: n/a
path_es: n/a
path_seo: n/a
domain: n/a
runs_total: 0
runs_remaining: 0
acceptance: n/a
share: n/a
next_step_required: no
notes: Closed timeline-event-composer. Ready for next IDEATE.
adsense-prep_runs: 7
```

<!-- end:ideas-lab-state.md -->
