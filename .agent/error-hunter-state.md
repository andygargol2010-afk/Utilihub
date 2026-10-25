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
- mode: known smoke (E001–E023 green: registry full no PLACEHOLDER, index complete, home routes clean no $(cat), playgrounds E010–E012 full canvas implementations) + discovery (sampled playgrounds SolarSystemScaleExplorer/ParticleSignaturePlayground/NBodyGravitySim full, games index routes clean)
- deploy: tip SHA 32850d769ae06892b59af7fc13c907b378d701f0 (house-modeler commit); previous READY; no ERROR
- known_smoke: green (no open/recurring failures; dedicated UIs wired, no stubs)
- new_findings: none (discovery sampled small playgrounds and games catalog — real implementations, no PLACEHOLDER/return null/broken imports)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: playgrounds (E010–E012 + SolarSystem/ParticleSignature) + games routes
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
