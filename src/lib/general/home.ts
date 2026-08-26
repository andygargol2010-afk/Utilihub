import {makeTool} from "./types";
const h=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"hogar",k,summary,[],config);
export const HOGAR_TOOLS=[
 h("coste-electricidad","Coste de electricidad","number","Calcula el coste estimado de un aparato según consumo y precio por kWh.",{operation:"multiply",fields:["Consumo (kWh)","Precio por kWh"]}),
 h("consumo-electrico-diario","Consumo eléctrico diario","number","Calcula consumo diario a partir de potencia y horas de uso.",{operation:"power-hours",fields:["Potencia (W)","Horas por día"]}),
 h("consumo-electrico-mensual","Consumo eléctrico mensual","number","Estima el consumo mensual de un aparato según uso diario.",{operation:"monthly-electricity",fields:["Potencia (W)","Horas por día"]}),
 h("coste-agua","Coste de agua","number","Calcula el coste de agua según volumen y precio unitario.",{operation:"multiply",fields:["Volumen","Precio por unidad"]}),
 h("presupuesto-hogar","Presupuesto doméstico","number","Calcula el gasto restante de un presupuesto doméstico.",{operation:"subtract",fields:["Presupuesto","Gastos"]}),
 h("division-alquiler","División de alquiler","number","Divide un alquiler entre varias personas.",{operation:"divide",fields:["Alquiler","Personas"]}),
 h("ahorro-mensual","Ahorro mensual","number","Calcula ahorro mensual necesario para alcanzar una meta.",{operation:"divide",fields:["Meta de ahorro","Meses"]}),
 h("ahorro-anual","Ahorro anual","number","Calcula el ahorro anual a partir de un ahorro mensual.",{operation:"multiply",fields:["Ahorro mensual","Meses"]}),
 h("porcentaje-ahorro","Porcentaje de ahorro","number","Calcula qué porcentaje de un ingreso representa el ahorro.",{operation:"percent-of",fields:["Ahorro","Ingreso"]}),
 h("coste-por-unidad-hogar","Coste por unidad","number","Calcula el coste unitario de una compra.",{operation:"divide",fields:["Coste total","Unidades"]}),
 h("descuento-compra","Descuento de compra","number","Calcula el precio final después de un descuento.",{operation:"discount",fields:["Precio","Descuento %"]}),
 h("iva-compra","Impuesto sobre compra","number","Calcula impuesto y total a partir de un precio y porcentaje.",{operation:"tax",fields:["Precio","Impuesto %"]}),
 h("aumento-alquiler","Aumento de alquiler","number","Calcula el nuevo alquiler después de un aumento porcentual.",{operation:"markup",fields:["Alquiler actual","Aumento %"]}),
 h("reparto-tareas","Reparto de tareas","number","Calcula tareas promedio por persona.",{operation:"divide",fields:["Tareas","Personas"]}),
 h("horas-trabajo","Horas de trabajo","number","Calcula horas trabajadas a partir de horas de inicio y duración decimal.",{operation:"subtract",fields:["Hora final","Hora inicial"]}),
 h("tarifa-horaria","Tarifa por hora","number","Calcula una tarifa horaria a partir de ingreso y horas.",{operation:"divide",fields:["Ingreso","Horas"]}),
 h("productividad-hora","Unidades por hora","number","Calcula unidades producidas por hora.",{operation:"divide",fields:["Unidades","Horas"]}),
 h("material-por-superficie","Material por superficie","number","Calcula cantidad de material necesaria según superficie y consumo unitario.",{operation:"multiply",fields:["Superficie","Material por unidad"]}),
 h("coste-pintura","Coste de pintura","number","Calcula coste estimado de pintura según litros y precio por litro.",{operation:"multiply",fields:["Litros","Precio por litro"]}),
 h("desperdicio-material","Porcentaje de desperdicio","number","Calcula el porcentaje de material desperdiciado.",{operation:"percent-of",fields:["Desperdicio","Material utilizado"]}),
];
