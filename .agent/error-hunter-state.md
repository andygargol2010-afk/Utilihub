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
- date: 2026-10-23 (early, post HEAD 71817a05 / docs 9d141849)
- mode: known smoke (E001 registry, E005/E006 homes, E008 ElectricalPowerCalculatorTool, E009 compound-interest-tool empty) + discovery (N-Body Gravity Sim routes+component real, no PLACEHOLDER/$(cat) in src, Vercel deploys READY, runtime logs clean last 30m)
- deploy: latest READY (dpl_2C19rfz6w6FVHfqDTqFoQWXpb4jX on 33d13101); no ERROR
- known_smoke: all checked E### code-ok (registry kind-first + exports; homes start with imports no stubs; dedicated tools implement components; compound-interest-tool.ts empty array)
- new_findings: none (N-Body Gravity Simulator recently added looks solid: real canvas sim, EN/ES routes, no stubs)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E005 homes + E008 dedicated UI + E009 slug
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
