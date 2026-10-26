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
- mode: known smoke (E001 registry full no PLACEHOLDER, E005 homes start with import no $(cat, E031/E034 critical files clean, E033 ModularPatternComposer full >10kB canvas) + discovery (code search PLACEHOLDER/$(cat/Tool not available = 0; sampled live www.utilihub.net home/tools/png-a-jpg/games/studio/es home; registry/i18n full)
- deploy: tip SHA 61dfd45c45fec287ab39e9081d5cb024ab32453a no deploy yet (docs only); latest READY dpl_9B6pwpGVysHhbEJm3isvg9yz5WZ2 on bdef37210307cecc0021239260f0e50edc7e2257; no recent ERROR on tip
- known_smoke: all fixed entries green on tip; E031 open as recurring risk but no active corruption
- new_findings: none — no new runtime/routing/registry/SEO/corrupt patterns in sampled paths (prod 404 on some new slugs expected if not promoted)
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E001/E005/E031 homes+registry+composer smoke
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
