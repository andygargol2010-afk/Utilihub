import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-superficie-corporal",
  "Body Surface Area Calculator",
  "salud",
  "calculator",
  "Calculate body surface area (BSA) using the Du Bois formula from height and weight. Useful for medical dosing and health metrics.",
  [
    "body surface area",
    "BSA calculator",
    "calculadora superficie corporal",
    "area superficie corporal",
    "Du Bois formula",
    "BSA m2",
  ],
  {
    title: "Body Surface Area Calculator | BSA Du Bois | UtiliHub",
    description: "Free body surface area calculator. Compute BSA in m² from height (cm) and weight (kg) with the Du Bois formula. EN+ES.",
    summaryEs: "Calcula el área de superficie corporal (ASC) con la fórmula de Du Bois.",
  },
);
tool.faq.push(faq("What formula is used?", "Du Bois: BSA (m²) = 0.007184 × height(cm)^0.725 × weight(kg)^0.425."));
tool.faq.push(faq("What units should I use?", "Height in centimeters and weight in kilograms. Result in square meters (m²)."));

export const BODY_SURFACE_AREA_CALCULATOR_TOOLS = [tool];
