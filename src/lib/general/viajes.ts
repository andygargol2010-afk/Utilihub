import {makeTool} from "./types";
const v=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"viajes",k,summary,[],config);
export const VIAJES_TOOLS=[
 v("velocidad-media","Average speed","number","Calculate average speed from distance and time.",{operation:"divide",fields:["Distance","Time"]}),
 v("distancia-viaje-calculadora","Trip distance calculator","number","Calculate distance from average speed and time.",{operation:"multiply",fields:["Average speed","Time"]}),
 v("tiempo-viaje","Travel time","number","Calculate the time needed to cover a distance at constant speed.",{operation:"divide",fields:["Distance","Speed"]}),
 v("consumo-viaje","Trip fuel consumption","number","Calculate fuel consumption per 100 kilometers.",{operation:"fuel-rate",fields:["Fuel used","Distance"]}),
 v("combustible-necesario","Fuel needed","number","Estimate the fuel needed for a given distance and consumption.",{operation:"fuel-needed",fields:["Distance","Consumption L/100 km"]}),
 v("coste-combustible-viaje","Trip fuel cost","number","Calculate the fuel cost of a trip.",{operation:"multiply",fields:["Liters","Price per liter"]}),
 v("coste-km-viaje","Trip cost per km","number","Calculate the average fuel cost per kilometer.",{operation:"divide",fields:["Total cost","Distance"]}),
 v("division-gastos-viaje","Expense split","number","Split a travel expense among several people.",{operation:"divide",fields:["Total expense","People"]}),
 v("propina-viaje-calculadora","Travel tip","number","Calculate tip and total from a bill and a percentage.",{operation:"tip",fields:["Bill","Tip %"]}),
 v("porcentaje-descuento-viaje","Travel discount","number","Calculate the final price after applying a percentage discount.",{operation:"discount",fields:["Price","Discount %"]}),
 v("aumento-precio-viaje","Price increase","number","Calculate the final price after a percentage increase.",{operation:"markup",fields:["Price","Increase %"]}),
 v("millas-kilometros-viaje","Miles to kilometers","number","Convert statute miles to kilometers.",{operation:"mi-km",fields:["Miles"]}),
 v("kilometros-millas-viaje","Kilometers to miles","number","Convert kilometers to statute miles.",{operation:"km-mi",fields:["Kilometers"]}),
 v("millas-nauticas-km","Nautical miles to kilometers","number","Convert nautical miles to kilometers.",{operation:"nmi-km",fields:["Nautical miles"]}),
 v("kilometros-millas-nauticas","Kilometers to nautical miles","number","Convert kilometers to nautical miles.",{operation:"km-nmi",fields:["Kilometers"]}),
 v("litros-galones-viaje","Liters to gallons","number","Convert liters to US gallons.",{operation:"l-gal",fields:["Liters"]}),
 v("galones-litros-viaje","Gallons to liters","number","Convert US gallons to liters.",{operation:"gal-l",fields:["Gallons"]}),
 v("celsius-fahrenheit-viaje","Celsius to Fahrenheit","number","Convert temperature from Celsius to Fahrenheit.",{operation:"c-f",fields:["Celsius"]}),
 v("fahrenheit-celsius-viaje","Fahrenheit to Celsius","number","Convert temperature from Fahrenheit to Celsius.",{operation:"f-c",fields:["Fahrenheit"]}),
 v("presupuesto-viaje","Travel budget","number","Calculate total budget from daily spend and days.",{operation:"multiply",fields:["Daily spend","Days"]}),
];
