import {makeTool} from "./types";
const m=(s:string,n:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"matematicas","number",summary,[],config);
export const MATH_EXTRA_TOOLS=[
 m("valor-absoluto","Valor absoluto","Calcula el valor absoluto de un número.",{operation:"abs",fields:["Número"]}),
 m("redondeo","Redondeo","Redondea un número al entero más cercano.",{operation:"round",fields:["Número"]}),
 m("redondeo-decimales","Redondeo a decimales","Redondea un número a una cantidad de decimales indicada.",{operation:"round-decimals",fields:["Número","Decimales"]}),
 m("piso-matematico","Piso matemático","Obtén el entero inferior de un número.",{operation:"floor",fields:["Número"]}),
 m("techo-matematico","Techo matemático","Obtén el entero superior de un número.",{operation:"ceil",fields:["Número"]}),
 m("raiz-n-esima","Raíz n-ésima","Calcula una raíz de índice n.",{operation:"nth-root",fields:["Número","Índice"]}),
 m("hipotenusa","Hipotenusa","Calcula la hipotenusa de un triángulo rectángulo.",{operation:"hypotenuse",fields:["Cateto A","Cateto B"]}),
 m("cateto-pitagoras","Cateto de Pitágoras","Calcula un cateto con hipotenusa y otro cateto.",{operation:"leg",fields:["Hipotenusa","Cateto conocido"]}),
 m("area-circulo","Área de círculo","Calcula el área de un círculo a partir de su radio.",{operation:"circle-area",fields:["Radio"]}),
 m("circunferencia","Circunferencia","Calcula la longitud de una circunferencia.",{operation:"circle-circumference",fields:["Radio"]}),
 m("area-rectangulo","Área de rectángulo","Calcula el área de un rectángulo.",{operation:"rectangle-area",fields:["Largo","Ancho"]}),
 m("perimetro-rectangulo","Perímetro de rectángulo","Calcula el perímetro de un rectángulo.",{operation:"rectangle-perimeter",fields:["Largo","Ancho"]}),
 m("area-triangulo","Área de triángulo","Calcula el área de un triángulo a partir de base y altura.",{operation:"triangle-area",fields:["Base","Altura"]}),
 m("volumen-cubo","Volumen de cubo","Calcula el volumen de un cubo.",{operation:"cube-volume",fields:["Lado"]}),
 m("volumen-prisma","Volumen de prisma","Calcula volumen con área de base y altura.",{operation:"multiply",fields:["Área de base","Altura"]}),
 m("cambio-porcentual","Cambio porcentual","Calcula la variación porcentual entre dos valores.",{operation:"percent-change",fields:["Valor inicial","Valor final"]}),
 m("precio-con-descuento","Precio con descuento","Calcula el precio final después de un descuento.",{operation:"discount",fields:["Precio","Descuento %"]}),
 m("precio-con-aumento","Precio con aumento","Calcula el precio final después de un aumento.",{operation:"markup",fields:["Precio","Aumento %"]}),
 m("promedio-dos-valores","Promedio de dos valores","Calcula la media de dos valores.",{operation:"average",fields:["Valor A","Valor B"]}),
 m("proporcion","Proporción","Calcula la relación entre dos cantidades.",{operation:"ratio",fields:["Cantidad A","Cantidad B"]}),
];
