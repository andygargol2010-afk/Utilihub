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
- date: 2026-10-22 (late, post registry-entries restore)
- mode: known smoke (E001–E008) + discovery (PLACEHOLDER/$(cat searches, registry-entries-a, modeler3d-app, homes, dedicated tools, SpanishToolSearch import, HouseModeler3D presence)
- deploy: latest READY (prior SHAs); HEAD 32bf4f74… not yet in recent list (no ERROR observed)
- known_smoke: all E001–E008 code-ok (registry full kind-first + dedicated UIs real, homes clean no $(cat, modeler3d-app → Modeler3DStudio, registry-3d correct, SEO/import paths OK, no PLACEHOLDER)
- new_findings: ninguno. registry-entries-a.ts restored prior run to valid array (now with ROI/DPI entries); no other stubs or broken patterns in sample.
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E008 dedicated + E004 modeler + brief homes/E007
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
