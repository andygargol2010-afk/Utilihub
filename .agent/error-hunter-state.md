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
- date: 2026-10-26 (run 9)
- mode: known smoke (E031 tip clean: no PLACEHOLDER/$(cat in registry.tsx, homes, summary-es.ts, catalog; homes start with import + DeferredHomeReviews; modeler3d-app → Modeler3DStudio) + discovery (sampled modeler3d-app, summary-es real content, no "Tool not available"/PLACEHOLDER patterns; recent dedicated wires present)
- deploy: recent deploys READY (no ERROR); tip SHA d31f58f pending or recent READY
- known_smoke: all fixed entries green on tip; E031 open as recurring risk but tip clean (no stubs)
- new_findings: none
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E031 clean check + E004 modeler3d + home routes
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
