# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-24 | finanzas | calculadora-descuento | PercentageDiscountCalculatorTool
- 2026-10-24 | viajes | calculadora-consumo-viaje | TripFuelConsumptionCalculatorTool
- 2026-10-24 | matematicas | calculadora-porcentaje-de-numero | PercentageOfNumberCalculatorTool
- 2026-10-24 | conversiones | conversor-celsius-a-fahrenheit | CelsiusFahrenheitConverterTool
- 2026-10-23 | finanzas | calculadora-porcentaje-aumento | PercentageIncreaseCalculatorTool
- 2026-10-23 | educacion | calculadora-media-geometrica | GeometricMeanCalculatorTool
- 2026-10-23 | conversiones | conversor-metros-pies | MetersToFeetConverterTool
- 2026-10-23 | salud | calculadora-imc | BmiCalculatorTool
- 2026-10-23 | educacion | calculadora-moda | ModeCalculatorTool
- 2026-10-23 | salud | calculadora-horas-sueno | SleepHoursCalculatorTool
- 2026-10-23 | conversiones | conversor-bytes | BytesConverterTool
- 2026-10-23 | matematicas | calculadora-perimetro-triangulo | TrianglePerimeterCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas, horas-entre-fechas, dias-habiles)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica, volumen-cono, area-superficie-esfera, caudal)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad, consumo-gas)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo, calculadora-consumo-viaje)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras, contador-lineas, conversor-texto-slug)
diseno: recent (contraste-color, paleta-complementaria, dpi, calculadora-ratio-dorado)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones, millas-km, conversor-bytes, conversor-metros-pies, conversor-celsius-a-fahrenheit)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable, calorias-diarias, horas-sueno, calculadora-imc)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria, desviacion-estandar, moda, media-geometrica)
finanzas: recent (descuento-porcentaje, ahorro-mensual, roi, interes-compuesto, aumento-salarial, porcentaje-aumento, calculadora-descuento)
productividad: recent (tiempo-lectura, porcentaje-completado, horas-extras, velocidad-promedio-diaria, palabras-por-minuto)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono, factorial, teorema-pitagoras, regla-de-tres, pendiente, perimetro-cuadrado, perimetro-triangulo, calculadora-porcentaje-de-numero)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-24 PRODUCT: calculadora-descuento (finanzas) + calculadora-consumo-viaje (viajes). Two tools, distinct clusters. Registry entries added surgically. SEO locales: deferred.
Previous: calculadora-porcentaje-de-numero + conversor-celsius-a-fahrenheit.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-descuento, calculadora-consumo-viaje
last_deploy: pending check
last_sha: 456d05603aa1dbdbd6b84f033f1a662fad61d3a9
```

<!-- end:tools-builder-state.md -->
