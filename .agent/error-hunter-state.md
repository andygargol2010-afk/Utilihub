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
- date: 2026-10-23 (HEAD ~2cca9f6c / ceaac6f9 after restore; prior ERROR deploy on 4dc160a for missing NeonLayerComposer export)
- mode: known smoke (E001-E011 green on prior; E010/E011 stable) + discovery (sampled NeonLayerComposer: found return-null stub after feat/polish; PLACEHOLDER search 0)
- deploy: prior ERROR fixed by restore; current HEAD should build (monitor post-push)
- known_smoke: E001-E011 green; E012 newly fixed
- new_findings: E012 NeonLayerComposer stub (return null) — restored full from c979242
- fixes: 1 (NeonLayerComposer.tsx restore, commit 2cca9f6c)

## Rotation (evitar sesgo)
- last_known_focus: E012 NeonLayerComposer (new, fixed)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
