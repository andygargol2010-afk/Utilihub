# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-20 | salud | calculadora-frecuencia-cardiaca-maxima | MaxHeartRateCalculatorTool
- 2026-10-20 | matematicas | calculadora-area-elipse | EllipseAreaCalculatorTool
- 2026-10-20 | diseno | calculadora-contraste-color | ColorContrastCalculatorTool
- 2026-10-20 | conversiones | conversor-peso | WeightConverterTool
- 2026-10-20 | hogar | calculadora-ratio-cafe | CoffeeRatioCalculatorTool
- 2026-10-20 | matematicas | calculadora-area-rombo | RhombusAreaCalculatorTool
- 2026-10-20 | viajes | calculadora-costo-combustible | FuelCostCalculatorTool
- 2026-10-20 | productividad | calculadora-tiempo-lectura | ReadingTimeCalculatorTool
- 2026-10-19 | matematicas | calculadora-area-triangulo | TriangleAreaCalculatorTool
- 2026-10-19 | finanzas | calculadora-interes-simple | SimpleInterestCalculatorTool
- 2026-10-19 | ciencia | calculadora-volumen-cubo | CubeVolumeCalculatorTool
- 2026-10-19 | texto | contador-silabas | SyllableCounterTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo)
finanzas simples: recent (regla-72, propina-impuesto, margen-beneficio, interes-simple)
hogar/cocina: recent (ratio-cafe)
viajes: recent (tiempo-viaje, costo-combustible)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas)
productividad: recent (tiempo-lectura)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse)
diseno: recent (contraste-color)
conversiones: recent (peso)
salud: recent (frecuencia-cardiaca-maxima)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-20 PRODUCT (roll 17): shipped 2 (calculadora-frecuencia-cardiaca-maxima salud + calculadora-area-elipse matematicas). Distinct clusters. Anti-dupe OK. Registry surgical OK.
2026-10-20 FIX-BUILD: state.md was placeholder wipe ($(cat /tmp/...)); restored from 7b86c93 content. Recent deploys ERROR due to prior duplicate slug generador-lorem-ipsum (fixed in restores). Tip 9a74b5f restored full registry. No new tools this run.
```

---

## OPTIONAL — last run snapshot

```
last_mode: FIX-BUILD
last_slugs: none (registry/state restore)
last_deploy: ERROR on prior; awaiting clean tip
```

<!-- end:tools-builder-state.md -->
