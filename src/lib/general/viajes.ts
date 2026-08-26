import {makeTool} from "./types";
const v=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"viajes",k,summary,[],config);
export const VIAJES_TOOLS=[
 v("velocidad-media","Velocidad media","number","Calcula la velocidad media a partir de distancia y tiempo.",{operation:"divide",fields:["Distancia","Tiempo"]}),
 v("distancia-viaje-calculadora","Distancia de viaje","number","Calcula distancia a partir de velocidad media y tiempo.",{operation:"multiply",fields:["Velocidad media","Tiempo"]}),
 v("tiempo-viaje","Tiempo de viaje","number","Calcula el tiempo necesario para recorrer una distancia a velocidad constante.",{operation:"divide",fields:["Distancia","Velocidad"]}),
 v("consumo-viaje","Consumo de combustible","number","Calcula el consumo de combustible por cada 100 kilómetros.",{operation:"fuel-rate",fields:["Combustible usado","Distancia"]}),
 v("combustible-necesario","Combustible necesario","number","Estima el combustible necesario para una distancia y un consumo dados.",{operation:"fuel-needed",fields:["Distancia","Consumo L/100 km"]}),
 v("coste-combustible-viaje","Coste de combustible","number","Calcula el coste de combustible de un trayecto.",{operation:"multiply",fields:["Litros","Precio por litro"]}),
 v("coste-km-viaje","Coste por kilómetro","number","Calcula el coste medio de combustible por kilómetro.",{operation:"divide",fields:["Coste total","Distancia"]}),
 v("division-gastos-viaje","División de gastos","number","Divide un gasto de viaje entre varias personas.",{operation:"divide",fields:["Gasto total","Personas"]}),
 v("propina-viaje-calculadora","Propina de viaje","number","Calcula propina y total a partir de una cuenta y un porcentaje.",{operation:"tip",fields:["Cuenta","Propina %"]}),
 v("porcentaje-descuento-viaje","Descuento de viaje","number","Calcula el precio final después de aplicar un descuento porcentual.",{operation:"discount",fields:["Precio","Descuento %"]}),
 v("aumento-precio-viaje","Aumento de precio","number","Calcula el precio final después de un aumento porcentual.",{operation:"markup",fields:["Precio","Aumento %"]}),
 v("millas-kilometros-viaje","Millas a kilómetros","number","Convierte millas terrestres a kilómetros.",{operation:"mi-km",fields:["Millas"]}),
 v("kilometros-millas-viaje","Kilómetros a millas","number","Convierte kilómetros a millas terrestres.",{operation:"km-mi",fields:["Kilómetros"]}),
 v("millas-nauticas-km","Millas náuticas a kilómetros","number","Convierte millas náuticas a kilómetros.",{operation:"nmi-km",fields:["Millas náuticas"]}),
 v("kilometros-millas-nauticas","Kilómetros a millas náuticas","number","Convierte kilómetros a millas náuticas.",{operation:"km-nmi",fields:["Kilómetros"]}),
 v("jet-lag-horas","Diferencia horaria","number","Calcula la diferencia entre dos desfases horarios UTC.",{operation:"subtract",fields:["UTC destino","UTC origen"]}),
 v("presupuesto-diario-viaje","Presupuesto diario","number","Calcula cuánto puedes gastar por día según presupuesto y duración.",{operation:"divide",fields:["Presupuesto total","Días"]}),
 v("presupuesto-restante-viaje","Presupuesto restante","number","Calcula el presupuesto restante después de gastos.",{operation:"subtract",fields:["Presupuesto","Gastos"]}),
 v("dias-por-presupuesto","Días posibles de viaje","number","Estima cuántos días permite un presupuesto diario fijo.",{operation:"divide",fields:["Presupuesto","Gasto diario"]}),
 v("equipaje-peso-restante","Peso de equipaje restante","number","Calcula cuánto peso queda disponible según un límite y el peso actual.",{operation:"subtract",fields:["Límite de peso","Peso actual"]}),
];
