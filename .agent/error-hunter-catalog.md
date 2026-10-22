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
- **last_seen**: 2026-10-22 (code smoke: no PLACEHOLDER, exports GENERAL_TOOL_UI / pickComponent presentes, kind routing prioritario)
- **symptom**: "We could not load this page" · `Cannot read properties of undefined (reading 'kind')` en GeneralTool bundle
- **root_cause**: `src/components/general/registry.tsx` reemplazado por PLACEHOLDER o sin `GENERAL_TOOL_UI` / `buildLazyRegistry` / `pickComponent`
- **check**: leer registry completo; tamaño razonable; exports presentes; abrir 1–2 tools del catálogo
- **fix_hint**: RESTORE desde SHA bueno en git history; nunca inventar registry mínimo
- **files**: `src/components/general/registry.tsx`, `DeferredToolUi.tsx`

## E002 — Image/PDF tools muestran calculadora numérica
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-22 (kind-first routing en pickComponent; MediaTool.tsx implementa upload/process para image/pdf)
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
- **last_seen**: 2026-10-22 (index.tsx y es.index.tsx empiezan con import, createFileRoute, sin $(cat); imports DeferredHomeReviews/HomeCatalogSlot OK)
- **symptom**: `/` o `/es` → "We could not find this page" / 404 UtiliHub
- **root_cause**: `src/routes/index.tsx` y `es.index.tsx` contenían literal `$(cat /tmp/…)` (stub de shell)
- **check**: ambos archivos empiezan con `import` y exportan `createFileRoute`; **no** contienen `$(cat`
- **fix_hint**: restaurar desde commit bueno (p.ej. pre-corrupción); nunca escribir output de shell como body del route
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E006 — Build ERROR por import fantasma en home
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-22 (imports DeferredHomeReviews, HomeCatalogSlot resuelven)
- **symptom**: deploy Vercel ERROR; log: cannot resolve `@/components/DeferredReviews`
- **root_cause**: import inventado al restaurar home; el componente real es `DeferredHomeReviews`
- **check**: imports de index/es.index resuelven a archivos existentes bajo `src/components`
- **fix_hint**: alinear con componentes reales (DeferredHomeReviews, HomeCatalogSlot, home-catalog)
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

<!-- end:catalog -->
