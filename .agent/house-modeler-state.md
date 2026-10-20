# UtiliHub House Modeler — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:house-modeler-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit state in the **same commit** as the counting run’s code/docs change (PRODUCT / FIX-BUILD / META with work). Never a second deploy-only commit for `runs_done`.  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

| | |
| --- | --- |
| task_id | `de5837d5-b00f-44e6-b175-53e118555f9b` |
| Fightersland on cap | `9dc1bead-17e3-47f8-898c-2cc98d13f022` |

---

## RUN LIFETIME

```
runs_done: 244
runs_max: 500
```

- End of counting run → `runs_done += 1` (this file + commit).
- Never raise `runs_max` or reset without user request.
- When `runs_done >= runs_max` → pause this auto + enable Fightersland (see rules). **STOP**.

---

## FORCE FOCUS — MOBILE UI (temporary)

```
status: done
remaining_runs: 0
note: completed after PRODUCT run 163 (larger secondary controls + spacing under 768px)
```

User request 2026-10-16: next 3 executions focus on making the UI more comfortable for phone users; PC unchanged. Completed.

---

## MONOLITH NOTES

```
path: src/components/general/HouseModeler3D.tsx
approx_bytes: 331247
last_known_good_hint: (post PRODUCT densify door-metal SHA pending ~330kB)
policy: prefer META when create_or_update_file would full-rewrite >300KB (tool-channel truncation risk)
Actions restore workflow_id: 375758025
```

Update `approx_bytes` / SHA after successful surgical PRODUCT or RESTORE verification.

---

## LAST RUN SNAPSHOT

```
last_mode: META
last_date: 2026-10-20
SEO_LOCALES_ACTIVE: pt (defer)
deploy: READY
note: Health check OK. Monolith 331247 bytes, no PLACEHOLDER, Sky present, deploy READY (d76122a). Railing densify deferred (no sandbox push auth; tool-channel full rewrite risk).
```

Refresh after each run.

---

## NOTES

```
Prefer local-clone surgical PRODUCT when auth available. Prefer META if only path is full rewrite >300KB via tool channel.
PRODUCT run 234: clay tiles densify (flecks 9→12, moss denser) via local clone surgical.
META run 235: health check + deferred chimney-crown densify due to no sandbox push auth.
PRODUCT run 236: chimney crown densify (courses 4→5 + soot/flecks/lime) via local clone surgical.
PRODUCT run 237: worn-earth densify (grit/damp/leaf/cracks) via local clone surgical.
RESTORE 2026-10-20: failed PRODUCT push truncated to PLACEHOLDER; restored via Actions (06f436ec).
META run 238: confirmed READY deploy + monolith health; door-metal densify still queued for authenticated local push.
META run 239: reconfirmed monolith health (~351kB, no PLACEHOLDER), deploy READY, door densify deferred.
MODELADOR-3D run 240: concrete MatPreset added surgically in helpers.
RESTORE 2026-10-20: push_files literalized content; monolith restored via Actions (aa9dbdb7). Door densify still deferred.
META run 241: confirmed tip READY, monolith intact (~330kB SHA aa9dbdb7), door densify deferred due to truncation risk.
PRODUCT run 242: door sheet-metal densify (seams 5→7, rivets 6→9 + weathering) via local clone surgical. runs_done=242.
PRODUCT run 243: roof-metal densify (seams 7→9 + fastener dots + denser weathering) via local clone surgical. runs_done=243.
META run 244: confirmed READY deploy + monolith health (331247 B); railing-metal densify deferred (no push auth / truncation risk).
```

<!-- end:house-modeler-state.md -->
