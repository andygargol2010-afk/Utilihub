import { makeTool } from "./types";

/** Gap: brick counts a flat wall; concrete sizes a pour. This orders retaining-wall blocks, caps, and a gravel base. */
export const RETAINING_WALL_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-muro-contencion",
    "Retaining wall block calculator",
    "hogar",
    "formula",
    "Estimate retaining-wall blocks, cap units, courses, and base gravel from wall length, exposed height, and block size.",
    [
      "retaining wall block calculator",
      "how many retaining wall blocks do I need",
      "retaining wall calculator",
      "landscape block calculator",
      "retaining wall cap calculator",
      "calculadora de muro de contencion",
      "cuantos bloques para un muro de contencion",
      "bloques de jardinera",
      "muro de bloques de hormigon",
      "tapa de muro de contencion",
    ],
    {
      mode: "retaining-wall-calculator",
      title: "Retaining Wall Block Calculator — Courses | UtiliHub",
      description:
        "Estimate retaining-wall blocks, caps, and base gravel from length and height. Buried course included. Free, in the browser.",
    },
  ),
];
