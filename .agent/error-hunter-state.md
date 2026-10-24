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
- mode: known smoke (E001–E015 green: registry kind-first, no PLACEHOLDER/$(cat), playgrounds full, home ok) + discovery (new guide routes caused Vercel ERROR on JSX unescaped > "N > 2"; already reworded to "greater than"/"mayor que" in tip 804dc17 / 65c1e4d etc.)
- deploy: ERROR on previous SHAs (1e0f87b and feat commits) due to E016; tip 804dc17 (fix) + this docs not yet deployed (list shows only prior ERROR/READY)
- known_smoke: green (all fixed/recurring passed checks; registry, index, playgrounds, home)
- new_findings: E016 — Build ERROR por > sin escapar en JSX de guía N-body (fixed already by rewording; added to catalog)
- fixes: 0 (code already fixed; only docs updated)

## Rotation (evitar sesgo)
- last_known_focus: studios/3d + new guides (this run, green + E016 catalogued); next rotate to text tools or games
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
