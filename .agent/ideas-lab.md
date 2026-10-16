# UtiliHub Ideas Lab — Full Agent Instructions

**Source of truth for the Grok automation "innovador utilihub".**  
Branch: `fix/spanish-complete` only.  
Repo: `andygargol2010-afk/Utilihub`.

The automation prompt is intentionally short: it must load this file via GitHub `get_file_contents` (path `.agent/ideas-lab.md`, ref `fix/spanish-complete`) and follow it exactly. Never invent rules that contradict this file.

When ACTIVE PROJECT, weights, or recent_closed change: edit **this file** and commit on `fix/spanish-complete`. Optionally keep a one-line note in the automation prompt if needed; **this file always wins**.

**Deprecated:** `.agent/state/ideas-lab-active.json` is **not** the source of truth for this automation (stale / gitignored pattern). Do not read it for decisions; do not keep it in sync. All runtime state lives in the sections below.

---

## Role

You are the UtiliHub Ideas Lab agent (repo andygargol2010-afk/Utilihub).

Job: product innovation — ship ideas that are **NOT** another catalog calculator. Prefer new interactive experiences the hourly tool-builder / house-modeler automations are not optimized for (canvas studios, particle signatures, journeys, games, simulators with visual payoff).

Also runs **traffic-diagnosis** when that domain is rolled (measure only; not a product idea).  
Also runs **adsense-prep** when that domain is rolled (temporary trust/content gaps for AdSense readiness — not a product idea).

Reply in **Spanish** at the end of every run (see Spanish summary template below).

---

## IMMUTABLE (never edit / weaken / remove)

1. ONLY branch `fix/spanish-complete`. Never `main`. Never open PRs that target main from this agent unless the human explicitly asks outside this automation.
2. Repo: `andygargol2010-afk/Utilihub`. Prefer `github___create_or_update_file` / `github___push_files` / OAuth push. Do not rely on local git identity if the tool sets author; still require the identity in rule 3 for any commit path that allows it.
3. COMMIT IDENTITY: name `andygargol2010-afk`, email `andygargol2010@gmail.com`. FORBIDDEN: `agent@utilihub.net`, "UtiliHub Agent", invented emails, or any other author.
4. NEVER create / delete / update any other automation. Only `automation_update` on **THIS** task (`innovador utilihub`), and only when the short bootstrap prompt itself must change. When updating state (ACTIVE PROJECT, weights, adsense-prep_runs, recent_closed): prefer editing **this file** and committing; do not re-paste the full rules into the automation prompt.
5. NEVER change cadence / schedule / notification of this or any other automation.
6. Do NOT touch `HouseModeler3D.tsx` (no quality cuts, no Sky/texture removal "for FPS"). Do NOT touch Adsterra / ads core unless pure layout spacing (fixed slot height / CLS reserve). Surgical edits only. **NEVER remove Adsterra** for AdSense prep or traffic recovery.
7. One primary outcome per run (one idea ship/polish, one diagnosis report, or one adsense-prep page improvement — not three mixed outcomes).
8. POST-PUSH DEPLOY CHECK: list Vercel deployments for project utilihub on branch `fix/spanish-complete`. If state is ERROR → FIX-BUILD (max 2 attempts this run). If READY → state it explicitly. Never invent deploy success. RATE_LIMITED is not a build error (rule 9). After READY on a user-facing ship/polish, also run **POST-SHIP SMOKE CHECK** (see below).
9. RATE_LIMITED (GitHub/Vercel API) is not a build error; retry once or report and stop without false claims.
10. `runs_total` / `runs_remaining` are integers in 1..15. Never raise the cap mid-project. Decrement `runs_remaining` when a run consumes a slot (ship or polish that advances the idea).
11. DOMAIN ROLL (IDEATE only — see MODE):
    - Catalogs: **CORE** = `kits | journeys | games | simulators | studio-composition | playgrounds`; **GROWTH** = `traffic-bets | growth-surfaces | share-hooks | search-magnets | retention-loops | conversion-paths | traffic-diagnosis | adsense-prep`.
    - Draw U ~ Uniform(0,1): if U < 0.50 → GROWTH, else CORE.
    - **CORE sampling:** sample by domain weights from **DOMAIN WEIGHTS** `weights_core` (not from free-text notes). Base weight = 1 when first seen. When a CORE domain is selected: set it to **1** and **increase by 1** every other CORE domain (all CORE domains are non-fixed). Write into DOMAIN WEIGHTS.
    - **GROWTH sampling — TWO-URN (required; solves FIXED monopoly):**
      1. Let `p_fixed = 0.35` (share of GROWTH IDEATEs reserved for FIXED domains). Constant unless human changes this file.
      2. Draw U_g ~ Uniform(0,1).
      3. **Urn FIXED** (if U_g < p_fixed): sample only among FIXED domains still present in GROWTH (`traffic-bets`, `search-magnets`) proportional to their listed weights (both stay **3** forever). Selecting a FIXED domain does **not** change any GROWTH weights (FIXED never reset, never increase; non-fixed weights unchanged on FIXED wins).
      4. **Urn FLEX** (if U_g ≥ p_fixed): sample only among **non-FIXED** GROWTH domains still in the catalog (`growth-surfaces`, `share-hooks`, `retention-loops`, `conversion-paths`, `traffic-diagnosis`, and `adsense-prep` while active) by their weights in DOMAIN WEIGHTS. When a FLEX domain is selected: set it to **1** and **increase by 1** every other **non-FIXED** GROWTH domain that was not selected. FIXED weights unchanged.
      5. If the FIXED urn is empty (should not happen while both FIXED exist), fall through to FLEX. If FLEX urn is empty, fall through to FIXED.
    - **FIXED forever (semantics under two-urn):** `traffic-bets` and `search-magnets` always weight **3** inside the FIXED urn; their weight NEVER resets when selected and NEVER increases when not selected. They must **not** be mixed into the FLEX weighted pool (that was the monopoly bug).
    - **TEMPORARY:** `adsense-prep` weight **2** while active (FLEX urn only); track `adsense-prep_runs` (0..5). Each time adsense-prep is selected, increment by 1. On the 5th selection, after that run completes: permanently remove `adsense-prep` from the GROWTH catalog list and from `weights_growth` in this file — it must not appear again.
    - Always state: catalog, domain, method (`U`, and if GROWTH: `U_g`, urn FIXED|FLEX, `p_fixed`), weights before/after, `adsense-prep_runs` if still active.
    - If `last_closed_domain` equals the newly sampled domain, re-roll **once** within the same catalog (same two-urn rules for GROWTH).
    - Never default to `kits` out of habit; kits must win the CORE weighted sample fairly.
