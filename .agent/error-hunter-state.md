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
- mode: known smoke (E001–E018 green: no PLACEHOLDER/$(cat, registry/index full, home routes clean, playgrounds full, dedicated tools present; recurring E010-E012 verified full) + discovery (sampled new tools calculadora-ratio-trabajo-descanso + calculadora-agua-arroz: UI components full React, registry entries present, index imports ok; NeonLayerComposer full canvas+particles; home index.tsx clean; no PLACEHOLDER/$(cat/"not implemented" patterns)
- deploy: tip SHA eb9f57dad49f329d193e7c8ee84d9413102f9c15 no deploy yet (recent feat(cat)); latest READY on 19f0dcadb9651f8318b6264b9b56f1216b53ad1c; no ERROR on tip
- known_smoke: green (no open/recurring failures; all last_seen recent)
- new_findings: none (new tools properly wired with dedicated UIs; patterns clean)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: new catalog tools + NeonLayerComposer + home routes (this run)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
