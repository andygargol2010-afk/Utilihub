# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-11-05 | educacion | calculadora-letra-a-porcentaje | LetterToPercentageCalculatorTool
- 2026-11-05 | texto | calculadora-palabras-unicas | UniqueWordsCalculatorTool
- 2026-11-04 | matematicas | calculadora-area-rombo | RhombusAreaCalculatorTool
- 2026-11-04 | matematicas | calculadora-area-trapecio | TrapezoidAreaCalculatorTool
- 2026-11-04 | diseno | calculadora-escala-modular | ModularScaleCalculatorTool
- 2026-11-04 | matematicas | calculadora-area-paralelogramo | ParallelogramAreaCalculatorTool
- 2026-11-04 | fechas/tiempo | calculadora-meses-entre-fechas | MonthsBetweenDatesCalculatorTool
- 2026-11-04 | ciencia/física | ley-de-ohm | OhmsLawCalculatorTool
- 2026-11-04 | finanzas | calculadora-tasa-efectiva-anual | EffectiveAnnualRateCalculatorTool
- 2026-11-04 | salud | calculadora-peso-objetivo-imc | TargetWeightByBmiCalculatorTool
- 2026-11-04 | hogar/cocina | calculadora-escalado-receta | RecipeScalerCalculatorTool
- 2026-11-03 | conversiones | conversor-kcal-kj | KcalKjConverterTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones, calculadora-edad, calculadora-dias-entre-fechas, calculadora-horas-a-decimal, conversor-zonas-horarias, calculadora-diferencia-horas, calculadora-meses-entre-fechas)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal, calculadora-presion-atmosferica, calculadora-velocidad-distancia-tiempo, calculadora-densidad, calculadora-area-triangulo, calculadora-hipotenusa, conversor-celsius-kelvin, calculadora-caudal, calculadora-perimetro-rectangulo, calculadora-energia-cinetica, calculadora-area-superficie-cilindro, ley-de-ohm)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz, calculadora-area-rectangular, calculadora-costo-kwh, calculadora-volumen-tanque, calculadora-porciones-pizza, conversor-cucharadas-ml, conversor-onzas-ml, conversor-tazas-ml, calculadora-calorias-porcion, calculadora-dosis-cafe, calculadora-escalado-receta)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje, calculadora-presupuesto-diario-viaje, calculadora-costo-por-km, calculadora-costo-litro-combustible, calculadora-presupuesto-total-viaje, calculadora-distancia-haversine)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug, calculadora-longitud-promedio-palabra, conversor-texto-caso, calculadora-oraciones-por-parrafo, calculadora-tiempo-de-lectura, conversor-numeros-romanos, calculadora-palabras-por-oracion, calculadora-palabras-unicas)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado, calculadora-px-a-rem, calculadora-relacion-aspecto, calculadora-factor-de-escala, conversor-pt-a-px, calculadora-line-height, calculadora-escala-modular)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc, calculadora-ingesta-agua-diaria, calculadora-frecuencia-cardiaca-objetivo, calculadora-ciclo-sueno, calculadora-ratio-cintura-altura, calculadora-superficie-corporal, calculadora-ratio-cintura-cadera, calculadora-peso-objetivo-imc)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica, calculadora-gpa, calculadora-porcentaje-asistencia, calculadora-promedio-simple, calculadora-media-ponderada, calculadora-moda, calculadora-promedio-examenes, calculadora-porcentaje-a-letra, calculadora-letra-a-porcentaje)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento, calculadora-gasto-diario, calculadora-interes-diario, calculadora-propina, calculadora-iva, calculadora-presupuesto-mensual, calculadora-interes-simple, calculadora-descuento-sucesivo, calculadora-markup, calculadora-precio-por-unidad, calculadora-tasa-de-ahorro, calculadora-cuota-prestamo, calculadora-comision-de-venta, calculadora-horas-extra, calculadora-ahorro-para-meta, calculadora-depreciacion-lineal, calculadora-cagr, calculadora-tasa-efectiva-anual)
matematicas: recent (calculadora-porcentaje-del-total, calculadora-porcentaje-restante, calculadora-cambio-porcentual, calculadora-regla-de-tres, calculadora-porcentaje-de-numero, calculadora-media-cuadratica, calculadora-desviacion-absoluta-media, calculadora-media-armonica, calculadora-media-geometrica, calculadora-mediana, calculadora-rango-estadistico, calculadora-varianza, mcd-mcm, media-geometrica, calculadora-area-paralelogramo, calculadora-area-trapecio, calculadora-area-rombo)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit, conversor-pulgadas-cm, conversor-yardas-metros, conversor-kmh-ms, conversor-gramos-libras, conversor-acres-hectareas, conversor-pies2-m2, conversor-mpg-l100km, conversor-psi-bar, conversor-kcal-kj)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 1 tool/run (default); quality bar identical; 2 only if both small and fully verified same commit. En saturación: forzar 1 del least-represented (ver ops.md §Saturación).
Registry anti-wipe remains the highest-priority safety rule. registry.tsx is large (~52 KB); do not full-rewrite (>40 KB rule). Append to entries-a/b only.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-11-05: PRODUCT — calculadora-letra-a-porcentaje (educacion, saturation least-represented). New dedicated letter-grade to typical % converter (US scale with +/-). EN+ES UI with 2 examples, validation (known letters), related links (porcentaje-a-letra, nota-necesaria), FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-05: PRODUCT — calculadora-palabras-unicas (texto, saturation least-represented). New dedicated unique-words count + ratio. EN+ES UI with 2 examples, validation (non-empty), related links (lineas, longitud-promedio-palabra), FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-04: PRODUCT — calculadora-area-rombo (matematicas, saturation least-ish). New dedicated UI for rhombus area = (d1×d2)/2. EN+ES UI with 2 examples, validation (positive), related links (area-paralelogramo, area-trapecio). Anti-dupe OK (new slug). SEO locales: defer.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-letra-a-porcentaje
last_deploy: no (branch auto-deploy disabled)
last_sha: (pending this commit)
```

<!-- end:tools-builder-state.md -->
