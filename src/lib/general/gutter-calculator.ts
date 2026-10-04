import { makeTool } from "./types";

/** Gap: roof counts shingle squares; fence counts posts and pickets. This orders gutter sections, hangers, and downspouts. */
export const GUTTER_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-canalones",
    "Gutter and downspout calculator",
    "hogar",
    "formula",
    "Estimate gutter sections, hangers, downspouts, elbows, and end caps from eave length and spacing.",
    [
      "gutter calculator",
      "how many gutters do I need",
      "downspout calculator",
      "gutter hanger spacing",
      "rain gutter estimator",
      "calculadora de canalones",
      "cuantos canalones necesito",
      "bajantes de lluvia",
      "canaletas para techo",
      "separacion de soportes de canalon",
    ],
    {
      mode: "gutter-calculator",
      title: "Gutter Calculator — Sections and Downspouts | UtiliHub",
      description:
        "Estimate gutter sections, hangers, downspouts, and elbows from eave length. Closed loop or open runs. Free, in the browser.",
    },
  ),
];
