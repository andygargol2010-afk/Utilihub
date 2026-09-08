# Informe operativo de UtiliHub

## Alcance y estado

- **Repositorio:** `andygargol2010-afk/Utilihub`
- **Rama auditada:** `chore/harden-manus-operator`
- **Commit:** `e21fa60 chore: enforce supervised isolated operator cycles`
- **PR:** [#47](https://github.com/andygargol2010-afk/Utilihub/pull/47)
- **Producción comprobada:** https://utilihub-299yzqiq1-financialproyects.vercel.app/
- **Fecha:** 2026-09-08
- **Estado general:** estable en la línea base; cambio de hardening en revisión; no fusionado ni promovido.

## Novedades del catálogo

No se crearon ni modificaron herramientas en esta operación. La prioridad fue asegurar el operador antes de permitir expansión o innovación automática.

La producción pública expone 555 herramientas y las categorías principales observadas fueron Finanzas, Matemáticas, Texto, Desarrollo, Conversores, Fecha y tiempo, Generadores, Diseño y color, Seguridad, Ciencia, Productividad, Educación, Cocina, Viajes y Hogar.

## Mejoras de producto y operación

Se endureció el sistema autónomo para que los ciclos mutables requieran una rama aislada con nombre. El operador ahora bloquea ejecuciones mutables cuando detecta `main`, `master` o un estado detached, evitando cambios sin trazabilidad mediante PR.

Se desactivó la declaración de merge automático de workers (`automatic_worker_merge: false`) y se marcó el scheduler como no configurado hasta que exista una programación de Manus verificable (`scheduler_configured: false`). La promoción a producción continúa separada de la validación y no se ejecuta automáticamente.

No se utilizó, instaló, configuró ni modificó n8n o su sandbox independiente.

## Errores corregidos y estado del pipeline

| Etapa | Evidencia | Estado |
|---|---|---|
| Repositorio y rama | `git remote`, rama `main` inicial limpia | Correcto |
| Instalación reproducible | `npm ci --ignore-scripts` | Correcto |
| Catálogo | `npm run validate:catalog` | Correcto |
| Lint | `npm run lint` | Correcto |
| Build | `npm run build` | Correcto; Vite/Nitro terminó sin error |
| Guardia de rama | Ejecución en worktree detached basada en `main` bloqueada con el mensaje de seguridad esperado | Correcto |
| Git | Commit `e21fa60`, rama publicada en origin | Correcto |
| PR | [PR #47](https://github.com/andygargol2010-afk/Utilihub/pull/47) | Abierto |
| Vercel Preview | Deployment asociado al PR pendiente al momento del informe | Pendiente |
| Checks remotos | `build` y `Audit and validate` en progreso; `promote` omitido; comentarios de Vercel correctos | Pendiente |
| Producción | Página cargó, título correcto y catálogo visible | Comprobación mínima correcta |
| Playwright | No ejecutado en esta operación | Pendiente |
| Mobile | No aprobado; solo existe evidencia desktop | Pendiente |

## Validación visual

La página pública mostró correctamente la cabecera, navegación, hero, buscador, accesos rápidos, categorías y enlaces legales en viewport desktop. Captura: [evidencia visual desktop](/home/ubuntu/screenshots/utilihub-299yzqiq1-f_2026-09-08_03-08-21_4896.webp).

No se declara validación móvil ni evaluación Playwright porque no se ejecutaron en esta operación.

## Integraciones

GitHub y Vercel están disponibles y vinculados al repositorio autorizado. El proyecto Vercel identificado es `utilihub` con ID `prj_ueRzGdQqzYfMSoMd1xL3iA4y6hu3` en el equipo `financialproyects`; el deployment de producción más reciente observado estaba en estado `READY` sobre `main`.

OpenRouter está deshabilitado y no fue necesario para la auditoría. No se expusieron ni añadieron secretos.

La consulta de estado del scheduler de Manus devolvió `scheduled task session missing ref_session_uid`; por seguridad no se creó ni se activó una rutina recurrente a partir de ese estado inconsistente. Queda como bloqueo de configuración que requiere resolver la sesión de scheduler antes de automatizar ejecuciones diarias.

## Pendientes y bloqueos

1. Esperar los checks del PR #47 y el estado READY de su Preview; repetir en Preview la prueba funcional y visual antes de considerar el hardening aceptado.
2. Ejecutar una matriz funcional representativa sobre catálogo, búsqueda, una calculadora, una conversión, una herramienta financiera y educación.
3. Añadir o habilitar pruebas Playwright y viewport móvil si el mecanismo está disponible.
4. Resolver el error de referencia de sesión del scheduler de Manus antes de activar una cadencia recurrente.
5. Mantener el PR sin fusionar y producción intacta hasta disponer de checks verdes y autorización explícita para promoción.

## Regla de rollback

No hubo rollback porque ningún cambio fue promovido a producción y la línea base local permaneció verde. Si Preview o un check remoto falla, se debe detener la acumulación de cambios, diagnosticar el commit responsable y cerrar/revertir la rama si la corrección no es segura.
