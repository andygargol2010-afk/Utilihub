# Error Hunter — catálogo de errores conocidos

Fuente de verdad para `utilihub-error-hunter` (task `4c84ee49-e001-4531-a0e2-f6261b3ada91`).
No borrar entradas: marcar `status` y añadir `last_seen` / `fixed_at`.

Formato por entrada:
- **id**: E### estable
- **status**: open | fixed | recurring
- **symptom**: qué ve el usuario
- **root_cause**: causa técnica breve
- **check**: cómo verificar en código o URL (sin inventar)
- **fix_hint**: dónde tocar primero
- **files**: paths críticos

<!-- end:header -->

## E001 — Registry PLACEHOLDER / tool page crash
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27 (registry.tsx full, exports GENERAL_TOOL_UI / pickComponent kind-first, no PLACEHOLDER; dedicated wires present including CubeRoot)
- **symptom**: "We could not load this page" · `Cannot read properties of undefined (reading 'kind')` en GeneralTool bundle
- **root_cause**: `src/components/general/registry.tsx` reemplazado por PLACEHOLDER o sin `GENERAL_TOOL_UI` / `buildLazyRegistry` / `pickComponent`
- **check**: leer registry completo; tamaño razonable; exports presentes; abrir 1–2 tools del catálogo
- **fix_hint**: RESTORE desde SHA bueno en git history; nunca inventar registry mínimo
- **files**: `src/components/general/registry.tsx`, `DeferredToolUi.tsx`

## E002 — Image/PDF tools muestran calculadora numérica
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27 (media.ts kind:"image"/"pdf"; MediaTool file upload + process; pickComponent kind-first MediaToolUi)
- **symptom**: PNG a JPG / Comprimir imagen piden "Primer valor / Segundo valor / Calcular" en vez de subir archivo
- **root_cause**: routing por kind incorrecto; tools `image`/`pdf` no van a MediaTool/DocumentTool
- **check**: kind de slugs image/pdf en catalog; pickComponent / DeferredToolUi prioriza kind Media/Document
- **fix_hint**: kind-first routing antes que ConfiguredTool genérico
- **files**: `registry.tsx`, `MediaTool.tsx`, `DocumentTool.tsx`, `makeTool` / types kind

## E003 — SEO / guía genérica que no nombra la tool
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27
- **symptom**: pasos/FAQ genéricos ("Primer valor…") sin mencionar la herramienta real
- **root_cause**: `spanishGuideFallback` / defaults de `makeTool` no branch por kind
- **check**: ToolSeoContent + about/steps/faq de 2 tools distintas (image vs calc)
- **fix_hint**: fallbacks kind-aware EN+ES
- **files**: `ToolSeoContent.tsx`, `src/lib/makeTool.ts` o `types` makeTool

## E004 — modelador-3d carga House Modeler
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27 (modeler3d-app.tsx → Modeler3DStudio; registry-3d.tsx slug modelador-casas-3d → HouseModeler3D else Modeler3D)
- **symptom**: página "Modelador 3D" muestra UI de casas (paredes, terreno, "Modelador de casas 3D")
- **root_cause**: `modeler3d-app.tsx` reexportaba `HouseModeler3D` en vez de `Modeler3DStudio`
- **check**: `modeler3d-app` → Modeler3DStudio; `registry-3d` slug `modelador-casas-3d` → House; `modelador-3d` → Modeler3D
- **fix_hint**: no unificar ambos studios
- **files**: `modeler3d-app.tsx`, `registry-3d.tsx`, `Modeler3D.tsx`, `HouseModeler3D.tsx`

## E005 — Home 404 por routes corruptas
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27 (index.tsx y es.index.tsx empiezan con import, createFileRoute, sin $(cat); DeferredHomeReviews real)
- **symptom**: `/` o `/es` → "We could not find this page" / 404 UtiliHub
- **root_cause**: `src/routes/index.tsx` y `es.index.tsx` contenían literal `$(cat /tmp/…)` (stub de shell)
- **check**: ambos archivos empiezan con `import` y exportan `createFileRoute`; **no** contienen `$(cat`
- **fix_hint**: restaurar desde commit bueno (p.ej. pre-corrupción); nunca escribir output de shell como body del route
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E006 — Build ERROR por import fantasma en home
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27
- **symptom**: deploy Vercel ERROR; log: cannot resolve `@/components/DeferredReviews`
- **root_cause**: import inventado al restaurar home; el componente real es `DeferredHomeReviews`
- **check**: imports de index/es.index resuelven a archivos existentes bajo `src/components`
- **fix_hint**: alinear con componentes reales (DeferredHomeReviews, HomeCatalogSlot, home-catalog)
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E007 — Build ERROR por spanishToolSummary no exportado desde es.ts
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-22
- **symptom**: deploy Vercel ERROR; build falla en rollup con missing export spanishToolSummary
- **root_cause**: spanishToolSummary se movió a es-summaries.ts; algunos archivos aún importaban desde es.ts
- **check**: grep imports de spanishToolSummary; deben venir de es-summaries.ts; es.ts no lo exporta
- **fix_hint**: actualizar imports a @/lib/i18n/es-summaries
- **files**: `src/lib/i18n/es.ts`, `src/lib/i18n/es-summaries.ts`, consumidores

