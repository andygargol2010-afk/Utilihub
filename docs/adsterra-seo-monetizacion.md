# Plan de monetización Adsterra y crecimiento SEO para UtiliHub

## Objetivo

Aumentar ingresos sin deteriorar la utilidad principal de UtiliHub: que una persona llegue a una herramienta, la use correctamente y continúe hacia otra herramienta relacionada. La métrica principal no debe ser el CTR aislado, sino el ingreso por sesión útil, combinado con páginas por sesión, retorno, duración de la sesión, porcentaje de rebote, viewability y Core Web Vitals.

## Principio rector

No se deben provocar clics accidentales ni bloquear la herramienta. Los clics involuntarios pueden elevar temporalmente el CTR, pero degradan la confianza, el retorno, la calidad del tráfico y la sostenibilidad de la monetización. Los anuncios deben estar claramente separados de los controles de la herramienta y etiquetados como publicidad cuando corresponda.

## Arquitectura publicitaria recomendada

| Superficie | Formato inicial | Ubicación | Objetivo | Precauciones |
|---|---|---|---|---|
| Portada | Un banner visible y, si el rendimiento lo justifica, Social Bar | Después del primer bloque de valor o entre secciones | Monetizar tráfico de entrada | No cubrir el hero ni la búsqueda |
| Catálogo | Native o banner | Entre grupos de resultados, nunca entre controles de filtros | Monetizar exploración | Mantener la lista escaneable |
| Página de herramienta | Native o banner | Después del resultado principal y antes del recorrido relacionado | Monetizar sin interrumpir la tarea | No colocarlo junto a botones Copiar, Descargar, Limpiar o Ejecutar |
| Página de herramienta larga | Segundo bloque | Después de la guía, FAQ o explicación | Capturar usuarios que ya terminaron | Reservar espacio fijo para evitar CLS |
| Mobile | In-Page Push o Social Bar, máximo una unidad | Fijo pero no obstructivo | Monetizar alta proporción de tráfico móvil | Probar cierre, tamaño y frecuencia |
| Página de kit/hub | Native | Entre pasos o al final del primer grupo | Monetizar navegación de intención | No romper el flujo encadenado |

Adsterra recomienda comenzar con una estrategia clara por formato y ubicación, medirla semanalmente y no cambiar varios formatos a la vez. Su documentación también advierte que no conviene sobrecargar una página con unidades similares y que un solo Social Bar por página es una referencia prudente.

## Lo que probaría primero

### Fase 1: baseline de siete días

Registrar por plantilla y dispositivo: sesiones, páginas por sesión, RPM de página, eCPM, impresiones visibles, CTR, ingresos, duración, rebote, errores JavaScript, LCP, INP y CLS. Separar móvil, escritorio, país, página de entrada y herramienta.

No cambiar la configuración durante esta medición. El objetivo es conocer la situación actual y detectar si el anuncio ya está reduciendo navegación o interacción con la herramienta.

### Fase 2: una prueba por vez

1. Banner o Native después del resultado principal.
2. Variante del mismo bloque después de la guía/FAQ.
3. Social Bar limitado a una unidad por página.
4. In-Page Push únicamente en móvil, si las métricas de retorno no empeoran.
5. Popunder solo como experimento controlado en páginas de menor sensibilidad y nunca como primera decisión para toda la web.

Cada experimento debe tener una hipótesis, una variante de control, una duración mínima razonable y un criterio de rollback. No se debe declarar ganador por CTR solamente: la variante ganadora es la que mejora ingreso por sesión sin bajar páginas por sesión, retorno o Core Web Vitals.

## Diseño de páginas que favorece ingresos legítimos

Una página de herramienta debería seguir este orden:

1. Breadcrumb, título y explicación breve.
2. Superficie funcional de la herramienta.
3. Resultado o métricas.
4. Acciones principales: copiar, descargar, limpiar o compartir.
5. Primer bloque publicitario con separación visual clara.
6. Siguiente paso recomendado.
7. Recorrido de herramientas relacionadas.
8. Guía específica, limitaciones y preguntas frecuentes.
9. Segundo bloque publicitario solo cuando la página tenga suficiente contenido y desplazamiento real.

Esta estructura permite que el usuario termine la tarea antes de encontrar el anuncio, y después le ofrece una ruta natural hacia otra página monetizable.

## SEO para aumentar impresiones de anuncios de forma sostenible

### Páginas de herramienta

Cada herramienta debe tener una intención principal identificable y contenido realmente específico:

- Qué resuelve y para quién.
- Cómo usarla en pasos concretos.
- Ejemplo con valores de entrada y salida.
- Fórmula o método cuando exista.
- Formatos admitidos y límites.
- Privacidad y procesamiento local.
- Errores frecuentes y casos de uso.
- FAQ relacionada con la herramienta.
- Tres o cuatro enlaces contextuales a herramientas siguientes.

No crear páginas casi idénticas cambiando únicamente el nombre de una unidad o palabra clave. Google recomienda contenido útil, claro, original y enlaces con texto descriptivo; también advierte contra anuncios que distraen o dificultan el uso del contenido.

