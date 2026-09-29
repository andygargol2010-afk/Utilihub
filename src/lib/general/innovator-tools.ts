import { makeTool } from "./types";

export const INNOVATOR_TOOLS = [
  makeTool("generador-nombres-archivos", "File name generator", "productividad", "text", "Normalize titles and create consistent file names for digital projects.", ["names","files","slug","organization"]),
  makeTool("calculadora-propina-compartida", "Shared tip calculator", "productividad", "text", "Calculate tip, total, and equal bill split among several people.", ["tip","bill","split","restaurant"]),
  makeTool(
    "modelador-3d",
    "3D modeler",
    "diseno",
    "design",
    "Build simple 3D scenes with cubes, spheres, and other shapes. Move, rotate, scale, color, and export JSON — all in the browser.",
    ["3d", "modeler", "modelador", "cube", "sphere", "design", "three"],
  ),
];
