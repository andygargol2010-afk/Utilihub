# Backlog: juegos y simuladores

Lista acordada para implementar **de a una**, priorizando calidad sobre cantidad.
El catálogo de tools simples sigue expandiéndose por automatización; este backlog es trabajo manual/asistido.

Última actualización: 2026-10-02

## Estado

| # | Tipo | Nombre | Estado |
|---|------|--------|--------|
| 1 | Simulador | Óptica: lentes y espejos | pendiente |
| 2 | Simulador | Circuitos DC interactivos | pendiente |
| 3 | Simulador | Cadenas tróficas / ecosistema | pendiente |
| 4 | Simulador | Propagación de epidemias (SIR) | pendiente |
| 5 | Simulador | Mercado / oferta-demanda | pendiente |
| 6 | Juego | Type race con código | **hecho** — `code-type-race` / `carrera-de-codigo` |
| 7 | Juego | Memory de fórmulas | **hecho** — `formula-memory` / `memoria-formulas` |
| 8 | Juego | Budget survivor | **hecho** — `budget-survivor` / `supervivencia-presupuesto` |
| 9 | Juego | Pathfinder grid (BFS/A*) | **hecho** — `pathfinder` / `busca-caminos` |
| 10 | Juego | Refracción challenge | pendiente |

## Detalle

### 1. Óptica: lentes y espejos
Rayos, foco, imagen real/virtual. Educación / ciencia.

### 2. Circuitos DC interactivos
Arrastrar batería, resistencias, LEDs; corriente y voltaje en vivo.

### 3. Cadenas tróficas / ecosistema
Ajustar depredadores/presas; equilibrio o colapso.

### 4. Propagación de epidemias (SIR)
R₀, vacunación, cuarentena; curvas en vivo.

### 5. Mercado / oferta-demanda
Mover curvas; precio de equilibrio e ingresos.

### 6. Type race con código ✅
Snippets JS/Python; WPM + errores. SLugs: `/games/code-type-race`, `/es/juegos/carrera-de-codigo`.

### 7. Memory de fórmulas ✅
Emparejar nombre ↔ fórmula (física, finanzas, geometría). SLugs: `/games/formula-memory`, `/es/juegos/memoria-formulas`.

### 8. Budget survivor ✅
Un mes de gastos aleatorios; no llegar a cero. SLugs: `/games/budget-survivor`, `/es/juegos/supervivencia-presupuesto`.

### 9. Pathfinder grid ✅
Dibujar obstáculos; visualizar BFS/A* paso a paso. Slugs: `/games/pathfinder`, `/es/juegos/busca-caminos`.

### 10. Refracción challenge
Apuntar láser al target con 1–3 lentes (arcade del #1).

## Prioridad sugerida (esfuerzo vs impacto)

1. **Alta:** Circuitos DC (#2), Óptica (#1), Type race (#6) ✅
2. **Media:** SIR (#4), Pathfinder (#9) ✅, Memory fórmulas (#7) ✅
3. **Experimental:** Budget survivor (#8) ✅, Ecosistema (#3), Mercado (#5), Refracción (#10)

## Reglas de implementación

- Una pieza a la vez (MVP completo: UI EN/ES, registry, SEO, mobile).
- No mezclar con el ritmo de la automatización de tools simples.
- Al terminar una: marcar estado `hecho` + commit/slug en esta tabla.
