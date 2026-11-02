# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-11-02 | matematicas | calculadora-varianza | VarianceCalculatorTool
- 2026-11-02 | fechas | conversor-zonas-horarias | TimezoneConverterTool
- 2026-11-01 | conversiones | conversor-mpg-l100km | MpgL100kmConverterTool
- 2026-11-01 | conversiones | conversor-pies2-m2 | SquareFeetMetersConverterTool
- 2026-11-01 | finanzas | calculadora-ahorro-para-meta | SavingsGoalCalculatorTool
- 2026-10-31 | hogar | calculadora-calorias-porcion | CaloriesPerServingCalculatorTool
- 2026-10-31 | finanzas | calculadora-horas-extra | OvertimeCalculatorTool
- 2026-10-31 | finanzas | calculadora-comision-de-venta | SalesCommissionCalculatorTool
- 2026-10-31 | salud | calculadora-ratio-cintura-altura | WaistToHeightRatioCalculatorTool
- 2026-10-31 | conversiones | conversor-acres-hectareas | AcresHectaresConverterTool
- 2026-10-31 | salud | calculadora-ciclo-sueno | SleepCycleCalculatorTool
- 2026-10-30 | educacion | calculadora-moda | ModeCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones, calculadora-edad, calculadora-dias-entre-fechas, calculadora-horas-a-decimal, conversor-zonas-horarias)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal, calculadora-presion-atmosferica, calculadora-velocidad-distancia-tiempo, calculadora-densidad, calculadora-area-triangulo, calculadora-hipotenusa, conversor-celsius-kelvin, calculadora-caudal, calculadora-perimetro-rectangulo)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz, calculadora-area-rectangular, calculadora-costo-kwh, calculadora-volumen-tanque, calculadora-porciones-pizza, conversor-cucharadas-ml, conversor-onzas-ml, conversor-tazas-ml, calculadora-calorias-porcion)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje, calculadora-presupuesto-diario-viaje, calculadora-costo-por-km, calculadora-costo-litro-combustible)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug, calculadora-longitud-promedio-palabra, conversor-texto-caso, calculadora-oraciones-por-parrafo, calculadora-tiempo-de-lectura)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado, calculadora-px-a-rem, calculadora-relacion-aspecto, calculadora-factor-de-escala)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc, calculadora-ingesta-agua-diaria, calculadora-frecuencia-cardiaca-objetivo, calculadora-ciclo-sueno, calculadora-ratio-cintura-altura)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica, calculadora-gpa, calculadora-porcentaje-asistencia, calculadora-promedio-simple, calculadora-media-ponderada, calculadora-moda)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento, calculadora-gasto-diario, calculadora-interes-diario, calculadora-propina, calculadora-iva, calculadora-presupuesto-mensual, calculadora-interes-simple, calculadora-descuento-sucesivo, calculadora-markup, calculadora-precio-por-unidad, calculadora-tasa-de-ahorro, calculadora-cuota-prestamo, calculadora-comision-de-venta, calculadora-horas-extra, calculadora-ahorro-para-meta)
matematicas: recent (calculadora-porcentaje-del-total, calculadora-porcentaje-restante, calculadora-cambio-porcentual, calculadora-regla-de-tres, calculadora-porcentaje-de-numero, calculadora-media-cuadratica, calculadora-desviacion-absoluta-media, calculadora-media-armonica, calculadora-media-geometrica, calculadora-mediana, calculadora-rango-estadistico, calculadora-varianza)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit, conversor-pulgadas-cm, conversor-yardas-metros, conversor-kmh-ms, conversor-gramos-libras, conversor-acres-hectareas, conversor-pies2-m2, conversor-mpg-l100km)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 1 tool/run (default); quality bar identical; 2 only if both small and fully verified same commit. En saturación: forzar 1 del least-represented (ver ops.md §Saturación).
Registry anti-wipe remains the highest-priority safety rule. registry.tsx is large (~52 KB); do not full-rewrite (>40 KB rule). Append to entries-a/b only.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-30: META — clarified in ops.md that .md files override bootstrap volume (default 1 tool). Roll 1=META. Saturation continues; many clusters recent. Prefer improve existing weak tools next.
2026-10-31: PRODUCT — calculadora-ciclo-sueno (salud). One tool (default). Anti-dupe OK (new slug). Practical sleep cycle calculator (90-min cycles + buffer) for bedtime/wake suggestions. High demand complement to existing health tools. SEO locales: defer pt/fr/de.
2026-10-31: PRODUCT — conversor-acres-hectareas (conversiones). One tool (default; .md overrides bootstrap 2). Anti-dupe OK (new slug). Practical land area converter acres ↔ ha. Under-represented cluster. EN+ES UI with 2 examples. SEO locales: defer pt/fr/de.
2026-10-31: PRODUCT — calculadora-ratio-cintura-altura (salud). One tool (default). Anti-dupe OK (new slug). Practical WHtR calculator (waist/height) for central obesity risk. Complements BMI. EN+ES UI with 2 examples, validation, FAQ. SEO locales: defer pt/fr/de.
2026-10-31: PRODUCT — calculadora-comision-de-venta (finanzas). One tool (default). Anti-dupe OK (dedicated vs generic comision-de-venta). Practical sales commission calculator. High demand for sales. EN+ES UI with 2 examples, validation, FAQ. SEO locales: defer pt/fr/de.
2026-10-31: PRODUCT — calculadora-horas-extra (finanzas). One tool (default). Anti-dupe OK (new slug, no prior overtime dedicated tool). Practical overtime pay calculator (regular + OT with multiplier). GSC demand evidence for overtime. EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer pt/fr/de.
2026-10-31: PRODUCT — calculadora-calorias-porcion (hogar). One tool (default). Anti-dupe OK (new slug). Practical calories-per-serving calculator for recipes and diet tracking. Complements daily calories and cooking tools. EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer pt/fr/de.
2026-11-01: PRODUCT — calculadora-ahorro-para-meta (finanzas). One tool (default; .md overrides bootstrap 2). Anti-dupe OK (new slug, no dedicated savings-goal tool). Practical monthly savings / months-to-goal calculator. High demand complement to savings-rate and compound-interest. EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer pt/fr/de.
2026-11-01: PRODUCT — conversor-pies2-m2 (conversiones). One tool (default). Anti-dupe OK (new slug). Practical ft² ↔ m² area converter for rooms/land/construction. Under-represented complement to acres-ha. EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer pt/fr/de.
2026-11-01: POLÍTICA SATURACIÓN ACTIVA. Cuando ≥8 clusters están “recent” en las últimas ~12: obligatorio 1 tool del cluster menos representado en RECENT_TOOLS (propósito nuevo). Improve solo si hay evidencia GSC clara de tool débil; si no, priorizar new. Prohibido cerrar en 0 tras un solo batch.
2026-11-01: Prefer improve se reduce a casos con evidencia GSC explícita. En saturación el default es new (least-represented).
2026-11-01: PRODUCT — conversor-mpg-l100km (conversiones). One tool (default). Anti-dupe OK (new slug). Practical MPG ↔ L/100km fuel efficiency converter for car trips. Complements existing fuel cost/consumption tools. EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer pt/fr/de.
2026-11-02: PRODUCT — conversor-zonas-horarias (fechas). One tool (default, saturation least-represented). Anti-dupe OK (new slug, no prior dedicated timezone converter). Practical IANA timezone converter with current time and common zones. EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer pt/fr/de.
2026-11-02: PRODUCT — calculadora-varianza (matematicas). One tool (default, saturation least-represented). Anti-dupe OK (new dedicated slug; generic entry in math.ts is thin). Practical sample/population variance + mean + SD. EN+ES UI with 2 examples, validation, related links, FAQ. SEO locales: defer pt/fr/de.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-varianza
last_deploy: no (branch auto-deploy disabled)
last_sha: (to be filled after push)
```

<!-- end:tools-builder-state.md -->
