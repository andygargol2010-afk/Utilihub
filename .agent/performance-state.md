# UtiliHub Performance — State

Runtime state for the CWV / performance automation. End marker required.

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a PSI-backed optimization ships. No state-only commits. No deploys. No blind opts if PSI fails.

---

## Sample URLs (rotate 2 per run)

```
- https://www.utilihub.net/
- https://www.utilihub.net/es
- https://www.utilihub.net/tools/unit-converter
- https://www.utilihub.net/es/herramientas/calculadora-imc
- https://www.utilihub.net/tools/css-box-shadow-generator
- https://www.utilihub.net/games/2048
- https://www.utilihub.net/simulators/n-body-gravity
- https://www.utilihub.net/guides/modular-pattern-composer
```

`next_sample_index: 0`  # start index into the list above (mod length); advance by 2 each successful sample run

---

## pending_verification

```
(none)
```

---

## Trend table (max 20; newest first)

```
date | url | score | LCP | CLS | TBT | notes
(empty — fill from PSI)
```

---

## Last known code wins (historical; not PSI-verified in this table)

- CLS: ad slot reservation on tool banner (`11ec799` era).
- JS: home catalog split (`3c0ba57` era).
- INP: `__root` idle streak/share (`6185a16` era).
- Tool routes: lazy page + DeferredToolUi splits.

## ACTIVE FOCUS

```
status: idle
last_run: psi-rules-2026-10-26
baseline: n/a
candidate: n/a
notes: Next run must call PSI on two sample URLs (and any pending_verification). Production host only. No code change if PSI fails.
```

<!-- end:performance-state.md -->
