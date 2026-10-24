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
- **last_seen**: 2026-10-24 (registry.tsx exports GENERAL_TOOL_UI / pickComponent kind-first, no PLACEHOLDER)
- **symptom**: "We could not load this page" · `Cannot read properties of undefined (reading 'kind')` en GeneralTool bundle
- **root_cause**: `src/components/general/registry.tsx` reemplazado por PLACEHOLDER o sin `GENERAL_TOOL_UI` / `buildLazyRegistry` / `pickComponent`
- **check**: leer registry completo; tamaño razonable; exports presentes; abrir 1–2 tools del catálogo
- **fix_hint**: RESTORE desde SHA bueno en git history; nunca inventar registry mínimo
- **files**: `src/components/general/registry.tsx`, `DeferredToolUi.tsx`

## E002 — Image/PDF tools muestran calculadora numérica
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-24 (kind-first en pickComponent presente)
- **symptom**: PNG a JPG / Comprimir imagen piden "Primer valor / Segundo valor / Calcular" en vez de subir archivo
- **root_cause**: routing por kind incorrecto; tools `image`/`pdf` no van a MediaTool/DocumentTool
- **check**: kind de slugs image/pdf en catalog; pickComponent / DeferredToolUi prioriza kind Media/Document
- **fix_hint**: kind-first routing antes que ConfiguredTool genérico
- **files**: `registry.tsx`, `MediaTool.tsx`, `DocumentTool.tsx`, `makeTool` / types kind

## E003 — SEO / guía genérica que no nombra la tool
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-24
- **symptom**: pasos/FAQ genéricos ("Primer valor…") sin mencionar la herramienta real
- **root_cause**: `spanishGuideFallback` / defaults de `makeTool` no branch por kind
- **check**: ToolSeoContent + about/steps/faq de 2 tools distintas (image vs calc)
- **fix_hint**: fallbacks kind-aware EN+ES
- **files**: `ToolSeoContent.tsx`, `src/lib/makeTool.ts` o `types` makeTool

## E004 — modelador-3d carga House Modeler
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-24
- **symptom**: página "Modelador 3D" muestra UI de casas (paredes, terreno, "Modelador de casas 3D")
- **root_cause**: `modeler3d-app.tsx` reexportaba `HouseModeler3D` en vez de `Modeler3DStudio`
- **check**: `modeler3d-app` → Modeler3DStudio; `registry-3d` slug `modelador-casas-3d` → House; `modelador-3d` → Modeler3D
- **fix_hint**: no unificar ambos studios
- **files**: `modeler3d-app.tsx`, `registry-3d.tsx`, `Modeler3D.tsx`, `HouseModeler3D.tsx`

## E005 — Home 404 por routes corruptas
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-24 (index.tsx y es.index.tsx empiezan con import, createFileRoute, sin $(cat))
- **symptom**: `/` o `/es` → "We could not find this page" / 404 UtiliHub
- **root_cause**: `src/routes/index.tsx` y `es.index.tsx` contenían literal `$(cat /tmp/…)` (stub de shell)
- **check**: ambos archivos empiezan con `import` y exportan `createFileRoute`; **no** contienen `$(cat`
- **fix_hint**: restaurar desde commit bueno (p.ej. pre-corrupción); nunca escribir output de shell como body del route
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E006 — Build ERROR por import fantasma en home
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-24
- **symptom**: deploy Vercel ERROR; log: cannot resolve `@/components/DeferredReviews`
- **root_cause**: import inventado al restaurar home; el componente real es `DeferredHomeReviews`
- **check**: imports de index/es.index resuelven a archivos existentes bajo `src/components`
- **fix_hint**: alinear con componentes reales (DeferredHomeReviews, HomeCatalogSlot, home-catalog)
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E007 — Build ERROR por spanishToolSummary no exportado desde es.ts
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-24
- **fixed_at**: 2026-10-22
- **symptom**: deploy Vercel ERROR; build falla en rollup con missing export spanishToolSummary
- **root_cause**: spanishToolSummary se movió a es-summaries.ts; algunos archivos aún importaban desde es.ts
- **check**: grep imports de spanishToolSummary; deben venir de es-summaries.ts; es.ts no lo exporta
- **fix_hint**: cambiar import a `@/lib/i18n/es-summaries`; no re-exportar si se quiere mantener separado
- **files**: `src/components/SpanishToolSearch.tsx`, `src/components/HomeFeaturedSection.tsx`, `src/components/CompactToolRow.tsx`, `src/lib/i18n/es-summaries.ts`, `src/lib/i18n/es.ts`

