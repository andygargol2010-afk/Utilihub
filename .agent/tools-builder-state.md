# UtiliHub Tools Builder — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:tools-builder-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after successful PRODUCT (or when cluster notes change).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## RECENT_TOOLS (max 12, newest first)

Format: `- YYYY-MM-DD | cluster | slug | ComponentName`

```
- 2026-10-18 | texto | contador-vocales | VowelCounterTool
- 2026-10-18 | ciencia | calculadora-area-circulo | CircleAreaCalculatorTool
- 2026-10-18 | texto | contador-frecuencia-palabras | WordFrequencyCounterTool
- 2026-10-18 | ciencia | calculadora-densidad | DensityCalculatorTool
- 2026-10-18 | texto | contador-parrafos | ParagraphCounterTool
- 2026-10-18 | ciencia | calculadora-volumen-cilindro | CylinderVolumeCalculatorTool
- 2026-10-18 | texto | contador-oraciones | SentenceCounterTool
- 2026-10-18 | ciencia | calculadora-volumen-esfera | SphereVolumeCalculatorTool
- 2026-10-18 | finanzas | calculadora-propina-impuesto | TipTaxCalculatorTool
- 2026-10-18 | salud | calculadora-bac | BacCalculatorTool
- 2026-10-16 | viajes | calculadora-tiempo-viaje | TripTimeTool
- 2026-10-16 | ciencia | calculadora-fuerza | ForceCalculatorTool
```

Update this block when you ship. Drop entries beyond 12.

---

## CLUSTER WATCH

Use with PRODUCT diversity rules (ops). Prefer under-represented clusters.  
Two tools in the **same** PRODUCT run must **not** share a cluster.

```
fechas/tiempo: recent
ciencia/física: recent (fuerza, volumen-esfera, volumen-cilindro, densidad, area-circulo)
finanzas simples: recent (regla-72, propina-impuesto)
hogar/construcción: recent
% / math básica: recent (proporcion)
generadores texto: watch
conversiones genéricas: recent
salud / body-metrics: recent (bac, deficit)
productividad: recent (caracteres)
cocina: recent
educacion: recent
diseno: recent
viajes: recent (tiempo-viaje)
texto: recent (oraciones, parrafos, frecuencia, vocales)
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
```

---

## OPTIONAL — last run snapshot

```
last_mode: PRODUCT
last_slugs: calculadora-area-circulo, contador-vocales
last_deploy: pending verification
```

<!-- end:tools-builder-state.md -->