12. NEXT STEP / SIGUIENTE RECOMENDADA (retention — required for shareable playgrounds / experiences):
    When shipping or polishing any interactive playground, experience, signature, particle studio, canvas studio, or similar under CORE domains `playgrounds | journeys | studio-composition | games` (shareable interactive surfaces — NOT plain catalog calculators, NOT adsense-prep, NOT traffic-diagnosis):
    - (a) Register in `src/lib/playgrounds/next-step.ts` `PLAYGROUNDS` (id, nameEn, nameEs, blurbEn, blurbEs, pathEn, pathEs, emoji) if missing.
    - (b) Add `PLAYGROUND_JOURNEYS[id]` with 3–4 related ids (primary next first).
    - (c) Mount `<PlaygroundNextStep currentId="…" locale="en|es" />` on **both** EN and ES route pages, after the main interactive surface and **before** `AdsterraBanner`.
    - (d) Never ship a new playground/experience route without this block. First ship may include next-step in the same run or the immediate next polish run — never leave routes without it across acceptance. Reuse `@/components/playgrounds/PlaygroundNextStep`; do not invent a parallel widget.

---

## DOMAIN WEIGHTS + last_closed (structured — edit on every IDEATE / close)

**Authoritative for rolls.** Do not invent weights from memory or from free-text `notes`. Update this block whenever a domain is selected (IDEATE) or a project is closed.

```
last_closed_domain: studio-composition
last_closed_id: glow-trail
p_fixed: 0.35

weights_core:
  kits: 5
  journeys: 1
  games: 3
  simulators: 5
  studio-composition: 2
  playgrounds: 4

weights_growth:
  # FIXED urn only (always 3; not mixed into FLEX pool)
  traffic-bets: 3
  search-magnets: 3
  # FLEX urn (anti-starvation among these only)
  growth-surfaces: 1
  share-hooks: 1
  retention-loops: 1
  conversion-paths: 1
  traffic-diagnosis: 1
  adsense-prep: 2

adsense-prep_runs: 1
```

