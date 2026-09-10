import {makeTool} from "./types";
const m=(s:string,n:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"matematicas","number",summary,[],config);
export const MATH_EXTRA_TOOLS=[
 m("valor-absoluto","Absolute value","Calculate the absolute value of a number.",{operation:"abs",fields:["Number"]}),
 m("redondeo","Round","Round a number to the nearest integer.",{operation:"round",fields:["Number"]}),
 m("redondeo-decimales","Round to decimals","Round a number to a given number of decimal places.",{operation:"round-decimals",fields:["Number","Decimals"]}),
 m("piso-matematico","Floor","Get the lower integer of a number.",{operation:"floor",fields:["Number"]}),
 m("techo-matematico","Ceiling","Get the upper integer of a number.",{operation:"ceil",fields:["Number"]}),
 m("raiz-n-esima","Nth root","Calculate a root of index n.",{operation:"nth-root",fields:["Number","Index"]}),
 m("hipotenusa","Hypotenuse","Calculate the hypotenuse of a right triangle.",{operation:"hypotenuse",fields:["Leg A","Leg B"]}),
 m("cateto-pitagoras","Pythagorean leg","Calculate a leg from the hypotenuse and the other leg.",{operation:"leg",fields:["Hypotenuse","Known leg"]}),
 m("area-circulo","Circle area","Calculate the area of a circle from its radius.",{operation:"circle-area",fields:["Radius"]}),
 m("circunferencia","Circumference","Calculate the length of a circumference.",{operation:"circle-circumference",fields:["Radius"]}),
 m("area-rectangulo","Rectangle area","Calculate the area of a rectangle.",{operation:"rectangle-area",fields:["Length","Width"]}),
 m("perimetro-rectangulo","Rectangle perimeter","Calculate the perimeter of a rectangle.",{operation:"rectangle-perimeter",fields:["Length","Width"]}),
 m("area-triangulo","Triangle area","Calculate the area of a triangle from base and height.",{operation:"triangle-area",fields:["Base","Height"]}),
 m("volumen-cubo","Cube volume","Calculate the volume of a cube.",{operation:"cube-volume",fields:["Side"]}),
 m("volumen-prisma","Prism volume","Calculate volume from base area and height.",{operation:"multiply",fields:["Base area","Height"]}),
 m("cambio-porcentual","Percentage change","Calculate the percentage change between two values.",{operation:"percent-change",fields:["Initial value","Final value"]}),
 m("precio-con-descuento","Price with discount","Calculate the final price after a discount.",{operation:"discount",fields:["Price","Discount %"]}),
 m("precio-con-aumento","Price with markup","Calculate the final price after a markup.",{operation:"markup",fields:["Price","Markup %"]}),
 m("promedio-dos-valores","Average of two values","Calculate the mean of two values.",{operation:"average",fields:["Value A","Value B"]}),
 m("proporcion","Ratio","Calculate the relationship between two quantities.",{operation:"ratio",fields:["Quantity A","Quantity B"]}),
];
