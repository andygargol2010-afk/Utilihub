# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a fix ships (code + catalog/state). **No commit if nothing found.** No deploys. PRE-PUSH SELF-REVIEW a–d. Max 20% time on fixed-item regression smoke. Discovery: prod/runtime → recent risky commits → code sampling.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-27 run 19
last_fix: E040 AuroraRibbonWeaver PLACEHOLDER stub (SHA 76d60622)
last_known_focus: E031 recurring ($(cat / PLACEHOLDER stubs) — fixed new instance in AuroraRibbonWeaver.tsx; critical homes/registry/summary-es clean)
new_findings: E040 (PLACEHOLDER in playground component causing build ERROR)
deploy: recent ERROR on 027e2060 and 61924ea6 due to missing export; fix pushed, awaiting new deploy READY
notes: Known smoke green on index.tsx, registry, summary-es, orbit guide. Discovery found AuroraRibbonWeaver.tsx literal PLACEHOLDER_WILL_REPLACE (from 3a991e2), causing Vercel build ERROR "AuroraRibbonWeaver is not exported". Restored full component from e01519d (gravity/hueShift/randomize/deep-link). No other $(cat or PLACEHOLDER in src. E031 remains open/recurring.
```

<!-- end:error-hunter-state.md -->
