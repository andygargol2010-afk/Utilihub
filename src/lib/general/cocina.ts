import {makeTool} from "./types";
const c=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"cocina",k,summary,[],config);
export const COCINA_TOOLS=[
 c("escalador-recetas","Escalador de recetas","number","Ajusta automáticamente las cantidades de una receta según las porciones.",{operation:"scale-recipe",fields:["Cantidad original","Porciones originales","Porciones nuevas"]}),
 c("conversion-gramos-tazas","Gramos a tazas","number","Convierte cantidades aproximadas de ingredientes habituales entre gramos y tazas.",{operation:"grams-cups",fields:["Gramos","Factor g/taza"]}),
 c("conversion-ml-tazas","Mililitros a tazas","number","Convierte mililitros a tazas usando una equivalencia configurable.",{operation:"divide",fields:["Mililitros","Factor ml/taza"]}),
 c("conversion-cucharadas-ml","Cucharadas a mililitros","number","Convierte cucharadas a mililitros con la equivalencia estándar de cocina.",{operation:"multiply",fields:["Cucharadas","ml por cucharada"]}),
 c("conversion-cucharaditas-ml","Cucharaditas a mililitros","number","Convierte cucharaditas a mililitros.",{operation:"multiply",fields:["Cucharaditas","ml por cucharadita"]}),
 c("porcion-por-persona","Cantidad por persona","number","Calcula la cantidad de ingrediente necesaria por persona.",{operation:"divide",fields:["Cantidad total","Personas"]}),
 c("coste-receta","Coste total de receta","number","Suma un coste base por ingrediente a partir de cantidad y precio unitario.",{operation:"multiply",fields:["Cantidad","Precio por unidad"]}),
 c("coste-por-porcion-cocina","Coste por porción","number","Calcula el coste de una porción de una receta.",{operation:"divide",fields:["Coste total","Porciones"]}),
 c("hidratacion-pan","Hidratación del pan","number","Calcula el porcentaje de agua respecto a la harina.",{operation:"percent-of",fields:["Agua","Harina"]}),
 c("sal-pan","Sal respecto a harina","number","Calcula el porcentaje de sal respecto al peso de la harina.",{operation:"percent-of",fields:["Sal","Harina"]}),
 c("levadura-pan","Levadura respecto a harina","number","Calcula el porcentaje de levadura respecto al peso de la harina.",{operation:"percent-of",fields:["Levadura","Harina"]}),
 c("temperatura-horno-fahrenheit","Celsius a Fahrenheit de horno","number","Convierte una temperatura de horno de Celsius a Fahrenheit.",{operation:"c-to-f",fields:["Temperatura °C"]}),
 c("temperatura-horno-celsius","Fahrenheit a Celsius de horno","number","Convierte una temperatura de horno de Fahrenheit a Celsius.",{operation:"f-to-c",fields:["Temperatura °F"]}),
 c("ajuste-tiempo-horno","Ajuste de tiempo de horneado","number","Estima un nuevo tiempo de horneado aplicando un factor de ajuste.",{operation:"multiply",fields:["Tiempo original (min)","Factor"]}),
 c("cafe-proporcion","Proporción café-agua","number","Calcula la proporción de café respecto al agua.",{operation:"divide",fields:["Café (g)","Agua (ml)"]}),
 c("rendimiento-receta","Rendimiento por ingrediente","number","Calcula cuántas unidades produce una receta según cantidad total y por unidad.",{operation:"divide",fields:["Cantidad total","Cantidad por unidad"]}),
 c("porcentaje-merma-cocina","Porcentaje de merma","number","Calcula qué porcentaje de un ingrediente se pierde durante la preparación.",{operation:"percent-of",fields:["Merma","Cantidad inicial"]}),
 c("cantidad-aprovechable","Cantidad aprovechable","number","Calcula la cantidad útil después de aplicar un porcentaje de merma.",{operation:"remaining-percent",fields:["Cantidad inicial","Merma %"]}),
 c("conversion-kg-gramos-cocina","Kilogramos a gramos","number","Convierte kilogramos a gramos para recetas.",{operation:"multiply",fields:["Kilogramos","1000"]}),
 c("conversion-litros-ml-cocina","Litros a mililitros","number","Convierte litros a mililitros para recetas y bebidas.",{operation:"multiply",fields:["Litros","1000"]}),
];
