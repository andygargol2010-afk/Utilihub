# UtiliHub — plan de implementación

La refactorización se implementa en 7 fases secuenciales. No se considera una fase cerrada hasta verificarla.

1. Eliminar `generate-education-banks.mjs` del Build UtiliHub. **Cerrada.**
2. Dejar bancos educativos reales en el repositorio, separados por materia, con 40 preguntas independientes por tema. **En curso.**
3. Convertir Verify education banks en gate real: 40 preguntas, sin duplicados, opciones/respuestas válidas, nivel/dificultad correctos, selección 5/10/20 y variación real por dificultad/nivel.
4. Mantener Build UtiliHub únicamente con `npm install`, `npm run validate:catalog` y `npm run build`.
5. Conseguir Actions verde en ambos workflows.
6. Confirmar que la refactorización visual está correctamente integrada.
7. Hacer revisión visual móvil final: first fold, listas compactas, formularios, creadores de tests, documentación colapsada, footer y objetivos táctiles de 44x44 px.

## Trabajo posterior

Después de completar las 7 fases, se hará una pasada específica para solucionar los problemas de **funcionalidad** que aparezcan en el nuevo diseño. Esta etapa queda deliberadamente separada de la refactorización estética para poder distinguir regresiones visuales de regresiones funcionales.
