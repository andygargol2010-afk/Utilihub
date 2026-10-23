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
- date: 2026-10-23 (HEAD d3bc033 / then docs 05fa207)
- mode: known smoke (brief on E001-E010 green on prior READY) + discovery (Vercel ERROR deploys on recent SHAs for AuroraParticlePlayground missing export due to PLACEHOLDER literal)
- deploy: ERROR on ad172c33 (and prior a5cd989/cf8c827); fixed by restoring real component in d3bc033
- known_smoke: prior known green; new recurring-style PLACEHOLDER in playgrounds
- new_findings: E011 — AuroraParticlePlayground.tsx was PLACEHOLDER_FULL_CONTENT_FROM_LOCAL causing rollup missing export; restored full "use client" component from good history
- fixes: 1 (restore AuroraParticlePlayground.tsx SHA d3bc033)

## Rotation (evitar sesgo)
- last_known_focus: E010 NBody + new E011 Aurora playgrounds PLACEHOLDER pattern
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
