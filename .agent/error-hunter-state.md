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
- date: 2026-10-22
- mode: known smoke + discovery
- deploy: READY (SHA b4de6817e6348777283ee09168580ee5dbc41fe5, branch preview)
- known_smoke: E001-E006 code-ok (registry completo sin PLACEHOLDER, kind routing prioritario image/pdf/media → MediaTool; homes sin $(cat) e imports reales DeferredHomeReviews/HomeCatalogSlot; no patrones PLACEHOLDER/$(cat)/"Tool not available")
- new_findings: none (sampled registry, index/es.index, OuncesToGramsConverterTool, IdealWeightCalculatorTool, general components tree; patterns clean)
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E001 (registry verified)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
