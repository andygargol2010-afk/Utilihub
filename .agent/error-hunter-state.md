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
- date: 2026-10-26 (run 10)
- mode: known smoke (E031 tip clean: no PLACEHOLDER/$(cat in registry.tsx, homes, summary-es.ts, catalog; homes start with import + DeferredHomeReviews; modeler files present but not in general registry path checked) + discovery (sampled recent tools PercentageErrorCalculatorTool / AspectRatioCalculatorTool wired and logic ok; games/simulators registries structured; no "Tool not available"/PLACEHOLDER/$(cat patterns in src; validate:catalog and validate:registry PASS)
- deploy: auto-deploy disabled for branch in vercel.json; no ERROR logs accessible; tip SHA 2bbab280 pending status
- known_smoke: E031 open(recurring) but tip clean; other fixed entries not re-failed on sampled checks
- new_findings: none
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E031 clean check + recent catalog tools (percentage-error, aspect-ratio) + games/simulators sample
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
