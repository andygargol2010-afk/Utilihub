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
- date: 2026-10-22
- mode: known smoke + discovery (sampling dedicated tool UIs + routes)
- deploy: latest READY on b96d5f92 (Aura Card routes); no current ERROR/BUILDING on HEAD at check time
- known_smoke: E001–E007 code-ok (registry full, no PLACEHOLDER, kind routing, homes clean, i18n imports OK)
- new_findings: E008 — ElectricalPowerCalculatorTool.tsx y FlightTimeCalculatorTool.tsx eran literal PLACEHOLDER → crash al abrir tools; corregido con implementaciones reales
- fixes: 2 (9675c9de ElectricalPower, 3dedd6a3 FlightTime)

## Rotation (evitar sesgo)
- last_known_focus: E008 (dedicated tool stubs) + brief E001 registry
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
