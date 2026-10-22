# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-22 | ciencia | calculadora-potencia-electrica | ElectricalPowerCalculatorTool
- 2026-10-22 | viajes | calculadora-tiempo-vuelo | FlightTimeCalculatorTool
- 2026-10-22 | conversiones | conversor-litros-galones | LitersToGallonsConverterTool
- 2026-10-22 | productividad | calculadora-velocidad-promedio-diaria | DailyAverageSpeedCalculatorTool
- 2026-10-22 | educacion | calculadora-nota-necesaria | GradeNeededCalculatorTool
- 2026-10-22 | fechas | calculadora-semanas-entre-fechas | WeeksBetweenDatesCalculatorTool
- 2026-10-22 | salud | calculadora-peso-saludable | IdealWeightCalculatorTool
- 2026-10-22 | conversiones | conversor-onzas-gramos | OuncesToGramsConverterTool
- 2026-10-22 | finanzas | calculadora-ahorro-mensual | MonthlySavingsCalculatorTool
- 2026-10-22 | conversiones | conversor-kg-libras | KgToLbsConverterTool
- 2026-10-22 | matematicas | calculadora-regla-de-tres | RuleOfThreeCalculatorTool
- 2026-10-22 | productividad | calculadora-horas-extras | OvertimeCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent (dias-hasta-fecha, semanas-entre-fechas)
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide, volumen-prisma-rectangular, volumen-cubo, energia-potencial, trabajo, potencia-electrica)
hogar/cocina: recent (ratio-cafe, consumo-agua, consumo-electricidad)
viajes: recent (tiempo-viaje, costo-combustible, presupuesto-viaje, tiempo-vuelo)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes, silabas, palabras-unicas, frecuencia-letras)
productividad: recent (tiempo-lectura, porcentaje-completado, horas-extras, velocidad-promedio-diaria)
matematicas: recent (area-triangulo, area-paralelogramo, area-trapecio, area-rombo, area-elipse, area-hexagono, factorial, teorema-pitagoras, regla-de-tres)
diseno: recent (contraste-color, paleta-complementaria)
conversiones: recent (peso, velocidad, rgb-hex, kg-libras, onzas-gramos, litros-galones)
salud: recent (frecuencia-cardiaca-maxima, tmb, peso-saludable)
educacion: recent (media-aritmetica, media-ponderada, nota-necesaria)
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
2026-10-22 META (this run): restored tools-builder-state.md from PLACEHOLDER wipe (size 11). Added recent potencia-electrica (ciencia) + tiempo-vuelo (viajes). registry-entries-a.ts currently PLACEHOLDER_FIX_LATER — thin registry.tsx has dedicated ifs for recent tools and is intact. No new tools this run to avoid risk. Deploy was READY on previous SHA.
2026-10-22 PRODUCT: shipped calculadora-potencia-electrica + calculadora-tiempo-vuelo (fixed from PLACEHOLDER components).
Previous notes preserved from 63133ddf.
```

---

## OPTIONAL — last run snapshot

```
last_mode: META
last_slugs: none (restore only)
last_deploy: READY (prior)
last_sha: c6c7aa778989d8d97047458dffe7e5c5e0ab1809
```

<!-- end:tools-builder-state.md -->
