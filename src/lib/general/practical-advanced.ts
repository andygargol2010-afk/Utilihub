import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"hogar","number",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const PRACTICAL_ADVANCED_TOOLS=[
 t("consumo-agua","Water consumption calculator","Calculate total water use from daily consumption and number of days.",["Daily consumption (L)","Number of days"],"water-consumption"),
 t("calorias-receta","Recipe calorie intake","Calculate total recipe calories from calories per serving and number of servings.",["Calories per serving","Number of servings"],"recipe-calories"),
 t("coste-por-kilo","Cost per kilogram","Calculate price per kilogram from price and weight purchased.",["Price","Weight (kg)"],"cost-per-kg"),
 t("coste-por-litro","Cost per liter","Calculate price per liter from price and volume.",["Price","Volume (L)"],"cost-per-liter"),
 t("precio-unitario","Unit price","Calculate how much each product unit costs.",["Total price","Number of units"],"unit-price"),
 t("propina-dividida","Tip split among people","Calculate total with tip and how much each person pays.",["Bill","Tip (%)","People"],"split-tip"),
 t("reparto-proporcional","Proportional share","Calculate the share corresponding to a proportion of a total.",["Total","Part","Sum of parts"],"proportional-share"),
 t("volumen-caja","Box volume","Calculate the volume of a rectangular box.",["Length","Width","Height"],"box-volume"),
 t("litros-recipiente","Container liters","Calculate the capacity of a cylindrical container in liters.",["Radius (cm)","Height (cm)"],"container-liters"),
 t("pintura-superficie","Paint needed for a surface","Estimate liters of paint from surface area, coverage, and number of coats.",["Surface (m²)","Coverage (m²/L)","Number of coats"],"paint-needed"),
];
