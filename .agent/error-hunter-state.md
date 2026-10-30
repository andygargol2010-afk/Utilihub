# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-30 run 58
last_mode: HUNT
last_fix: E045 — Spanish guide fallback now prefers tool.summaryEs over tool.summary so /es pages no longer leak English about text (e.g. calculadora-media-armonica). SHA b5997b05. Catalog+state updated in same run.
last_prevent: n/a
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat/PLACEHOLDER in src via code search, homes index/es.index start with import + createFileRoute, registry.tsx full no PLACEHOLDER; remains open for vigilance)
new_findings: sampled new tools (calculadora-media-armonica live with mixed-language guide, calculadora-desviacion-absoluta-media 404 on domain — likely not yet deployed); SudokuClassicGame full content no placeholder. Fix applied for E045. Tip deploy still on older SHA 684f2714 (READY); newer commits may not have triggered Vercel yet.
deploy: latest listed production READY dpl_AV3mRtraqdxQPWW9tvgwS1QskqvM on 684f2714. Post-push verification pending for new SHA.
notes: Known smoke E031 green. Discovery found E045 (EN leak in ES guide fallback). Fixed surgically. No other open/recurring. No build ERROR on tip.
```

<!-- end:error-hunter-state.md -->
