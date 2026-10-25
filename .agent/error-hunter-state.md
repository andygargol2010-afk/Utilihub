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
- mode: known smoke (E001–E019 green: no PLACEHOLDER/$(cat, registry/index full with previous wires, home routes clean start-with-import, playgrounds E010-E011 full canvas+loop; E012 prior restore verified) + discovery (sampled latest feat(cat) tools calculadora-longitud-promedio-palabra + calculadora-interes-diario: dedicated *CalculatorTool.tsx exist and full with useState/useMemo, imported in index.ts, but not wired in registry pickComponent → fall to Math/TextTool generic)
- deploy: tip SHA 102221abcc34957807a59126fcb005a3daa6733e READY (feat(cat) add the two tools); no ERROR
- known_smoke: green (no open/recurring failures; all last_seen updated)
- new_findings: E020 — dedicated UIs for longitud-promedio-palabra + interes-diario not wired in registry (fixed this run)
- fixes: 1 (registry.tsx: added lazy + slug checks for the two tools)

## Rotation (evitar sesgo)
- last_known_focus: latest catalog tools wiring + playgrounds full + home routes (this run)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
