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
];
