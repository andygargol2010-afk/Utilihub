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
- mode: known smoke (E001–E014 green: registry kind-first, home no $(cat), playgrounds full, no PLACEHOLDER) + discovery (runtime logs + playgrounds sample: ConstellationNameMap/FluidTypeSignature/ParticleSignature/SolarSystem real implementations; found duplicate slug via logs)
- deploy: READY (pre-fix on recent SHAs); post-push pending verify
- known_smoke: green (all fixed/recurring passed brief checks)
- new_findings: E015 — duplicate tool slug conversor-velocidad (CONVERTER_TOOLS in converters.ts + SPEED_CONVERTER_TOOLS in speed-converter-tool.ts). Runtime logs showed "duplicate tool slugs (keeping first occurrence)". Fixed by removing from converters.ts, keeping dedicated with SEO/faq.
- fixes: 1 (src/lib/general/converters.ts remove duplicate entry)

## Rotation (evitar sesgo)
- last_known_focus: E015 duplicate slug (this run, from runtime logs discovery); next rotate to games/studios or other categories
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
