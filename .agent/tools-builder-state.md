# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-19 | ciencia | calculadora-volumen-piramide | PyramidVolumeCalculatorTool
- 2026-10-19 | matematicas | calculadora-area-trapecio | TrapezoidAreaCalculatorTool
- 2026-10-18 | conversiones | conversor-presion | PressureConverterTool
- 2026-10-18 | salud | calculadora-calorias-quemadas | CaloriesBurnedCalculatorTool
- 2026-10-18 | ciencia | calculadora-circunferencia | CircleCircumferenceCalculatorTool
- 2026-10-18 | matematicas | calculadora-perimetro-rectangulo | RectanglePerimeterCalculatorTool
- 2026-10-18 | finanzas | calculadora-margen-beneficio | ProfitMarginCalculatorTool
- 2026-10-18 | educacion | calculadora-promedio-ponderado | WeightedAverageCalculatorTool
- 2026-10-18 | texto | contador-consonantes | ConsonantCounterTool
- 2026-10-18 | ciencia | calculadora-area-rectangulo | RectangleAreaCalculatorTool
- 2026-10-18 | texto | contador-vocales | VowelCounterTool
- 2026-10-18 | ciencia | calculadora-area-circulo | CircleAreaCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo, area-rectangulo, circunferencia, volumen-piramide)
finanzas simples: recent (regla-72, propina-impuesto, margen-beneficio)
hogar/construcción: recent
% / math básica: recent (proporcion, perimetro-rectangulo, area-trapecio)
generadores texto: watch
conversiones genéricas: recent (presion)
salud / body-metrics: recent (bac, deficit, calorias-quemadas)
productividad: recent (caracteres)
cocina: recent
educacion: recent (promedio-ponderado, nota-final)
diseno: recent
viajes: recent (tiempo-viaje)
texto: recent (oraciones, parrafos, frecuencia, vocales, consonantes)
```

After shipping, bump the relevant lines (e.g. `recent` / count in notes).

---

## NOTES

```
PRODUCT target: 2 tools/run; quality bar identical per tool; escape hatch → 1 excellent.
Registry anti-wipe remains the highest-priority safety rule.
Bootstrap automation prompt only points here — expand rules in tools-builder.md / ops.
POLICY 2026-10-17: if <2 candidates pass filters after first batch → mandatory up to 3 expansion rounds (≥4 new ideas each). Forbidden to ship 0 after only the first batch. Saturation escape: when all clusters recent, pick least-represented in RECENT_TOOLS (still distinct clusters). See tools-builder-ops.md §PRODUCT step 4.
2026-10-16 PRODUCT: shipped calculadora-tiempo-viaje (viajes) + calculadora-fuerza (ciencia).
2026-10-17 PRODUCT runs (multiple rolls): shipped 0 under old policy (first-batch saturation + anti-dupe). Expansion loop now required.
2026-10-18 PRODUCT: shipped 1 (calculadora-bac, salud) — second (tip+tax) prepared but registry/index update for two considered fragile after accidental placeholder; stopped at 1 excellent. Tip+tax files left for next run.
2026-10-18 PRODUCT: shipped 1 (calculadora-propina-impuesto, finanzas) — files were prepared; registered surgically. Second candidate not shipped to keep quality bar and avoid any registry risk this run.
2026-10-18 PRODUCT: shipped 2 (calculadora-volumen-esfera ciencia + contador-oraciones texto). Saturation escape used; distinct clusters. Anti-dupe passed (no existing sphere volume or sentence counter). Registry surgical OK.
2026-10-18 PRODUCT: shipped 2 (calculadora-volumen-cilindro ciencia + contador-parrafos texto). Saturation escape; distinct clusters. Anti-dupe OK. Registry surgical OK.
2026-10-18 PRODUCT: shipped 2 (calculadora-densidad ciencia + contador-frecuencia-palabras texto). Saturation escape; distinct clusters. Anti-dupe OK (no existing density or word frequency). Registry surgical OK.
2026-10-18 PRODUCT: shipped 2 (calculadora-area-circulo ciencia + contador-vocales texto). Saturation escape; distinct clusters. Anti-dupe OK (no existing dedicated circle area or vowel counter). Registry surgical OK.
2026-10-18 PRODUCT: shipped 2 (calculadora-area-rectangulo ciencia + contador-consonantes texto). Saturation escape used; distinct clusters. Anti-dupe OK (no existing rectangle area or consonant counter). Registry surgical OK.
2026-10-18 PRODUCT: shipped 2 (calculadora-margen-beneficio finanzas + calculadora-promedio-ponderado educacion). Distinct clusters (not texto/ciencia). Anti-dupe OK. Registry surgical OK after typo fix.
2026-10-18 PRODUCT: shipped 2 (calculadora-circunferencia ciencia + calculadora-perimetro-rectangulo matematicas). Distinct clusters. Anti-dupe OK (no existing dedicated circumference or rectangle perimeter). Registry surgical OK.
2026-10-18 PRODUCT: shipped 2 (conversor-presion conversiones + calculadora-calorias-quemadas salud). Distinct clusters. Anti-dupe OK. Registry restored after brief accidental wipe then full correct write OK.
2026-10-19 PRODUCT: prepared calculadora-volumen-piramide (ciencia) + calculadora-area-trapecio (matematicas) — components and data files committed. Index.ts and registry.tsx update considered fragile due to large file size and truncation risk in tool calls; stopped without registering to avoid breaking the catalog. Files left for next run. Saturation escape used.

2026-10-19 PRODUCT: shipped 2 (calculadora-volumen-piramide ciencia + calculadora-area-trapecio matematicas). Components and data were prepared previous run; registered surgically after restoring good index.ts. Distinct clusters. Anti-dupe OK. Registry surgical OK. Saturation escape used.

2026-10-19 FIX-BUILD: deploy ERROR due to missing ./pyramid-volume-calculator-tool and trapezoid definitions in lib/general (dangling imports). Created the two tool definition files matching the existing component quality bar, then re-added the imports to index.ts. Registry already had the lazy + pickComponent entries. Build should be clean once new deploy processes.
```

---

## OPTIONAL — last run snapshot

```
last_mode: FIX-BUILD
last_slugs: calculadora-volumen-piramide, calculadora-area-trapecio
last_deploy: pending (index re-add commit fe7308be)
```

<!-- end:tools-builder-state.md -->