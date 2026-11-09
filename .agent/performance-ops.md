# UtiliHub Performance — Ops

## MODE

0. Load state (sample list, pending-verification, trend table).  
1. Re-measure any **pending-verification** URLs first (post-deploy after).  
2. Rotate **2** sample URLs this run (from the fixed list in state).  
3. If PSI fails/rate-limits on the targets → **stop**: summary only, **no code**.  
4. Else baseline → pick ONE optimization for the largest opportunity → ship → state (expected effect + optional KB delta) → single commit.

## Fixed URL sample (production)

Stored in state; rotate **2 per run**:

- `https://www.utilihub.net/`
- `https://www.utilihub.net/es`
- `https://www.utilihub.net/tools/unit-converter`
- `https://www.utilihub.net/es/herramientas/calculadora-imc`
- `https://www.utilihub.net/tools/css-box-shadow-generator`
- `https://www.utilihub.net/games/2048`
- one simulator page (path in state)
- one guide page (path in state)

## Definition of done

1. **Baseline** from PSI for the target URL(s) written into state (score, LCP, CLS, TBT, field if any, top 3 opportunities).
2. **Exactly one** code optimization that addresses the **biggest PSI opportunity** on the chosen URL (or none if PSI failed / nothing safe).
3. **Expected effect** written + **KB delta** of the changed chunk if knowable from the code (import graph / lazy boundary).
4. **REAL after** is **not** invented this run: add the URL to **pending-verification**; next run(s) re-PSI after Andy deploys and fill after numbers + trend row.
5. Ads kill switch, SEO head, SSR H1, registry untouched; HouseModeler3D.tsx not modified.
6. Single commit including `performance-state.md`, or **no commit**.

## Pending verification

State must keep a list:

```
pending_verification:
  - url: …
    shipped_sha: …
    expected: …
    baseline_score/LCP/CLS/TBT: …
    after: pending
```

When re-measured after deploy: set `after`, append trend row, remove or mark verified.

## Trend table

In state, max **20 rows** (drop oldest):

```
date | url | score | LCP | CLS | TBT | notes
```

## PRE-PUSH SELF-REVIEW

a. Re-fetch written files; abort on >10% unexpected shrink or `PLACEHOLDER` / `$(cat`.  
b. No full write >40 KB.  
c. No registry.tsx / registry-entries rewrite; no duplicate slug.  
d. Imports/exports valid.

## Coordination

- Heavy 3D: propose to house-modeler; do not edit monolith.
- Ads: fail-closed kill switch remains source of truth.
- No high-impact low-risk win after PSI: summary, **no push**.

## Spanish summary template

```
PSI URLs: …
Baseline (score/LCP/CLS/TBT + top opportunity): …
Cambio: … | expected: … | KB delta: …
pending-verification: …
Trend rows added: …
PRE-PUSH: a=… b=… c=… d=…
Commit: <SHA>|ninguno
HouseModeler3D / ads / SEO / H1 / registry: intactos
```

<!-- end:performance-ops.md -->
