# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-26 | diseno | calculadora-relacion-aspecto | AspectRatioCalculatorTool
- 2026-10-26 | fechas | calculadora-dias-entre-fechas | DaysBetweenDatesCalculatorTool
- 2026-10-26 | ciencia | calculadora-densidad | DensityCalculatorTool
- 2026-10-26 | matematicas | calculadora-error-porcentual | PercentageErrorCalculatorTool
- 2026-10-26 | educacion | calculadora-porcentaje-asistencia | AttendancePercentageCalculatorTool
- 2026-10-26 | viajes | calculadora-costo-por-km | CostPerKmCalculatorTool
- 2026-10-26 | texto | conversor-texto-caso | TextCaseConverterTool
- 2026-10-26 | salud | calculadora-frecuencia-cardiaca-objetivo | TargetHeartRateCalculatorTool
- 2026-10-26 | finanzas | calculadora-iva | IvaCalculatorTool
- 2026-10-26 | conversiones | conversor-kmh-ms | KmhToMsConverterTool
- 2026-10-25 | productividad | calculadora-horas-para-meta | TimeToGoalCalculatorTool
- 2026-10-25 | hogar | calculadora-costo-kwh | KwhCostCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones, calculadora-edad, calculadora-dias-entre-fechas)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal, calculadora-presion-atmosferica, calculadora-velocidad-distancia-tiempo, calculadora-densidad)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz, calculadora-area-rectangular, calculadora-costo-kwh)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje, calculadora-presupuesto-diario-viaje, calculadora-costo-por-km)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug, calculadora-longitud-promedio-palabra, conversor-texto-caso)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado, calculadora-px-a-rem, calculadora-relacion-aspecto)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit, conversor-pulgadas-cm, conversor-yardas-metros, conversor-kmh-ms)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc, calculadora-ingesta-agua-diaria, calculadora-frecuencia-cardiaca-objetivo)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica, calculadora-gpa, calculadora-porcentaje-asistencia)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento, calculadora-gasto-diario, calculadora-interes-diario, calculadora-propina, calculadora-iva)
productividad: recent (tiempo-lectura, porcentaje-completado, horas-extras, velocidad-promedio-diaria, palabras-por-minuto, calculadora-horas-estudio, calculadora-ratio-trabajo-descanso, calculadora-horas-para-meta)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono, factorial, teorema-pitagoras, regla-de-tres, pendiente, perimetro-cuadrado, perimetro-triangulo, calculadora-porcentaje-de-numero, calculadora-raiz-cuadrada, calculadora-raiz-cubica, calculadora-logaritmo, calculadora-diferencia-porcentual, calculadora-error-porcentual)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-26: PRODUCT — calculadora-relacion-aspecto (diseno) + calculadora-dias-entre-fechas (fechas). Clusters distintos, calidad alta. SEO locales: defer pt. Multiple commits due to sequential wiring after initial components push.
2026-10-26: PRODUCT — conversor-texto-caso (texto) + calculadora-frecuencia-cardiaca-objetivo (salud). Clusters distintos, calidad alta. SEO locales: defer pt. Multiple commits due to sequential push; registry dedicated ifs pending category fallback for now.
2026-10-26: FIX-BUILD — deploy ERROR on ignoreCommand >256 chars (dpl_Cqrs6rgtk...). Already fixed on branch (ba0769f short command). No new tools this run. Next PRODUCT after READY.
2026-10-26: PRODUCT — calculadora-porcentaje-asistencia (educacion) + calculadora-costo-por-km (viajes). Clusters distintos. SEO locales: none active.
2026-10-26: PRODUCT — calculadora-densidad (ciencia) + calculadora-error-porcentual (matematicas). Clusters distintos, calidad alta. SEO locales: defer pt.
2026-10-26: FIX-BUILD — deploy ERROR dpl_2kykMQp8... on SHA 03a896db due to duplicate slug calculadora-relacion-aspecto in two files. Fixed on HEAD (duplicate file removed, wired to aspect-ratio-tool.ts). No new tools. Next PRODUCT after READY.
2026-10-26: FIX-BUILD — confirmed duplicate gone on HEAD 55f59a06; forced redeploy dpl_DCUETUZ6... (QUEUED). No new tools while ERROR/QUEUED. Next PRODUCT after READY.
```

---

## OPTIONAL — last run snapshot

```
last_mode: FIX-BUILD
last_slugs: (none — fix only)
last_deploy: forced redeploy of HEAD after ERROR; QUEUED at start of run
last_sha: 55f59a061f915d276ba1084c80df619f0a7f5d51
```

<!-- end:tools-builder-state.md -->
