import {makeTool} from "./types";

const c=(slug:string,name:string,summary:string,keywords:string[]=[])=>makeTool(slug,name,"quimica","science",summary,[name.toLowerCase(),"química","quimica","mol","concentración",...keywords]);

export const CHEMISTRY_TOOLS=[
 c("molaridad","Molaridad","Calcula la molaridad de una disolución a partir de moles y volumen.",["molaridad","mol/L"]),
 c("molalidad","Molalidad","Calcula la molalidad a partir de moles de soluto y masa del disolvente.",["molalidad","mol/kg"]),
 c("moles-desde-masa","Moles desde masa","Calcula la cantidad de sustancia a partir de masa y masa molar.",["moles","masa molar"]),
 c("masa-desde-moles","Masa desde moles","Calcula la masa de una sustancia a partir de moles y masa molar.",["masa","moles"]),
 c("particulas-desde-moles","Partículas desde moles","Convierte moles a número de partículas usando la constante de Avogadro.",["avogadro","partículas"]),
 c("moles-desde-particulas","Moles desde partículas","Convierte un número de partículas a moles usando la constante de Avogadro.",["avogadro","partículas"]),
 c("porcentaje-masa","Porcentaje en masa","Calcula el porcentaje masa/masa de un soluto en una mezcla o disolución.",["% m/m","concentración"]),
 c("porcentaje-volumen","Porcentaje en volumen","Calcula el porcentaje volumen/volumen de un componente en una mezcla.",["% v/v","concentración"]),
 c("ppm-quimica","PPM en química","Calcula partes por millón a partir de miligramos de soluto y litros de disolución.",["ppm","partes por millón"]),
 c("ph-quimica","pH","Calcula el pH a partir de la concentración molar de iones hidrógeno.",["pH","acidez"]),
 c("poh-quimica","pOH","Calcula el pOH a partir de la concentración molar de iones hidróxido.",["pOH","basicidad"]),
 c("concentracion-h-desde-ph","Concentración de H+ desde pH","Calcula la concentración de H+ a partir del pH.",["H+","iones hidrógeno"]),
 c("concentracion-oh-desde-poh","Concentración de OH− desde pOH","Calcula la concentración de OH− a partir del pOH.",["OH-","iones hidróxido"]),
 c("pka-desde-ka","pKa desde Ka","Calcula pKa a partir de la constante de acidez Ka.",["pKa","Ka"]),
 c("ka-desde-pka","Ka desde pKa","Calcula Ka a partir de pKa.",["Ka","pKa"]),
 c("gas-ideal-presion","Ley de gases ideales: presión","Calcula la presión de un gas ideal usando n, T y V.",["PV=nRT","presión"]),
 c("gas-ideal-volumen","Ley de gases ideales: volumen","Calcula el volumen de un gas ideal usando n, T y P.",["PV=nRT","volumen"]),
 c("gas-ideal-moles","Ley de gases ideales: moles","Calcula los moles de un gas ideal usando P, V y T.",["PV=nRT","moles"]),
 c("densidad-quimica","Densidad química","Calcula densidad a partir de masa y volumen.",["densidad","masa","volumen"]),
 c("fraccion-molar","Fracción molar","Calcula la fracción molar de un componente respecto del total de moles.",["fracción molar","mezclas"]),
 c("dilucion","Dilución","Calcula el volumen final de una dilución mediante C1·V1=C2·V2.",["dilución","C1V1=C2V2"]),
] as const;
