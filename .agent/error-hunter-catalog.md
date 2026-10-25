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
- **last_seen**: 2026-10-25 (registry.tsx exports GENERAL_TOOL_UI / pickComponent kind-first, no PLACEHOLDER; dedicated wires present)
- **symptom**: "We could not load this page" · `Cannot read properties of undefined (reading 'kind')` en GeneralTool bundle
- **root_cause**: `src/components/general/registry.tsx` reemplazado por PLACEHOLDER o sin `GENERAL_TOOL_UI` / `buildLazyRegistry` / `pickComponent`
- **check**: leer registry completo; tamaño razonable; exports presentes; abrir 1–2 tools del catálogo
- **fix_hint**: RESTORE desde SHA bueno en git history; nunca inventar registry mínimo
- **files**: `src/components/general/registry.tsx`, `DeferredToolUi.tsx`

## E002 — Image/PDF tools muestran calculadora numérica
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-25 (media.ts kind:"image"/"pdf"; MediaTool file upload + process; pickComponent kind-first MediaToolUi)
- **symptom**: PNG a JPG / Comprimir imagen piden "Primer valor / Segundo valor / Calcular" en vez de subir archivo
- **root_cause**: routing por kind incorrecto; tools `image`/`pdf` no van a MediaTool/DocumentTool
- **check**: kind de slugs image/pdf en catalog; pickComponent / DeferredToolUi prioriza kind Media/Document
- **fix_hint**: kind-first routing antes que ConfiguredTool genérico
- **files**: `registry.tsx`, `MediaTool.tsx`, `DocumentTool.tsx`, `makeTool` / types kind

## E003 — SEO / guía genérica que no nombra la tool
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-25
- **symptom**: pasos/FAQ genéricos ("Primer valor…") sin mencionar la herramienta real
- **root_cause**: `spanishGuideFallback` / defaults de `makeTool` no branch por kind
- **check**: ToolSeoContent + about/steps/faq de 2 tools distintas (image vs calc)
- **fix_hint**: fallbacks kind-aware EN+ES
- **files**: `ToolSeoContent.tsx`, `src/lib/makeTool.ts` o `types` makeTool

## E004 — modelador-3d carga House Modeler
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-25 (modeler3d-app.tsx → Modeler3DStudio; registry-3d.tsx slug modelador-casas-3d → HouseModeler3D else Modeler3D)
- **symptom**: página "Modelador 3D" muestra UI de casas (paredes, terreno, "Modelador de casas 3D")
- **root_cause**: `modeler3d-app.tsx` reexportaba `HouseModeler3D` en vez de `Modeler3DStudio`
- **check**: `modeler3d-app` → Modeler3DStudio; `registry-3d` slug `modelador-casas-3d` → House; `modelador-3d` → Modeler3D
- **fix_hint**: no unificar ambos studios
- **files**: `modeler3d-app.tsx`, `registry-3d.tsx`, `Modeler3D.tsx`, `HouseModeler3D.tsx`

## E005 — Home 404 por routes corruptas
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-25 (index.tsx y es.index.tsx empiezan con import, createFileRoute, sin $(cat); DeferredHomeReviews real)
- **symptom**: `/` o `/es` → "We could not find this page" / 404 UtiliHub
- **root_cause**: `src/routes/index.tsx` y `es.index.tsx` contenían literal `$(cat /tmp/…)` (stub de shell)
- **check**: ambos archivos empiezan con `import` y exportan `createFileRoute`; **no** contienen `$(cat`
- **fix_hint**: restaurar desde commit bueno (p.ej. pre-corrupción); nunca escribir output de shell como body del route
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E006 — Build ERROR por import fantasma en home
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-25
- **symptom**: deploy Vercel ERROR; log: cannot resolve `@/components/DeferredReviews`
- **root_cause**: import inventado al restaurar home; el componente real es `DeferredHomeReviews`
- **check**: imports de index/es.index resuelven a archivos existentes bajo `src/components`
- **fix_hint**: alinear con componentes reales (DeferredHomeReviews, HomeCatalogSlot, home-catalog)
- **files**: `src/routes/index.tsx`, `src/routes/es.index.tsx`

