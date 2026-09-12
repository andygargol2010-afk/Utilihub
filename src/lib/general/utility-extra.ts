import { makeTool } from "./types";

const tool=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"utilidades","formula",summary,name.toLowerCase().split(/\s+/),{operation,fields});

export const UTILITY_EXTRA_TOOLS=[
  tool("porcentaje-de-cambio","Percent change between values","Calculate the percentage change between an initial and a final value.",["Initial value","Final value"],"percent-change"),
  tool("impuesto-sobre-precio","Price with tax","Calculate the final price after applying a percentage tax.",["Base price","Tax (%)"],"tax"),
  tool("comision-de-venta","Sales commission","Calculate the commission amount on a sale.",["Sale amount","Commission (%)"],"percentage-amount"),
  tool("consumo-por-distancia","Consumption by distance","Calculate fuel consumption per 100 km.",["Fuel used (L)","Distance (km)"],"fuel-rate"),
  tool("distancia-por-combustible","Distance per fuel","Calculate distance traveled per unit of fuel.",["Distance (km)","Fuel used (L)"],"divide"),
  tool("coste-por-distancia","Cost by distance","Calculate fuel cost per kilometer traveled.",["Fuel cost","Distance (km)"],"divide"),
  tool("densidad-de-poblacion","Population density","Calculate inhabitants per unit of area.",["Population","Area (km²)"],"divide"),
  tool("escala-de-mapa","Map scale","Calculate a scale as the ratio of map distance to real distance.",["Map distance","Real distance"],"divide"),
];
