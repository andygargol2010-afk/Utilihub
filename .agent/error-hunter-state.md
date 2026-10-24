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
- date: 2026-10-23
- mode: known smoke (E001–E013 green; E010/E011 full) + discovery (sampled GravityParticlesPlayground, ParticlePostcard, EchoWaveSignature, FireworkSignature — all full real components)
- deploy: READY on 6233347302a8017245371057076d0f3f44cefca5
- known_smoke: no PLACEHOLDER, no $(cat), home/index imports resolve, NBody full named export
- new_findings: none (playgrounds outside catalog set are complete implementations)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E013 TextParticlesPlayground (prior)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
