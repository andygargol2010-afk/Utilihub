# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-28 | matematicas | calculadora-regla-de-tres | RuleOfThreeCalculatorTool
- 2026-10-28 | matematicas | calculadora-cambio-porcentual | PercentageChangeCalculatorTool
- 2026-10-28 | educacion | calculadora-promedio-simple | SimpleAverageCalculatorTool
- 2026-10-28 | ciencia | calculadora-hipotenusa | HypotenuseCalculatorTool
- 2026-10-28 | texto | calculadora-oraciones-por-parrafo | SentencesPerParagraphCalculatorTool
- 2026-10-28 | ciencia | calculadora-area-triangulo | TriangleAreaCalculatorTool
- 2026-10-27 | fechas | calculadora-horas-a-decimal | HoursToDecimalCalculatorTool
- 2026-10-27 | matematicas | calculadora-porcentaje-del-total | PercentageOfTotalCalculatorTool
- 2026-10-27 | finanzas | calculadora-presupuesto-mensual | MonthlyBudgetCalculatorTool
- 2026-10-27 | matematicas | calculadora-porcentaje-restante | PercentageRemainingCalculatorTool
- 2026-10-27 | viajes | calculadora-costo-litro-combustible | FuelLiterCostCalculatorTool
- 2026-10-26 | cocina | calculadora-porciones-pizza | PizzaPortionsCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones, calculadora-edad, calculadora-dias-entre-fechas, calculadora-horas-a-decimal)
ciencia/f\u00edsica: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal, calculadora-presion-atmosferica, calculadora-velocidad-distancia-tiempo, calculadora-densidad, calculadora-area-triangulo, calculadora-hipotenusa)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz, calculadora-area-rectangular, calculadora-costo-kwh, calculadora-volumen-tanque, calculadora-porciones-pizza)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje, calculadora-presupuesto-diario-viaje, calculadora-costo-por-km, calculadora-costo-litro-combustible)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug, calculadora-longitud-promedio-palabra, conversor-texto-caso, calculadora-oraciones-por-parrafo)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado, calculadora-px-a-rem, calculadora-relacion-aspecto)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit, conversor-pulgadas-cm, conversor-yardas-metros, conversor-kmh-ms)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc, calculadora-ingesta-agua-diaria, calculadora-frecuencia-cardiaca-objetivo)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica, calculadora-gpa, calculadora-porcentaje-asistencia, calculadora-promedio-simple)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento, calculadora-gasto-diario, calculadora-interes-diario, calculadora-propina, calculadora-iva, calculadora-presupuesto-mensual)
matematicas: recent (calculadora-porcentaje-del-total, calculadora-porcentaje-restante, calculadora-cambio-porcentual, calculadora-regla-de-tres)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 1 tool/run (default); quality bar identical; 2 only if both small and fully verified same commit.
Registry anti-wipe remains the highest-priority safety rule. registry.tsx is large (~52 KB); do not full-rewrite (>40 KB rule). Append to entries-a/b only.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (\u22654 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md \u00a7PRODUCT step 4.
2026-10-28: PRODUCT — calculadora-regla-de-tres (matematicas). One tool (default). Anti-dupe OK (new slug). Practical proportions. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-cambio-porcentual (matematicas). One tool (default). Anti-dupe OK (new slug). Practical percentage change. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-promedio-simple (educacion). One tool (default). Anti-dupe OK (new slug). Practical arithmetic mean from list. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-hipotenusa (ciencia). One tool (default). Anti-dupe OK (new slug; generic hypotenuse exists in math-extra but dedicated UI adds examples/validation/related). Practical Pythagoras hypotenuse. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-oraciones-por-parrafo (texto). One tool (default). Anti-dupe OK (no prior slug). Practical average sentences per paragraph for writing analysis. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-area-triangulo (ciencia). One tool (default). Anti-dupe OK (no prior slug). Practical triangle area from base/height. SEO locales: defer pt/fr/de.
2026-10-27: PRODUCT — calculadora-horas-a-decimal (fechas). One tool (default). Anti-dupe OK (new slug, demand for timesheets). Practical decimal hours. SEO locales: defer pt/fr.
2026-10-27: PRODUCT — calculadora-porcentaje-del-total (matematicas). One tool (default). Anti-dupe OK. Practical % of total. SEO locales: defer pt/fr.
2026-10-27: PRODUCT — calculadora-presupuesto-mensual (finanzas). One tool (default per ops). Anti-dupe OK. Practical remaining budget. SEO locales: defer pt/fr.
2026-10-27: PRODUCT — calculadora-porcentaje-restante (matematicas). One tool (default per ops). Anti-dupe OK. Practical remaining percentage. SEO locales: defer pt/fr.
2026-10-27: PRODUCT — calculadora-costo-litro-combustible (viajes). One tool. Anti-dupe OK (new slug). Practical total fuel cost. Dedicated UI created; pickComponent if pending (uses category fallback for now). SEO locales: defer pt.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-regla-de-tres
last_deploy: no (branch auto-deploy disabled)
last_sha: pending
```

<!-- end:tools-builder-state.md -->
