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
- date: 2026-10-26
- mode: known smoke (E001 registry full no PLACEHOLDER, E005 homes start with import no $(cat, E031 critical files clean, E004/E002 kind routing ok) + discovery (code search PLACEHOLDER/$(cat/"Tool not available" = 0; sampled registry.tsx full dedicated wires, summary-es.ts full >10kB no PLACEHOLDER, index.tsx clean; live prod home OK, some new slugs 404 expected)
- deploy: tip SHA 6d589f6ee1de276776bdb9f50f360823da94b618 no deploy yet; latest READY dpl_9B6pwpGVysHhbEJm3isvg9yz5WZ2 on bdef37210307cecc0021239260f0e50edc7e2257; recent CANCELED on later SHAs; no recent ERROR on tip
- known_smoke: all fixed entries green on tip; E031 open as recurring risk but no active corruption
- new_findings: none — no new runtime/routing/registry/SEO/corrupt patterns in sampled paths
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E001/E005/E031 registry+homes+critical clean
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
