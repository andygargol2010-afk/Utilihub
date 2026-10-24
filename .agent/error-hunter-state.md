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
- mode: known smoke (E001–E016 green: registry kind-first no PLACEHOLDER, playgrounds NBody/Aurora/Neon full exports+canvas, home index clean, no $(cat)) + discovery (text tools: TextTool/LineCounter/WordsPerMinute/syllable-counter; cocina numeric ops; EchoWaveSignature full; TextParticles full; no stubs/PLACEHOLDER/kind issues)
- deploy: tip READY (1da7b751 on utilihub-qssnulsjn-... and git-fix-spanish-complete alias); prior ERRORs were old E016 JSX and playground stubs
- known_smoke: green (recurring E010–E012 passed full checks; fixed smokes brief green)
- new_findings: none (sampled text + studio/playground routes outside catalog focus; all real components)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: text tools + EchoWave/TextParticles (this run, green); next rotate to games or lifestyle/cocina dedicated
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
