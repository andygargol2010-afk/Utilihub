# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-20 | hogar | calculadora-ratio-cafe | CoffeeRatioCalculatorTool
- 2026-10-20 | matematicas | calculadora-area-rombo | RhombusAreaCalculatorTool
- 2026-10-20 | viajes | calculadora-costo-combustible | FuelCostCalculatorTool
- 2026-10-20 | productividad | calculadora-tiempo-lectura | ReadingTimeCalculatorTool
- 2026-10-19 | matematicas | calculadora-area-triangulo | TriangleAreaCalculatorTool
- 2026-10-19 | finanzas | calculadora-interes-simple | SimpleInterestCalculatorTool
- 2026-10-19 | ciencia | calculadora-volumen-cubo | CubeVolumeCalculatorTool
- 2026-10-19 | texto | contador-silabas | SyllableCounterTool
- 2026-10-19 | matematicas | calculadora-area-paralelogramo | ParallelogramAreaCalculatorTool
- 2026-10-19 | ciencia | calculadora-volumen-prisma-rectangular | RectangularPrismVolumeCalculatorTool
- 2026-10-19 | ciencia | calculadora-volumen-piramide | PyramidVolumeCalculatorTool
- 2026-10-19 | matematicas | calculadora-area-trapecio | TrapezoidAreaCalculatorTool
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
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-19 PRODUCT (roll 15): shipped 2 (calculadora-area-triangulo matematicas + calculadora-interes-simple finanzas). Distinct clusters. Anti-dupe OK. Registry surgical OK.
2026-10-19 FIX-BUILD: deploy ERROR slug duplicado calculadora-pintura. Eliminé paint-calculator.ts, sole owner paint-calculator-tool.ts.
2026-10-20 PRODUCT: shipped 2 (calculadora-costo-combustible viajes + calculadora-tiempo-lectura productividad) but deploy ERROR due to duplicate slug files (fuel-cost-tool.ts + reading-time-tool.ts vs *-calculator-tool.ts).
2026-10-20 FIX-BUILD: deleted fuel-cost-tool.ts and reading-time-tool.ts (sole owners remain the calculator-tool files already in index.ts). Restored this state file from placeholder wipe.
2026-10-20 PRODUCT (roll 12): shipped 2 (calculadora-ratio-cafe hogar + calculadora-area-rombo matematicas). Distinct clusters. Anti-dupe OK. Registry surgical OK (after accidental placeholder restore).
2026-10-20 FIX-BUILD: deploy ERROR on SHA 9ea089e (PRODUCT commit wrote PLACEHOLDER to registry/index/components). Tip already has full restored registry + components + index. This docs commit triggers re-deploy of good tree. No new tools.
```

---

## OPTIONAL — last run snapshot

```
last_mode: FIX-BUILD
last_slugs: calculadora-ratio-cafe, calculadora-area-rombo (verification pending after re-deploy)
last_deploy: ERROR on bad PRODUCT SHA; tip restored; this commit to re-trigger READY
```

<!-- end:tools-builder-state.md -->