### Hubs de intención

Priorizar hubs que agrupen herramientas por trabajo real, no solo por categoría técnica:

- Preparar documentos y archivos.
- Crear y limpiar contenido.
- Herramientas para freelancers.
- Finanzas personales.
- Diseño y color para interfaces.
- Seguridad para desarrolladores.
- Herramientas para estudiantes.

Cada hub debe incluir una secuencia de pasos, herramientas destacadas, casos de uso, FAQ y enlaces a las páginas individuales. Esto eleva las páginas por sesión sin depender de anuncios agresivos.

### Centro editorial

Publicar guías que actúen como entradas SEO y derivación a herramientas:

- Cómo convertir, comprimir y organizar PDFs.
- Cómo calcular porcentajes, descuentos e impuestos.
- Cómo elegir colores accesibles con WCAG.
- Cómo crear una contraseña segura.
- Cómo limpiar un texto antes de publicarlo.

Cada guía debe enlazar a herramientas que resuelvan los pasos descritos. La guía debe aportar instrucciones y ejemplos propios, no ser una colección artificial de keywords.

### Arquitectura y rastreo

- Usar un solo canonical por herramienta.
- Mantener URLs legibles y agrupadas por intención.
- Enlazar desde hubs, categorías, guías y recorridos.
- Evitar filtros o parámetros que generen miles de URLs indexables.
- Mantener sitemap actualizado con páginas que tienen valor independiente.
- Revisar Search Console después de la migración de dominio.
- Comprobar que las nuevas páginas devuelvan 200, tengan contenido renderizado y no queden huérfanas.

## Migración al dominio nuevo

Antes de promocionarlo ampliamente:

1. Configurar el dominio preferido y HTTPS.
2. Confirmar `SITE_URL`, canonical, sitemap, robots, Open Graph y enlaces absolutos.
3. Añadir y verificar el dominio en Google Search Console y Bing Webmaster Tools.
4. Enviar el sitemap del dominio nuevo.
5. Si el dominio anterior seguirá activo, implementar redirecciones 301 página a página; no enviar todas las URLs a la portada.
6. Revisar que Adsterra esté asociado al dominio correcto y que el código no se duplique.
7. Inspeccionar muestras de portada, herramienta, categoría, hub y finanzas.
8. Medir indexación, impresiones y errores durante las primeras semanas.

## Métricas y cuadro de mando

| Grupo | Métricas |
|---|---|
| Adquisición | Impresiones orgánicas, clics orgánicos, CTR de Search Console, páginas de entrada |
| Navegación | Páginas por sesión, siguiente herramienta, profundidad, retorno a 7 días |
| Monetización | RPM por sesión, eCPM, ingresos por plantilla, viewability, CTR por placement |
| Experiencia | LCP menor o igual a 2,5 s, INP menor de 200 ms, CLS menor de 0,1, rebote, errores |
| Calidad | Clics accidentales reportados, cierres del anuncio, bloqueadores, reclamaciones, tráfico inválido |

Google define como objetivos de buena experiencia un LCP de hasta 2,5 segundos, INP inferior a 200 ms y CLS inferior a 0,1. Los anuncios deben reservar altura para evitar desplazamientos de contenido.

## Reglas de decisión

- Si sube el CTR pero bajan páginas por sesión o retorno: retirar o recolocar el anuncio.
- Si sube el RPM y se mantienen navegación y Core Web Vitals: mantener y ampliar solo a plantillas equivalentes.
- Si un formato funciona solo en un país o dispositivo: segmentarlo, no universalizarlo.
- Si el anuncio compite con el botón principal de la herramienta: moverlo aunque el CTR sea alto.
- Si el contenido tiene poco valor o pocas herramientas relacionadas: mejorar primero la página, no añadir más anuncios.
- Si el dominio nuevo pierde impresiones tras la migración: revisar indexación, canonical, sitemap, redirecciones y Search Console antes de tocar la publicidad.

## Prioridad de implementación

### Alta

- Medición por placement, plantilla, dispositivo y país.
- Reserva de altura para anuncios y control de CLS.
- Primer anuncio después del resultado, no antes del uso.
- Recorridos de siguiente herramienta visibles y contextuales.
- Search Console, sitemap, canonical y redirecciones del dominio nuevo.

### Media

- Tests A/B de Native frente a banner.
- Hubs por intención y guías editoriales.
- Segmentación móvil/escritorio y por país.
- Revisión semanal de RPM por sesión, no solo ingresos totales.

### Baja o condicionada

- Popunder global.
- Interstitial al cargar la página.
- Múltiples Social Bars.
- Smartlinks en navegación primaria o botones funcionales.
- Aumentar la densidad publicitaria antes de tener datos de navegación.

## Fuentes

- [Adsterra: manual de formatos para publishers](https://adsterra.com/blog/quick-publishers-manual-to-ad-formats/)
- [Adsterra: estrategias de ubicación de anuncios](https://adsterra.com/blog/ad-placement-strategies/)
- [Google Search Central: evitar interstitials intrusivos](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)
- [Google Search Central: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
