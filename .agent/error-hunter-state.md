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
- mode: deploy ERROR logs (tip c373982a ERROR) + known smoke (registry still has all dedicated wires including E025, no PLACEHOLDER) + discovery via build failure
- deploy: tip before fix c373982aee45608bca5627742a2ca37a4b613b14 ERROR (JSX syntax); fix commit 7ea952667596898929cefba2990ec9c4f02681ea
- known_smoke: green for E001–E025 (no open/recurring; previous READY deploys confirmed dedicateds wired)
- new_findings: E026 — ToolSearch.tsx facets.map Button closing tag truncated `</Button` → build ERROR
- fixes: 1 (ToolSearch.tsx restore `</Button>`)

## Rotation (evitar sesgo)
- last_known_focus: deploy ERROR priority (E026 JSX truncation)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
