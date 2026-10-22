import {makeTool} from "./types";
const h=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"hogar",k,summary,[],config);
export const HOGAR_TOOLS=[
 {...h("coste-electricidad","Electricity cost","number","Estimate the cost of an appliance from consumption and price per kWh.",{operation:"multiply",fields:["Consumption (kWh)","Price per kWh"]}),
  title:"Electricity Cost Calculator (kWh × Price) | UtiliHub",
  keywords:["electricity cost calculator","kwh cost calculator","appliance electricity cost"],
  faq:[
   {q:"How is electricity cost calculated?",a:"Multiply the consumption in kWh by the price per kWh: cost = kWh × price per kWh."},
   {q:"How do I estimate the kWh of an appliance?",a:"Multiply the appliance power in watts by the hours of use and divide by 1000: kWh = (W × hours) / 1000."}
  ]},
 h("consumo-electrico-diario","Daily electricity use","number","Calculate daily consumption from power and hours of use.",{operation:"power-hours",fields:["Power (W)","Hours per day"]}),
 h("consumo-electrico-mensual","Monthly electricity use","number","Estimate monthly appliance consumption from daily use.",{operation:"monthly-electricity",fields:["Power (W)","Hours per day"]}),
 h("coste-agua","Water cost","number","Calculate water cost from volume and unit price.",{operation:"multiply",fields:["Volume","Price per unit"]}),
 h("presupuesto-hogar","Household budget","number","Calculate remaining spend from a household budget.",{operation:"subtract",fields:["Budget","Expenses"]}),
 h("division-alquiler","Rent split","number","Split rent among several people.",{operation:"divide",fields:["Rent","People"]}),
 h("ahorro-mensual","Monthly savings","number","Calculate monthly savings needed to reach a goal.",{operation:"divide",fields:["Savings goal","Months"]}),
 h("ahorro-anual","Annual savings","number","Calculate annual savings from a monthly amount.",{operation:"multiply",fields:["Monthly savings","Months"]}),
 h("porcentaje-ahorro","Savings percentage","number","Calculate what percentage of income savings represent.",{operation:"percent-of",fields:["Savings","Income"]}),
 h("coste-por-unidad-hogar","Cost per unit","number","Calculate the unit cost of a purchase.",{operation:"divide",fields:["Total cost","Units"]}),
 h("descuento-compra","Purchase discount","number","Calculate the final price after a discount.",{operation:"discount",fields:["Price","Discount %"]}),
 h("iva-compra","Purchase tax","number","Calculate tax and total from a price and percentage.",{operation:"tax",fields:["Price","Tax %"]}),
 h("aumento-alquiler","Rent increase","number","Calculate the new rent after a percentage increase.",{operation:"markup",fields:["Current rent","Increase %"]}),
 h("reparto-tareas","Task split","number","Calculate average tasks per person.",{operation:"divide",fields:["Tasks","People"]}),
 h("horas-trabajo","Work hours","number","Calculate hours worked from end and start times.",{operation:"subtract",fields:["End time","Start time"]}),
 h("tarifa-horaria","Hourly rate","number","Calculate an hourly rate from income and hours.",{operation:"divide",fields:["Income","Hours"]}),
 h("productividad-hora","Units per hour","number","Calculate units produced per hour.",{operation:"divide",fields:["Units","Hours"]}),
 h("material-por-superficie","Material by surface","number","Calculate material needed from surface area and unit usage.",{operation:"multiply",fields:["Surface","Material per unit"]}),
 h("coste-pintura","Paint cost","number","Estimate paint cost from liters and price per liter.",{operation:"multiply",fields:["Liters","Price per liter"]}),
 h("desperdicio-material","Material waste percentage","number","Calculate the percentage of material wasted.",{operation:"percent-of",fields:["Waste","Material used"]}),
];
