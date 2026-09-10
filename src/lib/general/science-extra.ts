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
  t("frecuencia-periodo", "Frequency to period", "Convert a frequency into its period using T = 1/f.", ["Frequency (Hz)"], "divide-fixed", 1),
  t("energia-foton-frecuencia", "Photon energy from frequency", "Calculate photon energy using E = hf.", ["Frequency (Hz)"], "multiply-fixed", 6.62607015e-34),
  t("energia-masa-relativista", "Mass-energy equivalence", "Calculate the energy equivalent of a mass using E = mc².", ["Mass (kg)"], "multiply-fixed", 299792458 ** 2),
  t("fuerza-presion-area", "Force from pressure and area", "Calculate the force on a surface using F = P·A.", ["Pressure (Pa)", "Area (m²)"], "multiply"),
  t("trabajo-fuerza-distancia", "Work from force and distance", "Calculate the work of a constant force parallel to displacement using W = F·d.", ["Force (N)", "Distance (m)"], "multiply"),
  t("densidad-lineal", "Linear density", "Calculate mass per unit length using λ = m/L.", ["Mass (kg)", "Length (m)"], "divide"),
  t("caudal-volumetrico", "Volumetric flow rate", "Calculate volume through a section per unit time using Q = V/t.", ["Volume (m³)", "Time (s)"], "divide"),
  t("concentracion-masa-volumen", "Mass-volume concentration", "Calculate concentration as mass divided by volume.", ["Solute mass (g)", "Solution volume (L)"], "divide"),
  t("relacion-de-aspecto", "Aspect ratio", "Calculate the ratio of width to height of a surface or screen.", ["Width", "Height"], "divide"),
  t("velocidad-angular-frecuencia", "Angular velocity from frequency", "Calculate angular velocity using ω = 2πf.", ["Frequency (Hz)"], "multiply-fixed", 2 * Math.PI),
];
