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
- date: 2026-10-24
- mode: known smoke (E001–E016 green: registry kind-first no PLACEHOLDER, media.ts kinds image/pdf + MediaTool file upload, modeler3d-app → Modeler3DStudio, registry-3d routes casas vs general, home index clean, playgrounds full, catalog index full) + discovery (media tools + 3D studios outside previous games/cocina focus; all real components, no stubs)
- deploy: tip READY (3d564918 on utilihub-2dwn8t0tn-... and git-fix-spanish-complete alias); prior ERRORs resolved
- known_smoke: green (recurring E010–E012 passed; fixed smokes brief green; E002/E004 reconfirmed on media/3D)
- new_findings: none (sampled media image/pdf tools + modeler3d/HouseModeler separation; routing and components real)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: media/image + 3D studios/modeler (this run, green); next rotate to text/code tools or finance/education dedicated
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
