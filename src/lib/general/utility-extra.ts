import { makeTool } from "./types";

const tool=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"utilidades","formula",summary,name.toLowerCase().split(/\s+/),{operation,fields});

export const UTILITY_EXTRA_TOOLS=[
  makeTool("porcentaje-de-cambio","Percentage change","utilidades","formula","Calculate the percentage change between an initial and a final value.",["percentage change calculator","percent change formula","percentage increase calculator","percentage decrease","porcentaje de cambio","variacion porcentual","calcular aumento porcentual"],{operation:"percent-change",fields:["Initial value","Final value"],title:"Percentage change calculator — increase and decrease | UtiliHub",description:"Calculate the percentage change between two values with the formula ((final − initial) / initial) × 100. Works for increases and decreases. Free, in the browser, no signup."}),
  tool("impuesto-sobre-precio","Price with tax","Calculate the final price after applying a percentage tax.",["Base price","Tax (%)"],"tax"),
  tool("comision-de-venta","Sales commission","Calculate the commission amount on a sale.",["Sale amount","Commission (%)"],"percentage-amount"),
  tool("consumo-por-distancia","Consumption by distance","Calculate fuel consumption per 100 km.",["Fuel used (L)","Distance (km)"],"fuel-rate"),
  tool("distancia-por-combustible","Distance per fuel","Calculate distance traveled per unit of fuel.",["Distance (km)","Fuel used (L)"],"divide"),
  tool("coste-por-distancia","Cost by distance","Calculate fuel cost per kilometer traveled.",["Fuel cost","Distance (km)"],"divide"),
  tool("densidad-de-poblacion","Population density","Calculate inhabitants per unit of area.",["Population","Area (km²)"],"divide"),
  tool("escala-de-mapa","Map scale","Calculate a scale as the ratio of map distance to real distance.",["Map distance","Real distance"],"divide"),
];
