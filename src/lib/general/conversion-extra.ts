import {makeTool} from "./types";
const c=(s:string,n:string,summary:string,config:Record<string,unknown>)=>makeTool(s,n,"conversiones","number",summary,[],config);
export const CONVERSION_EXTRA_TOOLS=[
 c("km-metros","Kilómetros a metros","Convierte kilómetros a metros.",{operation:"multiply",fields:["Kilómetros","1000"]}),
 c("metros-km","Metros a kilómetros","Convierte metros a kilómetros.",{operation:"divide",fields:["Metros","1000"]}),
 c("cm-metros","Centímetros a metros","Convierte centímetros a metros.",{operation:"divide",fields:["Centímetros","100"]}),
 c("metros-cm","Metros a centímetros","Convierte metros a centímetros.",{operation:"multiply",fields:["Metros","100"]}),
 c("mm-cm","Milímetros a centímetros","Convierte milímetros a centímetros.",{operation:"divide",fields:["Milímetros","10"]}),
 c("pulgadas-cm","Pulgadas a centímetros","Convierte pulgadas a centímetros.",{operation:"multiply",fields:["Pulgadas","2.54"]}),
 c("cm-pulgadas","Centímetros a pulgadas","Convierte centímetros a pulgadas.",{operation:"divide",fields:["Centímetros","2.54"]}),
 c("pies-metros","Pies a metros","Convierte pies a metros.",{operation:"multiply",fields:["Pies","0.3048"]}),
 c("metros-pies","Metros a pies","Convierte metros a pies.",{operation:"divide",fields:["Metros","0.3048"]}),
 c("yardas-metros","Yardas a metros","Convierte yardas a metros.",{operation:"multiply",fields:["Yardas","0.9144"]}),
 c("metros-yardas","Metros a yardas","Convierte metros a yardas.",{operation:"divide",fields:["Metros","0.9144"]}),
 c("kg-libras","Kilogramos a libras","Convierte kilogramos a libras.",{operation:"multiply",fields:["Kilogramos","2.2046226218"]}),
 c("libras-kg","Libras a kilogramos","Convierte libras a kilogramos.",{operation:"divide",fields:["Libras","2.2046226218"]}),
 c("gramos-kg","Gramos a kilogramos","Convierte gramos a kilogramos.",{operation:"divide",fields:["Gramos","1000"]}),
 c("kg-gramos","Kilogramos a gramos","Convierte kilogramos a gramos.",{operation:"multiply",fields:["Kilogramos","1000"]}),
 c("litros-ml","Litros a mililitros","Convierte litros a mililitros.",{operation:"multiply",fields:["Litros","1000"]}),
 c("ml-litros","Mililitros a litros","Convierte mililitros a litros.",{operation:"divide",fields:["Mililitros","1000"]}),
 c("galones-litros","Galones estadounidenses a litros","Convierte galones estadounidenses a litros.",{operation:"multiply",fields:["Galones","3.785411784"]}),
 c("litros-galones","Litros a galones estadounidenses","Convierte litros a galones estadounidenses.",{operation:"divide",fields:["Litros","3.785411784"]}),
 c("celsius-kelvin","Celsius a Kelvin","Convierte Celsius a Kelvin.",{operation:"c-k",fields:["Temperatura °C"]}),
];