## E007 — Build ERROR por spanishToolSummary no exportado desde es.ts
- **status**: fixed (vigilar regresión)
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-22
- **symptom**: deploy Vercel ERROR; build falla en rollup con missing export spanishToolSummary
- **root_cause**: spanishToolSummary se movió a es-summaries.ts; algunos archivos aún importaban desde es.ts
- **check**: grep imports de spanishToolSummary; deben venir de es-summaries.ts; es.ts no lo exporta
- **fix_hint**: cambiar import a `@/lib/i18n/es-summaries`; no re-exportar si se quiere mantener separado
- **files**: `src/components/SpanishToolSearch.tsx`, `src/components/HomeFeaturedSection.tsx`, `src/components/CompactToolRow.tsx`, `src/lib/i18n/es-summaries.ts`, `src/lib/i18n/es.ts`

## E008 — Dedicated tool UI files contienen literal PLACEHOLDER
- **status**: fixed
- **last_seen**: 2026-10-25 (search PLACEHOLDER en src: 0)
- **fixed_at**: 2026-10-22
- **symptom**: página de tool crashea o muestra error de módulo al intentar cargar la UI dedicada
- **root_cause**: archivos de UI dedicados creados como stubs PLACEHOLDER en vez de componentes React exportados
- **check**: leer ElectricalPowerCalculatorTool.tsx y FlightTimeCalculatorTool.tsx; deben exportar función componente, no solo PLACEHOLDER
- **fix_hint**: implementar UI similar a otros *CalculatorTool.tsx (useState + useMemo + copy/reset)
- **files**: `src/components/general/ElectricalPowerCalculatorTool.tsx`, `src/components/general/FlightTimeCalculatorTool.tsx`, `registry.tsx` (lazy imports)

