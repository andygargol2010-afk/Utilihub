import { makeTool } from "./types";

const t = (
  slug: string,
  name: string,
  summary: string,
  fields: string[],
  operation: string,
  fixed?: number,
) =>
  makeTool(
    slug,
    name,
    "ciencia",
    "formula",
    summary,
    name.toLowerCase().split(/\s+/),
    { operation, fields, ...(fixed === undefined ? {} : { fixed }) },
  );

export const SCIENCE_EXTRA_TOOLS = [
  t("frecuencia-periodo", "Frecuencia a período", "Convierte una frecuencia en su período usando T = 1/f.", ["Frecuencia (Hz)"], "divide-fixed", 1),
  t("energia-foton-frecuencia", "Energía de fotón por frecuencia", "Calcula la energía de un fotón mediante E = hf.", ["Frecuencia (Hz)"], "multiply-fixed", 6.62607015e-34),
  t("energia-masa-relativista", "Energía masa-relativista", "Calcula la energía equivalente de una masa mediante E = mc².", ["Masa (kg)"], "multiply-fixed", 299792458 ** 2),
  t("fuerza-presion-area", "Fuerza por presión y área", "Calcula la fuerza ejercida sobre una superficie mediante F = P·A.", ["Presión (Pa)", "Área (m²)"], "multiply"),
  t("trabajo-fuerza-distancia", "Trabajo por fuerza y distancia", "Calcula el trabajo de una fuerza constante paralela al desplazamiento mediante W = F·d.", ["Fuerza (N)", "Distancia (m)"], "multiply"),
  t("densidad-lineal", "Densidad lineal", "Calcula la masa por unidad de longitud mediante λ = m/L.", ["Masa (kg)", "Longitud (m)"], "divide"),
  t("caudal-volumetrico", "Caudal volumétrico", "Calcula el volumen que atraviesa una sección por unidad de tiempo mediante Q = V/t.", ["Volumen (m³)", "Tiempo (s)"], "divide"),
  t("concentracion-masa-volumen", "Concentración masa-volumen", "Calcula la concentración de una sustancia como masa dividida por volumen.", ["Masa de soluto (g)", "Volumen de solución (L)"], "divide"),
  t("relacion-de-aspecto", "Relación de aspecto", "Calcula la relación entre ancho y alto de una superficie o pantalla.", ["Ancho", "Alto"], "divide"),
  t("velocidad-angular-frecuencia", "Velocidad angular desde frecuencia", "Calcula la velocidad angular mediante ω = 2πf.", ["Frecuencia (Hz)"], "multiply-fixed", 2 * Math.PI),
];
