import { makeTool } from "./types";

/** Gap: hidratacion-pan, sal-pan, and levadura-pan are single percentages. This builds a full baker's formula and scales it. */
export const BAKERS_PERCENTAGE_TOOLS = [
  makeTool(
    "calculadora-porcentaje-panadero",
    "Baker's percentage calculator",
    "cocina",
    "formula",
    "Scale bread dough from flour weight or a target dough weight using baker's percentages, including a preferment.",
    [
      "baker's percentage calculator",
      "bread hydration calculator",
      "dough calculator",
      "sourdough starter baker percentage",
      "calculadora porcentaje panadero",
      "hidratacion masa pan",
      "calculadora de masa",
      "formula panadera",
    ],
    {
      mode: "bakers-percentage",
      title: "Baker's percentage calculator | UtiliHub",
      description:
        "Turn baker's percentages into grams of flour, water, salt, yeast, fat, and preferment. Scale from flour or a target dough weight. Free in the browser.",
    },
  ),
];
