import {makeTool} from "./types";
const p=(s:string,n:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"productividad","number",summary,[],config);
export const PRODUCTIVITY_EXTRA_TOOLS=[
 p("horas-a-minutos","Hours to minutes","Convert decimal hours to minutes.",{operation:"hours-minutes",fields:["Hours"]}),
 p("minutos-a-horas","Minutes to hours","Convert minutes to decimal hours.",{operation:"minutes-hours",fields:["Minutes"]}),
 p("segundos-a-minutos","Seconds to minutes","Convert seconds to minutes.",{operation:"seconds-minutes",fields:["Seconds"]}),
 p("minutos-a-segundos","Minutes to seconds","Convert minutes to seconds.",{operation:"minutes-seconds",fields:["Minutes"]}),
 p("tareas-por-dia","Tasks per day","Calculate how many tasks you need to complete per day to reach a goal.",{operation:"divide",fields:["Tasks","Days"]}),
 p("dias-para-meta","Days to complete goal","Calculate days needed from pending tasks and daily pace.",{operation:"divide",fields:["Pending tasks","Tasks per day"]}),
 p("coste-tiempo","Cost of time","Calculate the cost of a time block from hourly rate.",{operation:"multiply",fields:["Hours","Hourly rate"]}),
 p("ingreso-horas","Income by hours","Calculate income from hours worked and rate.",{operation:"multiply",fields:["Hours","Hourly rate"]}),
 p("avance-proyecto","Project progress","Calculate the completed percentage of a project.",{operation:"percent-of",fields:["Completed tasks","Total tasks"]}),
 p("tareas-restantes","Remaining tasks","Calculate pending tasks from total and completed.",{operation:"subtract",fields:["Total tasks","Completed"]}),
 p("bloques-estudio","Study blocks","Calculate how many blocks fit in available time.",{operation:"divide",fields:["Available minutes","Minutes per block"]}),
 p("pausas-totales","Break time total","Calculate total break time during a workday.",{operation:"multiply",fields:["Number of breaks","Minutes per break"]}),
 p("jornada-restante","Remaining workday","Calculate remaining time from planned and completed hours.",{operation:"subtract",fields:["Planned hours","Hours done"]}),
 p("porcentaje-productividad","Productivity percentage","Calculate the completed percentage of a goal.",{operation:"percent-of",fields:["Result","Goal"]}),
 p("eficiencia","Efficiency","Calculate output per unit of time.",{operation:"divide",fields:["Output","Time"]}),
 p("coste-por-tarea","Cost per task","Calculate average cost per completed task.",{operation:"divide",fields:["Total cost","Tasks"]}),
 p("tiempo-por-tarea","Time per task","Calculate average time per task.",{operation:"divide",fields:["Total time","Tasks"]}),
 p("objetivo-diario","Daily goal","Calculate the daily goal needed to reach a target.",{operation:"divide",fields:["Total goal","Days"]}),
 p("objetivo-semanal","Weekly goal","Calculate the weekly goal from a daily goal.",{operation:"multiply",fields:["Daily goal","Days per week"]}),
 p("cumplimiento-plazo","Deadline progress","Calculate what percentage of available time has elapsed.",{operation:"percent-of",fields:["Time elapsed","Total time"]}),
];
