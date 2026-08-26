import { makeTool } from "./types";

const tool=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"utilidades","formula",summary,name.toLowerCase().split(/\s+/),{operation,fields});

export const UTILITY_EXTRA_TOOLS=[
  tool("porcentaje-de-cambio","Porcentaje de cambio","Calcula el porcentaje de cambio entre un valor inicial y uno final.",["Valor inicial","Valor final"],"percent-change"),
  tool("impuesto-sobre-precio","Precio con impuesto","Calcula el precio final después de aplicar un impuesto porcentual.",["Precio base","Impuesto (%)"],"tax"),
  tool("comision-de-venta","Comisión de venta","Calcula el importe de una comisión sobre una venta.",["Importe de venta","Comisión (%)"],"percentage-amount"),
  tool("consumo-por-distancia","Consumo por distancia","Calcula el consumo de combustible por cada 100 km.",["Combustible usado (L)","Distancia (km)"],"fuel-rate"),
  tool("distancia-por-combustible","Distancia por combustible","Calcula la distancia recorrida por unidad de combustible.",["Distancia (km)","Combustible usado (L)"],"divide"),
  tool("coste-por-distancia","Coste por distancia","Calcula el coste de combustible por kilómetro recorrido.",["Coste de combustible","Distancia (km)"],"divide"),
  tool("densidad-de-poblacion","Densidad de población","Calcula habitantes por unidad de superficie.",["Población","Superficie (km²)"],"divide"),
  tool("escala-de-mapa","Escala de mapa","Calcula una escala como relación entre distancia del mapa y distancia real.",["Distancia en mapa","Distancia real"],"divide"),
];