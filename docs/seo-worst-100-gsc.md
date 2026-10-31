# UtiliHub — 100 páginas peor posicionadas (GSC)

**Objetivo:** subir cada URL a **posición media < 50**.
**Snapshot:** 2026-10-31 (Search Console).

Priorizar por **impresiones** (no solo por posición peor).

## Cómo usar (Error Hunter — modo SEO)

Fuente oficial: este índice + las filas en:

- `docs/seo-worst-100-gsc-part1.md` (50 URLs)
- `docs/seo-worst-100-gsc-part2.md` (50 URLs)

1. Leer `seo_done` en `.agent/error-hunter-state.md`.
2. Unir todas las filas `| http` de part1 + part2.
3. Excluir paths ya en `seo_done`.
4. Ordenar por **impresiones DESC**, luego posición peor.
5. Una URL por corrida SEO; añadir el path a `seo_done`.

**Ya hechas (2026-10-31):** `/es/herramientas/imc`, `/tools/coordinate-converter`, `/es/herramientas/calculadora-punto-rocio`, `/tools/temperature-converter`, `/tools/pool-volume-calculator`, `/es/herramientas/consumo-viaje`.

**Siguiente por impresiones (aprox.):** `/es/finanzas/calculadora-wacc` (25), `/tools/overtime-pay-calculator` (25), `/tools/beaufort-wind-scale-converter` (22), …