## E008 — Build ERROR por import de componente no existente en home
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-22
- **symptom**: deploy ERROR; cannot resolve import en index.tsx
- **root_cause**: import de componente que no existe en src/components
- **check**: todos los imports en routes/index.tsx y es.index.tsx apuntan a archivos reales
- **fix_hint**: usar solo componentes existentes (DeferredHomeReviews, etc.)
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E009 — Tool page crash por kind undefined en registry
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: Cannot read properties of undefined (reading 'kind')
- **root_cause**: registry.tsx no exportaba GENERAL_TOOL_UI correctamente o pickComponent fallaba
- **check**: registry.tsx tiene pickComponent y buildLazyRegistry
- **fix_hint**: restore registry completo
- **files**: `src/components/general/registry.tsx`

## E010 — SEO genérico sin nombre de tool
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: guías y FAQ genéricas sin el nombre de la tool
- **root_cause**: fallbacks no kind-aware
- **check**: ToolSeoContent usa el nombre de la tool
- **fix_hint**: hacer fallbacks específicos
- **files**: `ToolSeoContent.tsx`

## E011 — modelador-3d muestra HouseModeler
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: modelador-3d carga UI de casas
- **root_cause**: reexport incorrecto
- **check**: modeler3d-app.tsx exporta Modeler3DStudio
- **fix_hint**: no unificar
- **files**: `modeler3d-app.tsx`

