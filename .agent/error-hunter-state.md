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
- mode: known smoke + discovery
- deploy: READY (SHA a53b4432f829fef561feb856caeffc4e25b59bdc, branch preview protected)
- known_smoke: E001 code-ok (no PLACEHOLDER, exports present); E002-E006 code-ok (homes restored, kind routing present, modeler3d-app → Studio, no $(cat)
- new_findings: none (sampled registry-3d, DeferredToolUi, new tools calculadora-ahorro-mensual + conversor-kg-libras registered, no PLACEHOLDER/$(cat)/Tool not available patterns)
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E001 (deepened code verification)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
