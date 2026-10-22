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
- date: 2026-10-22 (late)
- mode: known smoke + discovery (games registry + routes + dedicated tools + SEO fallback + modeler)
- deploy: latest READY on 8e9c95732abf0a51fcc99845f61a3aa3b434bfcf (no ERROR/BUILDING)
- known_smoke: E001–E008 code-ok (registry full with kind-first + dedicated UIs, homes clean no $(cat, modeler3d-app → Modeler3DStudio, SEO fallback kind-aware, dedicated Electrical/Flight tools real components)
- new_findings: ninguno (games registry complete, no PLACEHOLDER, no $(cat, no broken imports visibles en sample)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E004 modeler + E003 SEO + brief E001/E008
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
