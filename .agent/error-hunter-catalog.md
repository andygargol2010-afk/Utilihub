# Error Hunter — catálogo de errores conocidos

Fuente de verdad para `utilihub-error-hunter` (task `4c84ee49-e001-4531-a0e2-f6261b3ada91`).
No borrar entradas: marcar `status` y añadir `last_seen` / `fixed_at`.

Formato por entrada:
- **id**: E### estable
- **status**: open | fixed | recurring
- **symptom**: qué ve el usuario
- **root_cause**: causa técnica breve
- **check**: cómo verificar en código o URL (sin inventar)
- **fix_hint**: dónde tocar primero
- **files**: paths críticos

<!-- end:header -->

## Entradas (divididas 2026-10-28)
Las entradas E### viven en `.agent/error-hunter-catalog/` (archivos de ~10 entradas cada uno):
- `.agent/error-hunter-catalog/E001-E010.md`
- `.agent/error-hunter-catalog/E011-E020.md`
- `.agent/error-hunter-catalog/E021-E030.md`
- `.agent/error-hunter-catalog/E031-E040.md`
- `.agent/error-hunter-catalog/E041-E050.md`

Add new entries in the smallest file of `.agent/error-hunter-catalog/`; never rewrite files wholesale. Si el más chico supera ~100 líneas, crear `E###-E###.md` nuevo y listarlo arriba.
