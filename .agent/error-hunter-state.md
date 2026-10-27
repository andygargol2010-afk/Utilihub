# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a fix ships (code + catalog/state). **No commit if nothing found.** No deploys. PRE-PUSH SELF-REVIEW a–d. Max 20% time on fixed-item regression smoke. Discovery: prod/runtime → recent risky commits → code sampling.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-27 run 21
last_fix: restored src/lib/general/index.ts from e341781 (was "placeholder for index")
last_known_focus: E031 recurring ($(cat / PLACEHOLDER stubs) — fixed index.ts placeholder; registry.tsx, homes, AuroraRibbonWeaver, ModularPatternComposer, summary-es clean)
new_findings: src/lib/general/index.ts reduced to placeholder string, would break GENERAL_TOOLS export and tool pages/build
deploy: latest ERROR on older SHAs (027e2060, 61924ea6); current HEAD a0d2c50 had no deploy; this restore should allow READY
notes: Known smoke green on fixed items. Discovery found placeholder in catalog index.ts. Restored full content. E031 remains open/recurring for vigilance. 1 fix.
```

<!-- end:error-hunter-state.md -->
