# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-24 | productividad | calculadora-ratio-trabajo-descanso | WorkBreakRatioCalculatorTool
- 2026-10-24 | cocina | calculadora-agua-arroz | RiceWaterCalculatorTool
- 2026-10-24 | conversiones | conversor-pulgadas-cm | InchesToCmConverterTool
- 2026-10-24 | matematicas | calculadora-raiz-cubica | CubeRootCalculatorTool
- 2026-10-24 | matematicas | calculadora-raiz-cuadrada | SquareRootCalculatorTool
- 2026-10-24 | educacion | calculadora-media-armonica | HarmonicMeanCalculatorTool
- 2026-10-24 | productividad | calculadora-horas-estudio | StudyHoursCalculatorTool
- 2026-10-24 | fechas | calculadora-dias-vacaciones | VacationDaysCalculatorTool
- 2026-10-24 | finanzas | calculadora-descuento | PercentageDiscountCalculatorTool
- 2026-10-24 | viajes | calculadora-consumo-viaje | TripFuelConsumptionCalculatorTool
- 2026-10-24 | matematicas | calculadora-porcentaje-de-numero | PercentageOfNumberCalculatorTool
- 2026-10-24 | conversiones | conversor-celsius-a-fahrenheit | CelsiusFahrenheitConverterTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit, conversor-pulgadas-cm)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento)
productividad: recent (tiempo-lectura, porcentaje-completado, horas-extras, velocidad-promedio-diaria, palabras-por-minuto, calculadora-horas-estudio, calculadora-ratio-trabajo-descanso)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono, factorial, teorema-pitagoras, regla-de-tres, pendiente, perimetro-cuadrado, perimetro-triangulo, calculadora-porcentaje-de-numero, calculadora-raiz-cuadrada, calculadora-raiz-cubica)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-24: PRODUCT — calculadora-ratio-trabajo-descanso (productividad) + calculadora-agua-arroz (cocina). Clusters distintos, calidad alta. SEO locales: defer pt (active but not tool-critical this run).
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT (roll ~7)
last_slugs: calculadora-ratio-trabajo-descanso, calculadora-agua-arroz
last_deploy: pending
last_sha: pending
```

<!-- end:tools-builder-state.md -->
