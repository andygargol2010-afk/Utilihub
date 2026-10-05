import { makeTool } from "./types";

/** Gap: heat index estimates feels-like heat; this estimates the saturation temperature (dew point). */
export const DEW_POINT_TOOLS = [
  makeTool(
    "calculadora-punto-rocio",
    "Dew point calculator",
    "ciencia",
    "formula",
    "Estimate dew point and the temperature–dew-point spread from air temperature and relative humidity, in Celsius or Fahrenheit.",
    [
      "dew point calculator",
      "dew point from humidity",
      "calculate dew point celsius",
      "dew point fahrenheit",
      "relative humidity to dew point",
      "calculadora de punto de rocio",
      "punto de rocio humedad",
      "calcular punto de rocio",
      "punto de rocio celsius",
      "depresion del punto de rocio",
    ],
    {
      mode: "dew-point",
      title: "Dew Point Calculator from Humidity | UtiliHub",
      description:
        "Calculate dew point from air temperature and relative humidity. Celsius or Fahrenheit, with a comfort band. Free, in the browser.",
    },
  ),
];
