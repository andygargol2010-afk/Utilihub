import {faq,makeTool} from "./types";
const x=(s:string,n:string,cat:string,k:string,summary:string)=>makeTool(s,n,cat,k,summary);
export const LIFESTYLE_TOOLS=[
 x("gramos-tazas","Grams to cups","productividad","converter","Convert common cooking masses to approximate measures."),x("ml-cucharadas","Milliliters to tablespoons","productividad","converter","Convert volume between milliliters, tablespoons, and teaspoons."),x("porciones-receta","Recipe servings","productividad","number","Calculate amounts per person from a base recipe."),
 {...x("hidratacion-masa","Dough hydration","productividad","number","Calculate the hydration percentage of a dough."),
  title:"Dough hydration calculator (baker's percentage) | UtiliHub",
  description:"Calculate dough hydration with the baker's percentage: water ÷ flour × 100. Enter grams of flour and water to get the exact percentage for your dough.",
  keywords:["dough hydration","baker's percentage","bread hydration calculator","dough hydration ratio"],
  about:["Dough hydration is the baker's percentage of water relative to flour: water weight ÷ flour weight × 100. Example: 350 g of water and 500 g of flour gives 70% hydration.","Higher hydration doughs are stickier and give a more open crumb; lower hydration doughs are easier to handle."],
  faq:[faq("How is dough hydration calculated?","Hydration = water weight ÷ flour weight × 100. With 350 g of water and 500 g of flour, hydration is 70%."),
       faq("What units should I use?","Any consistent weight unit works, such as grams. Flour and water must use the same unit."),
       faq("What is a good hydration level?","Lean breads often use 60–75%; Neapolitan pizza dough around 60–65%; high-hydration ciabatta can exceed 80%.")]},
 x("coste-comida","Meal cost per serving","productividad","number","Calculate total and per-serving cost of a recipe."),
 x("propina-viaje","Tip and bill split","productividad","number","Split a bill and add tip per person."),x("zona-horaria-viaje","Time zone converter","fechas","date","Convert a time between entered UTC offsets."),x("duracion-vuelo","Flight duration","fechas","date","Calculate duration between departure and arrival with time offsets."),x("consumo-combustible","Fuel consumption","productividad","number","Calculate consumption by distance and estimated cost."),x("coste-km","Cost per kilometer","productividad","number","Calculate fuel cost per kilometer."),
];