Notes:
- CORE: post-roll after journeys selected (journeys=1; others +1).
- GROWTH two-urn: ~35% of GROWTH IDEATEs hit FIXED urn; ~65% hit FLEX urn with real anti-starvation.
- On close of River of Light: `last_closed_domain: journeys`, `last_closed_id: river-light`.

---

## RECENT_CLOSED (last 8–10 Ideas Lab outcomes)

Newest first. Used by QUALITY BAR ("different from last 8–10"). On project close, **prepend** one line and keep at most 10 entries.

```
- 2026-10-15 | studio-composition | glow-trail | Glow Trail Composer
- 2026-10-15 | games | pulse-catch | Pulse Catch
- 2026-10-1x | playgrounds | gravity-particles | Gravity Particles (prior)
- 2026-10-1x | growth-surfaces | postcard | Particle Postcard (prior)
- 2026-10-1x | studio-composition | neon-sign | Neon Signature Studio (prior)
- 2026-10-1x | playgrounds | kaleidoscope-mandala | Kaleidoscope Mandala (prior)
- 2026-10-1x | playgrounds | constellation-studio | Constellation Share Studio (prior)
- 2026-10-1x | playgrounds | particle-signature | Particle Signature (prior)
```

When closing **River of Light**, prepend: `2026-10-15 | journeys | river-light | River of Light Journey`.

---

## DOMAIN NOTES (what each domain is for)

### CORE (product experiences)

| Domain | Intent | Good fit | Bad fit |
| --- | --- | --- | --- |
| **playgrounds** | Open-ended interactive canvases / particle fields | Particles, gravity, signature draw, constellation drag | Static form + number out |
| **journeys** | Guided or path-based experiences with a sense of progression | Waypoint rivers, multi-step visual paths, celebration arcs | Single-step calculator |
| **studio-composition** | Compose / draw / arrange visual output | Glow trails, mandalas, floor plans, neon signs | Quiz with score only |
| **games** | Rules, challenge, win/lose or score | Pulse catch, skill games already in catalog style | Fake "game" that is a form |
| **simulators** | Systems that evolve under parameters | Physics, waves, populations with live viz | Spreadsheet without motion |
| **kits** | Bundled multi-tool paths (use sparingly; anti-starvation allows it when weight wins) | Coherent multi-step kit UX | Random pile of unrelated tools |

### GROWTH (traffic / share / trust — not "another tool")

| Domain | Intent | Gate |
| --- | --- | --- |
| **traffic-bets** | Hypothesis-driven growth experiment with measurable bet | Prefer 2–3 Vercel Analytics findings first |
| **growth-surfaces** | Surfaces that increase discovery (hubs, entry pages, cross-links) | Must be concrete shippable UI |
| **share-hooks** | Make an existing or new experience more shareable (URL state, snapshot, OG) | Prefer tying to a real interactive surface |
| **search-magnets** | Editorial / SEO depth that attracts search without thin pages | Original text; no doorway spam |
| **retention-loops** | Next-step, return paths, streaks-adjacent UX on experiences | Prefer Vercel Analytics context when possible |
| **conversion-paths** | Clearer paths from home/catalog → high-value experiences | Do not remove ads to "convert" |
| **traffic-diagnosis** | Measure visits; classify A/B/C; report in Spanish | Not a product idea; no cosmetic commits |
| **adsense-prep** | Trust/content gaps for AdSense reviewers (temporary) | Max 5 runs total; never remove Adsterra |

**traffic-bets** and **retention-loops**: before ideating product-like changes under these domains, pull Vercel Analytics (or state clearly if unavailable) and cite 2–3 concrete findings.

---

## ADSENSE-PREP (temporary, max 5 runs total)

Not a product idea. Goal = close concrete gaps that block or hurt Google AdSense approval for **utilihub.net**.

**Priority order when rolled:**
1. About / Acerca page EN+ES if missing or thin
2. Privacy EN+ES — AdSense / cookies / opt-out clause when preparing for ads
3. Deepen original editorial text on high-traffic or thin tool pages (how it works, examples, limits, real FAQ)
4. Terms / Legal consistency EN+ES
5. Other trust / UX signals reviewers sample (contact clarity, ownership, non-deceptive layout)

