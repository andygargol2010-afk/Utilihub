# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-11-04 | ciencia/física | ley-de-ohm | OhmsLawCalculatorTool
- 2026-11-04 | finanzas | calculadora-tasa-efectiva-anual | EffectiveAnnualRateCalculatorTool
- 2026-11-04 | salud | calculadora-peso-objetivo-imc | TargetWeightByBmiCalculatorTool
- 2026-11-04 | hogar/cocina | calculadora-escalado-receta | RecipeScalerCalculatorTool
- 2026-11-03 | conversiones | conversor-kcal-kj | KcalKjConverterTool
- 2026-11-03 | viajes | calculadora-distancia-haversine | GreatCircleDistanceCalculatorTool
- 2026-11-03 | finanzas | calculadora-cagr | CagrCalculatorTool
- 2026-11-03 | matematicas | media-geometrica | GeometricMeanCalculatorTool
- 2026-11-03 | texto | calculadora-palabras-por-oracion | WordsPerSentenceCalculatorTool
- 2026-11-03 | educacion | calculadora-porcentaje-a-letra | PercentageToLetterGradeCalculatorTool
- 2026-11-03 | diseno | calculadora-line-height | LineHeightCalculatorTool
- 2026-11-03 | matematicas | mcd-mcm | McdMcmCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones, calculadora-edad, calculadora-dias-entre-fechas, calculadora-horas-a-decimal, conversor-zonas-horarias, calculadora-diferencia-horas)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal, calculadora-presion-atmosferica, calculadora-velocidad-distancia-tiempo, calculadora-densidad, calculadora-area-triangulo, calculadora-hipotenusa, conversor-celsius-kelvin, calculadora-caudal, calculadora-perimetro-rectangulo, calculadora-energia-cinetica, calculadora-area-superficie-cilindro, ley-de-ohm)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz, calculadora-area-rectangular, calculadora-costo-kwh, calculadora-volumen-tanque, calculadora-porciones-pizza, conversor-cucharadas-ml, conversor-onzas-ml, conversor-tazas-ml, calculadora-calorias-porcion, calculadora-dosis-cafe, calculadora-escalado-receta)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje, calculadora-presupuesto-diario-viaje, calculadora-costo-por-km, calculadora-costo-litro-combustible, calculadora-presupuesto-total-viaje, calculadora-distancia-haversine)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug, calculadora-longitud-promedio-palabra, conversor-texto-caso, calculadora-oraciones-por-parrafo, calculadora-tiempo-de-lectura, conversor-numeros-romanos, calculadora-palabras-por-oracion)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado, calculadora-px-a-rem, calculadora-relacion-aspecto, calculadora-factor-de-escala, conversor-pt-a-px, calculadora-line-height)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc, calculadora-ingesta-agua-diaria, calculadora-frecuencia-cardiaca-objetivo, calculadora-ciclo-sueno, calculadora-ratio-cintura-altura, calculadora-superficie-corporal, calculadora-ratio-cintura-cadera, calculadora-peso-objetivo-imc)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica, calculadora-gpa, calculadora-porcentaje-asistencia, calculadora-promedio-simple, calculadora-media-ponderada, calculadora-moda, calculadora-promedio-examenes, calculadora-porcentaje-a-letra)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento, calculadora-gasto-diario, calculadora-interes-diario, calculadora-propina, calculadora-iva, calculadora-presupuesto-mensual, calculadora-interes-simple, calculadora-descuento-sucesivo, calculadora-markup, calculadora-precio-por-unidad, calculadora-tasa-de-ahorro, calculadora-cuota-prestamo, calculadora-comision-de-venta, calculadora-horas-extra, calculadora-ahorro-para-meta, calculadora-depreciacion-lineal, calculadora-cagr, calculadora-tasa-efectiva-anual)
matematicas: recent (calculadora-porcentaje-del-total, calculadora-porcentaje-restante, calculadora-cambio-porcentual, calculadora-regla-de-tres, calculadora-porcentaje-de-numero, calculadora-media-cuadratica, calculadora-desviacion-absoluta-media, calculadora-media-armonica, calculadora-media-geometrica, calculadora-mediana, calculadora-rango-estadistico, calculadora-varianza, mcd-mcm, media-geometrica)
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
2026-11-04: PRODUCT — ley-de-ohm (ciencia/física). Improved existing generic ScienceTool with dedicated UI (solve for V/I/R). EN+ES UI with 2 examples, validation (non-negative, positive divisors), related links (potencia-electrica, resistencias-serie), FAQ. Anti-dupe OK (existing slug, dedicated component). SEO locales: defer.
2026-11-04: PRODUCT — calculadora-tasa-efectiva-anual (finanzas). One tool (saturation least-represented). New dedicated EAR from nominal rate + compounding periods. EN+ES UI with 2 examples, validation (0-100%, 1-365), related links (compound/simple interest), FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-04: PRODUCT — calculadora-peso-objetivo-imc (salud). One tool (saturation least-represented). New dedicated target weight from height + desired BMI. EN+ES UI with 2 examples, validation (height 100-250, BMI 15-40), related links (imc, peso-ideal), FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-04: PRODUCT — calculadora-escalado-receta (hogar/cocina). One tool (saturation least-represented). New dedicated recipe scaler (factor or servings). EN+ES UI with 2 examples, validation (positive), related links, FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-03: PRODUCT — conversor-kcal-kj (conversiones). One tool (saturation least-represented). New dedicated kcal ↔ kJ converter (1 kcal = 4.184 kJ). EN+ES UI with 2 examples, validation (non-negative), related links, FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-03: PRODUCT — calculadora-distancia-haversine (viajes). One tool (saturation least-represented). New dedicated great-circle (Haversine) distance calculator between lat/lon. EN+ES UI with 2 examples, validation (ranges), related links (tiempo-viaje, velocidad-media), FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-03: PRODUCT — calculadora-cagr (finanzas). One tool (saturation least-represented). New dedicated CAGR calculator. EN+ES UI with 2 examples, validation (positive values), related links (compound/simple interest), FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-03: PRODUCT — media-geometrica (matematicas). One tool (saturation least-represented). Improved existing generic with dedicated UI. Anti-dupe OK (existing slug, dedicated component). Geometric mean calculator (positive numbers, exp(avg ln)). EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer.
2026-11-03: PRODUCT — mcd-mcm (matematicas). One tool (default, saturation least-represented). Improved existing generic with dedicated UI. Anti-dupe OK (existing slug, dedicated component). GCD/LCM calculator with Euclidean algorithm. EN+ES UI with 2 examples, validation, related links. SEO locales: defer pt/fr/de.
2026-11-03: PRODUCT — calculadora-line-height (diseno). One tool (saturation least-represented). New dedicated calculator for recommended line-height (body 1.5 / headings 1.2). EN+ES UI, 2 examples, validation, related links, FAQ. Anti-dupe OK (new slug). SEO locales: defer.
2026-11-03: PRODUCT — calculadora-porcentaje-a-letra (educacion). One tool (saturation least-represented in RECENT_TOOLS). New dedicated percentage-to-letter-grade calculator (standard US A–F scale). EN+ES UI, 2 examples (85%→B, 92%→A), validation (0–100), related links, FAQ. Anti-dupe OK (new slug, no prior equivalent). SEO locales: defer.
2026-11-03: PRODUCT — calculadora-palabras-por-oracion (texto). One tool (saturation, texto less recent in last batch). New dedicated words-per-sentence calculator for readability. EN+ES UI, 2 examples, validation (empty/no sentences), related links (word-counter, reading-time), FAQ. Anti-dupe OK (new slug). SEO locales: defer (none active).
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: ley-de-ohm
last_deploy: no (branch auto-deploy disabled)
last_sha: (to be filled after commit)
```

<!-- end:tools-builder-state.md -->
