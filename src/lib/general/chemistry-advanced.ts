import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"ciencia","science",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const CHEMISTRY_ADVANCED_TOOLS=[
 t("molaridad","Molaridad","Calcula la concentración molar a partir de moles y volumen de solución.",["Moles de soluto","Volumen de solución (L)"],"molarity"),
 t("molalidad","Molalidad","Calcula la concentración molal a partir de moles y masa de solvente.",["Moles de soluto","Masa de solvente (kg)"],"molality"),
 t("normalidad-quimica","Normalidad química","Calcula equivalentes de soluto por litro de solución.",["Equivalentes","Volumen de solución (L)"],"normality"),
 t("fraccion-molar","Fracción molar","Calcula la fracción molar de un componente en una mezcla.",["Moles del componente","Moles totales"],"mole-fraction"),
 t("porcentaje-masa","Porcentaje en masa","Calcula el porcentaje en masa de un soluto en una solución o mezcla.",["Masa del soluto","Masa de la solución"],"mass-percent"),
 t("porcentaje-volumen","Porcentaje en volumen","Calcula el porcentaje en volumen de un componente en una mezcla.",["Volumen del componente","Volumen de la solución"],"volume-percent"),
 t("numero-moles","Número de moles","Calcula moles a partir de masa y masa molar.",["Masa (g)","Masa molar (g/mol)"],"moles"),
 t("numero-moleculas","Número de moléculas","Convierte moles en número de moléculas usando la constante de Avogadro.",["Moles"],"molecules"),
 t("numero-atomos","Número de átomos","Calcula el número de átomos considerando cuántos átomos hay por molécula.",["Moles de sustancia","Átomos por molécula"],"atoms"),
 t("estequiometria","Estequiometría","Calcula una cantidad de producto a partir de moles de reactivo y una relación estequiométrica.",["Moles de reactivo","Mol de producto por mol de reactivo","Masa molar del producto (g/mol)"],"stoichiometry"),
 t("reactivo-limitante","Reactivo limitante","Determina cuál de dos reactivos limita una reacción a partir de sus moles y coeficientes estequiométricos.",["Moles de reactivo A","Coeficiente de A","Moles de reactivo B","Coeficiente de B"],"limiting-reagent"),
 t("rendimiento-porcentual","Rendimiento porcentual","Calcula el rendimiento porcentual comparando el rendimiento real con el teórico.",["Rendimiento real (g)","Rendimiento teórico (g)"],"chemical-yield"),
 t("dilucion","Dilución","Calcula el volumen final o concentración resultante mediante C₁V₁=C₂V₂.",["Concentración inicial","Volumen inicial (L)","Concentración final"],"dilution"),
 t("concentracion-mezcla","Concentración después de mezclar","Calcula la concentración final al mezclar dos soluciones del mismo soluto.",["Concentración 1","Volumen 1 (L)","Concentración 2","Volumen 2 (L)"],"mixed-concentration"),
 t("poh","pOH","Calcula el pOH a partir de la concentración de iones hidróxido.",["[OH⁻] (mol/L)"],"poh"),
 t("pka-pkb","pKa / pKb","Calcula pKa o pKb a partir de la constante de disociación.",["Ka o Kb"],"pka-pkb"),
 t("henderson-hasselbalch","Henderson-Hasselbalch","Calcula el pH de un tampón a partir de pKa y la relación base/ácido.",["pKa","Base conjugada","Ácido"],"henderson-hasselbalch"),
 t("masa-molecular","Masa molecular","Calcula la masa molar de un compuesto a partir de masa y cantidad de sustancia.",["Masa (g)","Moles"],"molecular-mass"),
 t("gases-ideales","Ley de gases ideales","Calcula la presión usando PV=nRT.",["Moles","Temperatura (K)","Volumen (L)"],"ideal-gas"),
 t("presion-parcial","Presión parcial","Calcula la presión parcial de un gas usando su fracción molar y la presión total.",["Fracción molar","Presión total"],"partial-pressure"),
];
