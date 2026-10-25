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
- mode: known smoke (E001 registry full, E005 homes clean, E031/E034 PLACEHOLDER risk) + discovery (Vercel ERROR logs on tip-1, summary-es.ts PLACEHOLDER check, modeler3d-app, HouseModeler size)
- deploy: SHA 1a75be3 ERROR (PLACEHOLDER in summary-es.ts → missing SUMMARY_ES export); tip c920a10 restored file (deploy pending or not yet listed)
- known_smoke: registry complete no PLACEHOLDER, homes start with import no $(cat, ModularPatternComposer full canvas; E031 recurring risk confirmed by previous PLACEHOLDER
- new_findings: E034 — summary-es.ts was PLACEHOLDER on ERROR SHA, causing build fail; already restored in tip commit. Added to catalog as fixed.
- fixes: 0 code (restore already in c920a10); docs catalog + state updated

## Rotation (evitar sesgo)
- last_known_focus: E031/E034 PLACEHOLDER stubs + i18n summary-es
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
