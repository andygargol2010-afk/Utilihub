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
- mode: known smoke (E001–E018 green: no PLACEHOLDER/$(cat, registry/index full, home routes clean, dedicated tools present) + discovery (sampled cube-root tool, index.ts complete with new exports, home index.tsx clean, no "not implemented"/PLACEHOLDER patterns in src, build READY)
- deploy: tip SHA 300991788037f7ceefaca7db6e855cfdd72912af READY (post fix restore index + new tools); previous ERROR on 56471ba/3ac2676 fixed by tip
- known_smoke: green (no open/recurring failures; all last_seen recent)
- new_findings: none (patterns clean; new tools properly exported and structured)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: catalog index + home routes + new dedicated tools sample (this run)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
