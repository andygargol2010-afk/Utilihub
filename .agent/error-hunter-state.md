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
- mode: known smoke (E001–E022 green: no PLACEHOLDER, registry/index full, home routes clean, playgrounds E010–E012 full canvas, UNIT_PRICE wired) + discovery (sampled recent home DailyExperienceSpotlight + playground routes)
- deploy: tip SHA 4d6d12d5 READY; this run fix f13537f5… (path correction); post-push deploy pending verification
- known_smoke: green (no open/recurring failures; E010–E012 still full implementations)
- new_findings: E023 — DailyExperienceSpotlight N-Body path pointed to non-existent /n-body-gravity-sim (fixed this run)
- fixes: 1 (DailyExperienceSpotlight.tsx: correct pathEn/pathEs for n-body entry)

## Rotation (evitar sesgo)
- last_known_focus: playgrounds smoke (E010–E012) + recent home spotlight component
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
