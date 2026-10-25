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
- mode: known smoke (E031 recurring catalog stub) + discovery (games/simulators registries, general index, HouseModeler3D, tip deploy status)
- deploy: tip SHA 60cea8a8 sin deploy aún; último ERROR en 37111dc (slug dupe calculadora-area-habitacion) ya corregido por rename a calculadora-area-rectangular en commits posteriores
- known_smoke: E001 registry.tsx real (pickComponent + dedicated wires OK); E005 homes reales; E031 OPEN (catalog.md era literal "$(cat /tmp/catalog.md)", ahora restaurado); E032 fixed
- new_findings: ninguna tool rota nueva; E031 es el único abierto real
- fixes: restaurado error-hunter-catalog.md completo (E001–E032) desde history + entradas nuevas; state actualizado

## Rotation (evitar sesgo)
- last_known_focus: E031 catalog stub + deploy tip status
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
