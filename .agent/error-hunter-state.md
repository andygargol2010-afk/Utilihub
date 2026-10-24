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
- mode: known smoke (E001–E017 green: registry wired dedicateds, home index clean, playgrounds full no stub, catalog index full no PLACEHOLDER, no $(cat)) + discovery (sampled NeonLayerComposer full canvas, home route clean, general/index.ts full exports)
- deploy: previous SHAs (aa157b85, b939e90, 39b8d2e5) ERROR by duplicate slug calculadora-descuento; fixed in 71763fa (unique calculadora-descuento-porcentaje); tip f2f2fce pending verify
- known_smoke: green (no open/recurring failures; E010–E012 passed brief)
- new_findings: none (discovery path clean; no new PLACEHOLDER, broken imports, or unwired dedicateds in sample)
- fixes: 0 (checks OK this run)

## Rotation (evitar sesgo)
- last_known_focus: playgrounds/home/catalog integrity (this run green); next rotate to education/dev tools or games/studio sample
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
