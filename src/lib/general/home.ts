import {makeTool} from "./types";
const h=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"hogar",k,summary,[],config);
export const HOME_TOOLS=[
 h("consumo-electrico","Electricity cost","number","Estimate electricity cost from power, hours, and rate.",{operation:"energy-cost",fields:["Power (W)","Hours","Rate per kWh"]}),
 h("consumo-agua","Water cost","number","Estimate water cost from volume and rate.",{operation:"multiply",fields:["Volume (m³)","Rate per m³"]}),
 h("cuota-alquiler-prorrateo","Rent proration","number","Prorate monthly rent for a partial month.",{operation:"prorate",fields:["Monthly rent","Days occupied","Days in month"]}),
 h("interes-hipoteca-simple","Simple mortgage interest","number","Estimate interest over a period with a simplified model.",{operation:"simple-interest",fields:["Principal","Annual rate %","Years"]}),
 h("ahorro-mensual","Monthly savings","number","Calculate monthly savings needed to reach a goal.",{operation:"divide",fields:["Savings goal","Months"]}),
 h("ahorro-anual","Annual savings","number","Calculate annual savings from a monthly amount.",{operation:"multiply",fields:["Monthly savings","Months"]}),
 h("pintura-paredes","Paint needed","number","Estimate paint liters from area and coverage.",{operation:"divide",fields:["Area (m²)","Coverage m²/L"]}),
 h("azulejos-necesarios","Tiles needed","number","Calculate how many tiles cover an area.",{operation:"divide",fields:["Area (m²)","Tile area (m²)"]}),
 h("sueldo-neto-estimado","Estimated net salary","number","Estimate net pay after a simple deduction percentage.",{operation:"remaining-percent",fields:["Gross salary","Deduction %"]}),
 h("coste-hora-trabajo","Hourly work cost","number","Calculate cost per hour from salary and hours.",{operation:"divide",fields:["Monthly salary","Hours per month"]}),
 h("impuesto-simple","Simple tax","number","Calculate tax amount from a base and rate.",{operation:"percentage-amount",fields:["Base","Tax %"]}),
 h("descuento-compra","Purchase discount","number","Calculate final price after a discount.",{operation:"discount",fields:["Price","Discount %"]}),
 h("propina-restaurante","Restaurant tip","number","Calculate tip and total for a bill.",{operation:"tip",fields:["Bill","Tip %"]}),
 h("division-cuenta","Bill split","number","Split a bill among people.",{operation:"divide",fields:["Total","People"]}),
 h("consumo-gas","Gas cost","number","Estimate gas cost from volume and rate.",{operation:"multiply",fields:["Volume","Rate"]}),
 h("ahorro-energia-porcentaje","Energy savings %","number","Calculate percentage savings between two consumptions.",{operation:"percent-change",fields:["Previous consumption","New consumption"]}),
 h("coste-internet-mensual","Monthly internet cost","number","Annualize or monthly-ize a plan cost.",{operation:"divide",fields:["Annual cost","12"]}),
 h("superficie-habitacion","Room area","number","Calculate rectangular room area.",{operation:"multiply",fields:["Length","Width"]}),
 h("volumen-habitacion","Room volume","number","Calculate rectangular room volume.",{operation:"box-volume",fields:["Length","Width","Height"]}),
 h("desperdicio-material","Material waste percentage","number","Calculate the percentage of material wasted.",{operation:"percent-of",fields:["Waste","Material used"]}),
];
