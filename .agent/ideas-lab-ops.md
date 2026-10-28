# UtiliHub Ideas Lab — Ops (2/3)

**Part 2 of 3.** Procedures, quality bars, EXECUTE checklist. End marker required.

Load after ideas-lab.md. Files win over automation prompt.

---

## MODE

0) Load state → rules → ops (+ seo registry if needed).  
1) `status: active` && `runs_remaining > 0` → **EXECUTE**.  
2) `done` / remaining 0 → **IDEATE** (two-urn GROWTH) or **CLOSE**.  
3) No deploy step. No `create_deployment`.

---

## ONE COMMIT PER RUN

- Every EXECUTE (and IDEATE that only updates state) produces **exactly one** git commit on `fix/spanish-complete`.
- Include **code + `.agent/ideas-lab-state.md`** in the same `push_files` call.
- **Forbidden:** feat commit then a second `docs(agent)` state commit.
- **Exception:** CLOSE may be a state-only commit when no code changes remain.
- Commit identity: `andygargol2010-afk` <andygargol2010@gmail.com>.
- Prefer prefixes: `feat(ideas-lab):`, `polish(ideas-lab):`, `docs(ideas-lab):` (CLOSE only).

---

## NO DEPLOYS

Auto deploys are disabled for `fix/spanish-complete` on purpose.

- Do **not** call Vercel `create_deployment`, deploy hooks, or CLI deploy.
- Do **not** wait for preview URLs or treat missing deploys as failures.
- Andy / Claude review and deploy in batches.
- Post-ship smoke is replaced by **PRE-PUSH SELF-REVIEW**.

---

## PRE-PUSH SELF-REVIEW (mandatory — report in Spanish summary)

Before finishing the run, complete and report:

**a. Origin re-fetch + integrity**  
Never write a whole file you did not fully read in this run. For every file written: re-fetch from origin after the single push; compare bytes/lines to the intended payload.  
If it lost more than **10%** of its lines vs the previous commit, or contains `PLACEHOLDER` / `$(cat` / stub text, **revert it in the same run** (restore the previous blob exactly; never retype it).  
Never condense, summarize or "clean up" an existing file while adding to it: edits must be additive or targeted.

**b. File size**  
Never write a file **> 40 KB** in full via the API. For larger files: targeted edits only, or split modules.

**c. Catalog / registry hygiene**  
Do **not** rewrite `registry.tsx` or `registry-entries-*.ts`.  
If touching catalog at all: search `GENERAL_TOOLS` / `src/lib/general/index.ts` for the slug first — **no duplicate slugs**. Prefer non-catalog surfaces (routes under playgrounds/games/guides).

**d. TypeScript sanity**  
Every import path exists; every exported symbol used exists. No dangling imports.

**f. JSX text**  
In JSX text never write a raw `<` or `>`; use "más de" / "menos de" (or "more than" / "less than" in EN).

Report a short **PRE-PUSH SELF-REVIEW** block in the Spanish summary (pass/fail per a–d + f).

---

## IDEATE — IDEA QUALITY RUBRIC

Generate **3 candidate ideas**. Score each **1–5** on:

1. **User value / fun**
2. **Shareability** (screenshot-worthy moment)
3. **Search demand** (real query people type; GSC or keyword logic)
4. **Distinctiveness** vs existing UtiliHub surfaces (**list the 3 closest**)
5. **Feasibility** in the run budget (default 4 / max 6; **seo-locales: min 11**)
6. **Performance cost** (mobile CWV risk; lower score = worse)

**Pick** the best total score. Write all scores into state `notes`.  
**Reject** any idea scoring **< 3** on value **or** distinctiveness.

### VARIETY MANDATE (hard — especially for playgrounds / interactive)

Recent closes cluster around the same pattern: **canvas + particles/field lines + place/drag attractors + live trails + branded PNG + URL deep-link**. That pattern is saturated. IDEATE must break it.

**Before scoring, read RECENT_CLOSED + ACTIVE PROJECT.** For each candidate:

1. List **3 closest existing surfaces** by *mechanic*, not by theme name.
2. State the **primary interaction metaphor** in one phrase (e.g. "turn-based grid puzzle", "step sequencer", "spatial packing", "constraint solver", "story choice tree", "rhythm timing", "declarative form → diagram", "local multiplayer pass-and-play").
3. If the metaphor is essentially **freehand/particle canvas with attractors or trails**, score **distinctiveness ≤ 2** and **reject** unless the domain is explicitly `quality-lift` on that same surface.

**Anti-patterns (do not propose as new CORE playgrounds):**
- Another particle / ink / aurora / ribbon / magnet / gravity trail sandbox
- Another N/S pole or attractor field visualizer
- Another "draw freehand → pretty animated strokes" studio
- Cosmetic reskins of fluid-ink, magnetic-field, aurora-particle, glow-trail, gravity-ribbon

