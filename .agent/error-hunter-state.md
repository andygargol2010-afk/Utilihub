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
- date: 2026-10-26
- mode: known smoke (E001 registry full no PLACEHOLDER, E005 homes clean, E031/E034 tip clean, ModularPatternComposer full) + discovery (new tools calculadora-iva + conversor-kmh-ms missing registry wires)
- deploy: tip previous e5459da no deploy listed yet at check; fix SHA 554d53a (wire dedicated UIs) committed; post-push verification pending
- known_smoke: registry complete, homes start with import no $(cat, summary-es full no PLACEHOLDER, ModularPatternComposer canvas present; E031 still open as risk pattern but no active corruption
- new_findings: E035 — dedicated UIs for calculadora-iva and conversor-kmh-ms existed + catalog wired but pickComponent missing slug checks → generic Math/Converter UI. Fixed by adding lazy + early returns.
- fixes: 1 code (registry.tsx wire); catalog + state updated

## Rotation (evitar sesgo)
- last_known_focus: E031 PLACEHOLDER risk + new tool wiring (E035)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
