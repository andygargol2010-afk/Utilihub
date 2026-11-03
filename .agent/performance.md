# UtiliHub Performance (CWV) — Rules

Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/performance-state.md` — **required**
2. `.agent/performance.md` (this file)
3. `.agent/performance-ops.md` (procedures + DoD)

Optional evidence: `.agent/reports/perf-agent-*.md` (append-only history).

**Truncation protocol:** re-fetch incomplete reads; stop after two failures; never push partial work.

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## Role

Improve **Core Web Vitals** and payload cost using **real lab measurements** from the public PageSpeed Insights API (not guesses). One optimization per run, tied to the biggest PSI opportunity on a sampled production URL.

Not your job: feature product work, catalog expansion, HouseModeler3D internals, Adsterra creative, SEO copy (except not breaking head/SSR H1).

Reply in **Spanish** at end of run.

---

## IMMUTABLE

1. ONLY `fix/spanish-complete`. Never `main`.
2. **ONE COMMIT PER RUN** when an optimization ships (code + state). **NO commit** if no measurable change or if PSI failed.
3. **NO DEPLOYS.** Never `create_deployment` / deploy hooks. Production may lag the branch — note that in state.
4. Never change automation cadence/accounts/workflows.
5. **Never break:** ads kill switch, SEO `head`, SSR H1, registry integrity.
6. **Never edit** `HouseModeler3D.tsx` internals — propose for house-modeler in the summary.
7. **PRE-PUSH SELF-REVIEW a–d** (re-fetch/size, no >40KB full write, no registry rewrite/dupe, imports exist).
8. Files under `.agent/performance*` win over bootstrap prompt.
9. **No blind optimizations.** If PSI fails or rate-limits → summary only, no code change.

---

## NO-BREAK GATE (immutable — added 2026-11-03, never edit / weaken / remove)
Lesson: the 2026-10-28 registry split kept the build green but silently sent 102 tools to `ConfiguredTool` → users saw «Operation not available.» for days. A green build is NOT proof that tools work.
1. **Routing is frozen.** Never reorder, remove or move below the `ConfiguredToolUi` fallback any branch of `pickComponent` in `src/components/general/registry.tsx`. Only add new slug wires in `registry-ui/slugs-NN.ts` / `components-NN.ts`.
2. **No refactors/splits/moves of existing code** (registry, catalogs, i18n, shared components) by automations. A split must be proposed in the summary for Andy; never done in a run.
3. **Guards are sacred.** `npm run validate:catalog` (includes `scripts/validate-tool-routing.mjs`) must pass before every push. Never edit, weaken, skip or delete `scripts/validate-*.mjs`, `scripts/*baseline*.json` or the `validate:*`/`build` scripts in `package.json` to make a check pass.
4. **Functional smoke before push** when touching `src/components/**`, `src/lib/**` or `src/routes/**`: open ≥3 affected tools on EN and ES, enter values, press the action button. Fail if the page shows «Operation not available», «Operación no disponible», «Tool not available», «no tiene una operación», HTTP 500 or a console error. If you cannot run this check, do not push — report.
5. **Scope lock.** Touch only files your task needs. Never delete, rename or empty a file you did not create in this run; >5 files outside your own area in one commit → stop and report.
6. **Out-of-scope breakage:** report it in the summary (file + URL + symptom); do not «fix» it by rewriting someone else's code.
7. **If your push breaks build or a guard:** `git revert` your own commit in the next step. Never force-push, never reset shared branches, never restore from an older commit than the previous one.
8. **Summary must list:** files changed, guard output (`✓ tool routing guard OK`), and the smoke URLs tested. Missing evidence = task BLOQUEADA, not HECHA.

## Measurement source (mandatory)

Google PageSpeed Insights API v5 (public; no key at low volume):

```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<URL>&strategy=mobile&category=performance
```

Record from the response:

- **Lab:** performance score, LCP, CLS, TBT
- **Field (if present):** `loadingExperience` CrUX p75 LCP / INP / CLS
- **Top 3** opportunities / diagnostics (title + estimated savings when available)

Production host only: `https://www.utilihub.net` (never preview URLs for the sample table).

<!-- end:performance.md -->
