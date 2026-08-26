import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"matematicas","number",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const GEOMETRY_ADVANCED_TOOLS=[
 t("area-trapecio","Área de trapecio","Calcula el área de un trapecio.",["Base mayor","Base menor","Altura"],"trapezoid-area"),
 t("area-rombo","Área de rombo","Calcula el área de un rombo a partir de sus diagonales.",["Diagonal mayor","Diagonal menor"],"rhombus-area"),
 t("area-paralelogramo","Área de paralelogramo","Calcula el área de un paralelogramo.",["Base","Altura"],"parallelogram-area"),
 t("area-sector-circular","Área de sector circular","Calcula el área de un sector circular usando radio y ángulo.",["Radio","Ángulo (°)"],"sector-area"),
 t("area-corona-circular","Área de corona circular","Calcula el área comprendida entre dos circunferencias concéntricas.",["Radio exterior","Radio interior"],"annulus-area"),
 t("longitud-arco","Longitud de arco","Calcula la longitud de un arco circular.",["Radio","Ángulo (°)"],"arc-length"),
 t("volumen-esfera","Volumen de esfera","Calcula el volumen de una esfera.",["Radio"],"sphere-volume"),
 t("volumen-cilindro","Volumen de cilindro","Calcula el volumen de un cilindro.",["Radio","Altura"],"cylinder-volume"),
 t("volumen-cono","Volumen de cono","Calcula el volumen de un cono.",["Radio","Altura"],"cone-volume"),
 t("volumen-piramide","Volumen de pirámide","Calcula el volumen de una pirámide a partir del área de base y altura.",["Área de base","Altura"],"pyramid-volume"),
 t("area-esfera","Área de esfera","Calcula el área superficial de una esfera.",["Radio"],"sphere-area"),
 t("area-lateral-cilindro","Área lateral de cilindro","Calcula el área lateral de un cilindro.",["Radio","Altura"],"cylinder-lateral-area"),
 t("area-total-cilindro","Área total de cilindro","Calcula el área total de un cilindro cerrado.",["Radio","Altura"],"cylinder-total-area"),
 t("area-lateral-cono","Área lateral de cono","Calcula el área lateral de un cono usando radio y generatriz.",["Radio","Generatriz"],"cone-lateral-area"),
 t("diagonal-rectangulo","Diagonal de rectángulo","Calcula la diagonal de un rectángulo.",["Base","Altura"],"rectangle-diagonal"),
 t("diagonal-cuadrado","Diagonal de cuadrado","Calcula la diagonal de un cuadrado.",["Lado"],"square-diagonal"),
 t("altura-triangulo","Altura de triángulo","Calcula la altura de un triángulo a partir de área y base.",["Área","Base"],"triangle-height"),
 t("teorema-coseno","Teorema del coseno","Calcula el lado opuesto a un ángulo mediante el teorema del coseno.",["Lado a","Lado b","Ángulo C (°)"],"law-of-cosines"),
 t("teorema-seno","Teorema del seno","Calcula un lado usando la ley de senos.",["Lado conocido a","Ángulo conocido A (°)","Ángulo buscado B (°)"],"law-of-sines"),
 t("grados-radianes","Grados ↔ radianes","Convierte un ángulo entre grados y radianes. Usa 1 para grados→radianes y 2 para radianes→grados.",["Ángulo","Dirección (1=°→rad, 2=rad→°)"],"degrees-radians"),
];
