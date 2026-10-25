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
- mode: known smoke (E001 regression detected) + discovery (registry stub, agent docs stub)
- deploy: recent SHAs READY; tip may need new deploy after fix
- known_smoke: E001 OPEN (registry.tsx = "$(cat /tmp/utilihub/registry.tsx)"); E005 home clean; others green
- new_findings: E031 — agent files and registry corrupted by $(cat stubs (same pattern as E005)
- fixes: restored registry.tsx from good SHA 10fa5476 + added wires for E027-E030; restored catalog+state

## Rotation (evitar sesgo)
- last_known_focus: registry E001 regression + agent docs
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
