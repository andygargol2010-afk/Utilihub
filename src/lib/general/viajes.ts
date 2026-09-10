import {makeTool} from "./types";
const v=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"viajes",k,summary,[],config);
export const VIAJES_TOOLS=[
 v("velocidad-media","Average speed","number","Calculate average speed from distance and time.",{operation:"divide",fields:["Distance","Time"]}),
 v("distancia-viaje-calculadora","Travel distance","number","Calculate distance from average speed and time.",{operation:"multiply",fields:["Average speed","Time"]}),
 v("tiempo-viaje","Travel time","number","Calculate the time needed to cover a distance at constant speed.",{operation:"divide",fields:["Distance","Speed"]}),
 v("consumo-viaje","Fuel consumption","number","Calculate fuel consumption per 100 kilometers.",{operation:"fuel-rate",fields:["Fuel used","Distance"]}),
 v("combustible-necesario","Fuel needed","number","Estimate the fuel needed for a given distance and consumption.",{operation:"fuel-needed",fields:["Distance","Consumption L/100 km"]}),
 v("coste-combustible-viaje","Fuel cost","number","Calculate the fuel cost of a trip.",{operation:"multiply",fields:["Liters","Price per liter"]}),
 v("coste-km-viaje","Cost per kilometer","number","Calculate the average fuel cost per kilometer.",{operation:"divide",fields:["Total cost","Distance"]}),
 v("division-gastos-viaje","Expense split","number","Split a travel expense among several people.",{operation:"divide",fields:["Total expense","People"]}),
 v("propina-viaje-calculadora","Travel tip","number","Calculate tip and total from a bill and a percentage.",{operation:"tip",fields:["Bill","Tip %"]}),
 v("porcentaje-descuento-viaje","Travel discount","number","Calculate the final price after applying a percentage discount.",{operation:"discount",fields:["Price","Discount %"]}),
 v("aumento-precio-viaje","Price increase","number","Calculate the final price after a percentage increase.",{operation:"markup",fields:["Price","Increase %"]}),
 v("millas-kilometros-viaje","Miles to kilometers","number","Convert statute miles to kilometers.",{operation:"mi-km",fields:["Miles"]}),
 v("kilometros-millas-viaje","Kilometers to miles","number","Convert kilometers to statute miles.",{operation:"km-mi",fields:["Kilometers"]}),
 v("millas-nauticas-km","Nautical miles to kilometers","number","Convert nautical miles to kilometers.",{operation:"nmi-km",fields:["Nautical miles"]}),
 v("kilometros-millas-nauticas","Kilometers to nautical miles","number","Convert kilometers to nautical miles.",{operation:"km-nmi",fields:["Kilometers"]}),
 v("jet-lag-horas","Time difference","number","Calculate the difference between two UTC offsets.",{operation:"subtract",fields:["Destination UTC","Origin UTC"]}),
 v("presupuesto-diario-viaje","Daily budget","number","Calculate how much you can spend per day based on budget and duration.",{operation:"divide",fields:["Total budget","Days"]}),
 v("presupuesto-restante-viaje","Remaining budget","number","Calculate the remaining budget after expenses.",{operation:"subtract",fields:["Budget","Expenses"]}),
 v("dias-por-presupuesto","Possible travel days","number","Estimate how many days a fixed daily budget allows.",{operation:"divide",fields:["Budget","Daily spend"]}),
 v("equipaje-peso-restante","Remaining luggage weight","number","Calculate how much weight is left under a limit and current weight.",{operation:"subtract",fields:["Weight limit","Current weight"]}),
];
