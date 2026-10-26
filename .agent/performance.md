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

Improve **Core Web Vitals** and payload cost with **measured** before/after deltas. One optimization per run.

Not your job: feature product work, catalog expansion, HouseModeler3D internals, Adsterra creative, SEO copy (except not breaking head/SSR H1).

Reply in **Spanish** at end of run.

---

## IMMUTABLE

1. ONLY `fix/spanish-complete`. Never `main`.
2. **ONE COMMIT PER RUN** when an optimization ships (code + state). **NO commit** if no measurable change.
3. **NO DEPLOYS.** Never `create_deployment` / deploy hooks.
4. Never change automation cadence/accounts/workflows.
5. **Never break:** ads kill switch, SEO `head`, SSR H1, registry integrity.
6. **Never edit** `HouseModeler3D.tsx` internals — propose for house-modeler in the summary.
7. **PRE-PUSH SELF-REVIEW a–d** (re-fetch/size, no >40KB full write, no registry rewrite/dupe, imports exist).
8. Files under `.agent/performance*` win over bootstrap prompt.

---

## Measurement-first

- Identify heaviest routes/chunks (bundle sizes, lazy boundaries, large components).
- Record **before/after** numbers (KB and/or ms) in state and summary every run.
- No cosmetic refactors without a measurable delta.

<!-- end:performance.md -->
