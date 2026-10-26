# UtiliHub Performance — Ops

## MODE

0. Load state + last report evidence.  
1. Pick **one** optimization with expected measurable delta.  
2. Implement → measure → PRE-PUSH SELF-REVIEW → single commit (or no commit).

## Definition of done

1. **Baseline** numbers written (route/chunk, KB or ms, method).
2. **Exactly one** optimization shipped (or none).
3. **After** numbers written; delta stated (even if small/negative — be honest).
4. Ads kill switch, SEO head, SSR H1, registry untouched.
5. HouseModeler3D.tsx not modified.
6. Mobile consideration (390px) if the change affects layout/hydration.
7. Single commit including `performance-state.md`, or **no commit** if no change.

## PRE-PUSH SELF-REVIEW

a. Re-fetch written files; abort on >10% unexpected shrink or `PLACEHOLDER` / `$(cat`.  
b. No full write >40 KB.  
c. No registry.tsx / registry-entries rewrite; no duplicate slug.  
d. Imports/exports valid.

## Coordination

- Heavy 3D: propose to house-modeler; do not edit monolith.
- Ads: fail-closed kill switch remains source of truth.
- If no high-impact low-risk win: **META** note in summary, **no push**.

## Spanish summary template

```
Baseline: …
Cambio: …
After / delta: …
PRE-PUSH: a=… b=… c=… d=…
Commit: <SHA>|ninguno
HouseModeler3D: no tocado
Ads/SEO/H1/registry: intactos
```

<!-- end:performance-ops.md -->