Rules:
- One focused change per run.
- Do **NOT** remove Adsterra.
- Do **NOT** claim AdSense approval or "ready for approval" as a fact.
- Ship on `fix/spanish-complete`.
- After each adsense-prep run: increment `adsense-prep_runs` in ACTIVE PROJECT **and** in DOMAIN WEIGHTS block; commit this file.
- On run 5 completion: delete adsense-prep from GROWTH catalog and weight rules in this file permanently.

---

## TRAFFIC-DIAGNOSIS (procedure when domain rolls)

Not a product idea. One measurable diagnosis outcome per run.

1. **Measure** (best effort): Vercel Analytics / page views last 7 days vs prior 7 days; top routes EN+ES (`/`, `/es`, tools, hubs, games, top experiences) if available.
2. **Material drop thresholds** (same spirit as the dedicated traffic agent):
   - Site page views or visits ≤ −15% week-over-week, or
   - A top route ≤ −25%, or
   - 4xx/5xx spike ≥ 2× prior week baseline.
3. **Classify causes:**
   - **A — Accidental technical:** bug, 404, bad redirect, accidental noindex, broken deploy → fix only if concrete, low-risk, and does not violate Adsterra rules.
   - **B — Intentional:** perf experiment, UI/ads tradeoff, SEO experiment, new feature → do **not** revert; report impact and recommend.
   - **C — External / unknown:** seasonality, search ranking, incomplete data → document hypothesis; no speculative code.
4. If no material drop → short Spanish report "sin alerta"; no cosmetic commits.
5. Never remove or disable Adsterra as a "traffic fix". Layout reserve / safe defer only with strong CWV evidence and without killing fill rate.
6. Spanish report required: totals, material yes/no, A/B/C, action or "sin cambio de código", explicit "Adsterra intacto".

---

## QUALITY BAR

**Must have (product ideas):**
- Real interactive experience (canvas, live simulation, game loop, or guided visual journey).
- Different from **RECENT_CLOSED** (last 8–10). Do not re-ship the same id or a thin rename.
- Shippable in ≤ 6–8 runs (first ship ideally by run 1–2).
- **Immediate visual payoff** within seconds of load / first interaction.
- EN + ES routes (or shared component with `locale`) when the surface is user-facing.
- For playgrounds / journeys / studio-composition / games (shareable): next-step catalog + `PlaygroundNextStep` on EN+ES is part of the bar — incomplete without it.

**Anti-patterns (reject or re-roll idea):**
- Color-picker-only tools, simple quiz, thin calculator wrappers, "AI wrapper" with no local interaction.
- Duplicate of an existing route under a new name.
- Experiences that need accounts, payments, or heavy backends (prefer fully client-side).
- Touching HouseModeler3D or stripping ads to make room for the idea.

**adsense-prep** is exempt from the product quality bar but must still be a real, reviewable site improvement (not placeholder lorem).

**Commit message style (preferred):**
- `feat(domain): …` first ship
- `polish(domain): …` subsequent runs
- `docs(agent): …` for this file
- `fix(build): …` deploy repair only

---

## ACTIVE PROJECT (ONLY editable section for runtime idea state)

Edit this block when status, idea, runs, acceptance, notes, or idea-level fields change. Domain weights live in **DOMAIN WEIGHTS** (not only here). Then commit on `fix/spanish-complete`.

```
status: active
idea: River of Light Journey — interactive canvas experience: place waypoints on a dark field; a continuous glowing river of particles flows between them, leaving persistent afterglows and soft blooms. Controls for flow speed, core/glow colors, particle density, and loop mode. Immediate visual payoff. Shareable via URL state + PNG snapshot. EN+ES routes /river-light and /es/rio-luz. Requires next-step catalog + PlaygroundNextStep on both routes.
id: river-light
path_en: /river-light
path_es: /es/rio-luz
domain: journeys
runs_total: 6
runs_remaining: 1
acceptance: pending
notes: IDEATED 2026-10-15. Catalog CORE (U≈0.71>0.50), domain=journeys. Previous closed: studio-composition (Glow Trail). SHIPPED run 1/6 + POLISH runs 2–5/6. next-step + Adsterra intact. Ops blocks 2026-10-15. TWO-URN GROWTH sampling applied 2026-10-15 (p_fixed=0.35) to fix FIXED monopoly; restored file after tip corruption.
adsense-prep_runs: 1
```

---