**Prefer underused mechanics and CORE domains:**
- `games` (rules, levels, score, fail states — not pure sandboxes)
- `simulators` (cause→effect models with parameters and readouts, not just pretty fields)
- `kits` (multi-step guided recipes / assemblers with discrete parts)
- `journeys` (ordered stages, progress, narrative waypoints)
- `studio-composition` only if the composition model is **not** freehand particle paint
- Non-canvas or hybrid UI: grids, cards, timelines, forms that generate structure, text+visual dual panes, audio/rhythm (CWV-safe), packing/layout planners, educational drills with clear win condition

**Domain balance:** If the last 2 closed CORE projects were both `playgrounds`, **prefer** rolling or choosing among `games | simulators | kits | journeys | quality-lift` when FLEX/CORE allows. Do not keep stacking playgrounds only because weight is high — high weight is not a license for clones.

**Notes must include:** closest-3 list, primary metaphor, and one sentence why this is *not* the saturated particle/canvas cluster.

### games — classic + original (search demand bias)

When domain is **`games`**, candidates may be:

1. **Classic / well-known game types** with real search demand (preferred when demand is clear), **or**
2. **Original invented games** with a clear win/lose or score loop.

UtiliHub already has examples like snake, 2048, and tic-tac-toe (3 en raya). A polished known type often beats a pure invention on traffic.

**Copyright / IP gate (mandatory before choosing a classic):**
- Only ship mechanics that are **traditional, public-domain, or generic** (rules themselves are generally not copyrightable; specific expression, art, names, and branded IP are).
- **Allowed examples (non-exhaustive):** tic-tac-toe, snake-style grid eat-grow, 2048-style merge, memory match pairs, hangman / word guess, minesweeper-style reveal, connect-four style gravity drops, checkers/draughts basic, solitaire klondike-style (generic), pong/breakout-style paddle+ball, flappy-style gap flyer *without* branded assets, sudoku / nonogram / sliding puzzle, rock-paper-scissors, Simon-style color sequence memory, Battleship-style grid hunt (generic naming).
- **Forbidden:** Nintendo/Sega/Sony/Disney/etc. characters or titles; Mario, Pokémon, Tetris as branded product (use a clearly generic “block falling puzzle” only if rules are not a slavish copy of protected expression and naming is generic — when in doubt **skip**); any game whose distinctive art, music, levels, or name is still commercial IP; clones that reproduce unique copyrighted level design or audiovisual identity.
- In `notes` write a one-line **IP check**: e.g. `IP: traditional grid merge (2048-like mechanics; generic UI; no branded assets)` or `IP: rejected Tetris brand — skipped`.
- If IP status is unclear → **do not ship**; invent an original game or pick another safe classic.

**Distinctiveness still applies:** do not re-ship snake / 2048 / tic-tac-toe if they already exist as UtiliHub surfaces — either **quality-lift** them or pick a *different* classic not already in the catalog.

**Search demand:** for classics, score search demand from real queries people type (e.g. "play minesweeper online", "memory card game", "connect 4 online"). Prefer the classic with strong demand *and* not already on the site.

**At least one of the 3 IDEATE candidates** when domain is `games` should be a **classic** (IP-safe) unless every high-demand classic is already shipped; the other candidates may be original.

### Project size

- Default **`runs_total: 4`**, hard max **6** for CORE and most GROWTH domains.
- Must show a working, playable/useful **core by run 2** or cut scope / close.
- **Exception — domain `seo-locales`:** hard **minimum `runs_total: 11`** (always more than 10). Global max-6 does **not** apply. Thin shells are forbidden; see section **seo-locales** below and `.agent/seo-locales-registry.md`.

### quality-lift

- Prefer the surface with **weakest engagement / oldest update** (not uniform random across all).
- Before run 1: write **3 concrete measurable improvements** as the “elevated bar” in `notes`.
- Still score 3 candidates when choosing which surface to lift.

### search-magnets (guides)

- Must target a **real query** (GSC or explicit keyword logic).
- Original examples / visuals; link to the live tool/game.
- No thin text pages.

### seo-locales (full product parity — RESET 2026-10-28)

**Goal:** cover in the target language **what EN already covers** (home structure, tools hubs, games/simulators indexes, high-traffic experiences) — **not** 3–4 keyword pages with a minimal shell.

**Hard rules:**
1. Load `.agent/seo-locales-registry.md` + `src/lib/i18n/seo-locales.ts` every time this domain is active.
2. **`runs_total` ≥ 11** at IDEATE. Never open a seo-locales project with fewer runs.
3. **Forbidden:** thin shells (home + a handful of games only). Previous pt/fr/de shells were deleted 2026-10-28 for this reason.
4. One locale at a time until the **parity bar** in the registry is met; track `pages_done` so later runs can **update** that locale when EN/ES grow.
5. Design must track current EN shell — do not freeze an old minimal template.
6. Mark locale `active` in registry + `SEO_LOCALES_ACTIVE` only when parity bar is met.
7. CAP 5 active SEO locales; then set `weights_growth.seo-locales = 0`.
8. EN+ES checklist rows still apply for any dual-language touch; SEO locale pages themselves use the target language strings.

