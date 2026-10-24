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
- date: 2026-10-24
- mode: known smoke (E001–E018 green: no PLACEHOLDER/$(cat, registry/index full, home routes clean, playgrounds full, dedicated tools present) + discovery (sampled AuroraParticlePlayground full canvas, home index.tsx clean, bytes-converter tool present, no "not implemented"/PLACEHOLDER/$(cat patterns in src, tip deploy READY)
- deploy: tip SHA 9cc3644e3080cf7e2dac99e16e436dd3225eeb1d READY; previous ERROR on 386ac087 fixed by later commits
- known_smoke: green (no open/recurring failures; all last_seen recent)
- new_findings: none (patterns clean; playgrounds and catalog structured correctly)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: playgrounds (Aurora) + home routes + catalog index (this run)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
