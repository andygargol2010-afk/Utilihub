# UtiliHub: descubrimiento, encadenamiento y retorno

## CURRENT STATE

**Fecha de revisión:** 8 de septiembre de 2026.

Se inspeccionó el repositorio autorizado `andygargol2010-afk/Utilihub`, su catálogo, rutas, componentes de navegación, metadata SEO, sitemap y mecanismos locales de favoritos, historial reciente y parámetros compartibles. El repositorio contiene un catálogo amplio de herramientas, URLs individuales, categorías, breadcrumbs, metadata por página, canonical, datos estructurados, Vercel Analytics y Speed Insights. También existía historial local (`localStorage`), favoritos y compartir/restaurar parámetros, por lo que no era necesario reconstruir esas capacidades.

La URL pública `https://utilihub.site/` fue comprobada el 8 de septiembre de 2026 y devolvió HTTP 404 con el mensaje **“This project has been deleted.”**. En cambio, el dominio Vercel configurado en el código (`https://utilihub-ten.vercel.app/`) respondió HTTP 200. Esto indica una incidencia confirmada de dominio/hosting en `utilihub.site`, no una conclusión sobre tráfico o conversión. No se dispuso de datos de Search Console, Analytics detallado, cohortes de retorno ni consultas de búsqueda; por tanto, todas las puntuaciones de impacto, esfuerzo y potencial son estimaciones de producto.

## TOP OPPORTUNITIES

| Rank | Oportunidad | Usuario/problema | Impacto | Esfuerzo | Riesgo | SEO | Utilidad | Social | Relación I/E | Acción |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | Kits por intención | El usuario sabe qué quiere lograr, no qué herramienta elegir | 9 | 4 | 2 | 8 | 9 | 6 | 2.25 | BUILD |
| 2 | Siguiente paso recomendado | El uso termina después de una sola herramienta | 8 | 3 | 2 | 5 | 8 | 4 | 2.67 | BUILD |
| 3 | Recuperar `utilihub.site` y verificar dominio canónico | El acceso público principal está roto | 10 | 3 | 7 | 10 | 10 | 2 | 3.33 | VALIDATE |
| 4 | Profundizar páginas de herramientas | Las páginas necesitan más contexto para resolver dudas y captar intención long-tail | 8 | 6 | 3 | 9 | 8 | 5 | 1.33 | BUILD SOON |
| 5 | Centro editorial | Falta una superficie estable para guías, comparativas y plantillas | 7 | 7 | 3 | 8 | 7 | 8 | 1.00 | BUILD SOON |
| 6 | Colecciones locales | Favoritos e historial existen, pero las colecciones pueden mejorar la organización | 7 | 5 | 2 | 4 | 8 | 4 | 1.40 | VALIDATE |
| 7 | PWA o extensión | Puede mejorar el retorno, pero todavía no prueba cuál es el problema principal | 5 | 8 | 4 | 2 | 5 | 6 | 0.63 | WATCH |

Las puntuaciones son estimaciones razonadas, no métricas observadas. El dominio roto se prioriza como bloqueo de distribución aunque la construcción de producto siga siendo válida sobre el dominio Vercel operativo.

## PRIORITY

La primera entrega debe reducir la fricción entre intención y acción sin introducir cuentas, backend ni cambios destructivos. Por eso se eligió un MVP de **kits por intención** más un bloque de **siguiente paso recomendado** en páginas de herramienta. El criterio de éxito inicial no es tráfico atribuido, que aún no está disponible, sino: rutas accesibles, enlaces rastreables, navegación comprensible, ausencia de regresiones y eventos que permitan medir después el paso desde una herramienta hacia otra.

Se posponen el centro editorial, las colecciones avanzadas y la PWA/extensión hasta verificar la superficie pública, confirmar analítica y observar si el problema dominante es descubrimiento o retorno.

## ACTION PLAN

1. Verificar y corregir la configuración de `utilihub.site`, redirecciones y dominio canónico en el proveedor de hosting. Comprobar después HTTP, canonical, robots y sitemap en producción.
2. Medir el embudo `home → kit → herramienta → siguiente herramienta` con eventos de analítica no sensibles.
3. Comparar el uso de kits con navegación normal durante un periodo de validación suficiente para obtener señal.
4. Ampliar las páginas de herramientas con ejemplos, formatos, privacidad, límites, preguntas frecuentes y enlaces relacionados solo donde el contenido sea específico y verificable.
5. Crear el centro editorial después de identificar los flujos con mayor uso y preguntas recurrentes.

## EXECUTION

Se implementó y subió al repositorio `andygargol2010-afk/Utilihub` el commit `f470e27` (`feat: add intent-based work kits and next steps`). Los cambios realizados fueron:

- Se creó el catálogo local `src/lib/work-kits.ts` con cuatro kits: freelancers, SEO y contenido, preparar documentos y estudiantes.
- Se añadieron `/kits` y `/kits/$slug` con metadata, canonical, breadcrumbs, CollectionPage structured data y enlaces a las herramientas existentes.
- Se añadió acceso a kits en navegación desktop, menú móvil y portada.
- Se registraron las nuevas URLs en `sitemap.xml`.
- Se añadió un “Siguiente paso recomendado” en páginas individuales, usando herramientas relacionadas del mismo catálogo.
- No se añadió cuenta, base de datos, cookies nuevas, backend ni envío de datos de usuario.
- No se modificaron URLs existentes ni se hicieron cambios masivos de canonical, robots o redirecciones.

## RESULTS

Validaciones ejecutadas:

- `npm run validate:catalog`: correcto; 146 archivos inspeccionados y 44 operaciones configuradas.
- `npm run build`: correcto.
- `npm run lint`: correcto.
- Preview local: `/`, `/kits`, `/kits/freelancers`, `/sitemap.xml` y `/herramientas/contador-de-palabras` respondieron HTTP 200.
- `git diff --check`: correcto.
- Push a GitHub: correcto hacia `main` en `andygargol2010-afk/Utilihub`.

La mejora de tráfico, uso encadenado o retención todavía no puede atribuirse porque no se dispuso de datos posteriores al despliegue. La comprobación visual móvil y la verificación en producción quedan pendientes de un despliegue activo y de la superficie pública definitiva.

## NEXT MOVE

**Corregir y verificar `utilihub.site` como dominio público/canónico antes de invertir en más contenido.** El criterio de decisión es que la portada, las nuevas rutas, `robots.txt`, canonical y sitemap respondan correctamente en el dominio que se quiere distribuir; después debe medirse el flujo entre kits y herramientas para decidir si la siguiente inversión debe ser editorial o de retención.
