# UtiliHub Performance — State

Runtime state for the CWV / performance automation. End marker required.

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a measured optimization ships. No state-only commits. No deploys. Measurement-first.

---

## Last known wins (seed from reports)

- CLS: ad slot reservation on tool banner (`11ec799` era).
- JS: home catalog split out of index / es.index (`3c0ba57` era).
- INP: `__root` stops hydrating unused streak/share (`6185a16` era).
- Tool routes: lazy page + DeferredToolUi splits; listings idle-prefetch.

## ACTIVE FOCUS

```
status: idle
last_run: none-since-rules-bootstrap
baseline: n/a
candidate: n/a
after: n/a
notes: Rules bootstrap 2026-10-26. Prefer measured listing/tool-shell hydration or chunk weight; do not re-open ad reservation, home catalog split, root hooks, or HouseModeler3D quality.
```

<!-- end:performance-state.md -->