## E009 — Build ERROR por slug duplicado calculadora-interes-compuesto
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-22
- **symptom**: deploy Vercel ERROR; build falla en validate-catalog con slug duplicado
- **root_cause**: dos makeTool con el mismo slug; el de compound-interest-tool.ts no se importaba en src/lib/general/index.ts
- **check**: grep makeTool("calculadora-interes-compuesto"; solo debe quedar en compound-interest-calculator-tool.ts; compound-interest-tool.ts exporta array vacío
- **fix_hint**: eliminar o vaciar la definición no referenciada; no crear segundo makeTool del mismo slug
- **files**: `src/lib/general/compound-interest-calculator-tool.ts`, `src/lib/general/compound-interest-tool.ts`, `src/lib/general/index.ts`, `scripts/validate-catalog.mjs`

## E010 — Build ERROR por NBodyGravitySim no exportado
- **status**: recurring (transients PLACEHOLDER en polish commits)
- **last_seen**: 2026-10-25 (export function NBodyGravitySim present, full sim body with canvas loop, no PLACEHOLDER, starts with "use client")
- **fixed_at**: 2026-10-23
- **symptom**: deploy Vercel ERROR; build falla en rollup missing named export
- **root_cause**: polish commits intermedios escribieron literal PLACEHOLDER en NBodyGravitySim.tsx en vez de componente exportado
- **check**: `export function NBodyGravitySim` en src/components/playgrounds/NBodyGravitySim.tsx; import named en routes; no PLACEHOLDER; starts with "use client"
- **fix_hint**: asegurar named export y contenido real; nunca dejar PLACEHOLDER en archivos importados por routes
- **files**: `src/components/playgrounds/NBodyGravitySim.tsx`, `src/routes/n-body-gravity.tsx`, `src/routes/es.n-body-gravity.tsx`

## E011 — Build ERROR / blank page por AuroraParticlePlayground stub
- **status**: recurring (regresión detectada anteriormente; ahora full)
- **last_seen**: 2026-10-25 (full multi-mode + polarity + trails + emitters, starts with "use client", canvas loop)
- **fixed_at**: 2026-10-23
- **symptom**: deploy Vercel ERROR o página blank (componente retorna null); rollup missing export si no exporta
- **root_cause**: polish commit reemplazó el componente real por stub que retorna null
- **check**: file starts with "use client"; `export function AuroraParticlePlayground({ locale }`; body real (canvas loop, no return null / PLACEHOLDER); routes pasan locale
- **fix_hint**: restore full component from good history SHA; never leave stub/PLACEHOLDER in imported playground files
- **files**: `src/components/playgrounds/AuroraParticlePlayground.tsx`, `src/routes/aurora-particle-playground.tsx`, `src/routes/es.aurora-particle-playground.tsx`

## E012 — Blank page / return null stub en NeonLayerComposer
- **status**: recurring (regresión: stub abbreviated con return <div> placeholder en HEAD)
- **last_seen**: 2026-10-25 (discovery previous: restored full; current HEAD full canvas)
- **fixed_at**: 2026-10-24 (restore full canvas + layers + particles + pointer force + continuous emit from bb38036b)
- **symptom**: página /neon-layer-composer muestra solo un div estático en vez de canvas interactivo (componente stub)
- **root_cause**: polish/EXECUTE commits escribieron versión abreviada con comentario "rest of the component" + return div en vez de implementación real
- **check**: file exports `function NeonLayerComposer({ locale })`; body real (canvas, useEffect loop, drawSymmetry, no return <div> placeholder / PLACEHOLDER); routes importan el named export
- **fix_hint**: restore full from good history SHA (e.g. bb38036b or 2cca9f6c); never leave abbreviated stubs or return placeholder in playground imported by routes
- **files**: `src/components/playgrounds/NeonLayerComposer.tsx`, `src/routes/neon-layer-composer.tsx`, `src/routes/es.neon-layer-composer.tsx`

## E013 — Blank page / return null stub en TextParticlesPlayground (Firma Visual)
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-23
- **symptom**: /es/firma-visual (y visual-signature) blank; componente retorna null
- **root_cause**: archivo quedó como stub return-null (comentarios "abbreviated for call safety"); history también tenía el stub
- **check**: file exports `function TextParticlesPlayground({ locale, entryMode })`; body real (canvas loop, sampleTextTargets, no return null); routes importan el named export
- **fix_hint**: implement full particle-text swarm (similar a ParticlePostcard); never leave return null in route-imported playgrounds
- **files**: `src/components/playgrounds/TextParticlesPlayground.tsx`, `src/routes/es.firma-visual.tsx` (y ruta EN equivalente)

## E014 — Build ERROR por PLACEHOLDER en general/index.ts (catalog index)
- **status**: fixed
- **last_seen**: 2026-10-25 (index.ts real: export { GENERAL_CATEGORIES } + GENERAL_TOOLS array completo, no PLACEHOLDER; includes new tools)
- **fixed_at**: 2026-10-24
- **symptom**: deploy Vercel ERROR; build falla en rollup: "GENERAL_CATEGORIES" is not exported by "src/lib/general/index.ts"
- **root_cause**: feat(cat) commit reemplazó el contenido de src/lib/general/index.ts por literal "PLACEHOLDER_INDEX" al añadir tools, perdiendo los exports y imports
- **check**: leer src/lib/general/index.ts; debe importar GENERAL_CATEGORIES from "./catalog" y export { GENERAL_CATEGORIES }; GENERAL_TOOLS array completo; no PLACEHOLDER
- **fix_hint**: restore full index.ts from good history; never write PLACEHOLDER into catalog index or any imported module; tools-builder must append, not replace the index
- **files**: `src/lib/general/index.ts`, `src/lib/all-tools.ts`, `src/lib/general/catalog.ts`

## E015 — Catalog integrity warning por slug duplicado conversor-velocidad
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-24
- **symptom**: runtime logs "UtiliHub catalog integrity: duplicate tool slugs (keeping first occurrence): conversor-velocidad"; potencial pérdida de SEO/faq o routing ambiguo
- **root_cause**: makeTool("conversor-velocidad") en converters.ts (simple) y en speed-converter-tool.ts (con faq/seo); ambos importados en index.ts
- **check**: grep slug conversor-velocidad; solo debe quedar en speed-converter-tool.ts; converters.ts no lo define
- **fix_hint**: eliminar la entrada simple del array CONVERTER_TOOLS; mantener la dedicada con mejor metadata
- **files**: `src/lib/general/converters.ts`, `src/lib/general/speed-converter-tool.ts`, `src/lib/general/index.ts`

## E016 — Build ERROR por carácter > sin escapar en JSX de guía N-body
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-24
- **symptom**: deploy Vercel ERROR; esbuild/vite transform fails: The character ">" is not valid inside a JSX element in guides.n-body-gravity.tsx
- **root_cause**: texto de la guía nueva contenía "N > 2" dentro de <p> sin escapar como > o reescribir
- **check**: grep "N >" en src/routes/guides*.tsx y es.guias*.tsx; no debe haber > raw en texto JSX
- **fix_hint**: reescribir "N > 2" como "N greater than 2" o "N mayor que 2"; nunca dejar > sin escapar en children de JSX
- **files**: `src/routes/guides.n-body-gravity.tsx`, `src/routes/es.guias.n-body-gravity.tsx`

## E017 — Dedicated calculator/counter UIs no wired in registry (generic "not implemented")
- **status**: fixed (partial: 3 slugs wired; more may exist)
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-24
- **symptom**: tools like contador-silabas, calculadora-roi, calculadora-imc show error "Text tool not implemented" or "Statistical tool not implemented" instead of dedicated UI
- **root_cause**: dedicated *CalculatorTool.tsx / *CounterTool.tsx exist and export real components, but pickComponent in registry.tsx lacks the slug === check + lazy import, so falls to TextTool/MathTool switch default
- **check**: for slug with dedicated file, verify if (slug === "...") return XxxToolUi in registry; process/calculate switch has case or dedicated is used
- **fix_hint**: add lazy import + early slug if in pickComponent; tools-builder must update registry when adding dedicated UI
- **files**: `src/components/general/registry.tsx`, `SyllableCounterTool.tsx`, `RoiCalculatorTool.tsx`, `BmiCalculatorTool.tsx` (and similar unlisted dedicateds)

## E018 — Build ERROR por slug duplicado calculadora-descuento-porcentaje
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-24
- **symptom**: deploy Vercel ERROR; Catalog validator: slug duplicado en makeTool/wrappers: calculadora-descuento-porcentaje (discount-percentage-calculator-tool.ts, percentage-discount-calculator-tool.ts)
- **root_cause**: dos archivos de tool dedicados definían el mismo slug; el validator escanea todos los makeTool en src/lib/general aunque no estén importados en index.ts
- **check**: grep makeTool("calculadora-descuento-porcentaje"; solo uno; el otro usa slug único (calculadora-porcentaje-descuento)
- **fix_hint**: cambiar slug de uno de los archivos a único; nunca dos makeTool con mismo slug (incluso si uno no se importa)
- **files**: `src/lib/general/discount-percentage-calculator-tool.ts`, `src/lib/general/percentage-discount-calculator-tool.ts`, `scripts/validate-catalog.mjs`

## E019 — Dedicated UIs for new catalog tools (logaritmo, presion-atmosferica) not wired in registry
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-25
- **symptom**: /calculadora-logaritmo y /calculadora-presion-atmosferica muestran UI genérica de MathTool ("Statistical tool not implemented") o stats input en vez de la UI dedicada con campos específicos
- **root_cause**: feat(cat) añadió makeTool + *CalculatorTool.tsx dedicados e import en index.ts, pero no actualizó pickComponent en registry.tsx con slug === + lazy import; caen a kind "calculator" → MathToolUi default throw
- **check**: registry.tsx tiene lazy LogarithmCalculatorToolUi + AtmosphericPressureCalculatorToolUi y if (slug === "calculadora-logaritmo") / "calculadora-presion-atmosferica"; componentes exportan función real
- **fix_hint**: añadir lazy + early slug check en pickComponent; tools-builder debe actualizar registry al añadir dedicated UI
- **files**: `src/components/general/registry.tsx`, `src/components/general/LogarithmCalculatorTool.tsx`, `src/components/general/AtmosphericPressureCalculatorTool.tsx`

## E020 — Dedicated UIs for latest catalog tools (longitud-promedio-palabra, interes-diario) not wired in registry
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-25
- **symptom**: /calculadora-longitud-promedio-palabra y /calculadora-interes-diario muestran UI genérica de MathTool/TextTool ("Statistical tool not implemented" / generic inputs) en vez de la UI dedicada con campos específicos
- **root_cause**: feat(cat) añadió makeTool + *CalculatorTool.tsx dedicados e import en index.ts, pero no actualizó pickComponent en registry.tsx con slug === + lazy import; caen a kind "calculator" → MathToolUi / TextTool default
- **check**: registry.tsx tiene lazy AverageWordLengthCalculatorToolUi + DailyInterestCalculatorToolUi y if (slug === "calculadora-longitud-promedio-palabra") / "calculadora-interes-diario"; componentes exportan función real (useState + useMemo)
- **fix_hint**: añadir lazy + early slug check en pickComponent; tools-builder debe actualizar registry al añadir dedicated UI
- **files**: `src/components/general/registry.tsx`, `src/components/general/AverageWordLengthCalculatorTool.tsx`, `src/components/general/DailyInterestCalculatorTool.tsx`

## E021 — Dedicated UIs for older catalog tools (raiz-cubica, pulgadas-cm, gasto-diario, ratio-trabajo-descanso) not wired in registry
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-25
- **symptom**: /calculadora-raiz-cubica, /conversor-pulgadas-cm, /calculadora-gasto-diario, /calculadora-ratio-trabajo-descanso muestran UI genérica (MathTool/ConverterTool) en vez de la dedicada
- **root_cause**: makeTool + *CalculatorTool/*ConverterTool.tsx dedicados e import en index.ts existían, pero pickComponent en registry.tsx no tenía slug === + lazy; caían a kind routes genéricos
- **check**: registry.tsx tiene lazy CubeRoot / InchesToCm / DailySpending / WorkBreakRatio y if slug === los cuatro; componentes exportan función real
- **fix_hint**: añadir lazy + early slug check en pickComponent; tools-builder debe actualizar registry al añadir dedicated UI
- **files**: `src/components/general/registry.tsx`, `CubeRootCalculatorTool.tsx`, `InchesToCmConverterTool.tsx`, `DailySpendingCalculatorTool.tsx`, `WorkBreakRatioCalculatorTool.tsx`

## E022 — Tool definition exists but not wired into catalog index (404)
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-25
- **symptom**: /tools/calculadora-precio-unitario y /es/herramientas/calculadora-precio-unitario → 404 "We could not find this page"
- **root_cause**: unit-price-tool.ts exported UNIT_PRICE_TOOLS with makeTool("calculadora-precio-unitario"...) and FAQ, but was never imported nor spread into GENERAL_TOOLS in src/lib/general/index.ts; slug absent from ALL_TOOLS so route loader throws notFound
- **check**: index.ts imports UNIT_PRICE_TOOLS from "./unit-price-tool" and spreads ...UNIT_PRICE_TOOLS in GENERAL_TOOLS array; toolByEnglishSlug resolves the slug
- **fix_hint**: add import + spread when adding a new *tool.ts that defines a slug; tools-builder must update the catalog index
- **files**: `src/lib/general/index.ts`, `src/lib/general/unit-price-tool.ts`

## E023 — DailyExperienceSpotlight N-Body path 404
- **status**: fixed
- **last_seen**: 2026-10-25
- **fixed_at**: 2026-10-25
- **symptom**: home Daily Spotlight CTA for N-Body Gravity links to /n-body-gravity-sim (and /es/n-body-gravity-sim) → 404 "We could not find this page"
- **root_cause**: POOL in DailyExperienceSpotlight.tsx used incorrect paths ending in -sim; actual createFileRoute are /n-body-gravity and /es/n-body-gravity
- **check**: DailyExperienceSpotlight.tsx POOL entry for n-body-gravity-sim has pathEn="/n-body-gravity" pathEs="/es/n-body-gravity"; routes n-body-gravity.tsx and es.n-body-gravity.tsx exist
- **fix_hint**: align spotlight paths with actual route definitions; verify other POOL entries against routes/
- **files**: `src/components/DailyExperienceSpotlight.tsx`, `src/routes/n-body-gravity.tsx`, `src/routes/es.n-body-gravity.tsx`

<!-- end:catalog -->
