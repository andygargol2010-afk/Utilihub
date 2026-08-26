import {makeTool} from "./types";
const c=(s:string,n:string,summary:string,config:Record<string,unknown>)=>makeTool(s,n,"conversiones","number",summary,[],config);
export const CONVERSION_EXTRA_TOOLS=[
 c("km-metros","Kilómetros a metros","Convierte kilómetros a metros.",{operation:"multiply-fixed",fields:["Kilómetros"],fixed:1000}),
 c("metros-km","Metros a kilómetros","Convierte metros a kilómetros.",{operation:"divide-fixed",fields:["Metros"],fixed:1000}),
 c("cm-metros","Centímetros a metros","Convierte centímetros a metros.",{operation:"divide-fixed",fields:["Centímetros"],fixed:100}),
 c("metros-cm","Metros a centímetros","Convierte metros a centímetros.",{operation:"multiply-fixed",fields:["Metros"],fixed:100}),
 c("mm-cm","Milímetros a centímetros","Convierte milímetros a centímetros.",{operation:"divide-fixed",fields:["Milímetros"],fixed:10}),
 c("pulgadas-cm","Pulgadas a centímetros","Convierte pulgadas a centímetros.",{operation:"multiply-fixed",fields:["Pulgadas"],fixed:2.54}),
 c("cm-pulgadas","Centímetros a pulgadas","Convierte centímetros a pulgadas.",{operation:"divide-fixed",fields:["Centímetros"],fixed:2.54}),
 c("pies-metros","Pies a metros","Convierte pies a metros.",{operation:"multiply-fixed",fields:["Pies"],fixed:0.3048}),
 c("metros-pies","Metros a pies","Convierte metros a pies.",{operation:"divide-fixed",fields:["Metros"],fixed:0.3048}),
 c("yardas-metros","Yardas a metros","Convierte yardas a metros.",{operation:"multiply-fixed",fields:["Yardas"],fixed:0.9144}),
 c("metros-yardas","Metros a yardas","Convierte metros a yardas.",{operation:"divide-fixed",fields:["Metros"],fixed:0.9144}),
 c("kg-libras","Kilogramos a libras","Convierte kilogramos a libras.",{operation:"multiply-fixed",fields:["Kilogramos"],fixed:2.2046226218}),
 c("libras-kg","Libras a kilogramos","Convierte libras a kilogramos.",{operation:"divide-fixed",fields:["Libras"],fixed:2.2046226218}),
 c("gramos-kg","Gramos a kilogramos","Convierte gramos a kilogramos.",{operation:"divide-fixed",fields:["Gramos"],fixed:1000}),
 c("kg-gramos","Kilogramos a gramos","Convierte kilogramos a gramos.",{operation:"multiply-fixed",fields:["Kilogramos"],fixed:1000}),
 c("litros-ml","Litros a mililitros","Convierte litros a mililitros.",{operation:"multiply-fixed",fields:["Litros"],fixed:1000}),
 c("ml-litros","Mililitros a litros","Convierte mililitros a litros.",{operation:"divide-fixed",fields:["Mililitros"],fixed:1000}),
 c("galones-litros","Galones estadounidenses a litros","Convierte galones estadounidenses a litros.",{operation:"multiply-fixed",fields:["Galones"],fixed:3.785411784}),
 c("litros-galones","Litros a galones estadounidenses","Convierte litros a galones estadounidenses.",{operation:"divide-fixed",fields:["Litros"],fixed:3.785411784}),
 c("celsius-kelvin","Celsius a Kelvin","Convierte Celsius a Kelvin.",{operation:"c-k",fields:["Temperatura °C"]}),
];