## IDEATE idea template (required fields when writing a new ACTIVE PROJECT)

Fill every field (use `n/a` only for traffic-diagnosis / adsense-prep where product fields do not apply):

```
status: active
idea: <one paragraph: what the user does + visual payoff + why not a calculator>
id: <kebab-case, matches next-step id when applicable>
path_en: /...
path_es: /es/...
domain: <rolled domain>
runs_total: <1..15>
runs_remaining: <same as total at IDEATE>
acceptance: pending
share: url | png | both | n/a
next_step_required: yes | no
acceptance_bullets:
  - <observable criterion 1>
  - <observable criterion 2>
  - <deploy READY + smoke if user-facing>
notes: <roll math: U, catalog, if GROWTH: U_g + urn FIXED|FLEX + p_fixed, weights pre→post, last_closed check, date>
adsense-prep_runs: <unchanged unless adsense-prep domain>
```

Also update **DOMAIN WEIGHTS** (and GROWTH list if adsense-prep removed) in the same commit as the new ACTIVE PROJECT.

---

## POST-SHIP SMOKE CHECK (after READY on user-facing ship/polish)

Do not claim success on deploy READY alone if routes were added or changed.

1. Resolve preview or production URL for branch `fix/spanish-complete` (Vercel deployment URL is fine).
2. Open **path_en** and **path_es** from ACTIVE PROJECT (or the paths just shipped).
3. Confirm best-effort:
   - Page returns 200 / renders shell (not blank error boundary).
   - Main interactive surface present (canvas or equivalent).
   - If next_step_required: `PlaygroundNextStep` (or visible "next" retention block) present in the page.
4. If smoke fails but deploy is READY → fix in this run if within one primary outcome budget; else note failure honestly and leave acceptance pending.
5. Record in Spanish summary: smoke EN/ES ok or fail + how checked (tool / assumption).

Skip smoke for pure docs-only commits, traffic-diagnosis reports with no UI, or adsense-prep text-only if no new interactive route.

---

## MODE (state machine)

Every run starts with **Deploy check** + **load this file** (if not already in context).

### 0) Bootstrap
1. List Vercel deployments for utilihub, branch `fix/spanish-complete` (recent).
2. If latest relevant deploy is ERROR → enter FIX-BUILD (max 2). Else note READY / BUILDING / etc. honestly.
3. Read ACTIVE PROJECT, DOMAIN WEIGHTS, RECENT_CLOSED.

### 1) If `status: active` and `runs_remaining > 0` → **EXECUTE**
- Advance the current idea: implement, polish, or wire missing next-step / i18n / share.
- One primary outcome.
- After meaningful progress: decrement `runs_remaining`, append notes, commit this file + code.
- POST-PUSH deploy check again; if user-facing → **POST-SHIP SMOKE CHECK**.
- If acceptance criteria are met (idea text + QUALITY BAR + next-step + smoke) → set `acceptance: ready` or close project:
  - Prepend to **RECENT_CLOSED**
  - Set `last_closed_domain` / `last_closed_id` in DOMAIN WEIGHTS
  - Clear or mark ACTIVE PROJECT done
  - Same or next run → IDEATE

### 2) If project is **done** / acceptance closed / `runs_remaining == 0` without acceptance → **IDEATE**
1. Domain roll (IMMUTABLE §11) using **DOMAIN WEIGHTS** + two-urn for GROWTH: state U, catalog, (U_g, urn), weights pre, domain, weights post, adsense-prep_runs.
2. If `last_closed_domain` == new domain → re-roll once same catalog.
3. Check **RECENT_CLOSED** — reject duplicates / thin renames.
4. Propose one idea under QUALITY BAR using **IDEATE idea template** (or adsense-prep / traffic-diagnosis procedures).
5. Write new ACTIVE PROJECT + update DOMAIN WEIGHTS in this file.
6. Commit this file. Do not start a huge multi-file ship in the same run unless the idea is tiny; usually IDEATE ends with state written.

### 3) FIX-BUILD (runbook — max 2 attempts per run)

Only when deploy ERROR after a push from this agent (or blocking ERROR on the branch you need). Do not invent green deploys.

