import {makeTool} from "./types";
const p=(s:string,n:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"productividad","number",summary,[],config);
export const PRODUCTIVITY_EXTRA_TOOLS=[
 p("horas-a-minutos","Horas a minutos","Convierte horas decimales a minutos.",{operation:"hours-minutes",fields:["Horas"]}),
 p("minutos-a-horas","Minutos a horas","Convierte minutos a horas decimales.",{operation:"minutes-hours",fields:["Minutos"]}),
 p("segundos-a-minutos","Segundos a minutos","Convierte segundos a minutos.",{operation:"seconds-minutes",fields:["Segundos"]}),
 p("minutos-a-segundos","Minutos a segundos","Convierte minutos a segundos.",{operation:"minutes-seconds",fields:["Minutos"]}),
 p("tareas-por-dia","Tareas por día","Calcula cuántas tareas necesitas completar por día para alcanzar una meta.",{operation:"divide",fields:["Tareas","Días"]}),
 p("dias-para-meta","Días para completar meta","Calcula los días necesarios según tareas pendientes y ritmo diario.",{operation:"divide",fields:["Tareas pendientes","Tareas por día"]}),
 p("coste-tiempo","Coste del tiempo","Calcula el coste de un bloque de tiempo según tarifa horaria.",{operation:"multiply",fields:["Horas","Tarifa por hora"]}),
 p("ingreso-horas","Ingreso por horas","Calcula ingreso según horas trabajadas y tarifa.",{operation:"multiply",fields:["Horas","Tarifa por hora"]}),
 p("avance-proyecto","Avance de proyecto","Calcula el porcentaje completado de un proyecto.",{operation:"percent-of",fields:["Tareas completadas","Tareas totales"]}),
 p("tareas-restantes","Tareas restantes","Calcula tareas pendientes a partir del total y completadas.",{operation:"subtract",fields:["Tareas totales","Completadas"]}),
 p("bloques-estudio","Bloques de estudio","Calcula cuántos bloques caben en un tiempo disponible.",{operation:"divide",fields:["Minutos disponibles","Minutos por bloque"]}),
 p("pausas-totales","Tiempo de pausas","Calcula el tiempo total de pausas durante una jornada.",{operation:"multiply",fields:["Número de pausas","Minutos por pausa"]}),
 p("jornada-restante","Jornada restante","Calcula el tiempo restante de una jornada según horas previstas y realizadas.",{operation:"subtract",fields:["Horas previstas","Horas realizadas"]}),
 p("porcentaje-productividad","Productividad porcentual","Calcula el porcentaje de una meta completada.",{operation:"percent-of",fields:["Resultado","Meta"]}),
 p("eficiencia","Eficiencia","Calcula producción por unidad de tiempo.",{operation:"divide",fields:["Producción","Tiempo"]}),
 p("coste-por-tarea","Coste por tarea","Calcula coste promedio por tarea completada.",{operation:"divide",fields:["Coste total","Tareas"]}),
 p("tiempo-por-tarea","Tiempo por tarea","Calcula tiempo promedio por tarea.",{operation:"divide",fields:["Tiempo total","Tareas"]}),
 p("objetivo-diario","Objetivo diario","Calcula el objetivo diario necesario para alcanzar una meta.",{operation:"divide",fields:["Objetivo total","Días"]}),
 p("objetivo-semanal","Objetivo semanal","Calcula el objetivo semanal a partir de un objetivo diario.",{operation:"multiply",fields:["Objetivo diario","Días por semana"]}),
 p("cumplimiento-plazo","Cumplimiento de plazo","Calcula qué porcentaje del plazo disponible ha transcurrido.",{operation:"percent-of",fields:["Tiempo transcurrido","Tiempo total"]}),
];
