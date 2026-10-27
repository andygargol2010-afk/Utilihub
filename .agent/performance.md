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
