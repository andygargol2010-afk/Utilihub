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
- date: 2026-10-25
- mode: known smoke (E001 registry, E005 homes, E004 3D routing, E031 catalog real) + discovery (playgrounds/ModularPatternComposer)
- deploy: tip SHA caa4965 pushed; previous READY on 57a9f0a3; no current ERROR on latest
- known_smoke: all sampled fixed (registry full, homes real, 3D correct routing); E031 still recurring pattern but current files clean
- new_findings: E033 ModularPatternComposer was stub returning null (blank playground); restored full from 6528acc5
- fixes: restored src/components/playgrounds/ModularPatternComposer.tsx (530 lines added); catalog + state updated

## Rotation (evitar sesgo)
- last_known_focus: E031 $(cat pattern) + playgrounds
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
