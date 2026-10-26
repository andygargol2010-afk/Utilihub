# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-25 | productividad | calculadora-horas-para-meta | TimeToGoalCalculatorTool
- 2026-10-25 | hogar | calculadora-costo-kwh | KwhCostCalculatorTool
- 2026-10-25 | ciencia | calculadora-velocidad-distancia-tiempo | SpeedDistanceTimeCalculatorTool
- 2026-10-25 | matematicas | calculadora-diferencia-porcentual | PercentageDifferenceCalculatorTool
- 2026-10-25 | diseno | calculadora-px-a-rem | PxToRemCalculatorTool
- 2026-10-25 | viajes | calculadora-presupuesto-diario-viaje | DailyTravelBudgetCalculatorTool
- 2026-10-25 | educacion | calculadora-gpa | GpaCalculatorTool
- 2026-10-25 | hogar | calculadora-area-rectangular | RoomAreaCalculatorTool
- 2026-10-25 | fechas | calculadora-edad | AgeCalculatorTool
- 2026-10-25 | finanzas | calculadora-propina | TipCalculatorTool
- 2026-10-25 | salud | calculadora-ingesta-agua-diaria | DailyWaterIntakeCalculatorTool
- 2026-10-24 | texto | calculadora-longitud-promedio-palabra | AverageWordLengthCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones, calculadora-edad)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal, calculadora-presion-atmosferica, calculadora-velocidad-distancia-tiempo)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz, calculadora-area-rectangular)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje, calculadora-presupuesto-diario-viaje)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug, calculadora-longitud-promedio-palabra)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado, calculadora-px-a-rem)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit, conversor-pulgadas-cm, conversor-yardas-metros)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc, calculadora-ingesta-agua-diaria)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica, calculadora-gpa)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento, calculadora-gasto-diario, calculadora-interes-diario, calculadora-propina)
productividad: recent (tiempo-lectura, porcentaje-completado, horas-extras, velocidad-promedio-diaria, palabras-por-minuto, calculadora-horas-estudio, calculadora-ratio-trabajo-descanso)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono, factorial, teorema-pitagoras, regla-de-tres, pendiente, perimetro-cuadrado, perimetro-triangulo, calculadora-porcentaje-de-numero, calculadora-raiz-cuadrada, calculadora-raiz-cubica, calculadora-logaritmo, calculadora-diferencia-porcentual)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-24: PRODUCT — conversor-yardas-metros (conversiones) + calculadora-gasto-diario (finanzas). Clusters distintos, calidad alta. SEO locales: defer pt.
2026-10-24: PRODUCT — calculadora-logaritmo (matematicas) + calculadora-presion-atmosferica (ciencia). Clusters distintos, calidad alta. SEO locales: defer pt.
2026-10-24: PRODUCT — calculadora-longitud-promedio-palabra (texto) + calculadora-interes-diario (finanzas). Clusters distintos, calidad alta. SEO locales: defer pt.
2026-10-25: NEW-CATEGORY — salud + calculadora-ingesta-agua-diaria. Gates OK. Seed tool calidad alta. SEO locales: defer pt.
2026-10-25: PRODUCT — calculadora-edad (fechas) + calculadora-propina (finanzas). Clusters distintos, calidad alta. SEO locales: defer pt.
2026-10-25: PRODUCT — calculadora-gpa (educacion) + calculadora-area-rectangular (hogar). Clusters distintos, calidad alta. SEO locales: defer pt. (slug renombrado por dupe previo)
2026-10-25: FIX-BUILD — deploy ERROR on ModularPatternComposer (export not found on older SHA). Current HEAD has full export. No new tools this run.
2026-10-25: PRODUCT — calculadora-px-a-rem (diseno) + calculadora-presupuesto-diario-viaje (viajes). Clusters distintos, calidad alta. SEO locales: defer pt.
2026-10-25: PRODUCT — calculadora-diferencia-porcentual (matematicas) + calculadora-velocidad-distancia-tiempo (ciencia). Clusters distintos, calidad alta. SEO locales: defer pt.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-horas-para-meta, calculadora-costo-kwh
last_deploy: pending
last_sha: (pending push)
```

<!-- end:tools-builder-state.md -->
