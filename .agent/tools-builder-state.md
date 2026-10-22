# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-22 | salud | calculadora-peso-ideal | IdealWeightCalculatorTool
- 2026-10-22 | conversiones | conversor-onzas-gramos | OuncesToGramsConverterTool
- 2026-10-22 | finanzas | calculadora-ahorro-mensual | MonthlySavingsCalculatorTool
- 2026-10-22 | conversiones | conversor-kg-libras | KgToLbsConverterTool
- 2026-10-22 | matematicas | calculadora-regla-de-tres | RuleOfThreeCalculatorTool
- 2026-10-22 | productividad | calculadora-horas-extras | OvertimeCalculatorTool
- 2026-10-22 | texto | calculadora-frecuencia-letras | LetterFrequencyCalculatorTool
- 2026-10-22 | ciencia | calculadora-trabajo | WorkCalculatorTool
- 2026-10-22 | hogar | calculadora-consumo-electricidad | ElectricityConsumptionTool
- 2026-10-22 | diseno | generador-paleta-complementaria | ComplementaryPaletteTool
- 2026-10-21 | conversiones | conversor-rgb-hex | RgbHexConverterTool
- 2026-10-21 | salud | calculadora-tmb | TmbCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras)
productividad: recent (tiempo-lectura, porcentaje-completado, horas-extras)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono, factorial, teorema-pitagoras, regla-de-tres)
diseno: recent (contraste-color, paleta-complementaria)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-ideal)
educacion: recent (media-aritmetica, media-ponderada)
finanzas: recent (descuento-porcentaje, ahorro-mensual)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-22 PRODUCT (roll 12): shipped 2 (conversor-onzas-gramos conversiones + calculadora-peso-ideal salud). Distinct clusters. Anti-dupe OK. Registry surgical + dedicated ifs OK. Deploy pending. SEO locales: pt active, deferred.
2026-10-22 PRODUCT (roll 15): shipped 2 (calculadora-ahorro-mensual finanzas + conversor-kg-libras conversiones). Distinct clusters. Anti-dupe OK. Registry surgical OK. Deploy pending. SEO locales: pt active, deferred.
2026-10-22 PRODUCT (roll 20): shipped 2 (calculadora-regla-de-tres matematicas + calculadora-horas-extras productividad). Distinct clusters. Anti-dupe OK. Registry surgical OK. Deploy pending. SEO locales: pt active, deferred.
2026-10-22 PRODUCT (roll 11): shipped 2 (calculadora-frecuencia-letras texto + calculadora-trabajo ciencia). Distinct clusters. Anti-dupe OK. Registry surgical OK. Deploy READY (SHA 953d758). SEO locales: pt active, deferred. Previews protected; verification limited.
2026-10-22 PRODUCT (roll 14): shipped 2 (generador-paleta-complementaria diseno + calculadora-consumo-electricidad hogar). Distinct clusters. Anti-dupe OK. Registry surgical OK. Deploy READY (SHA 39e16184). SEO locales: pt active, deferred. Previews protected.
2026-10-22 META/NEW-CATEGORY gate note: roll 2 but "salud" already used in tool data (category field) though missing from GENERAL_CATEGORIES + ENGLISH_CATEGORY_SLUGS → not a clean NEW-CATEGORY; deferred formalization. No product tools this run.
2026-10-21 PRODUCT (roll 7): shipped 2 (calculadora-tmb salud + conversor-rgb-hex conversiones). Distinct clusters. Anti-dupe OK. Registry surgical OK. Deploy ERROR (unrelated ColorCascadeFusionGame export issue in build). SEO locales: pt active, deferred.
2026-10-21 PRODUCT (roll 8): shipped 2 (calculadora-media-ponderada educacion + calculadora-descuento-porcentaje finanzas). Distinct clusters. Anti-dupe OK. Registry surgical OK. SEO locales: pt active, deferred.
2026-10-21 PRODUCT (roll 15): shipped 2 (calculadora-teorema-pitagoras matematicas + conversor-velocidad conversiones). Distinct clusters. Anti-dupe OK. Registry surgical OK. SEO locales: pt active, deferred.
2026-10-21 PRODUCT (roll 12): shipped 2 (calculadora-factorial matematicas + calculadora-consumo-agua hogar). Distinct clusters. Anti-dupe OK. Registry surgical OK. SEO locales: pt active, deferred.
2026-10-21 PRODUCT (roll 13): shipped 2 (calculadora-presupuesto-viaje viajes + calculadora-porcentaje-completado productividad). Distinct clusters. Anti-dupe OK. Registry surgical OK. SEO locales: pt active, deferred.
2026-10-21 PRODUCT (roll 10): shipped 2 (calculadora-cambio-porcentaje finanzas + calculadora-energia-potencial ciencia). Distinct clusters. Anti-dupe OK. Registry surgical OK. SEO locales: pt active, deferred.
2026-10-21 PRODUCT (roll 10): shipped 2 (calculadora-dias-hasta-fecha fechas + contador-palabras-unicas texto). Distinct clusters. Anti-dupe OK. Registry surgical OK. SEO locales: pt active, deferred.
2026-10-21 FIX-BUILD: resolved duplicate slug calculadora-cambio-porcentaje by deleting leftover percentage-change-tool.ts. Deploy of fix SHA READY.
2026-10-21 FIX-BUILD: catalog validator failed on operation "tmb" (missing case in ConfiguredTool switch). Fixed by adding case"tmb" in switch. Deploy of SHA b5429cc READY. Previews protected; verification limited.
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: conversor-onzas-gramos, calculadora-peso-ideal
last_deploy: pending
last_sha: pending
```

<!-- end:tools-builder-state.md -->