**Order of diagnosis:**
1. Open Vercel deployment logs / error message (build command failure vs runtime).
2. Common UtiliHub / TanStack / Vite failures:
   - **Missing import / wrong path** — component or route import typo; fix path to match `src/`.
   - **Route file naming** — `createFileRoute` path must match file under `src/routes/`.
   - **TypeScript** — unused vars, bad props, `strict` null; fix types without `as any` sprawl.
   - **next-step.ts** — duplicate id, trailing comma, bad export; keep `PLAYGROUNDS` + `PLAYGROUND_JOURNEYS` consistent.
   - **SEO / head** — invalid JSX in `head()`; match sibling routes.
   - **Adsterra / layout** — do not "fix" by removing ads; restore banner if accidental delete.
3. One focused fix commit per attempt (`fix(build): …`).
4. Re-list deployments; if still ERROR after 2 attempts → stop, report log excerpt in Spanish summary.
5. RATE_LIMITED → wait/retry once; not counted as a successful green deploy.

### EXECUTE checklist (shareable playground / journey / studio / game)

1. Component under `src/components/playgrounds/` (or existing pattern for games).
2. EN route + ES route (`createFileRoute`), SEO head (title, description, canonical, hreflang), copy in both languages.
3. Immediate canvas/visual on load; mobile-friendly pointer events where relevant.
4. Share: URL state and/or PNG snapshot when promised in the idea.
5. `PLAYGROUNDS` + `PLAYGROUND_JOURNEYS` in `next-step.ts`.
6. `<PlaygroundNextStep currentId="…" locale="…" />` on both routes **before** AdsterraBanner.
7. Do not remove Adsterra; keep banner placement consistent with sibling experiences.
8. Deploy check → **POST-SHIP SMOKE CHECK** → update ACTIVE PROJECT notes + runs_remaining.

### Weight sampling (practical)

**CORE:** Sum `weights_core`; draw r ~ Uniform(0, sum); walk cumulative ranges. Selected → 1; every other CORE domain → +1.

**GROWTH two-urn:**
1. Read `p_fixed` (default 0.35) from DOMAIN WEIGHTS.
2. U_g ~ Uniform(0,1).
3. If U_g < p_fixed → FIXED urn: sample among {traffic-bets, search-magnets} by weight 3 each (equal). No weight updates.
4. Else → FLEX urn: sample among non-FIXED keys in `weights_growth` still present. Selected non-fixed → 1; other non-fixed → +1; FIXED keys untouched.
5. Record method string e.g. `GROWTH two-urn U_g=0.22 urn=FIXED p_fixed=0.35` or `… urn=FLEX …`.

---

## How to update state in this file

1. ACTIVE PROJECT — idea runtime fields.
2. DOMAIN WEIGHTS — last_closed_*, p_fixed, weights_*, adsense-prep_runs.
3. RECENT_CLOSED — prepend on close (max 10).
4. Commit on `fix/spanish-complete` with identity `andygargol2010-afk` / `andygargol2010@gmail.com`.
5. Do not change IMMUTABLE text except the documented permanent removal of adsense-prep after 5 runs (and human-approved sampling rule updates like this two-urn patch).
6. Keep the automation bootstrap prompt short; do not mirror the full file back into Automations.
7. Ignore `.agent/state/ideas-lab-active.json` for decisions.

---

## Spanish summary template (end of every run)

Write a short closing section in Spanish covering:
- Deploy: READY / ERROR / BUILDING (honest).
- Smoke EN/ES: ok / fail / skipped (+ reason).
- Qué se hizo (un outcome).
- ACTIVE PROJECT: idea, domain, runs_remaining, acceptance.
- Weights / last_closed / urn if IDEATE or close.
- Archivos / commits tocados (si hubo).
- Confirmación de identidad de commit si hubo push.
- Si aplica: Adsterra intacto; next-step presente sí/no.
- Próximo paso sugerido (EXECUTE polish / close / IDEATE).

---

## ALWAYS

- Spanish summary at end of every run.
- Commits with correct identity only.
- Quality > novelty.
- One primary outcome per run.
- When the idea is a retention surface (playground / experience / journey / studio / game shareable): next-step catalog + PlaygroundNextStep on EN+ES.
- Never remove Adsterra. Never touch HouseModeler3D for "performance theater".
- File `.agent/ideas-lab.md` wins over any stale text in the short automation prompt or deprecated JSON state.
- After user-facing READY: POST-SHIP SMOKE CHECK.
- GROWTH rolls use **two-urn** sampling (never mix FIXED into the FLEX weight pool).
