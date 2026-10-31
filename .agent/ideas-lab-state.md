# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: games
last_closed_id: sudoku-classic
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

adsense-prep_runs: 3
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-10-30 | games | sudoku-classic | Classic Sudoku number-placement puzzle complete after 4 runs. 9x9 grid with uniqueness, difficulties (easy/medium/hard), pencil marks with toggle + auto-clear related on place, peer (row/col/box) + same-number highlights, live conflict highlights, win detection + celebration, undo stack, keyboard (1-9/0/arrows/WASD), 3 hints, URL deep-link (?seed=&diff=), branded PNG (board + notes + progress + utilihub.app), copy-link, EN+ES via catalog+registry (/games/sudoku-classic, /es/juegos/sudoku-clasico), mobile 390px touch cells. CWV-safe. Adsterra intact.
- 2026-10-30 | simulators | traffic-signal-lab | Interactive traffic signal intersection lab complete after 4 runs. 4-way grid, discrete cars spawn/move/queue on green/red phases, NS/EW green sliders + presets (balanced/rush), live queues/throughput/avg wait/peak queue, phase remaining, URL deep-link (?ns=&ew=), branded PNG (queues + peak + utilihub.app), copy-link, EN+ES via catalog+registry (/simulators/traffic-signal-lab, /es/simuladores/laboratorio-semaforos), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-30 | games | connect-four-classic | Classic Connect Four gravity-drop game complete after 4 runs. 7x6 grid, alternate drops, win highlight (horiz/vert/diag), PvP or vs CPU with Easy/Medium/Hard difficulty (random / heuristic / look-ahead), undo last move(s), new game, URL deep-link (?moves= + ?mode=), branded PNG of board with winner + utilihub.app, EN+ES routes (/games/connect-four-classic, /es/juegos/conecta-cuatro), mobile 390px touch columns. CWV-safe. Adsterra intact.
- 2026-10-30 | kits | furniture-assembly-kit | Interactive flatpack furniture assembly kit complete after 4 runs. User selects type (shelf/desk/chair) + difficulty, discrete part cards into ordered steps with drag-reorder and part move between steps, live exploded-to-assembled CSS diagram (offset by progress), parts checklist with placed counts, progress waypoints + next highlight, completion banner, URL deep-link (?a=), branded PNG (accent + silhouette + steps + utilihub.app), copy-link, reset. EN+ES routes (/kits/furniture-assembly-kit, /es/kits/ensamblaje-muebles), localized strings, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | games | simon-sequence-memory | Classic Simon-style color sequence memory game complete after 4 runs. 4 colored pads with tones (Web Audio sine), growing sequence from 3, user repeats to advance score/level, game-over on mistake with best (localStorage). Sound toggle, difficulty (Easy/Normal/Hard speed), keyboard 1-4, URL deep-link (?seed=) with mulberry32 for reproducible challenge, branded PNG (accent + pads + score/best/level/difficulty + utilihub.app), share-link, New sequence button for fresh challenge, EN+ES via catalog (/games/simon-sequence-memory, /es/juegos/memoria-secuencia-simon), mobile 390px 2x2 pads. CWV-safe. Adsterra intact.
- 2026-10-29 | simulators | logistic-chaos-lab | Interactive logistic map chaos lab complete after 4 runs. Live time series, cobweb plot, bifurcation diagram with period-doubling cascade (P2/P4/P8), Feigenbaum point, stability windows (P3/P5), zoom cascade toggle, attractor type readout, URL deep-link, branded PNG, EN+ES routes (/simulators/logistic-chaos-lab, /es/simuladores/laboratorio-caos-logistico), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
- 2026-10-29 | journeys | choice-story-journey | Interactive narrative choice journey complete after 4 runs. Branching decision cards, labeled progress waypoints, back/undo, current-step highlight, 3 endings with accent colors, URL deep-link path, branded PNG with accent bar, copy-link, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-28 | simulators | sir-epidemic-simulator | Interactive SIR epidemic compartmental model simulator complete after 4 runs. Live S/I/R curves, discrete interventions (lockdown, vaccination), Peak I + day tracking with marker, cumulative total cases, URL deep-link, branded PNG, EN+ES routes, mobile 390px, preset scenario buttons. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: active
idea: Social Hook Composer — interactive template lab for creating shareable social media hooks. User selects a proven hook pattern (question, story, list, myth-bust, etc.), fills blanks with their topic, sees live preview of the post text + suggested hashtags, then copies text or generates a branded PNG card with accent bar + utilihub.app. URL deep-link for the filled template. EN+ES. Mobile-first.
id: social-hook-composer
path_en: /growth/social-hook-composer
path_es: /es/crecimiento/compositor-ganchos-sociales
path_seo: n/a
domain: share-hooks
runs_total: 4
runs_remaining: 2
acceptance: User selects pattern, fills 2-3 blanks, sees live post preview, copies text or downloads branded PNG.
share: both
next_step_required: yes
notes: Rubric (1-5): Cand1 social-hook-composer value4 share5 search4 distinct4 feas5 perf5 total27 | closest-3: branded-PNG-exports-in-games, any-text-tools, quote-makers | metaphor: template-fill to copyable post | not particle-canvas (form+preview, no freehand). Cand2 quote-card-maker value4 share5 search3 distinct3 feas5 perf4 total24 | closest-3: PNG in closed projects, quote generators | metaphor: form to branded image | not particle. Cand3 challenge-result-sharer value3 share4 search3 distinct2 feas4 perf4 total20 (rejected low distinct, too close to games). Chose social-hook-composer (highest, growth share-hooks). Roll: FLEX (p>0.35), weighted to share-hooks. IP: n/a (original templates, generic patterns).
Run 1 (2026-10-30): Core shipped — 5 patterns (question/story/list/myth/howto), fill blanks, live preview + hashtags, copy text, branded PNG (accent bar + text wrap + utilihub.app), URL deep-link (?p=&blanks), EN+ES routes, mobile 390px flex inputs. CWV-safe. Adsterra intact.
Run 2 (2026-10-30): Expanded to 8 patterns (added curiosity-gap, statistic, contrarian), per-pattern accent colors on PNG, explicit Copy link button, live character count with soft >280 warning, reset button, improved PNG wrapping + pattern name header. Still form+preview, no canvas freehand. CWV-safe. Adsterra intact.
adsense-prep_runs: 3
```

<!-- end:ideas-lab-state.md -->
