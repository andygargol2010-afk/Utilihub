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
- mode: known smoke (E001–E018 green: registry kind-first + dedicated wired incl. raiz-cuadrada/media-armonica, home routes clean no $(cat, catalog index full, playgrounds full no stubs) + discovery (home EN/ES, registry.tsx, general/index.ts, sample playground ConstellationNameMap, no PLACEHOLDER/$(cat/"not implemented" in src)
- deploy: latest listed READY on fc0e5252 (post E018); tip SHA 9bcf555 (feat registry/index for new calcs) no deployment yet listed — no ERROR on branch
- known_smoke: green (no open failures; fixed entries last_seen recent)
- new_findings: none (sampled home, catalog index, dedicated wiring, playgrounds; patterns clean)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: home/routes + registry/catalog index + playgrounds sample (this run)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
