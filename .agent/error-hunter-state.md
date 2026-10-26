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
- mode: known smoke (E001 registry full, E005 homes clean no $(cat, E031/E034 tip clean no PLACEHOLDER, E033 ModularPatternComposer full canvas) + discovery (searches for PLACEHOLDER/$(cat/Tool not available, sampled homes/registry/playground/i18n)
- deploy: tip SHA 5f413e1836ca12478e25dbf5b5bfadc682238236 READY (dpl_GHVPeKeCQjWgnB9TWmimivmvpPDF); older ERROR on unrelated chore commit
- known_smoke: all fixed entries green on tip; E031 open as recurring risk but no active corruption in critical files
- new_findings: none — no new runtime/routing/registry/SEO/corrupt patterns detected in sampled paths
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E031 PLACEHOLDER risk + homes/registry smoke
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
