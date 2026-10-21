# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-21 | ciencia | calculadora-energia-potencial | PotentialEnergyCalculatorTool
- 2026-10-21 | finanzas | calculadora-cambio-porcentaje | PercentageChangeCalculatorTool
- 2026-10-20 | educacion | calculadora-media-aritmetica | ArithmeticMeanCalculatorTool
- 2026-10-20 | matematicas | calculadora-area-hexagono | HexagonAreaCalculatorTool
- 2026-10-20 | salud | calculadora-frecuencia-cardiaca-maxima | MaxHeartRateCalculatorTool
- 2026-10-20 | matematicas | calculadora-area-elipse | EllipseAreaCalculatorTool
- 2026-10-20 | diseno | calculadora-contraste-color | ColorContrastCalculatorTool
- 2026-10-20 | conversiones | conversor-peso | WeightConverterTool
- 2026-10-20 | hogar | calculadora-ratio-cafe | CoffeeRatioCalculatorTool
- 2026-10-20 | matematicas | calculadora-area-rombo | RhombusAreaCalculatorTool
- 2026-10-20 | viajes | calculadora-costo-combustible | FuelCostCalculatorTool
- 2026-10-20 | productividad | calculadora-tiempo-lectura | ReadingTimeCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial)
finanzas simples: recent (regla-72, propina-impuesto, margen-beneficio, interes-simple, cambio-porcentaje)
hogar/cocina: recent (ratio-cafe)
viajes: recent (tiempo-viaje, costo-combustible)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas)
productividad: recent (tiempo-lectura)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono)
diseno: recent (contraste-color)
conversiones: recent (peso)
salud: recent (frecuencia-cardiaca-maxima)
educacion: recent (media-aritmetica)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-21 PRODUCT (roll 10): shipped 2 (calculadora-cambio-porcentaje finanzas + calculadora-energia-potencial ciencia). Distinct clusters. Anti-dupe OK. Registry surgical OK. SEO locales: pt active, deferred.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-cambio-porcentaje, calculadora-energia-potencial
last_deploy: pending verify
```

<!-- end:tools-builder-state.md -->
