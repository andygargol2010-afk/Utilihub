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
- **last_seen**: 2026-10-23 (code smoke: registry.tsx exports GENERAL_TOOL_UI / pickComponent, kind-first routing, no PLACEHOLDER)
- **symptom**: "We could not load this page" · `Cannot read properties of undefined (reading 'kind')` en GeneralTool bundle
- **root_cause**: `src/components/general/registry.tsx` reemplazado por PLACEHOLDER o sin `GENERAL_TOOL_UI` / `buildLazyRegistry` / `pickComponent`
- **check**: leer registry completo; tamaño razonable; exports presentes; abrir 1–2 tools del catálogo
- **fix_hint**: RESTORE desde SHA bueno en git history; nunca inventar registry mínimo
- **files**: `src/components/general/registry.tsx`, `DeferredToolUi.tsx`

## E002 — Image/PDF tools muestran calculadora numérica
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-23 (kind-first en pickComponent presente)
- **symptom**: PNG a JPG / Comprimir imagen piden "Primer valor / Segundo valor / Calcular" en vez de subir archivo
- **root_cause**: routing por kind incorrecto; tools `image`/`pdf` no van a MediaTool/DocumentTool
- **check**: kind de slugs image/pdf en catalog; pickComponent / DeferredToolUi prioriza kind Media/Document
- **fix_hint**: kind-first routing antes que ConfiguredTool genérico
- **files**: `registry.tsx`, `MediaTool.tsx`, `DocumentTool.tsx`, `makeTool` / types kind

## E003 — SEO / guía genérica que no nombra la tool
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-22 (no evidencia de fallback genérico en smoke)
- **symptom**: pasos/FAQ genéricos ("Primer valor…") sin mencionar la herramienta real
- **root_cause**: `spanishGuideFallback` / defaults de `makeTool` no branch por kind
- **check**: ToolSeoContent + about/steps/faq de 2 tools distintas (image vs calc)
- **fix_hint**: fallbacks kind-aware EN+ES
- **files**: `ToolSeoContent.tsx`, `src/lib/makeTool.ts` o `types` makeTool

## E004 — modelador-3d carga House Modeler
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-22 (no evidencia de reexport incorrecto en búsqueda)
- **symptom**: página "Modelador 3D" muestra UI de casas (paredes, terreno, "Modelador de casas 3D")
- **root_cause**: `modeler3d-app.tsx` reexportaba `HouseModeler3D` en vez de `Modeler3DStudio`
- **check**: `modeler3d-app` → Modeler3DStudio; `registry-3d` slug `modelador-casas-3d` → House; `modelador-3d` → Modeler3D
- **fix_hint**: no unificar ambos studios
- **files**: `modeler3d-app.tsx`, `registry-3d.tsx`, `Modeler3D.tsx`, `HouseModeler3D.tsx`

## E005 — Home 404 por routes corruptas
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-23 (index.tsx y es.index.tsx empiezan con import, createFileRoute, sin $(cat); imports DeferredHomeReviews/HomeCatalogSlot OK)
- **symptom**: `/` o `/es` → "We could not find this page" / 404 UtiliHub
- **root_cause**: `src/routes/index.tsx` y `es.index.tsx` contenían literal `$(cat /tmp/…)` (stub de shell)
- **check**: ambos archivos empiezan con `import` y exportan `createFileRoute`; **no** contienen `$(cat`
- **fix_hint**: restaurar desde commit bueno (p.ej. pre-corrupción); nunca escribir output de shell como body del route
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E006 — Build ERROR por import fantasma en home
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-23 (imports DeferredHomeReviews, HomeCatalogSlot resuelven)
- **symptom**: deploy Vercel ERROR; log: cannot resolve `@/components/DeferredReviews`
- **root_cause**: import inventado al restaurar home; el componente real es `DeferredHomeReviews`
- **check**: imports de index/es.index resuelven a archivos existentes bajo `src/components`
- **fix_hint**: alinear con componentes reales (DeferredHomeReviews, HomeCatalogSlot, home-catalog)
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E007 — Build ERROR por spanishToolSummary no exportado desde es.ts
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-22 (deploy ERROR en 4a0830cf: "spanishToolSummary" is not exported by "src/lib/i18n/es.ts" from SpanishToolSearch.tsx:9)
- **fixed_at**: 2026-10-22 (SHA a7672b461c0f3b5d3c88bf3970a4544c2218986f corrige import a @/lib/i18n/es-summaries)
- **symptom**: deploy Vercel ERROR; build falla en rollup con missing export spanishToolSummary
- **root_cause**: spanishToolSummary se movió a es-summaries.ts; algunos archivos aún importaban desde es.ts
- **check**: grep imports de spanishToolSummary; deben venir de es-summaries.ts; es.ts no lo exporta
- **fix_hint**: cambiar import a `@/lib/i18n/es-summaries`; no re-exportar si se quiere mantener separado
- **files**: `src/components/SpanishToolSearch.tsx`, `src/components/HomeFeaturedSection.tsx`, `src/components/CompactToolRow.tsx`, `src/lib/i18n/es-summaries.ts`, `src/lib/i18n/es.ts`

