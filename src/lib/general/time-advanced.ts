import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"fechas","time",summary,name.toLowerCase().split(/\s+/),{mode:"date",operation,fields});
export const TIME_ADVANCED_TOOLS=[
 t("diferencia-fechas","Diferencia entre dos fechas","Calcula la diferencia exacta entre dos fechas.",["Fecha inicial","Fecha final"],"date-difference"),
 t("dias-entre-fechas","Días entre fechas","Calcula el número de días entre dos fechas.",["Fecha inicial","Fecha final"],"days-between"),
 t("semana-del-ano","Semana del año","Calcula el número de semana ISO de una fecha.",["Fecha"],"week-number"),
 t("fecha-despues","Fecha después de N días","Calcula una fecha sumando una cantidad de días.",["Fecha inicial","Número de días"],"date-after"),
 t("fecha-antes","Fecha antes de N días","Calcula una fecha restando una cantidad de días.",["Fecha final","Número de días"],"date-before"),
 t("cuenta-regresiva-fecha","Cuenta regresiva hasta una fecha","Calcula cuántos días faltan hasta una fecha determinada.",["Fecha objetivo","Fecha de referencia"],"countdown-date"),
];
