import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"hogar","number",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const PRACTICAL_ADVANCED_TOOLS=[
 t("consumo-agua","Calculadora de consumo de agua","Calcula el consumo total de agua a partir del consumo diario y los días.",["Consumo diario (L)","Número de días"],"water-consumption"),
 t("calorias-receta","Consumo calórico de una receta","Calcula las calorías totales de una receta a partir de calorías por porción y cantidad de porciones.",["Calorías por porción","Número de porciones"],"recipe-calories"),
 t("coste-por-kilo","Coste por kilo","Calcula el precio por kilogramo a partir del precio y el peso comprado.",["Precio","Peso (kg)"],"cost-per-kg"),
 t("coste-por-litro","Coste por litro","Calcula el precio por litro a partir del precio y el volumen.",["Precio","Volumen (L)"],"cost-per-liter"),
 t("precio-unitario","Precio unitario","Calcula cuánto cuesta cada unidad de un producto.",["Precio total","Cantidad de unidades"],"unit-price"),
 t("propina-dividida","Propina dividida entre personas","Calcula el total con propina y cuánto paga cada persona.",["Cuenta","Propina (%)","Personas"],"split-tip"),
 t("reparto-proporcional","Reparto proporcional","Calcula la parte correspondiente a una proporción de un total.",["Total","Parte","Suma de partes"],"proportional-share"),
 t("volumen-caja","Volumen de una caja","Calcula el volumen de una caja rectangular.",["Largo","Ancho","Alto"],"box-volume"),
 t("litros-recipiente","Litros de un recipiente","Calcula la capacidad de un recipiente cilíndrico en litros.",["Radio (cm)","Altura (cm)"],"container-liters"),
 t("pintura-superficie","Pintura necesaria para una superficie","Estima los litros de pintura según superficie, cobertura y número de capas.",["Superficie (m²)","Cobertura (m²/L)","Número de capas"],"paint-needed"),
];
