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
- mode: known smoke (E001–E018 green: no PLACEHOLDER/$(cat, registry/index full, home routes clean, playgrounds E010-E012 full canvas; recurring verified) + discovery (sampled new feat(cat) tools calculadora-logaritmo + calculadora-presion-atmosferica: dedicated *CalculatorTool.tsx exist and full, but not wired in registry pickComponent → fall to MathTool "Statistical tool not implemented")
- deploy: tip SHA a7b8cad190b27190ed3629f919437d02a80489c4 (docs) no new deploy yet; latest READY on 2bd60b04442e0415f20e25cf4c7418a275bde560; no ERROR
- known_smoke: green (no open/recurring failures; all last_seen recent)
- new_findings: E019 — dedicated UIs for logaritmo/presion-atmosferica not wired in registry (fixed this run)
- fixes: 1 (registry.tsx: added lazy + slug checks for the two tools)

## Rotation (evitar sesgo)
- last_known_focus: new catalog tools wiring + playgrounds full + home routes (this run)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
