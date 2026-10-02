# Backlog: juegos y simuladores

Lista acordada para implementar **de a una**, priorizando calidad sobre cantidad.

Última actualización: 2026-10-02

## Estado

| # | Tipo | Nombre | Estado |
|---|------|--------|--------|
| 1 | Simulador | Óptica: lentes y espejos | **hecho** — `optics-bench` / `banco-optico` |
| 2 | Simulador | Circuitos DC interactivos | **hecho** — `dc-circuit` / `circuito-dc` |
| 3 | Simulador | Cadenas tróficas / ecosistema | **hecho** — `ecosystem` / `ecosistema` |
| 4 | Simulador | Propagación de epidemias (SIR) | **hecho** — `sir-epidemic` / `epidemia-sir` |
| 5 | Simulador | Mercado / oferta-demanda | **hecho** — `market-equilibrium` / `equilibrio-mercado` |
| 6 | Juego | Type race con código | **hecho** — `code-type-race` / `carrera-de-codigo` |
| 7 | Juego | Memory de fórmulas | **hecho** — `formula-memory` / `memoria-formulas` |
| 8 | Juego | Budget survivor | **hecho** — `budget-survivor` / `supervivencia-presupuesto` |
| 9 | Juego | Pathfinder grid (BFS/A*) | **hecho** — `pathfinder` / `busca-caminos` |
| 10 | Juego | Refracción challenge | **hecho** — `refraction-challenge` / `desafio-refraccion` |

## Detalle

### 1–5. Simuladores ✅
Óptica, circuitos DC, ecosistema, epidemia SIR, mercado.

### 6–10. Juegos ✅
Todos implementados.

## Reglas de implementación

- Una pieza a la vez (MVP completo: UI EN/ES, registry, mobile).
- No mezclar con el ritmo de la automatización de tools simples.
- Al terminar una: marcar estado `hecho` + commit/slug en esta tabla.
