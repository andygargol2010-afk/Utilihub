# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: share-hooks
last_closed_id: social-hook-composer
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
- 2026-10-31 | share-hooks | social-hook-composer | Interactive social media hook template composer complete after 4 runs. 9 patterns (question/story/list/myth/howto/curiosity-gap/statistic/contrarian/before-after), fill blanks, live preview + hashtags + char count with platform limits (X/Twitter 280, LinkedIn 1300, Instagram 2200), copy text, "Post to X" intent button, branded PNG (accent bar + pattern header + platform label + text wrap + utilihub.app), URL deep-link (?p=&blanks=&plat=), EN+ES routes (/growth/social-hook-composer, /es/crecimiento/compositor-ganchos-sociales), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-30 | games | sudoku-classic | Classic Sudoku number-placement puzzle complete after 4 runs. 9x9 grid with uniqueness, difficulties (easy/medium/hard), pencil marks with toggle + auto-clear related on place, peer (row/col/box) + same-number highlights, live conflict highlights, win detection + celebration, undo stack, keyboard (1-9/0/arrows/WASD), 3 hints, URL deep-link (?seed=&diff=), branded PNG (board + notes + progress + utilihub.app), copy-link, EN+ES via catalog+registry (/games/sudoku-classic, /es/juegos/sudoku-clasico), mobile 390px touch cells. CWV-safe. Adsterra intact.
- 2026-10-30 | simulators | traffic-signal-lab | Interactive traffic signal intersection lab complete after 4 runs. 4-way grid, discrete cars spawn/move/queue on green/red phases, NS/EW green sliders + presets (balanced/rush), live queues/throughput/avg wait/peak queue, phase remaining, URL deep-link (?ns=&ew=), branded PNG (queues + peak + utilihub.app), copy-link, EN+ES via catalog+registry (/simulators/traffic-signal-lab, /es/simuladores/laboratorio-semaforos), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-30 | games | connect-four-classic | Classic Connect Four gravity-drop game complete after 4 runs. 7x6 grid, alternate drops, win highlight (horiz/vert/diag), PvP or vs CPU with Easy/Medium/Hard difficulty (random / heuristic / look-ahead), undo last move(s), new game, URL deep-link (?moves= + ?mode=), branded PNG of board with winner + utilihub.app, EN+ES routes (/games/connect-four-classic, /es/juegos/conecta-cuatro), mobile 390px touch columns. CWV-safe. Adsterra intact.
- 2026-10-30 | kits | furniture-assembly-kit | Interactive flatpack furniture assembly kit complete after 4 runs. User selects type (shelf/desk/chair) + difficulty, discrete part cards into ordered steps with drag-reorder and part move between steps, live exploded-to-assembled CSS diagram (offset by progress), parts checklist with placed counts, progress waypoints + next highlight, completion banner, URL deep-link (?a=), branded PNG (accent + silhouette + steps + utilihub.app), copy-link, reset. EN+ES routes (/kits/furniture-assembly-kit, /es/kits/ensamblaje-muebles), localized strings, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | games | simon-sequence-memory | Classic Simon-style color sequence memory game complete after 4 runs. 4 colored pads with tones (Web Audio sine), growing sequence from 3, user repeats to advance score/level, game-over on mistake with best (localStorage). Sound toggle, difficulty (Easy/Normal/Hard speed), keyboard 1-4, URL deep-link (?seed=) with mulberry32 for reproducible challenge, branded PNG (accent + pads + score/best/level/difficulty + utilihub.app), share-link, New sequence button for fresh challenge, EN+ES via catalog (/games/simon-sequence-memory, /es/juegos/memoria-secuencia-simon), mobile 390px 2x2 pads. CWV-safe. Adsterra intact.
- 2026-10-29 | simulators | logistic-chaos-lab | Interactive logistic map chaos lab complete after 4 runs. Live time series, cobweb plot, bifurcation diagram with period-doubling cascade (P2/P4/P8), Feigenbaum point, stability windows (P3/P5), zoom cascade toggle, attractor type readout, URL deep-link, branded PNG, EN+ES routes (/simulators/logistic-chaos-lab, /es/simuladores/laboratorio-caos-logistico), mobile 390px. CWV-safe. Adsterra intact.
- 2026-10-29 | games | hangman-classic | Classic Hangman word-guess game complete after 4 runs. Letter buttons + keyboard, categories + difficulty (easy/normal/hard), one hint, progressive SVG stick figure (extended for >6 misses), live guess announcements (aria-live), win/lose states, URL deep-link (?cat=&word=&diff=), branded PNG, share-link, EN+ES dedicated routes (/hangman, /es/ahorcado) + catalog entry, mobile 390px flex-wrap. CWV-safe. Adsterra intact.
- 2026-10-29 | kits | recipe-assembly-kit | Interactive multi-step recipe assembly kit complete after 4 runs. Discrete ingredient cards into ordered steps with reordering/drag, cuisine presets, live timeline/preview + aggregated shopping list, progress waypoints, URL deep-link, branded PNG with accent bar + shopping, EN+ES routes, mobile 390px flex-wrap, reset. CWV-safe. Adsterra intact.
- 2026-10-29 | journeys | choice-story-journey | Interactive narrative choice journey complete after 4 runs. Branching decision cards, labeled progress waypoints, back/undo, current-step highlight, 3 endings with accent colors, URL deep-link path, branded PNG with accent bar, copy-link, EN+ES routes, mobile 390px. CWV-safe. Adsterra intact.
```

---

## ACTIVE PROJECT

```
status: none
```

<!-- end:ideas-lab-state.md -->