## E008 — Dedicated tool UI files contienen literal PLACEHOLDER
- **status**: fixed
- **last_seen**: 2026-10-23 (ElectricalPowerCalculatorTool.tsx exporta componente real con useState/useMemo, no PLACEHOLDER; search PLACEHOLDER en src: 0)
- **fixed_at**: 2026-10-22 (SHAs 9675c9de y 3dedd6a3 implementan componentes reales con inputs/resultados)
- **symptom**: página de tool crashea o muestra error de módulo al intentar cargar la UI dedicada
- **root_cause**: archivos de UI dedicados creados como stubs PLACEHOLDER en vez de componentes React exportados
- **check**: leer ElectricalPowerCalculatorTool.tsx y FlightTimeCalculatorTool.tsx; deben exportar función componente, no solo PLACEHOLDER
- **fix_hint**: implementar UI similar a otros *CalculatorTool.tsx (useState + useMemo + copy/reset)
- **files**: `src/components/general/ElectricalPowerCalculatorTool.tsx`, `src/components/general/FlightTimeCalculatorTool.tsx`, `registry.tsx` (lazy imports)

## E009 — Build ERROR por slug duplicado calculadora-interes-compuesto
- **status**: fixed
- **last_seen**: 2026-10-23 (compound-interest-tool.ts exporta array vacío; no importado en index.ts)
- **fixed_at**: 2026-10-22 (SHA eedbb68e3fae43a9c416c77a3a36040a978d9a39 vacía el export de compound-interest-tool.ts, no importado en index.ts)
- **symptom**: deploy Vercel ERROR; build falla en validate-catalog con slug duplicado
- **root_cause**: dos makeTool con el mismo slug; el de compound-interest-tool.ts no se importaba en src/lib/general/index.ts
- **check**: grep makeTool(\"calculadora-interes-compuesto\"; solo debe quedar en compound-interest-calculator-tool.ts; compound-interest-tool.ts exporta array vacío
- **fix_hint**: eliminar o vaciar la definición no referenciada; no crear segundo makeTool del mismo slug
- **files**: `src/lib/general/compound-interest-calculator-tool.ts`, `src/lib/general/compound-interest-tool.ts`, `src/lib/general/index.ts`, `scripts/validate-catalog.mjs`

## E010 — Build ERROR por NBodyGravitySim no exportado
- **status**: recurring (transients PLACEHOLDER en polish commits)
- **last_seen**: 2026-10-23 (deploy ERROR dpl_2yrb3bc4 on SHA b13d8e5e / 4632ca7b: file was PLACEHOLDER_FULL_CONTENT, missing named export NBodyGravitySim; fixed in SHA 50e3d456 which restores full component with correct "use client")
- **fixed_at**: 2026-10-23 (SHA 50e3d456 restores named export + full sim; prior also on dafbf66)
- **symptom**: deploy Vercel ERROR; build falla en rollup missing named export
- **root_cause**: polish commits intermedios escribieron literal PLACEHOLDER en NBodyGravitySim.tsx en vez de componente exportado
- **check**: `export function NBodyGravitySim` en src/components/playgrounds/NBodyGravitySim.tsx; import named en routes n-body-gravity.tsx y es.n-body-gravity.tsx; no PLACEHOLDER; starts with "use client"
- **fix_hint**: asegurar named export y contenido real; nunca dejar PLACEHOLDER en archivos importados por routes
- **files**: `src/components/playgrounds/NBodyGravitySim.tsx`, `src/routes/n-body-gravity.tsx`, `src/routes/es.n-body-gravity.tsx`

<!-- end:catalog -->