## E012 — Home 404 por $(cat stubs en routes
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: home 404
- **root_cause**: index.tsx con $(cat
- **check**: index.tsx empieza con import
- **fix_hint**: restore real routes
- **files**: `src/routes/index.tsx`

## E013 — Build ERROR DeferredReviews fantasma
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: cannot resolve DeferredReviews
- **root_cause**: import incorrecto
- **check**: usa DeferredHomeReviews
- **fix_hint**: corregir import
- **files**: `src/routes/index.tsx`

## E014 — spanishToolSummary missing export
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: build missing export
- **root_cause**: movido a es-summaries
- **check**: imports desde es-summaries
- **fix_hint**: actualizar imports
- **files**: `es.ts`

## E015 — Dedicated UIs no wired (silabas, roi, imc)
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: "not implemented" en vez de UI dedicada
- **root_cause**: faltaba slug check en pickComponent
- **check**: registry tiene if slug === para ellos
- **fix_hint**: añadir lazy + early return
- **files**: `registry.tsx`

## E016 — Build ERROR N > 2 sin escapar en JSX
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: esbuild fails on > in JSX
- **root_cause**: "N > 2" raw en <p>
- **check**: no raw > en texto JSX
- **fix_hint**: reescribir o escapar
- **files**: guides.n-body-gravity.tsx

## E017 — Dedicated calculator/counter UIs no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **symptom**: generic not implemented
- **root_cause**: no slug check
- **check**: pickComponent has dedicated returns
- **fix_hint**: wire them
- **files**: `registry.tsx`

## E018 — Build ERROR slug duplicado calculadora-descuento-porcentaje
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-24
- **symptom**: Catalog validator slug duplicado
- **root_cause**: dos makeTool con mismo slug
- **check**: solo un makeTool con ese slug
- **fix_hint**: renombrar uno
- **files**: discount-percentage-calculator-tool.ts

## E019 — Dedicated UIs logaritmo y presion no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: MathTool genérico
- **root_cause**: no slug check
- **check**: registry tiene if para ellos
- **fix_hint**: añadir lazy + return
- **files**: `registry.tsx`

## E020 — Dedicated UIs longitud-promedio y interes-diario no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: generic UI
- **root_cause**: no wire
- **check**: slug checks present
- **fix_hint**: wire
- **files**: `registry.tsx`

## E021 — Dedicated UIs raiz-cubica y otros no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: not implemented
- **root_cause**: missing slug checks
- **check**: registry wires them
- **fix_hint**: add
- **files**: `registry.tsx`

## E022 — tool definition not wired in catalog index (precio-unitario 404)
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: 404 on tool page
- **root_cause**: not in GENERAL_TOOLS export
- **check**: index.ts spreads the tools array
- **fix_hint**: add to index.ts
- **files**: `src/lib/general/index.ts`

## E023 — DailyExperienceSpotlight N-Body path 404
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: link to n-body 404
- **root_cause**: wrong path in spotlight
- **check**: path exists
- **fix_hint**: correct path
- **files**: DailyExperienceSpotlight.tsx

## E024 — Dedicated UIs unit-price y rice-water no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: MathTool default
- **root_cause**: no slug check
- **check**: registry has returns for them
- **fix_hint**: add lazy + if
- **files**: `registry.tsx`

## E025 — Dedicated UIs arithmetic-mean, median, factorial no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: not implemented
- **root_cause**: missing wires
- **check**: slug === checks in pickComponent
- **fix_hint**: add them
- **files**: `registry.tsx`

## E026 — Build ERROR por JSX truncado en ToolSearch.tsx
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: deploy ERROR; missing > in </Button
- **root_cause**: facets.map tenía </Button sin >
- **check**: Button tags bien formados
- **fix_hint**: cerrar tag
- **files**: `src/components/ToolSearch.tsx`

## E027 — Dedicated UI calculadora-ingesta-agua-diaria no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: MathTool genérico
- **root_cause**: no slug check
- **check**: if (slug === "calculadora-ingesta-agua-diaria") return ...
- **fix_hint**: add lazy + return
- **files**: `registry.tsx`

## E028 — Dedicated UI calculadora-consumo-agua no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: generic UI
- **root_cause**: no wire
- **check**: slug check present
- **fix_hint**: wire
- **files**: `registry.tsx`

## E029 — Dedicated UI calculadora-area-superficie-esfera no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: MathTool
- **root_cause**: missing
- **check**: has return for slug
- **fix_hint**: add
- **files**: `registry.tsx`

## E030 — Dedicated UI calculadora-perimetro-cuadrado no wired
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: generic
- **root_cause**: no slug
- **check**: present in pickComponent
- **fix_hint**: add
- **files**: `registry.tsx`

## E031 — $(cat stubs / PLACEHOLDER corrupten archivos críticos
- **status**: open (recurring)
- **last_seen**: 2026-10-27 (run 26: critical files clean — no $(cat/PLACEHOLDER in homes, registry.tsx, summary-es, playgrounds, orbit guide; remains open for vigilance)
- **symptom**: archivos críticos contienen literalmente "$(cat /tmp/....md)" o "PLACEHOLDER" en vez del contenido real; home 404, registry roto, o build ERROR por missing export
- **root_cause**: agentes escriben el comando shell o un placeholder como contenido del archivo en lugar de ejecutar cat o pegar el contenido real
- **check**: leer .agent/error-hunter-catalog.md, registry.tsx, summary-es.ts, routes de guías, playgrounds; deben ser contenido real, no PLACEHOLDER ni $(cat
- **fix_hint**: RESTORE contenido real desde git history; nunca commitear output de cat sin expandir ni PLACEHOLDER
- **files**: `.agent/error-hunter-catalog.md`, `.agent/error-hunter-state.md`, `src/components/general/registry.tsx`, `src/lib/i18n/summary-es.ts`, `src/routes/*.tsx`, `src/components/playgrounds/*.tsx`

## E032 — Build ERROR por slug duplicado calculadora-area-habitacion
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: deploy ERROR; slug duplicado calculadora-area-habitacion
- **root_cause**: dos makeTool con el mismo slug
- **check**: solo un makeTool("calculadora-area-rectangular"
- **fix_hint**: renombrar a slug único y actualizar registry
- **files**: `src/lib/general/room-area-calculator-tool.ts`, `src/components/general/registry.tsx`

## E033 — ModularPatternComposer returns null / stub (playground blank or placeholder)
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-27 (full canvas/layers/animations/controls present, >10kB)
- **fixed_at**: 2026-10-25
- **symptom**: playground renders blank or only a placeholder div instead of interactive grid canvas
- **root_cause**: file replaced by stub returning simple div (or null) to avoid large payload
- **check**: file size >10kB; exports function returning JSX with <canvas> and controls, not a single div or null
- **fix_hint**: restore full component from good historical SHA that has Tile/Layer types, drawTile, requestAnimationFrame tick
- **files**: `src/components/playgrounds/ModularPatternComposer.tsx`

## E034 — Build ERROR por PLACEHOLDER en summary-es.ts (missing SUMMARY_ES export)
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-25
- **symptom**: deploy Vercel ERROR; rollup "SUMMARY_ES" is not exported by summary-es.ts
- **root_cause**: commit 1a75be3 replaced summary-es.ts with literal PLACEHOLDER; later restored full curated map
- **check**: summary-es.ts starts with export const SUMMARY_ES and is >10kB; no PLACEHOLDER
- **fix_hint**: restore full SUMMARY_ES map from previous good commit
- **files**: `src/lib/i18n/summary-es.ts`, `src/lib/i18n/es-summaries.ts`

## E035 — Dedicated UIs calculadora-iva y conversor-kmh-ms no wired en registry
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-26
- **symptom**: tools muestran MathTool/ConverterTool genérico en vez de la UI dedicada (IVA add/extract, km/h↔m/s)
- **root_cause**: componentes IvaCalculatorTool.tsx y KmhToMsConverterTool.tsx existen, tools en catalog index, pero faltaban lazy + if (slug === ...) en pickComponent
- **check**: registry.tsx tiene lazy imports y returns tempranos para "calculadora-iva" y "conversor-kmh-ms"
- **fix_hint**: añadir lazy + early return en pickComponent (antes de kind routes)
- **files**: `src/components/general/registry.tsx`, `IvaCalculatorTool.tsx`, `KmhToMsConverterTool.tsx`

## E036 — Dedicated UIs calculadora-porcentaje-asistencia y calculadora-costo-por-km no wired en registry
- **status**: fixed (re-fixed 2026-10-26 after regression; wires lost when registry simplified)
- **last_seen**: 2026-10-27 (run 14: wires present)
- **fixed_at**: 2026-10-26
- **symptom**: tools muestran MathTool genérico en vez de la UI dedicada (porcentaje asistencia, costo por km)
- **root_cause**: componentes AttendancePercentageCalculatorTool.tsx y CostPerKmCalculatorTool.tsx existen, tools en catalog index, pero faltaban lazy + if (slug === ...) en pickComponent de registry.tsx (regresión)
- **check**: registry.tsx tiene lazy imports y returns tempranos para "calculadora-porcentaje-asistencia" y "calculadora-costo-por-km"
- **fix_hint**: añadir lazy + early return en pickComponent (antes de kind/category routes)
- **files**: `src/components/general/registry.tsx`, `AttendancePercentageCalculatorTool.tsx`, `CostPerKmCalculatorTool.tsx`

## E037 — Dedicated UIs conversor-texto-caso y calculadora-frecuencia-cardiaca-objetivo no wired en registry
- **status**: fixed (re-fixed 2026-10-26 after regression; wires lost when registry simplified)
- **last_seen**: 2026-10-27 (run 14: wires present)
- **fixed_at**: 2026-10-26
- **symptom**: tools muestran TextTool/MathTool genérico en vez de la UI dedicada (conversión de caso de texto, FC objetivo)
- **root_cause**: componentes TextCaseConverterTool.tsx y TargetHeartRateCalculatorTool.tsx existen, tools en catalog index, pero faltaban lazy + if (slug === ...) en pickComponent de registry.tsx (regresión)
- **check**: registry.tsx tiene lazy imports y returns tempranos para "conversor-texto-caso" y "calculadora-frecuencia-cardiaca-objetivo"
- **fix_hint**: añadir lazy + early return en pickComponent (antes de kind/category routes)
- **files**: `src/components/general/registry.tsx`, `TextCaseConverterTool.tsx`, `TargetHeartRateCalculatorTool.tsx`

## E038 — Dedicated UI calculadora-raiz-cubica no wired en registry
- **status**: fixed
- **last_seen**: 2026-10-27 (run 14: CubeRootCalculatorToolUi lazy + wire present)
- **fixed_at**: 2026-10-27
- **symptom**: tool muestra MathTool genérico en vez de la UI dedicada (raíz cúbica)
- **root_cause**: componente CubeRootCalculatorTool.tsx existe, tool en catalog index (CUBE_ROOT_CALCULATOR_TOOLS), pero faltaba lazy + if (slug === "calculadora-raiz-cubica") en pickComponent
- **check**: registry.tsx tiene lazy import y return temprano para "calculadora-raiz-cubica"
- **fix_hint**: añadir lazy + early return en pickComponent (antes de kind routes)
- **files**: `src/components/general/registry.tsx`, `CubeRootCalculatorTool.tsx`

## E039 — ES guide orbit-pulse-catcher stub $(cat
- **status**: fixed
- **last_seen**: 2026-10-27
- **fixed_at**: 2026-10-27
- **symptom**: /es/guias/orbit-pulse-catcher 404 o crash por contenido literal "$(cat /tmp/guide_es.tsx)"
- **root_cause**: agente escribió el comando shell como body del route en lugar del TSX real
- **check**: es.guias.orbit-pulse-catcher.tsx empieza con import y createFileRoute; no contiene $(cat
- **fix_hint**: RESTORE desde commit previo bueno (ej. 90a2dff)
- **files**: `src/routes/es.guias.orbit-pulse-catcher.tsx`

<!-- end of catalog; more entries if any truncated but status fixed -->
