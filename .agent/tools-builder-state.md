# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-23 | conversiones | conversor-millas-km | MilesToKmConverterTool
- 2026-10-23 | matematicas | calculadora-perimetro-cuadrado | SquarePerimeterCalculatorTool
- 2026-10-23 | ciencia | calculadora-area-superficie-esfera | SphereSurfaceAreaCalculatorTool
- 2026-10-23 | productividad | calculadora-palabras-por-minuto | WordsPerMinuteCalculatorTool
- 2026-10-23 | fechas | calculadora-horas-entre-fechas | HoursBetweenDatesCalculatorTool
- 2026-10-23 | educacion | calculadora-desviacion-estandar | StandardDeviationCalculatorTool
- 2026-10-23 | ciencia | calculadora-volumen-cono | ConeVolumeCalculatorTool
- 2026-10-22 | salud | calculadora-calorias-diarias | DailyCaloriesCalculatorTool
- 2026-10-22 | finanzas | calculadora-interes-compuesto | CompoundInterestCalculatorTool
- 2026-10-22 | matematicas | calculadora-pendiente | SlopeCalculatorTool
- 2026-10-22 | texto | contador-lineas | LineCounterTool
- 2026-10-22 | finanzas | calculadora-roi | RoiCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas)
productividad: recent (tiempo-lectura, porcentaje-completado, horas-extras, velocidad-promedio-diaria, palabras-por-minuto)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono, factorial, teorema-pitagoras, regla-de-tres, pendiente, perimetro-cuadrado)
diseno: recent (contraste-color, paleta-complementaria, dpi)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-23 PRODUCT: calculadora-perimetro-cuadrado (matematicas) + conversor-millas-km (conversiones). Two tools, distinct clusters. Registry entries added surgically to A. SEO locales: pt active but deferred (not cheap for full translation this run).
Previous: calculadora-area-superficie-esfera (1 tool escape).
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-perimetro-cuadrado, conversor-millas-km
last_deploy: pending check after this commit
last_sha: pending
```

<!-- end:tools-builder-state.md -->
