import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"matematicas","number",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const GEOMETRY_ADVANCED_TOOLS=[
 t("area-trapecio","Trapezoid area","Calculate the area of a trapezoid.",["Longer base","Shorter base","Height"],"trapezoid-area"),
 t("area-rombo","Rhombus area","Calculate the area of a rhombus from its diagonals.",["Longer diagonal","Shorter diagonal"],"rhombus-area"),
 t("area-paralelogramo","Parallelogram area","Calculate the area of a parallelogram.",["Base","Height"],"parallelogram-area"),
 t("area-sector-circular","Circular sector area","Calculate the area of a circular sector from radius and angle.",["Radius","Angle (°)"],"sector-area"),
 t("area-corona-circular","Annulus area","Calculate the area between two concentric circles.",["Outer radius","Inner radius"],"annulus-area"),
 t("longitud-arco","Arc length","Calculate the length of a circular arc.",["Radius","Angle (°)"],"arc-length"),
 t("volumen-esfera","Sphere volume","Calculate the volume of a sphere.",["Radius"],"sphere-volume"),
 t("volumen-cilindro","Cylinder volume","Calculate the volume of a cylinder.",["Radius","Height"],"cylinder-volume"),
 t("volumen-cono","Cone volume","Calculate the volume of a cone.",["Radius","Height"],"cone-volume"),
 t("volumen-piramide","Pyramid volume","Calculate the volume of a pyramid from base area and height.",["Base area","Height"],"pyramid-volume"),
 t("area-esfera","Sphere surface area","Calculate the surface area of a sphere.",["Radius"],"sphere-area"),
 t("area-lateral-cilindro","Cylinder lateral area","Calculate the lateral area of a cylinder.",["Radius","Height"],"cylinder-lateral-area"),
 t("area-total-cilindro","Cylinder total area","Calculate the total area of a closed cylinder.",["Radius","Height"],"cylinder-total-area"),
 t("area-lateral-cono","Cone lateral area","Calculate the lateral area of a cone from radius and slant height.",["Radius","Slant height"],"cone-lateral-area"),
 t("diagonal-rectangulo","Rectangle diagonal","Calculate the diagonal of a rectangle.",["Base","Height"],"rectangle-diagonal"),
 t("diagonal-cuadrado","Square diagonal","Calculate the diagonal of a square.",["Side"],"square-diagonal"),
 t("altura-triangulo","Triangle height","Calculate the height of a triangle from area and base.",["Area","Base"],"triangle-height"),
 t("teorema-coseno","Law of cosines","Calculate the side opposite an angle using the law of cosines.",["Side a","Side b","Angle C (°)"],"law-of-cosines"),
 t("teorema-seno","Law of sines","Calculate a side using the law of sines.",["Known side a","Known angle A (°)","Target angle B (°)"],"law-of-sines"),
];
