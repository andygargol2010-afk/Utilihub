import {makeTool} from "./types";
const c=(s:string,n:string,summary:string,config:Record<string,unknown>)=>makeTool(s,n,"conversiones","number",summary,[],config);
export const CONVERSION_EXTRA_TOOLS=[
 c("km-metros","Kilometers to meters","Convert kilometers to meters.",{operation:"multiply-fixed",fields:["Kilometers"],fixed:1000}),
 c("metros-km","Meters to kilometers","Convert meters to kilometers.",{operation:"divide-fixed",fields:["Meters"],fixed:1000}),
 c("cm-metros","Centimeters to meters","Convert centimeters to meters.",{operation:"divide-fixed",fields:["Centimeters"],fixed:100}),
 c("metros-cm","Meters to centimeters","Convert meters to centimeters.",{operation:"multiply-fixed",fields:["Meters"],fixed:100}),
 c("mm-cm","Millimeters to centimeters","Convert millimeters to centimeters.",{operation:"divide-fixed",fields:["Millimeters"],fixed:10}),
 c("pulgadas-cm","Inches to centimeters","Convert inches to centimeters.",{operation:"multiply-fixed",fields:["Inches"],fixed:2.54}),
 c("cm-pulgadas","Centimeters to inches","Convert centimeters to inches.",{operation:"divide-fixed",fields:["Centimeters"],fixed:2.54}),
 c("pies-metros","Feet to meters","Convert feet to meters.",{operation:"multiply-fixed",fields:["Feet"],fixed:0.3048}),
 c("metros-pies","Meters to feet","Convert meters to feet.",{operation:"divide-fixed",fields:["Meters"],fixed:0.3048}),
 c("yardas-metros","Yards to meters","Convert yards to meters.",{operation:"multiply-fixed",fields:["Yards"],fixed:0.9144}),
 c("metros-yardas","Meters to yards","Convert meters to yards.",{operation:"divide-fixed",fields:["Meters"],fixed:0.9144}),
 c("kg-libras","Kilograms to pounds","Convert kilograms to pounds.",{operation:"multiply-fixed",fields:["Kilograms"],fixed:2.2046226218}),
 c("libras-kg","Pounds to kilograms","Convert pounds to kilograms.",{operation:"divide-fixed",fields:["Pounds"],fixed:2.2046226218}),
 c("gramos-kg","Grams to kilograms","Convert grams to kilograms.",{operation:"divide-fixed",fields:["Grams"],fixed:1000}),
 c("kg-gramos","Kilograms to grams","Convert kilograms to grams.",{operation:"multiply-fixed",fields:["Kilograms"],fixed:1000}),
 c("litros-ml","Liters to milliliters","Convert liters to milliliters.",{operation:"multiply-fixed",fields:["Liters"],fixed:1000}),
 c("ml-litros","Milliliters to liters","Convert milliliters to liters.",{operation:"divide-fixed",fields:["Milliliters"],fixed:1000}),
 c("galones-litros","US gallons to liters","Convert US gallons to liters.",{operation:"multiply-fixed",fields:["Gallons"],fixed:3.785411784}),
 c("litros-galones","Liters to US gallons","Convert liters to US gallons.",{operation:"divide-fixed",fields:["Liters"],fixed:3.785411784}),
 c("celsius-kelvin","Celsius to Kelvin","Convert Celsius to Kelvin.",{operation:"c-k",fields:["Temperature °C"]}),
];