### IDEATE idea template

```
status: active
idea: <paragraph>
id: <kebab-case>
path_en: /... or n/a
path_es: /es/... or n/a
path_seo: /{code}/...   # when seo-locales
domain: <rolled>
runs_total: <4..6>      # quality-lift: 4–6; seo-locales: >= 11
runs_remaining: <same at IDEATE>
acceptance: <user does X, sees Y>
share: url | png | both | n/a
next_step_required: yes | no
notes: <rubric scores for 3 candidates; closest-3; primary metaphor; why not particle-canvas clone; IP check if classic game; chosen id; roll math; quality-lift bar if any; seo-locales parity plan if any>
adsense-prep_runs: <n>
```

---

## EXECUTE — DEFINITION OF DONE

An EXECUTE run is done only when **all** hold:

1. **One user-visible outcome** stated as an acceptance test: *user does X, sees Y*.
2. **EN + ES** strings (UI and routes as applicable). For seo-locales: target-language strings on `/{code}/...`.
3. **Mobile** considered at **390px** width (layout not broken).
4. **No new console errors** expected from the change.
5. **Lazy-loaded** route/component when interactive (canvas/WebGL/games).
6. **Single commit** (code + state) after PRE-PUSH SELF-REVIEW.
7. Polish-only runs (colors, particle tweaks) **at most 1 per project**.

### EXECUTE checklist (copy into summary)

```
[ ] Acceptance test written (user does X, sees Y)
[ ] EN + ES strings (or target locale for seo-locales)
[ ] Mobile 390px considered
[ ] Lazy-load if interactive
[ ] No registry.tsx / registry-entries rewrite
[ ] No duplicate slug (if catalog touched)
[ ] PRE-PUSH SELF-REVIEW a–d + f passed
[ ] ONE commit: code + ideas-lab-state.md
[ ] No create_deployment / deploy hook
[ ] Adsterra / ads kill switch untouched
[ ] HouseModeler3D.tsx untouched
```

---

## Core Web Vitals (every ship)

- **LCP:** shells with font-display / sized media; avoid blocking the home critical path.
- **INP:** no heavy work on first interaction; modest particle counts on mobile.
- **CLS:** reserve space for interactive stages; fixed aspect for canvas.
- **Bundle:** no new heavy deps unless essential; never pull HouseModeler3D or full tools registry into a playground.

---

## GROWTH two-urn (unchanged logic)

- With probability `p_fixed` use FIXED growth weights; else FLEX.
- `seo-locales` only in FLEX; **skip domain if ≥ 5 active** locales in registry.
- Weight updates only on CLOSE per existing practice.

---

## Spanish summary template

```
Deploy: no (branch deploy disabled; batch review)
PRE-PUSH SELF-REVIEW: a=… b=… c=… d=…
Outcome / acceptance: …
ACTIVE PROJECT: id, runs_remaining/runs_total
Rubric (if IDEATE): …
Commits: <single hash>
Adsterra: untouched
Next: …
```

---

## ALWAYS

- Quality > novelty; one outcome; files win over prompt.
- Guard CWV; EN+ES; never remove Adsterra; never touch HouseModeler3D.
- Truncation → re-read, do not invent.
- **Variety > another particle sandbox.** Prefer underused domains and distinct mechanics.
- **Games:** classics with IP check + demand OK; never ship unclear or branded IP.
- **seo-locales:** full parity, min 11 runs, track pages_done; no thin shells.

<!-- end:ideas-lab-ops.md -->

## Split files (2026-10-28) — where to add entries
The big files were split into small modules so API writes never truncate them. Add new entries in the smallest file of the matching folder; never rewrite files wholesale:
- New catalog tool module: import + `...X_TOOLS,` spread in the smallest `src/lib/general/catalog-index/part-NN.ts` (not in `src/lib/general/index.ts`).
- New dedicated UI: `export const XToolUi = lazy(() => import("../XTool")...)` in the smallest `src/components/general/registry-ui/components-NN.ts`, and `"slug": UI.XToolUi,` in the smallest `src/components/general/registry-ui/slugs-NN.ts` (registry.tsx no longer has the `if (slug === ...)` chain).
- New Spanish exact tool name: the smallest `src/lib/i18n/es-names/names-NN.ts` (es.ts must stay > 15 KB because of the restore-es-i18n guard; do not move more out of it).
- New SEO override module: import + spread in the smallest `src/lib/tool-seo-index/part-NN.ts` (not in `src/lib/tool-seo-overrides.ts`); entries of the old big override files live in `src/lib/tool-seo-data/`.
- New Error Hunter catalog entry: the smallest file in `.agent/error-hunter-catalog/` (the root `.agent/error-hunter-catalog.md` is only the header + index).
- If the smallest file passes ~200 lines / 8 KB, create the next `part-NN` / `names-NN` / `components-NN` / `slugs-NN` file and wire it in its parent (index.ts, es.ts, tool-seo-overrides.ts, components.ts or slugs.ts) with a one-line surgical insert.
