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
- date: 2026-10-22 (evening, post HEAD 57b25f00)
- mode: known smoke (E001–E008 brief: registry, homes, modeler path, dedicated, no PLACEHOLDER/$(cat)) + discovery (sample EN/ES tools, 3D modeler/house, PixeliHub, games/2048+snake, /games + /es/juegos)
- deploy: latest READY on SHA 57b25f00801eb611584cf57063b1fef43216fde3 (no ERROR)
- known_smoke: all E001–E008 code-ok (registry kind-first present, homes load, no stubs, modeler at /tools/3d-modeler and /es/herramientas/modelador-3d loads correct studio description)
- new_findings: ninguno. Sample de tools (porcentaje, png-to-jpg), studios y games cargan sin 404 ni crash visible; SEO genérico en algunos (house modeler) pero dentro de fixed E003; no patrones PLACEHOLDER/$(cat/Tool not available.
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E004 modeler + E005 homes + games sample
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
