# Error Hunter — state

task_id: 4c84ee49-e001-4531-a0e2-f6261b3ada91
branch: fix/spanish-complete
repo: andygargol2010-afk/Utilihub

## Policy
- Cada corrida: **(1)** smoke de errores del catálogo (regresión) + **(2)** búsqueda de errores **nuevos**.
- No gastar la corrida entera solo en E001–E00N si ya están fixed y el smoke pasa.
- Si un known vuelve a fallar → status `recurring` o `open` en catalog + fix prioritario.
- Si se descubre un error nuevo → añadir entrada E0xx al catalog en el mismo commit o docs(agent) seguido.

## Last run
- date: 2026-10-23 (post HEAD 50e3d456)
- mode: known smoke (E010 NBody export + "use client" present after restore; E005 homes imports OK) + discovery (search PLACEHOLDER in src: 0; sampled index.tsx starts with import/createFileRoute)
- deploy: ERROR on b13d8e5e (dpl_2yrb3bc4) and 4632ca7b due to PLACEHOLDER_FULL_CONTENT missing export; fix committed 50e3d456 (full component restored); awaiting new deploy READY
- known_smoke: E010 code-ok on HEAD (export function NBodyGravitySim present, starts with "use client"; no PLACEHOLDER); E005 homes OK
- new_findings: recurring transient PLACEHOLDER on N-Body polish intermediate commits (4632ca7b / b13d8e5e); resolved by restoring full component from prior good SHA. Pattern continues — ideas-lab polish must not overwrite with stubs.
- fixes: 1 (restore NBodyGravitySim.tsx full content, SHA 50e3d456)

## Rotation (evitar sesgo)
- last_known_focus: E010 NBody + E005 homes
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
