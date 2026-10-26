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
- date: 2026-10-26 (run 8)
- mode: known smoke (E031 tip clean: no PLACEHOLDER/$(cat; homes clean; summary-es real; registry has dedicated wires) + discovery (recent tools from tools-builder-state: asistencia, costo-por-km, texto-caso, FC-objetivo had dedicated components but wires missing in pickComponent → regression of E036/E037)
- deploy: tip READY (no ERROR on recent); post-push of fix SHA ad146b6d pending verify
- known_smoke: E036/E037 regressed (wires lost) → re-fixed; others green; E031 open as recurring risk but tip clean
- new_findings: none beyond the regressions (pattern known)
- fixes: 1 (registry.tsx re-wire 4 dedicated UIs + catalog/state updates)

## Rotation (evitar sesgo)
- last_known_focus: E036/E037 registry wires + E031 clean check
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
