# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-30 | finanzas | calculadora-cuota-prestamo | LoanMonthlyPaymentCalculatorTool
- 2026-10-29 | ciencia | calculadora-caudal | FlowRateCalculatorTool
- 2026-10-29 | conversiones | conversor-gramos-libras | GramsToPoundsConverterTool
- 2026-10-29 | ciencia | conversor-celsius-kelvin | CelsiusKelvinConverterTool
- 2026-10-29 | hogar | conversor-tazas-ml | CupsMlConverterTool
- 2026-10-29 | hogar | conversor-onzas-ml | FluidOuncesMlConverterTool
- 2026-10-29 | hogar | conversor-cucharadas-ml | TablespoonMlConverterTool
- 2026-10-29 | texto | calculadora-tiempo-de-lectura | ReadingTimeCalculatorTool
- 2026-10-29 | finanzas | calculadora-tasa-de-ahorro | SavingsRateCalculatorTool
- 2026-10-29 | finanzas | calculadora-precio-por-unidad | UnitPriceCalculatorTool
- 2026-10-28 | finanzas | calculadora-markup | MarkupCalculatorTool
- 2026-10-28 | matematicas | calculadora-porcentaje-de-numero | PercentageOfNumberCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles, calculadora-dias-vacaciones, calculadora-edad, calculadora-dias-entre-fechas, calculadora-horas-a-decimal)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal, calculadora-presion-atmosferica, calculadora-velocidad-distancia-tiempo, calculadora-densidad, calculadora-area-triangulo, calculadora-hipotenusa, conversor-celsius-kelvin, calculadora-caudal)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas, calculadora-agua-arroz, calculadora-area-rectangular, calculadora-costo-kwh, calculadora-volumen-tanque, calculadora-porciones-pizza, conversor-cucharadas-ml, conversor-onzas-ml, conversor-tazas-ml)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje, calculadora-presupuesto-diario-viaje, calculadora-costo-por-km, calculadora-costo-litro-combustible)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug, calculadora-longitud-promedio-palabra, conversor-texto-caso, calculadora-oraciones-por-parrafo, calculadora-tiempo-de-lectura)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado, calculadora-px-a-rem, calculadora-relacion-aspecto, calculadora-factor-de-escala)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit, conversor-pulgadas-cm, conversor-yardas-metros, conversor-kmh-ms, conversor-gramos-libras)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc, calculadora-ingesta-agua-diaria, calculadora-frecuencia-cardiaca-objetivo)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica, media-armonica, calculadora-gpa, calculadora-porcentaje-asistencia, calculadora-promedio-simple)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento, calculadora-gasto-diario, calculadora-interes-diario, calculadora-propina, calculadora-iva, calculadora-presupuesto-mensual, calculadora-interes-simple, calculadora-descuento-sucesivo, calculadora-markup, calculadora-precio-por-unidad, calculadora-tasa-de-ahorro, calculadora-cuota-prestamo)
matematicas: recent (calculadora-porcentaje-del-total, calculadora-porcentaje-restante, calculadora-cambio-porcentual, calculadora-regla-de-tres, calculadora-porcentaje-de-numero)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 1 tool/run (default); quality bar identical; 2 only if both small and fully verified same commit.
Registry anti-wipe remains the highest-priority safety rule. registry.tsx is large (~52 KB); do not full-rewrite (>40 KB rule). Append to entries-a/b only.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (\u22654 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md \u00a7PRODUCT step 4.
2026-10-30: PRODUCT — calculadora-cuota-prestamo (finanzas). One tool (default). Anti-dupe OK (new slug; dangling loan-payment in entries-b left as-is to avoid rewrite). Practical monthly fixed loan payment. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — calculadora-caudal (ciencia). One tool (default). Anti-dupe OK (new slug). Practical volume/time flow rate Q=V/t. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — conversor-gramos-libras (conversiones). One tool (default). Anti-dupe OK (new slug). Practical weight g ↔ lb. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — conversor-celsius-kelvin (ciencia). One tool (default). Anti-dupe OK (new slug). Practical scientific °C ↔ K. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — conversor-tazas-ml (hogar). One tool (default). Anti-dupe OK (new slug). Practical cooking cups ↔ ml. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — conversor-onzas-ml (hogar). One tool (default). Anti-dupe OK (new slug). Practical cooking/drinks fl oz ↔ ml. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — conversor-cucharadas-ml (hogar). One tool (default). Anti-dupe OK (new slug). Practical cooking tbsp/tsp ↔ ml. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — calculadora-tiempo-de-lectura (texto). One tool (default). Anti-dupe OK (new dedicated slug; innovator contador-tiempo-lectura exists but different). Practical reading time from words/wpm. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — calculadora-tasa-de-ahorro (finanzas/utilidades). One tool (default). Anti-dupe OK (new slug). Practical savings rate from income/expenses. SEO locales: defer pt/fr/de.
2026-10-29: PRODUCT — calculadora-precio-por-unidad (finanzas/utilidades). One tool (default). Anti-dupe OK (new slug). Practical unit price for comparisons. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-markup (finanzas). One tool (default). Anti-dupe OK (new slug). Practical markup for pricing. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-porcentaje-de-numero (matematicas). One tool (default). Anti-dupe OK (component + catalog data existed; completed catalog/UI/ES/related). Practical X% of Y. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-imc (salud). One tool (default). Anti-dupe OK (component + registry entry existed; completed catalog/UI/ES). Practical BMI. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-descuento-sucesivo (finanzas). One tool (default). Anti-dupe OK (new slug). Practical successive discounts. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-factor-de-escala (diseno). One tool (default). Anti-dupe OK (new slug). Practical scale factor for design/models. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-interes-simple (finanzas). One tool (default). Anti-dupe OK (new slug). Practical simple interest for loans/savings. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-regla-de-tres (matematicas). One tool (default). Anti-dupe OK (new slug). Practical proportions. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-cambio-porcentual (matematicas). One tool (default). Anti-dupe OK (new slug). Practical percentage change. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-promedio-simple (educacion). One tool (default). Anti-dupe OK (new slug). Practical arithmetic mean from list. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-hipotenusa (ciencia). One tool (default). Anti-dupe OK (new slug; generic hypotenuse exists in math-extra but dedicated UI adds examples/validation/related). Practical Pythagoras hypotenuse. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-oraciones-por-parrafo (texto). One tool (default). Anti-dupe OK (no prior slug). Practical average sentences per paragraph for writing analysis. SEO locales: defer pt/fr/de.
2026-10-28: PRODUCT — calculadora-area-triangulo (ciencia). One tool (default). Anti-dupe OK (no prior slug). Practical triangle area from base/height. SEO locales: defer pt/fr/de.
2026-10-27: PRODUCT — calculadora-horas-a-decimal (fechas). One tool (default). Anti-dupe OK (new slug, demand for timesheets). Practical decimal hours. SEO locales: defer pt/fr.
2026-10-29: META — saturation check. Many simple geometry (trapecio, rombo, elipse, hexagon) and converters already have dedicated components. No new high-quality candidate in under-represented clusters without dupe risk this run. Prefer improve existing weak ones in next runs.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-cuota-prestamo
last_deploy: no (branch auto-deploy disabled)
last_sha: e067176dfefa5910c54bce1a7900b0b22258fbb8
```

<!-- end:tools-builder-state.md -->
