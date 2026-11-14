# UtiliHub Ideas Lab — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:ideas-lab-state.md -->`.

If truncated: re-fetch immediately. Keep this file small.

Edit + commit on every IDEATE / EXECUTE / close. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process (see ideas-lab.md / ops):** ONE commit per run (code + this file together). No deploys. No state-only commit except CLOSE. Default project 4 runs (max 6; **seo-locales min 11**). IDEATE stores rubric scores for 3 candidates in `notes`.

---

## DOMAIN WEIGHTS + last_closed

```
last_closed_domain: simulators
last_closed_id: cellular-automaton-lab
p_fixed: 0.35

weights_core:
  kits: 4
  journeys: 5
  games: 6
  simulators: 5
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

adsense-prep_runs: 8
```

---

## RECENT_CLOSED (max 10, newest first)

```
- 2026-11-14 | simulators | cellular-automaton-lab | Cellular Automaton Lab complete after 4 runs. /simulators/cellular-automaton-lab + /es/simuladores/laboratorio-automatas-celulares: tab 2D Life-like (48x48 wrapping grid, editable Birth/Survive, 5 rule presets, tap/drag toggle, 5 stamps, play/step/speed, generation + population readout + sparkline) and tab 1D Wolfram (rules 0-255, number input, 8-cell clickable rule table, presets 30/90/110/184, single/random seed), shareable URL (?mode=&rule=&b=&s=&g=) + branded 1080x1080 PNG, EN+ES, 390px, keys Space/S/R/C. Final polish: auto-pause when tab hidden, aria-live play/pause announcements, seed button state correct when restored from URL. Acceptance met. IP: public mathematical rules (Life-like / Wolfram), generic UI.
- 2026-11-13 | conversion-paths | tool-matchmaker | Tool Matchmaker complete after 4 runs. /find-your-tool + /es/encuentra-tu-herramienta: 3 tappable card steps (goal, time, output) -> ranked top-3 of 26 verified real routes with a 'why this fits' line each, Open deep-links, re-roll, restart, shareable ?g=&t=&o= URL, branded 1080x1080 PNG card, EN+ES, 390px, entry links from home hero EN+ES and EN command-palette empty state. Final polish: focus moves only on user action (no focus steal on load), copy-failure announced via aria-live, Back announced, motion-reduce on buttons. Palette is EN-only so no ES link added. Acceptance met. IP: n/a (own UI linking existing tools).
- 2026-11-13 | retention-loops | daily-challenge-hub | Daily Challenge hub complete after 4 runs. /daily-challenge + /es/reto-diario: UTC date-seeded pick of one of 12 existing games (never repeats yesterday) with a goal, Play deep-link, return-from-game prompt + manual Mark done/Undo, current/best streak, next-challenge countdown, 28-day calendar with per-day game emoji, branded 1080x1080 PNG + shareable URL snapshot, EN+ES, mobile-first 390px, aria-live. Final polish: singular/plural day, focus moves to the return prompt, empty-state copy, motion-reduce. No edits to existing games. Acceptance met. IP: n/a (own UI linking existing games).
- 2026-11-11 | games | sudoku-classic | Interactive classic Sudoku (9x9) complete after 4 runs. Difficulty easy/medium/hard, live row/column/box conflict highlighting, timer, undo, pencil notes + auto notes, hints, keyboard shortcuts, per-difficulty best time (localStorage), branded board PNG, URL deep-link, EN+ES, mobile 390px, a11y labels + aria-live. Final polish: aria-live now announces conflict count, motion-safe win pulse, GameSecondaryButton gained a real `disabled` prop (Undo/Hint/Pause were silently ignoring it), fixed TS errors. Acceptance met. IP: traditional public-domain Sudoku rules; generic UI.
- 2026-11-09 | adsense-prep | adsense-compliance-prep | Preparación de cumplimiento AdSense completa tras 4 runs. /ads.txt con entradas placeholder (google.com pub-0000000000000000), páginas About/Sobre con contenido sustantivo original (propósito, densidad, how-we-build, compliance note), privacy/cookies EN+ES actualizadas con secciones de publicidad de terceros, opt-outs, readiness y menciones a Adsterra intacto. Fechas 9 Nov 2026. EN+ES. Acceptance met (visita /ads.txt, revisa políticas con secciones de ads, About sustantivo). Adsterra intacto. IP: n/a.
- 2026-11-09 | games | hangman-classic | Interactive classic Hangman (Ahorcado) complete after 4 runs. User selects category (animals/countries/food/tech/random) and difficulty (easy 8/normal 6/hard 4 misses), guesses letters via keyboard or on-screen buttons to reveal the hidden word. On misses a live SVG hangman figure progresses (up to 7 parts + eyes). Shows lives remaining, guessed letters, score. Optional hint. Win when word complete or lose when figure full. Keyboard nav (letters + R new + H hint), URL deep-link (?cat=&word=&diff=), branded PNG of final hangman + word + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live for guesses and outcome. Final polish: progressive SVG, score, PNG branding, richer aria-live, keyboard shortcuts, focus-visible. Acceptance met (select category/difficulty, guess letters, see progressive SVG + revealed word, win/lose with stats, share PNG or URL). IP: traditional public-domain hangman letter-guess + penalty figure; generic words/categories; no branded.
- 2026-11-09 | kits | logic-circuit-kit | Interactive logic circuit kit complete after 4 runs. User places gates (AND/OR/NOT/XOR/NAND/NOR), inputs/outputs on 5x5 grid, connects with wires (port selector out/in1/in2), toggles inputs, sees live SVG wires, output indicators (colors), truth table (up to 3 inputs), guided challenges (half-adder, decoder) with completion feedback, wires list with delete, keyboard nav (arrows+Enter/Space), URL deep-link (?g= &w=), branded PNG of grid+wires+stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish completed truncated UI + visual connections. Acceptance met (place gates, connect wires, toggle inputs, see live outputs and truth table, complete challenge, share PNG or URL). IP: original educational boolean logic assembler with generic gates; no branded kits.
- 2026-11-09 | games | memory-match-classic | Interactive classic Memory Match (Concentration) complete after 4 runs. User selects difficulty (4x4 easy, 6x4 medium, 6x6 hard), flips two cards to find matching pairs (emoji themes: fruits/animals/numbers/symbols), sees live timer/moves/score/stars/progress bar, optional sound, mismatch shake, keyboard arrows+Enter/Space + R restart, URL deep-link (?size=&theme=&seed=), branded PNG of board + stats, EN+ES routes, mobile-first 390px, a11y labels + aria-live. Final polish: global R key restart + richer aria-live announcements. Acceptance met (select size/theme, match all pairs, see win stats/stars, share PNG or URL). IP: traditional public-domain pair-matching (concentration), generic emoji/icons; no branded assets.
- 2026-11-09 | simulators | predator-prey-simulator | Interactive predator-prey (Lotka-Volterra) population simulator complete after 4 runs. User sets initial prey/predator counts, growth rate of prey, predation rate, predator death rate, conversion efficiency. Discrete generations show live SVG dual-line or phase-space chart of both populations oscillating or stabilizing, phase label (oscillating/stable/extinct), peak values, current gen, averages, approx period. Presets (balanced, prey boom, predator crash), Animate/Stop with speed, Reset, URL deep-link (?params=), branded PNG of chart + stats, CSV export. EN+ES (+PT labels), mobile-first 390px, keyboard controls (Space/R), a11y labels + aria-live. Final polish restored after truncation incident. Acceptance met (set params/preset, animate, see live chart + phase/peaks/stats, share PNG or URL). IP: original educational Lotka-Volterra implementation with generic rates; no branded datasets or software.
- 2026-11-08 | games | connect-four-classic | Interactive classic Connect Four (Cuatro en línea) complete after 4 runs. User selects color, takes turns dropping pieces into a 7x6 grid (gravity), first to get 4 in a row (horiz/vert/diag) wins. Optional simple AI opponent (easy/med/hard with heuristic). Keyboard nav (arrows + Enter, 1-7 keys), win detection + highlight + animated line, undo, timer, URL deep-link for board state (?moves=), branded PNG of final board with winning line, EN+ES routes, mobile-first 390px with large touch cells (h-10/w-10 sm:h-12), a11y labels + aria-live for moves and win. Final polish: timer display, hard AI, drop animation, win pulse, dim non-win pieces. Acceptance met (select side, drop pieces, see gravity + win/lose detection with highlight, share PNG or URL). IP: traditional public-domain Connect Four gravity drops and 4-in-a-row; generic UI/naming; no Hasbro or branded assets.
```

