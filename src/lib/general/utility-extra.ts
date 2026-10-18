import { faq, makeTool } from "./types";

const tool=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"utilidades","formula",summary,name.toLowerCase().split(/\s+/),{operation,fields});

export const UTILITY_EXTRA_TOOLS=[
  tool("porcentaje-de-cambio","Percent change between values","Calculate the percentage change between an initial and a final value.",["Initial value","Final value"],"percent-change"),
  tool("impuesto-sobre-precio","Price with tax","Calculate the final price after applying a percentage tax.",["Base price","Tax (%)"],"tax"),
  tool("comision-de-venta","Sales commission","Calculate the commission amount on a sale.",["Sale amount","Commission (%)"],"percentage-amount"),
  tool("consumo-por-distancia","Consumption by distance","Calculate fuel consumption per 100 km.",["Fuel used (L)","Distance (km)"],"fuel-rate"),
  tool("distancia-por-combustible","Distance per fuel","Calculate distance traveled per unit of fuel.",["Distance (km)","Fuel used (L)"],"divide"),
  tool("coste-por-distancia","Cost by distance","Calculate fuel cost per kilometer traveled.",["Fuel cost","Distance (km)"],"divide"),
  {...tool("densidad-de-poblacion","Population density","Calculate inhabitants per unit of area.",["Population","Area (km²)"],"divide"),
  title:"Population density calculator (inhabitants per km²) | UtiliHub",
  description:"Calculate the population density of a city or region: divide the number of inhabitants by the area in km² and get inhabitants per km². Free, no signup, runs locally in your browser.",
  keywords:["population density","population density calculator","inhabitants per km2","inhabitants per square kilometer","density formula"],
  about:["Calculate the population density of a city, region, or country in inhabitants per km².","The tool runs directly in the browser for immediate results."],
  faq:[faq("How is population density calculated?","Population density = population ÷ area. For example, 250,000 inhabitants in an area of 50 km² gives 250,000 ÷ 50 = 5,000 inhabitants per km²."),faq("What units does the result use?","The result is expressed in inhabitants per square kilometer (inhabitants/km²), based on the population and the area in km² you enter."),faq("Do I need to sign up?","No. The tool works without an account.")]},
  tool("escala-de-mapa","Map scale","Calculate a scale as the ratio of map distance to real distance.",["Map distance","Real distance"],"divide"),
];
