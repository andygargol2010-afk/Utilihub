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

**a. Origin re-fetch**  
For every file written: re-fetch from origin after the single push; compare bytes/lines to the intended payload.  
Abort and restore if any file shrank **>10%** unexpectedly, or contains `PLACEHOLDER` / `$(cat`.

**b. File size**  
Never write a file **> 40 KB** in full via the API. For larger files: targeted edits only, or split modules.

**c. Catalog / registry hygiene**  
Do **not** rewrite `registry.tsx` or `registry-entries-*.ts`.  
If touching catalog at all: search `GENERAL_TOOLS` / `src/lib/general/index.ts` for the slug first — **no duplicate slugs**. Prefer non-catalog surfaces (routes under playgrounds/games/guides).

**d. TypeScript sanity**  
Every import path exists; every exported symbol used exists. No dangling imports.

Report a short **PRE-PUSH SELF-REVIEW** block in the Spanish summary (pass/fail per a–d).

---

## IDEATE — IDEA QUALITY RUBRIC

Generate **3 candidate ideas**. Score each **1–5** on:

1. **User value / fun**
2. **Shareability** (screenshot-worthy moment)
3. **Search demand** (real query people type; GSC or keyword logic)
4. **Distinctiveness** vs existing UtiliHub surfaces (**list the 3 closest**)
5. **Feasibility** in the run budget (default 4 / max 6)
6. **Performance cost** (mobile CWV risk; lower score = worse)

**Pick** the best total score. Write all scores into state `notes`.  
**Reject** any idea scoring **< 3** on value **or** distinctiveness.

### Project size

- Default **`runs_total: 4`**, hard max **6**.
- Must show a working, playable/useful **core by run 2** or cut scope / close.

### quality-lift

- Prefer the surface with **weakest engagement / oldest update** (not uniform random across all).
- Before run 1: write **3 concrete measurable improvements** as the “elevated bar” in `notes`.
- Still score 3 candidates when choosing which surface to lift.

### search-magnets (guides)

- Must target a **real query** (GSC or explicit keyword logic).
- Original examples / visuals; link to the live tool/game.
- No thin text pages.

### IDEATE idea template

```
status: active
idea: <paragraph>
id: <kebab-case>
path_en: /... or n/a
path_es: /es/... or n/a
path_seo: /{code}/...   # when seo-locales
domain: <rolled>
runs_total: <4..6>      # quality-lift: 4–6 with elevated bar
runs_remaining: <same at IDEATE>
acceptance: <user does X, sees Y>
share: url | png | both | n/a
next_step_required: yes | no
notes: <rubric scores for 3 candidates; chosen id; roll math; quality-lift bar if any>
adsense-prep_runs: <n>
```

---

## EXECUTE — DEFINITION OF DONE

An EXECUTE run is done only when **all** hold:

1. **One user-visible outcome** stated as an acceptance test: *user does X, sees Y*.
2. **EN + ES** strings (UI and routes as applicable).
3. **Mobile** considered at **390px** width (layout not broken).
4. **No new console errors** expected from the change.
5. **Lazy-loaded** route/component when interactive (canvas/WebGL/games).
6. **Single commit** (code + state) after PRE-PUSH SELF-REVIEW.
7. Polish-only runs (colors, particle tweaks) **at most 1 per project**.

### EXECUTE checklist (copy into summary)

```
[ ] Acceptance test written (user does X, sees Y)
[ ] EN + ES strings
[ ] Mobile 390px considered
[ ] Lazy-load if interactive
[ ] No registry.tsx / registry-entries rewrite
[ ] No duplicate slug (if catalog touched)
[ ] PRE-PUSH SELF-REVIEW a–d passed
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

<!-- end:ideas-lab-ops.md -->