---

## ACTIVE PROJECT

```
status: active
idea: Embed Studio — pick any existing tool/game, preview it in a framed card, tweak size/theme/language and copy a ready iframe/link snippet (with small "Powered by UtiliHub" backlink) so bloggers/teachers can embed UtiliHub on their sites. Backed by a minimal chrome-less /embed/{slug} wrapper route for a curated whitelist of self-contained tools/games.
id: embed-studio
path_en: /growth/embed-studio
path_es: /es/crecimiento/embed-studio
path_seo: n/a
domain: growth-surfaces
runs_total: 4
runs_remaining: 1
acceptance: user picks a tool/game, chooses size + theme + language, sees a live framed preview, copies the iframe snippet (and a plain link), and the pasted embed renders the chrome-less tool with a visible UtiliHub attribution link.
share: url
next_step_required: yes
notes: RUN 3/4 DONE 2026-11-14: EmbedStudio.tsx additive: custom size (w/h inputs clamped 280-1200, 4th preset), snippet type fixed/responsive (aspect-ratio wrapper), attribution style text-link/button (attribution always kept; no badge=0 option offered), deep-link params w,h,m=r,b=button added to ?g=&s=&t=&l=, textarea rows 8; home hero entry link EN "Embed games" + ES "Incrusta juegos" (src/routes/index.tsx, es.index.tsx). tool-matchmaker/games hub link and PNG skipped (scope). Verified: validate:catalog + routing guard OK, vite build. NEXT run4 (final polish): a11y/390px check of studio, aria-live for size clamp, motion-reduce, empty/edge states, optional "Embed this game" link on game pages ONLY if trivial; then CLOSE. RUN 2/4 DONE 2026-11-14: src/components/growth/EmbedStudio.tsx (lazy; game picker over 12-game whitelist, 3 size presets, light/dark, EN/ES, live same-origin iframe preview, copy iframe+attribution-link snippet, copy plain link, aria-live copy status, ?g=&s=&t=&l= deep-link, 44px targets) + routes /growth/embed-studio and /es/crecimiento/embed-studio (hreflang pair, AdsterraBanner untouched). Verified: vite build ok, validate:catalog + validate-registry + routing guard OK, SSR 200 EN/ES studio + /embed/2048 + /embed/snake?lang=es&theme=dark, fightersland 404. NEXT run3: wire params polish (custom width/height, badge copy variants, responsive-embed snippet, link from games/hub + tool-matchmaker entry, home/growth hub link), URL share + PNG optional. RUN 1/4 DONE 2026-11-14: src/lib/embed/whitelist.ts (12 self-contained games, EN slugs; tools whitelist deferred), route src/routes/embed.$slug.tsx (chrome-less, ?lang=es&theme=dark&badge=0 only non-default params kept so no iframe redirect, noindex+canonical to game page, visible Powered by UtiliHub link), __root.tsx RootComponent early-return for /embed/* (no header/footer/ads/analytics), vercel.json: global header rule source now /((?!embed/).*) + separate /embed/(.*) rule (frame-ancestors *, no X-Frame-Options, X-Robots-Tag noindex) — security headers unchanged elsewhere. Verified local build + SSR 200 for /embed/2048 etc, fightersland 404, guard OK. Also repaired state file: previous IDEATE commit left a stale duplicate tail (lines 82-159) — removed. NEXT run2: Studio UI /growth/embed-studio + /es/crecimiento/embed-studio (picker, size, theme, lang, live iframe preview, copy iframe + link). IDEATE 2026-11-14. Roll: p_fixed roll 51>=35 -> FLEX; weighted roll 52% over core+growth weights -> growth-surfaces. Candidates (value/share/demand/distinct/feasib/perf): A Tool Stack Card 4/4/2/2/4/5=21 (rejected: distinct 2, too close to find-your-tool); B Embed Studio 4/3/4/5/3/4=23 CHOSEN; C Challenge-a-friend score links for games 4/5/3/4/2/4=22 (needs edits to many games, feasibility 2). Closest-3 to B by mechanic: /growth/quote-card-maker (declarative form -> shareable artifact), /find-your-tool (card steps -> deep links), /growth/achievement-certificate-maker (config form -> output). Primary metaphor: declarative form -> copyable embed snippet with live preview. Not particle/canvas cluster: form + iframe preview, no canvas. Plan: run1 whitelist + /embed/$slug chrome-less route + frame headers check in vercel config (do NOT weaken security headers globally; scope to /embed/* only); run2 Studio UI EN+ES with preview + snippet copy; run3 theme/size/lang params + attribution + URL deep-link; run4 polish/a11y/390px. Risk: X-Frame-Options/CSP frame-ancestors must be relaxed ONLY for /embed/*; if not feasible without touching ads core, cut to link-only share cards. IP: n/a.
adsense-prep_runs: 8
```

<!-- end:ideas-lab-state.md -->
