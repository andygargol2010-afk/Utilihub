import {makeTool} from "./types";
const c=(s:string,n:string,k:string,summary:string,config:Record<string,unknown>={})=>makeTool(s,n,"cocina",k,summary,[],config);
export const COCINA_TOOLS=[
 c("escalador-recetas","Recipe scaler","number","Automatically adjust recipe amounts by servings.",{operation:"scale-recipe",fields:["Original amount","Original servings","New servings"]}),
 c("conversion-gramos-tazas","Grams to cups","number","Convert approximate amounts of common ingredients between grams and cups.",{operation:"divide",fields:["Grams","g/cup factor"]}),
 c("conversion-ml-tazas","Milliliters to cups","number","Convert milliliters to cups using a configurable equivalence.",{operation:"divide",fields:["Milliliters","ml/cup factor"]}),
 c("conversion-cucharadas-ml","Tablespoons to milliliters","number","Convert tablespoons to milliliters with the standard cooking equivalence.",{operation:"multiply",fields:["Tablespoons","ml per tablespoon"]}),
 c("conversion-cucharaditas-ml","Teaspoons to milliliters","number","Convert teaspoons to milliliters.",{operation:"multiply",fields:["Teaspoons","ml per teaspoon"]}),
 c("porcion-por-persona","Amount per person","number","Calculate the ingredient amount needed per person.",{operation:"divide",fields:["Total amount","People"]}),
 c("coste-receta","Total recipe cost","number","Calculate the cost of a recipe from amount and unit price.",{operation:"multiply",fields:["Amount","Price per unit"]}),
 c("coste-por-porcion-cocina","Cost per serving","number","Calculate the cost of one recipe serving.",{operation:"divide",fields:["Total cost","Servings"]}),
 c("hidratacion-pan","Bread hydration","number","Calculate the percentage of water relative to flour.",{operation:"percent-of",fields:["Water","Flour"]}),
 c("sal-pan","Salt relative to flour","number","Calculate the percentage of salt relative to flour weight.",{operation:"percent-of",fields:["Salt","Flour"]}),
 c("levadura-pan","Yeast relative to flour","number","Calculate the percentage of yeast relative to flour weight.",{operation:"percent-of",fields:["Yeast","Flour"]}),
 c("temperatura-horno-fahrenheit","Oven Celsius to Fahrenheit","number","Convert an oven temperature from Celsius to Fahrenheit.",{operation:"c-to-f",fields:["Temperature °C"]}),
 c("temperatura-horno-celsius","Oven Fahrenheit to Celsius","number","Convert an oven temperature from Fahrenheit to Celsius.",{operation:"f-to-c",fields:["Temperature °F"]}),
 c("ajuste-tiempo-horno","Baking time adjustment","number","Estimate a new baking time by applying an adjustment factor.",{operation:"multiply",fields:["Original time (min)","Factor"]}),
 c("cafe-proporcion","Coffee-to-water ratio","number","Calculate the coffee-to-water ratio.",{operation:"divide",fields:["Coffee (g)","Water (ml)"]}),
 c("rendimiento-receta","Yield per ingredient","number","Calculate how many units a recipe produces from total and per-unit amounts.",{operation:"divide",fields:["Total amount","Amount per unit"]}),
 c("porcentaje-merma-cocina","Waste percentage","number","Calculate what percentage of an ingredient is lost during preparation.",{operation:"percent-of",fields:["Waste","Initial amount"]}),
 c("cantidad-aprovechable","Usable amount","number","Calculate the usable amount after applying a waste percentage.",{operation:"remaining-percent",fields:["Initial amount","Waste %"]}),
 c("conversion-kg-gramos-cocina","Kilograms to grams (cooking)","number","Convert kilograms to grams for recipes.",{operation:"multiply",fields:["Kilograms","1000"]}),
 c("conversion-litros-ml-cocina","Liters to milliliters (cooking)","number","Convert liters to milliliters for recipes and drinks.",{operation:"multiply",fields:["Liters","1000"]}),
];