## E008 — Dedicated tool UI files contienen literal PLACEHOLDER
- **status**: fixed
- **last_seen**: 2026-10-24 (search PLACEHOLDER en src: 0)
- **fixed_at**: 2026-10-22
- **symptom**: página de tool crashea o muestra error de módulo al intentar cargar la UI dedicada
- **root_cause**: archivos de UI dedicados creados como stubs PLACEHOLDER en vez de componentes React exportados
- **check**: leer ElectricalPowerCalculatorTool.tsx y FlightTimeCalculatorTool.tsx; deben exportar función componente, no solo PLACEHOLDER
- **fix_hint**: implementar UI similar a otros *CalculatorTool.tsx (useState + useMemo + copy/reset)
- **files**: `src/components/general/ElectricalPowerCalculatorTool.tsx`, `src/components/general/FlightTimeCalculatorTool.tsx`, `registry.tsx` (lazy imports)

## E009 — Build ERROR por slug duplicado calculadora-interes-compuesto
- **status**: fixed
- **last_seen**: 2026-10-24
- **fixed_at**: 2026-10-22
- **symptom**: deploy Vercel ERROR; build falla en validate-catalog con slug duplicado
- **root_cause**: dos makeTool con el mismo slug; el de compound-interest-tool.ts no se importaba en src/lib/general/index.ts
- **check**: grep makeTool("calculadora-interes-compuesto"; solo debe quedar en compound-interest-calculator-tool.ts; compound-interest-tool.ts exporta array vacío
- **fix_hint**: eliminar o vaciar la definición no referenciada; no crear segundo makeTool del mismo slug
- **files**: `src/lib/general/compound-interest-calculator-tool.ts`, `src/lib/general/compound-interest-tool.ts`, `src/lib/general/index.ts`, `scripts/validate-catalog.mjs`

## E010 — Build ERROR por NBodyGravitySim no exportado
- **status**: recurring (transients PLACEHOLDER en polish commits)
- **last_seen**: 2026-10-24 (export function NBodyGravitySim present, full sim body, no PLACEHOLDER)
- **fixed_at**: 2026-10-23
- **symptom**: deploy Vercel ERROR; build falla en rollup missing named export
- **root_cause**: polish commits intermedios escribieron literal PLACEHOLDER en NBodyGravitySim.tsx en vez de componente exportado
- **check**: `export function NBodyGravitySim` en src/components/playgrounds/NBodyGravitySim.tsx; import named en routes; no PLACEHOLDER; starts with "use client"
- **fix_hint**: asegurar named export y contenido real; nunca dejar PLACEHOLDER en archivos importados por routes
- **files**: `src/components/playgrounds/NBodyGravitySim.tsx`, `src/routes/n-body-gravity.tsx`, `src/routes/es.n-body-gravity.tsx`

## E011 — Build ERROR / blank page por AuroraParticlePlayground stub
- **status**: recurring (regresión detectada anteriormente; ahora full)
- **last_seen**: 2026-10-24 (full multi-mode + polarity + trails + emitters, starts with "use client")
- **fixed_at**: 2026-10-23
- **symptom**: deploy Vercel ERROR o página blank (componente retorna null); rollup missing export si no exporta
- **root_cause**: polish commit reemplazó el componente real por stub que retorna null
- **check**: file starts with "use client"; `export function AuroraParticlePlayground({ locale }`; body real (canvas loop, no return null / PLACEHOLDER); routes pasan locale
- **fix_hint**: restore full component from good history SHA; never leave stub/PLACEHOLDER in imported playground files
- **files**: `src/components/playgrounds/AuroraParticlePlayground.tsx`, `src/routes/aurora-particle-playground.tsx`, `src/routes/es.aurora-particle-playground.tsx`

## E012 — Blank page / return null stub en NeonLayerComposer
- **status**: recurring (regresión: stub abbreviated con return <div> placeholder en HEAD)
- **last_seen**: 2026-10-24 (discovery: file era stub con comentario "Abbreviated in this call" + return <div>Neon Layer Composer...</div>; restaurado full desde bb38036b)
- **fixed_at**: 2026-10-24 (restore full canvas + layers + particles + pointer force + continuous emit from bb38036b)
- **symptom**: página /neon-layer-composer muestra solo un div estático en vez de canvas interactivo (componente stub)
- **root_cause**: polish/EXECUTE commits escribieron versión abreviada con comentario "rest of the component" + return div en vez de implementación real
- **check**: file exports `function NeonLayerComposer({ locale })`; body real (canvas, useEffect loop, drawSymmetry, no return <div> placeholder / PLACEHOLDER); routes importan el named export
- **fix_hint**: restore full from good history SHA (e.g. bb38036b or 2cca9f6c); never leave abbreviated stubs or return placeholder in playground imported by routes
- **files**: `src/components/playgrounds/NeonLayerComposer.tsx`, `src/routes/neon-layer-composer.tsx`, `src/routes/es.neon-layer-composer.tsx`

## E013 — Blank page / return null stub en TextParticlesPlayground (Firma Visual)
- **status**: fixed
- **last_seen**: 2026-10-24
- **fixed_at**: 2026-10-23
- **symptom**: /es/firma-visual (y visual-signature) blank; componente retorna null
- **root_cause**: archivo quedó como stub return-null (comentarios "abbreviated for call safety"); history también tenía el stub
- **check**: file exports `function TextParticlesPlayground({ locale, entryMode })`; body real (canvas loop, sampleTextTargets, no return null); routes importan el named export
- **fix_hint**: implement full particle-text swarm (similar a ParticlePostcard); never leave return null in route-imported playgrounds
- **files**: `src/components/playgrounds/TextParticlesPlayground.tsx`, `src/routes/es.firma-visual.tsx` (y ruta EN equivalente)

## E014 — Build ERROR por PLACEHOLDER en general/index.ts (catalog index)
- **status**: fixed
- **last_seen**: 2026-10-24 (index.ts real: export { GENERAL_CATEGORIES } + GENERAL_TOOLS array completo, no PLACEHOLDER)
- **fixed_at**: 2026-10-24
- **symptom**: deploy Vercel ERROR; build falla en rollup: "GENERAL_CATEGORIES" is not exported by "src/lib/general/index.ts"
- **root_cause**: feat(cat) commit reemplazó el contenido de src/lib/general/index.ts por literal "PLACEHOLDER_INDEX" al añadir tools, perdiendo los exports y imports
- **check**: leer src/lib/general/index.ts; debe importar GENERAL_CATEGORIES from "./catalog" y export { GENERAL_CATEGORIES }; GENERAL_TOOLS array completo; no PLACEHOLDER
- **fix_hint**: restore full index.ts from good history; never write PLACEHOLDER into catalog index or any imported module; tools-builder must append, not replace the index
- **files**: `src/lib/general/index.ts`, `src/lib/all-tools.ts`, `src/lib/general/catalog.ts`

## E015 — Catalog integrity warning por slug duplicado conversor-velocidad
- **status**: fixed
- **last_seen**: 2026-10-24 (runtime logs: duplicate tool slugs conversor-velocidad; dedicated + converters.ts)
- **fixed_at**: 2026-10-24
- **symptom**: runtime logs "UtiliHub catalog integrity: duplicate tool slugs (keeping first occurrence): conversor-velocidad"; potencial pérdida de SEO/faq o routing ambiguo
- **root_cause**: makeTool("conversor-velocidad") en converters.ts (simple) y en speed-converter-tool.ts (con faq/seo); ambos importados en index.ts
- **check**: grep slug conversor-velocidad; solo debe quedar en speed-converter-tool.ts; converters.ts no lo define
- **fix_hint**: eliminar la entrada simple del array CONVERTER_TOOLS; mantener la dedicada con mejor metadata
- **files**: `src/lib/general/converters.ts`, `src/lib/general/speed-converter-tool.ts`, `src/lib/general/index.ts`

## E016 — Build ERROR por carácter > sin escapar en JSX de guía N-body
- **status**: fixed
- **last_seen**: 2026-10-24 (ERROR deploys on 1e0f87b due to "N > 2" in guides.n-body-gravity.tsx; fixed in subsequent commits to "greater than" / "mayor que")
- **fixed_at**: 2026-10-24
- **symptom**: deploy Vercel ERROR; esbuild/vite transform fails: The character ">" is not valid inside a JSX element in guides.n-body-gravity.tsx
- **root_cause**: texto de la guía nueva contenía "N > 2" dentro de <p> sin escapar como > o reescribir
- **check**: grep "N >" en src/routes/guides*.tsx y es.guias*.tsx; no debe haber > raw en texto JSX
- **fix_hint**: reescribir "N > 2" como "N greater than 2" o "N mayor que 2"; nunca dejar > sin escapar en children de JSX
- **files**: `src/routes/guides.n-body-gravity.tsx`, `src/routes/es.guias.n-body-gravity.tsx`

<!-- end:catalog -->
